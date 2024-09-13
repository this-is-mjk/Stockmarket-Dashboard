const express = require("express");
const app = express();

// const Kitten = require("./database/models/test");

// const saveKitten = async () => {
//   const silence = new Kitten({ name: "Silence" });
//   silence.speak();
//   await silence.save();
//   return silence;
// };

Worker = require("./worker/fetchData");
Worker();

// routes
app.get("/", async (req, res) => {
    
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
