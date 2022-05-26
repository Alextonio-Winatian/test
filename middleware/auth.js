// Import dependencies
const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
    const token = req.header("x-auth-token");
    if (!token) return res.status(401).send({
        status: "Error",
        error: "Access denied. No token provided"
    });

    try {
        const decoded = jwt.verify(token, "jwtPrivateKey");
        req.users = decoded;

    } catch (error) {
        return res.status(401).send({
            status: "Error",
        });
    }

    next();
}