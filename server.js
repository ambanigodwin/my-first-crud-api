const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.json());

let books = [
    { id: 1, title: "To Kill a Mockingbird", author: "Harper Lee" },
    { id: 2, title: "1984", author: "George Orwell" },
    { id: 3, title: "The Great Gatsby", author: "F. Scott Fitzgerald" }
];

// 1. READ ALL
app.get('/api/books', (req, res) => {
    res.json(books);
});

// 2. READ ONE
app.get('/api/books/:id', (req, res) => {
    const bookId = Number(req.params.id);
    const foundBook = books.find(b => b.id === bookId);

    if (foundBook) {
        res.json(foundBook);
    } else {
        res.status(404).json({ error: "Book not found" });
    }
});

// 3. CREATE
app.post('/api/books', (req, res) => {
    const { title, author } = req.body;

    if (!title || !author) {
        return res.status(400).json({ error: "Please provide both title and author" });
    }

    const newBook = {
        id: books.length + 1,
        title,
        author
    };

    books.push(newBook);
    res.status(201).json(newBook);
});

// 4. UPDATE (PUT)
app.put('/api/books/:id', (req, res) => {
    const bookId = Number(req.params.id);
    const book = books.find(b => b.id === bookId);

    if (!book) {
        return res.status(404).json({ error: "Book not found" });
    }

    const { title, author } = req.body;
    if (!title || !author) {
        return res.status(400).json({ error: "Please provide title and author to update" });
    }

    book.title = title;
    book.author = author;
 
    res.json(book);
});

// 5. DELETE
app.delete('/api/books/:id', (req, res) => {
    const bookId = Number(req.params.id);
    const bookIndex = books.findIndex(b => b.id === bookId);

    if (bookIndex === -1) {
        return res.status(404).json({ error: "Book not found" });
    }

    // Remove 1 item at bookIndex
    books.splice(bookIndex, 1);

    // 204 No Content means success, but no data to return
    res.status(204).send();
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});