import express from "express";
import pg from "pg";
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
        let reviews = [];
        result.rows.forEach((row) => {
            let review = {
                id: row.id,
                title: row.title,
                author: row.author,
                review: row.review,
                rating: row.rating,
                isbn: row.isbn,
                date: row.date_created,
            }
            reviews.push(review);
        });
        res.render("index.ejs", {reviews: reviews});
    } catch (err) {
        console.log(err);
    }
});

app.get("/new-review", (req, res) => {
    res.render("new-review.ejs");
});

// TODO:
// - some kind of sorting function

app.post("/add", async (req, res) => {
    const title = req.body.title;
    const author = req.body.author;
    const review = req.body.review;
    const rating = req.body.rating;
    const isbn = req.body.isbn;
    console.log(req.body);
    try {
        await db.query(
            "INSERT INTO reviews (title, date_created, review, rating, isbn, author) VALUES ($1, to_timestamp($2), $3, $4, $5, $6)",
            [title, Date.now(), review, rating, isbn, author],
        );
        // TODO: add user to DB/link to review
        res.redirect("/");
    } catch (err) {
        console.log(err);
    }
});

app.get("/view-review/:reviewId", async (req, res) => {
    try {
        const result = await db.query("SELECT * FROM reviews WHERE id = $1", [req.params.reviewId]);
        let review = {
            id: result.rows[0].id,
            title: result.rows[0].title,
            author: result.rows[0].author,
            review: result.rows[0].review,
            rating: result.rows[0].rating,
            isbn: result.rows[0].isbn,
            date: result.rows[0].date_created,
        }
        res.render("view-review.ejs", {review: review});
    } catch (err) {
        console.log(err);
    }
});

app.get("/edit-review/:reviewId", async (req, res) => {
    try {
        const result = await db.query("SELECT * FROM reviews WHERE id = $1", [req.params.reviewId]);
        let review = {
            id: result.rows[0].id,
            title: result.rows[0].title,
            author: result.rows[0].author,
            review: result.rows[0].review,
            rating: result.rows[0].rating,
            isbn: result.rows[0].isbn,
            date: result.rows[0].date_created,
        }
        res.render("edit-review.ejs", {review: review});
    } catch (err) {
        console.log(err);
    }
});

app.post("/edit-review/:reviewId", async (req, res) => {
    const id = req.params.reviewId;
    const title = req.body.title;
    const author = req.body.author;
    const review = req.body.review;
    const rating = req.body.rating;
    const isbn = req.body.isbn;
    console.log(req.body);
    try {
        await db.query(
            "UPDATE reviews SET title = $1, author = $2, review = $3, rating = $4, isbn = $5 WHERE id = $6",
            [title, author, review, rating, isbn, id],
        );
        // TODO: add user to DB/link to review
        res.redirect("/");
    } catch (err) {
        console.log(err);
    }
});


app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
  });