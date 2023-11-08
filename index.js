import express from "express";
import pg from "postgres";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import axios from "axios";

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

app.get("/", async (req, res) => {
    try {
        const result = await db.query("SELECT * FROM reviews");
        res.render("index.ejs", {reviews: result.rows});
    } catch (err) {
        console.log(err);
    }
});

// TODO:
// - /add post route
// - /edit route
// - /delete route
// - some kind of sorting function
// use axios to get book covers from https://openlibrary.org/dev/docs/api/covers

app.post("/add", async (req, res) => {
    const title = req.body.title;
    const review = req.body.review;
    const rating = req.body.rating;
    try {
        await db.query(
            "INSERT INTO reviews (title, date_created, review, rating) VALUES ($1, to_timestamp($2), $3, $4)",
            [title, Date.now(), review, rating]
        );
        res.redirect("/");
    } catch (err) {
        console.log(err);
    }
});


app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
  });