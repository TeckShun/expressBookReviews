const axios = require('axios');
const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Register a new user
public_users.post("/register", (req, res) => {
  // Extract user information from the request body
  const { username, password } = req.body;

  // Check if username and password are provided
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  // Check if the username already exists
  const userExists = users.some(user => user.username === username);

  if (userExists) {
    return res.status(409).json({ message: "Username already exists" });
  }

  // Add the new user to the list of users
  const newUser = { username, password };
  users.push(newUser);

  // Return a success response
  return res.status(201).json({ message: "User registered successfully" });
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
  // Check if books is an array or object and respond accordingly
  if (books) {
    // Send the list of books with a neat JSON format
    return res.status(200).json(books);
  } else {
    // If no books are available
    return res.status(404).json({ message: "No books available" });
  }
});

// // Get the book list available in the shop using async/await
// public_users.get('/', async function (req, res) {
//   try {
//     // URL of the API or data source
//     const response = await axios.get('http://localhost:5000/'); 
//     const books = response.data;

//     if (books) {
//       return res.status(200).json(books);
//     } else {
//       return res.status(404).json({ message: "No books available" });
//     }
//   } catch (error) {
//     return res.status(500).json({ message: "Error fetching books" });
//   }
// });


// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  // Retrieve ISBN from the request parameters
  const isbn = req.params.isbn;

  // Check if the book with the given ISBN exists in the books object
  const book = books[isbn];

  if (book) {
    // Return the book details as a JSON response
    return res.status(200).json(book);
  } else {
    // If the book is not found, return a 404 error
    return res.status(404).json({ message: "Book not found" });
  }
});

// // Get book details based on ISBN
// public_users.get('/isbn/:isbn', (req, res) => {
//   const isbn = req.params.isbn;

//   axios.get(`http://localhost:5000/books/isbn/${isbn}`) // URL to fetch book by ISBN
//     .then(response => {
//       const book = response.data;

//       if (book) {
//         return res.status(200).json(book);
//       } else {
//         return res.status(404).json({ message: "Book not found" });
//       }
//     })
//     .catch(error => {
//       return res.status(500).json({ message: "Error fetching book details" });
//     });
// });


// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  // Retrieve the author from the request parameters
  const author = req.params.author.toLowerCase(); // Normalize to lowercase for case-insensitive matching

  // Array to store books by the given author
  const booksByAuthor = [];

  // Iterate through the books object
  Object.keys(books).forEach(isbn => {
    if (books[isbn].author.toLowerCase() === author) { // Check for matching author
      booksByAuthor.push(books[isbn]);
    }
  });

  if (booksByAuthor.length > 0) {
    // Return the list of books by the author if found
    return res.status(200).json(booksByAuthor);
  } else {
    // If no books by the author are found
    return res.status(404).json({ message: "No books found by this author" });
  }
});


// // Get book details based on author
// public_users.get('/author/:author', async function (req, res) {
//   const author = req.params.author;

//   try {
//     const response = await axios.get(`http://localhost:5000/books/author/${author}`); // URL to fetch books by author
//     const booksByAuthor = response.data;

//     if (booksByAuthor.length > 0) {
//       return res.status(200).json(booksByAuthor);
//     } else {
//       return res.status(404).json({ message: "No books found by this author" });
//     }
//   } catch (error) {
//     return res.status(500).json({ message: "Error fetching books by author" });
//   }
// });


// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  // Retrieve the title from the request parameters
  const title = req.params.title.toLowerCase(); // Normalize to lowercase for case-insensitive matching

  // Array to store books with the given title
  const booksByTitle = [];

  // Iterate through the books object
  Object.keys(books).forEach(isbn => {
    if (books[isbn].title.toLowerCase() === title) { // Check for matching title
      booksByTitle.push(books[isbn]);
    }
  });

  if (booksByTitle.length > 0) {
    // Return the list of books with the matching title
    return res.status(200).json(booksByTitle);
  } else {
    // If no books with the title are found
    return res.status(404).json({ message: "No books found with this title" });
  }
});


// Get all books based on title
public_users.get('/title/:title', async function (req, res) {
  const title = req.params.title;

  try {
    const response = await axios.get(`http://localhost:5000/books/title/${title}`); // URL to fetch books by title
    const booksByTitle = response.data;

    if (booksByTitle.length > 0) {
      return res.status(200).json(booksByTitle);
    } else {
      return res.status(404).json({ message: "No books found with this title" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Error fetching books by title" });
  }
});



// public_users.get('/review/:isbn', function (req, res) {
//   // Retrieve ISBN from the request parameters
//   const isbn = req.params.isbn;

//   // Find the book in the books object using the ISBN
//   const book = books[isbn];

//   if (book) {
//     // Check if reviews exist for the book
//     if (book.reviews) {
//       // Return the book's reviews
//       return res.status(200).json(book.reviews);
//     } else {
//       // If the book has no reviews
//       return res.status(404).json({ message: "No reviews available for this book" });
//     }
//   } else {
//     // If the book is not found
//     return res.status(404).json({ message: "Book not found" });
//   }
// });

module.exports.general = public_users;
