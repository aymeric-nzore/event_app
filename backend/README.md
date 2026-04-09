# Event App API

API backend Node.js/Express pour la gestion d'utilisateurs, d'evenements et de tickets (avec generation de QR code).

## 1. Apercu

Ce projet fournit:

- Authentification JWT (access + refresh token)
- Creation et gestion d'evenements geolocalises
- Recherche d'evenements proches via coordonnees GPS
- Inscription d'un utilisateur a un evenement
- Generation d'un ticket + QR code
- Scan/validation de ticket

## 2. Stack Technique

- Runtime: Node.js (ES Modules)
- Framework API: Express
- Base de donnees: MongoDB (Mongoose)
- Auth: JSON Web Token
- Hash mot de passe: bcrypt
- Geocoding: OpenCage API (via axios)
- QR Code: qrcode
- Outils dev: nodemon
- Conteneurisation: Docker

## 3. Arborescence

```text
.
├── config/
│   ├── dbConfig.js
│   ├── geoLocalisationConfig.js
│   └── jwtConfig.js
├── controllers/
│   ├── authController.js
│   ├── eventController.js
│   └── ticketController.js
├── middlewares/
│   ├── authMiddleware.js
│   └── creatorMiddelware.js
├── models/
│   ├── event.js
│   ├── ticket.js
│   └── user.js
├── routes/
│   ├── authRoutes.js
│   ├── eventRoutes.js
│   └── ticketRoutes.js
├── utils/
│   ├── generateOtpCode.js
│   └── generateQR.js
├── .env
├── Dockerfile
├── package.json
└── server.js
```

## 4. Prerequis

- Node.js 18+ (recommande: Node.js 20)
- npm
- MongoDB Atlas ou MongoDB local
- Cle API OpenCage

## 5. Installation

```bash
npm install
```

## 6. Variables d'Environnement

Creer un fichier `.env` a la racine du projet.

Exemple:

```dotenv
PORT=8000
OPENCAGE_API_KEY=YOUR_OPENCAGE_API_KEY
JWT_ACCESS_SECRET=YOUR_ACCESS_SECRET
JWT_REFRESH_SECRET=YOUR_REFRESH_SECRET
JWT_TICKET_SECRET=YOUR_TICKET_SECRET
MONGO_URI=mongodb+srv://USER:PASSWORD@cluster.mongodb.net/dbname
```

### Variables utilisees

- `PORT`: port HTTP de l'API
- `OPENCAGE_API_KEY`: cle API de geocodage
- `JWT_ACCESS_SECRET`: secret JWT access token
- `JWT_REFRESH_SECRET`: secret JWT refresh token
- `JWT_TICKET_SECRET`: secret JWT ticket token
- `MONGO_URI`: chaine de connexion MongoDB

## 7. Demarrage

### Mode developpement

```bash
npm run dev
```

### Mode production local

```bash
npm start
```

### Healthcheck

```http
GET /health
```

Reponse attendue:

```json
{ "status": "ok" }
```

## 8. Scripts npm

- `npm run dev`: lance le serveur avec nodemon
- `npm start`: lance le serveur avec node
- `npm test`: script placeholder (non implemente)

## 9. Endpoints API

Base URL locale typique:

```text
http://localhost:8000
```

Pour les routes protegees, envoyer l'entete:

```http
Authorization: Bearer <access_token>
```

### 9.1 Auth (`/api/auth`)

#### POST `/api/auth/register`

Body:

```json
{
  "username": "john",
  "email": "john@mail.com",
  "password": "123456"
}
```

#### POST `/api/auth/login`

Body:

```json
{
  "UsernameOrEmail": "john",
  "password": "123456"
}
```

#### POST `/api/auth/logout` (protegee)

Body:

```json
{
  "refreshToken": "..."
}
```

#### DELETE `/api/auth/:id` (protegee)

Supprime le compte utilisateur.

### 9.2 Events (`/api/events`)

#### POST `/api/events/create` (protegee)

Body:

```json
{
  "eventType": "Concert",
  "name": "Concert Live",
  "description": "Soiree live",
  "adress": "Paris, France",
  "date": "2026-05-01T18:00:00.000Z"
}
```

#### PATCH `/api/events/:id` (protegee + createur)

