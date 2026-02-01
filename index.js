// Imported our npm packages
import express from "express";
import pg from "pg"
import bodyParser from "body-parser";
import axios from "axios";

// created our server 
const app = express();
const port = 3000;

// created middlewares
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));




// Linked our database to express 
const db = new pg.Client({
    user: "postgres",
    host: "127.0.0.1",
    database: "bookipedia",
    password: "1234567",
    port: 5432
});

db.connect();

// variable for database
let books = [];

app.get("/", async (req,res) => {
    try {
        const showcase =  await db.query("SELECT * FROM books ORDER BY id ASC");
        books = showcase.rows;

        res.render("index.ejs", {book: books})
    } catch (err) {
        console.error(err);
        res.status(500).send("Database error");
    }
});

app.post ("/search", async (req, res) => {
    const search = req.body.search;

    const result = books.filter((book) => book.title.toLowerCase().includes(search.toLowerCase()));

    res.render("index.ejs", {book:result})
})



app.listen(port, () => {
    console.log("Server is running on port 3000");
});