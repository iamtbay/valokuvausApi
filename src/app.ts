import express from "express";
import dotenv from "dotenv";

//VARIABLES
const app = express();
dotenv.config();
const port = process.env.PORT;

//MIDDLEWARES
app.use(express.json());

//ROUTES

app.listen(port, () => {
  console.log(`app started on port ${port}`);
});
