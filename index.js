// Imported our npm packages
import express from "express";
import pg from "pg"
import bodyParser from "body-parser";
import axios from "axios";
import env from "dotenv";

// created our server 
const app = express();
const port = 3000;
env.config();

// created middlewares
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));


// Linked our database to express 
const db = new pg.Client({
    user: process.env.PG_USER,
    host: process.env.PG_HOST,
    database: process.env.PG_DATABASE,
    password: process.env.PG_PASSWORD,
    port: process.env.PG_PORT
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

app.get("/view/:id", async (req,res) => {
    const bookId = parseInt(req.params.id);

    try {
        const databaseId = await db.query("SELECT * FROM books WHERE id = $1", [bookId]);
        
        console.log(databaseId)

        if (databaseId.rows.length === 0) {
            return res.status(404).send("Book Not Found")
        }

       const book = databaseId.rows[0]
    
        res.render("view.ejs", {book: book});
    } catch (err) {
        console.error(err);
        res.status(500).send("Internal server error");
    }   
})

app.post ("/search", async (req, res) => {
    const search = req.body.search;

    try {
        const titleSearch = await db.query("SELECT * FROM books WHERE title ILIKE $1", [`%${search}%`]);

        if (titleSearch.rows.length < 0) {
            return res.status(404).send("Book Not Found")
        }

        const bookSearch = titleSearch.rows;

        res.render("index.ejs", {book:bookSearch});

        console.log(bookSearch);


    } catch {
        console.error(err)
    }
})


app.listen(port, () => {
    console.log("Server is running on port 3000");
});