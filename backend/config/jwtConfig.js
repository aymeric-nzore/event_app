import jwt from "jsonwebtoken";

const ACCESS_TOKEN_EXPIRY = "15m";
const REFRESH_TOKEN_EXPIRY = "7d";
const TICKET_TOKEN_EXPIRY = "1d";

const generateToken = (payload) => {
  const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRY,
  });
  const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
    expiresIn: REFRESH_TOKEN_EXPIRY,
  });
  return { accessToken, refreshToken };
};
const generateTicketToken = (payload) => {
  return jwt.sign(
    {
      ...payload,
      type: "ticket",
    },
    process.env.JWT_TICKET_SECRET,
    { expiresIn: TICKET_TOKEN_EXPIRY }
  );
};
const verifyAccess = (token) =>
  jwt.verify(token, process.env.JWT_ACCESS_SECRET);
const verifyRefresh = (token) =>
  jwt.verify(token, process.env.JWT_REFRESH_SECRET);

export default {
  generateToken,
  verifyAccess,
  verifyRefresh,
  generateTicketToken
};
