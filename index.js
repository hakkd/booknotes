import express from "express";
import pg from "postgres";
import bodyParser from "body-parser";
import dotenv from "dotenv";

dotenv.config();

const db = new pg.Client({
    user: process.env.DB_USER,
    host: "localhost",
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: 5432,
  });

db.connect();

let reviews = [];

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));




app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
  });