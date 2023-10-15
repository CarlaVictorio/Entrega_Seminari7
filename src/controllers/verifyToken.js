const jwt = require("jsonwebtoken");
const config = require("../config");


function verifyToken(req, res, next) {
  const token = req.headers["x-access-token"]; //devuelve las cabeceras que el cliente envia, recogemos el token
  if (!token) {
    return res.status(401).json({
      auth: false,
      message: "No token provided",
    });
  }
  try{
    const decoded = jwt.verify(token, config.secret); //verificamos el token enviado, lo decodificamos usando el secret, el usuario se lo envia en headers
    req.userId = decoded.id;
    next();
  } 
  catch (error) {
    return res.status(401).json({
    auth: false,
    message: "Token inválido",
  });
  }
}



module.exports = verifyToken;
