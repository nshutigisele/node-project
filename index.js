const express = require('express');
const mysql = require('mysql2');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const port = 5000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Database connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'book management'
});

db.connect((err) => {
  if (err) {
    console.error('DB connection failed');
  } else {
    console.log('DB connected');
  }
});



// Show list of books
app.get('/books', (req, res) => {
  db.query('SELECT * FROM books', (err, results) => {
    if (err) return res.send('Error loading books');
    res.render('list', { books: results });
  });
});

// Show add form
app.get('/add', (req, res) => {
  res.render('form');
});

// Handle add book
app.post('/add', (req, res) => {
  const { bookname, quantity, author } = req.body;
  const sql = "INSERT INTO books (bookname, quantity, author) VALUES (?, ?, ?)";
  db.query(sql, [bookname, quantity, author], (err) => {
    if (err) return res.send('Insert failed');
    res.redirect('/books');
  });
});

// Show edit form
app.get('/edit/:id', (req, res) => {
  db.query('SELECT * FROM books WHERE id = ?', [req.params.id], (err, results) => {
    if (err || results.length === 0) return res.send('Book not found');
    res.render('edit', { book: results[0] });
  });
});

// Handle update
app.post('/update/:id', (req, res) => {
  const { bookname, quantity, author } = req.body;
  db.query(
    'UPDATE books SET bookname = ?, quantity = ?, author = ? WHERE id = ?',
    [bookname, quantity, author, req.params.id],
    (err) => {
      if (err) return res.send('Update failed');
      res.redirect('/books');
    }
  );
});

// Handle delete
app.get('/delete/:id', (req, res) => {
  db.query('DELETE FROM books WHERE id = ?', [req.params.id], (err) => {
    if (err) return res.send('Delete failed');
    res.redirect('/books');
  });
});

// Start server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
