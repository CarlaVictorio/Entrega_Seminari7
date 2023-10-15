const { Router } = require("express");
const router = Router();

const jwt = require("jsonwebtoken"); //me permite generar el token, que es un string de autorizacion que se envia entre servidor-cliente, es un pase para poder hacer request al servidor
const config = require("../config");

const User = require("../models/User");
const verifyToken = require("./verifyToken");

router.post("/signup", async (req, res, next) => { //ruta del register, ponemos async porque para encriptar usamos el await
  const { username, email, password, role } = req.body;
  console.log(username, email, password, role);

  const user = new User({
    username,
    email,
    password,
    role,
  });
  user.password = await user.encryptPassword(user.password); //ciframos la contraseña desde la funcion en la instancia del modelo
  await user.save();

  const token = jwt.sign({ id: user._id, email: user.email, role: user.role }, config.secret, { //sign para crear un token en función del id del usuario y el secret, que hace que sea único cada vez, es un texto unico en la aplicacion
    expiresIn: 60 * 60 * 24, //expira en 24h, le paso el tiempo en segundos
  });

  res.json({ auth: true, token }); //devuelve el token al usuario y verifica que está autenticado
});

router.get("/me", verifyToken, async (req, res, next) => { //ruta del perfil, para hacer el get verificamos antes que esté autorizado
  const user = await User.findById(req.userId, { password: 0 }); //pedimos que no devuelva el password
  if (!user) {
    return res.status(404).send("No user found"); //si no enviamos el token no recibimos info
  }

  res.json(user); //retornamos el json del usuario
});

router.post("/signin", async (req, res, next) => { //ruta del log in
  const { email, password } = req.body; //recibimos los datos de la petición
  const user = await User.findOne({ email: email }); // el servidor buscará si existe en la db
  if (!user) {
    return res.status(404).send("The email doesn t exists"); //el usuario con ese mail no existe
  }

  const validPassword = await user.validatePassword(password);
  if (!validPassword) {
    return res.status(401).json({ auth: false, token: null }); //la contraseña no es válida
  }

  const token = jwt.sign({ id: user._id, email: user.email, role: user.role }, config.secret, { //contraseña correcta, generamos token
    expiresIn: 60 * 60 * 24,
  });

  res.json({ auth: true, token });
});

router.get("/admin", verifyToken, async (req, res, next) => { //ruta del perfil, para hacer el get verificamos antes que esté autorizado
  const user = await User.findById(req.userId, { password: 0 }); //pedimos que no devuelva el password
  if (!user) {
    return res.status(404).send("No user found"); //si no enviamos el token no recibimos info
  }
  else if (user.role == "admin")
    {
      res.json("Your role is: " + user.role + "  "+user.username.toUpperCase()+":  Welcome to the admin section!!! "); 
    }
  else {
      return res.status(404).send("You are not an admin, change to /" + user.role); //si no enviamos el token no recibimos info
    }
  }
);

router.get("/basic", verifyToken, async (req, res, next) => { //ruta del perfil, para hacer el get verificamos antes que esté autorizado
  const user = await User.findById(req.userId, { password: 0 }); //pedimos que no devuelva el password
  if (!user) {
    return res.status(404).send("No user found"); //si no enviamos el token no recibimos info
  }
  res.json("you are a basic user: " + (user)); //retornamos el json del usuario

});

module.exports = router;