Body (exemple):

```json
{
  "updates": {
    "name": "Nouveau nom",
    "adress": "Lyon, France"
  }
}
```

#### DELETE `/api/events/:id` (protegee + createur)

Supprime un evenement.

#### GET `/api/events/nearby?lat=<lat>&lng=<lng>&km=<rayon_km>` (protegee)

Exemple:

```http
GET /api/events/nearby?lat=48.8566&lng=2.3522&km=10
```

#### POST `/api/events/join?id=<eventId>` (protegee)

Inscrit l'utilisateur a un evenement, cree un ticket et retourne un QR code base64.

Le QR retourne est genere en PNG base64 avec:

- correction d'erreur elevee (`H`)
- taille 360px pour un rendu plus net
- theme de couleurs personnalise (vert profond + fond clair)

#### GET `/api/events/:id/usersAttendus` (protegee + createur)

Retourne la liste des utilisateurs inscrits a l'evenement.

### 9.3 Tickets (`/api/ticket`)

#### POST `/api/ticket/scan` (protegee + createur)

Body:

```json
{
  "eventID": "<eventId>",
  "ticketID": "<ticketMongoId>"
}
```

Effet: marque le ticket comme utilise.

## 9.4 QR Code & Email

Lors de l'inscription a un evenement (`POST /api/events/join`), un email est automatiquement envoye a l'utilisateur avec son QR code comme piece jointe.

### Configuration Email (Brevo)

Pour activer l'envoi d'email, ajoute les variables d'environnement:

```dotenv
BREVO_API_KEY=ta_cle_api_brevo_v3
BREVO_FROM_EMAIL=noreply@tondomaine.com
BREVO_SENDER_NAME=Event App
```

#### Comment obtenir une cle Brevo:

1. Creer un compte sur https://www.brevo.com
2. Aller dans Settings → API keys
3. Creer une clé SMTP/REST API v3
4. Copier la cle dans `BREVO_API_KEY`

### Format du QR Envoye

![QR Code Example](qr_example.png)

Le QR contient:
- User ID
- Event ID
- Ticket ID
- Token JWT valide 24 heures

L'email HTML inclut le QR code en base64 avec:
- Titre de l'evenement
- Instructions de presentation
- Rendu responsive

## 10. Modeles de donnees

### User

- `username` (String, unique, requis)
- `email` (String, unique, requis)
- `password` (String, requis, hash bcrypt)
- `refreshToken` (Array de String)
- `eventsJoined` (Array ObjectId vers Event)

### Event

- `eventType` (Concert | Other | Evangelisation)
- `name` (String)
- `description` (String)
- `adress` (String)
- `date` (Date)
- `creator` (ObjectId vers User)
- `location` (GeoJSON Point)

### Ticket

- `ticketID` (String)
- `userID` (String)
- `eventID` (String)
- `used` (Boolean)

## 11. Docker

Build:

```bash
docker build -t event-app .
```

Run:

```bash
docker run --env-file .env -p 8000:8000 event-app
```

Note importante:

- Le `Dockerfile` expose le port `8000`.
- L'application ecoute `process.env.PORT` (ex: `8000` dans `.env`).
- Assurez-vous que `PORT` et votre mapping Docker sont coherents.

## 12. Erreurs Courantes et Debug

### Erreurs signalees dans `node_modules`

Des erreurs TypeScript dans `node_modules` peuvent apparaitre dans VS Code sans impacter le runtime Node.
Verifier la sante des dependances avec:

```bash
npm ls
```

### Verification rapide du serveur

```bash
npm start
```

Puis:

```http
GET /health
```

## 13. Securite

- Ne jamais committer les vrais secrets dans Git.
- Faire tourner les secrets JWT et credentials Mongo si exposes.
- Utiliser des secrets longs et aleatoires en production.
- Ajouter un rate-limit sur les routes d'auth en production.

## 14. Ameliorations Recommandees

- Ajouter une vraie suite de tests (unitaires + integration)
- Ajouter validation schema (ex: zod/joi)
- Ajouter logging structure (winston/pino)
- Ajouter gestion centralisee des erreurs
- Ajouter Swagger/OpenAPI
- Harmoniser certains noms de champs (`adress` vs `address`)

---
