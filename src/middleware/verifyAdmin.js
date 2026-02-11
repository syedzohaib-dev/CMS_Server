import jwt from "jsonwebtoken";

export const verifyAdmin = (req, res, next) => {
  const authHeader = req.headers.authorization;
  console.log("Authorization Header:", authHeader);

  if (!authHeader) return res.status(401).json({ message: "Access denied" });

  const token = authHeader.split(" ")[1];
  console.log("Extracted token:", token);
  console.log("JWT_SECRET:", process.env.JWT_SECRET);

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded token:", decoded);

    if (decoded.role !== "admin")
      return res.status(403).json({ message: "Only admin allowed" });

    req.user = decoded;
    next();
  } catch (err) {
    console.error("JWT Verify Error:", err.message);
    return res.status(401).json({ message: "Invalid token" });
  }
};
