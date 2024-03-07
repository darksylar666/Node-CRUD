import express from "express";
import mongoose from "mongoose";
import BookRoutes from "./routes/books.routes.js";
import bodyParser from "body-parser";
import { config } from "dotenv";
config();

const app = express();
app.use(bodyParser.json());

mongoose.connect(process.env.MONGO_URL, { dbName: process.env.MONGO_DB_NAME });
const db = mongoose.connection;

app.use("/books", BookRoutes);

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server is running http://localhost:${port}`);
});
