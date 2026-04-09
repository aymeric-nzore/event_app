import User from "../models/user.js";
import jwtConfig from "../config/jwtConfig.js";
import bcrypt from "bcrypt";
//SIGN-UP
export const register = async (req, res) => {
  const { username, email, password } = req.body;
  //normalisez les informations
  const normalizeUsername = username?.trim()?.toLowerCase();
  const normalizeEmail = email?.trim()?.toLowerCase();
  const normalizePassword = password?.trim();
  try {
    if (!normalizeUsername || !normalizeEmail || !normalizePassword)
      return res.status(401).json({ message: "Identifiants manquants" });
    if (normalizePassword.length < 6)
      return res.status(401).json({ message: "Mot de passe trop court" });
    const user = await User.create({
      username: normalizeUsername,
      email: normalizeEmail,
      password: normalizePassword,
    });
    //Les tokens
    const tokens = jwtConfig.generateToken({ id: user._id });
    const refreshToken = tokens.refreshToken;
    const accessToken = tokens.accessToken;
    user.refreshToken.push(refreshToken);
    await user.save();
    // Supprimer le mot de passe de la réponse
    const userObj = user.toObject();
    delete userObj.password;
    return res.status(201).json({
      user: userObj,
      accessToken: accessToken,
      refreshToken: refreshToken,
    });
  } catch (e) {
    if (e.code === 11000)
      return res
        .status(400)
        .json({ message: "Email ou username déja utilisé" });
    console.log(e);
    return res.status(400).json({ error: e.message });
  }
};
//LOGIN
export const login = async (req, res) => {
  const { UsernameOrEmail, password } = req.body;
  //Normalizer les valeurs des champs
  const normalizeUE = UsernameOrEmail?.trim()?.toLowerCase();
  const normalizePassword = password?.trim();
  try {
    if (!normalizeUE || !normalizePassword)
      return res.status(401).json({
        message: "Veuillez remplir tous les champs",
      });
    const user = await User.findOne({
      $or: [{ email: normalizeUE }, { username: normalizeUE }],
    });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isValidPassword = await bcrypt.compare(normalizePassword, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: "Identifiants invalides" });
    }

    const tokens = jwtConfig.generateToken({ id: user._id });
    const refreshToken = tokens.refreshToken;
    user.refreshToken.push(refreshToken);
    await user.save();
    //Sert à renvoyer l'user sans le password
    const userObj = user.toObject();
    delete userObj.password;
    return res.status(200).json({
      message: "Connéxion réussie",
      data: userObj,
      ...tokens,
    });
  } catch (e) {
    return res.status(500).json({
      error: e.message,
    });
  }
};
//LOGOUT
export const logout = async (req, res) => {
  const { refreshToken } = req.body;
  try {
    if (!refreshToken) return res.status(400).json({ message: "token manquant" });
    const user = await User.findOne({ refreshToken });
    if (!user) return res.status(404).json({ message: "User not found" });
    // Supprimer le refresh token de l'utilisateur
    user.refreshToken = user.refreshToken.filter((t) => t !== refreshToken);
    await user.save();
    return res.status(200).json({ message: "Déconnexion réussie" });
  } catch (e) {
    return res.status(400).json({ error: e.message });
  }
};
//DELETE ACCOUNT
export const deleteAccount = async (req, res) => {
  const userId = req.user?._id || req.params.id || req.body?.id;
  try {
    if (!userId) return res.status(400).json({ message: "Identifiants manquants" });
    const user = await User.findByIdAndDelete(userId);
    if (!user) return res.status(404).json({ message: "User not found" });
    return res.status(200).json({ message: "Compte supprimé" });
  } catch (e) {
    return res.status(400).json({ error: e.message });
  }
};
//RESET-PASSWORD
