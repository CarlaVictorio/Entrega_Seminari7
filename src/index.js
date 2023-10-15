const app = require("./app");
require("./database");

//archivo que se ejecuta con el nodemon
async function init() {
  await app.listen(3000);
  console.log("Server on port 3000");
}

init();
