const { Schema, model } = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new Schema({
  username: String,
  email: String,
  password: String,
  role: String
});

userSchema.methods.encryptPassword = async (password) => { //metodo para encriptar la contraseña
  const salt = await bcrypt.genSalt(10); //aplicamos el algoritmo 10 veces para que sea más seguro, asíncrono
  return bcrypt.hash(password, salt); //aplicamos la funcion hash, convierte el string usando el salt generado
};

userSchema.methods.validatePassword = function (password) { //validamos si la contraseña es la correcta
  return bcrypt.compare(password, this.password); //comparamos la contraseña recibida con la del objeto en la base de datos
};

module.exports = model("User", userSchema); //guardamos el modelo en la base de datos
