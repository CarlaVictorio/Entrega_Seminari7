const mongoose = require("mongoose");

mongoose
  .connect("mongodb://127.0.0.1:27017/simplejwt", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Database is connected");
  })
  .catch((err) => {
    console.error("Error connecting to database:", err);
  });
