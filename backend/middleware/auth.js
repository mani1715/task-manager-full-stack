const jwt = require('jsonwebtoken');


function authMiddleware(req, res, next){
const authHeader = req.headers.authorization;
if (!authHeader) return res.status(401).json({ message: 'No token provided' });
const parts = authHeader.split(' ');
if (parts.length !== 2) return res.status(401).json({ message: 'Token error' });
const token = parts[1];
try{
const decoded = jwt.verify(token, process.env.JWT_SECRET);
req.user = decoded; // { id, email }
next();
}catch(err){
return res.status(401).json({ message: 'Invalid token' });
}
}


module.exports = authMiddleware;