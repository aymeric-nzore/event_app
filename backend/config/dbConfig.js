import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const connect = await mongoose.connect(process.env.MONGO_URI,);
    console.log(`connexion réussie : ${connect.connection.host}`);
  } catch (e) {
    console.log(`Connexion echoué : erreur : ${e}`);
    process.exit(1);
  }
};
export default connectDB;
