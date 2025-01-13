require("dotenv").config();
console.log("DB_CONNECTION:", process.env.DB_CONNECTION);

const express = require("express");
const app = express();
const dotenv = require("dotenv").config();
const port = process.env.PORT || 3000;

const mongoose = require("mongoose");

mongoose.connect(process.env.DB_CONNECTION, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", (error) => console.error(error));
db.once("open", () => console.log("Connected to Database"));

const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


const postsRoutes = require("./routes/posts_routes");
app.use("/posts", postsRoutes);

app.get("/about", (req, res) => {
    res.send("Hello World!");
  });  

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
}).on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.error(`Port ${port} is already in use`);
      process.exit(1);
    } else {
      console.error(err);
    }
});