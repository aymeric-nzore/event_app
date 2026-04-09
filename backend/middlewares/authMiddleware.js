import jwtConfig from "../config/jwtConfig.js";
import User from "../models/user.js";

export const protect = async (req, res, next) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Token manquant" });
  }
  try {
    const decoded = jwtConfig.verifyAccess(header.split(" ")[1]);
    req.user = await User.findById(decoded.id).select("-password -refreshToken");
    if (!req.user) return res.status(401).json({ error: "User not found" });
    next();
  } catch (e) {
    return res.status(401).json({ error: "Token invalide" });
  }
};
