/* eslint-disable no-use-before-define */
/* eslint-disable max-classes-per-file */
// BOOK CLASS: REPRESENTS A BOOK DISPLAYED
class Book {
  constructor(title, author, isbn) {
    this.title = title;
    this.author = author;
    this.isbn = isbn;
  }
}

// UI CLASS: HANDLES ALL USER INTERFACE TASK SUCH AS ALERTS E.T.C
class UI {
  static displayBooks() {
    // create a book variable and set it to stored books
    const books = Store.getBooks();

    // loop through the books to add a book to the list
    books.forEach((book) => UI.addBookToList(book));
  }

  static addBookToList(book) {
    // target each book content/ booklist
    const list = document.querySelector('#book-list');

    // to create a table row element that will house each book
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${book.title}</td>
      <td>${book.author}</td>
      <td>${book.isbn}</td>
      <td><a href="#" class="btn btn-danger btn-sm delete">X</td>
      `;
    // to append child (row) to the list
    list.appendChild(row);
  }

  static deleteBook(element) {
    if (element.classList.contains('delete')) {
      element.parentElement.parentElement.remove();
    }
  }

  static showAlert(message, className) {
    // create the div for alert
    const div = document.createElement('div');
    div.className = `alert alert-${className}`;
    div.appendChild(document.createTextNode(message));

    const container = document.querySelector('.container');
    const form = document.querySelector('#book-form');
    container.insertBefore(div, form);

    // to vanish in 3 seconds
    setTimeout(() => document.querySelector('.alert').remove(), 3000);
  }

  static clearFields() {
    document.querySelector('#title').value = '';
    document.querySelector('#author').value = '';
    document.querySelector('#isbn').value = '';
  }
}

// STORE CLASS: HANDLES EVERYTHING IN THE LOCAL STORAGE
class Store {
  static getBooks() {
    let books;
    if (localStorage.getItem('books') === null) {
      books = [];
    } else {
      books = JSON.parse(localStorage.getItem('books'));
    }
    return books;
  }

  static addBook(book) {
    const books = Store.getBooks();
    books.push(book);
    localStorage.setItem('books', JSON.stringify(books));
  }

  static removeBook(isbn) {
    const books = Store.getBooks();

    // loop through each book
    books.forEach((book, index) => {
      if (book.isbn === isbn) {
        books.splice(index, 1);
        localStorage.setItem('books', JSON.stringify(books));
      }
    });
  }
}

// EVENT: TO DISPLAY BOOKS
document.addEventListener('DOMContentLoaded', UI.displayBooks);

// EVENT: TO ADD BOOK
document.querySelector('#book-form').addEventListener('submit', (e) => {
  // to prevent actual submit
  e.preventDefault();

  // when the user clicks submit, we want to Get form values
  // Get form values
  const title = document.querySelector('#title').value;
  const author = document.querySelector('#author').value;
  const isbn = document.querySelector('#isbn').value;

  // validate a book (alerts)
  if (title === '' || author === '' || isbn === '') {
    UI.showAlert('Hey love!, kindly fill all fields 🤗', 'danger');
  } else {
  // to instatiate a book from the parent Book
    // Instatiate book
    const book = new Book(title, author, isbn);

    // Add Book to UI
    UI.addBookToList(book);

    // Add book to store (localStorage)
    Store.addBook(book);

    // show success message
    UI.showAlert('Book Added successfully 😍!', 'success');

    // to clear fields on the UI class
    UI.clearFields();
  }
});

// EVENT: TO REMOVE A BOOK
// target the book-list, it's the container that holds each book added
document.querySelector('#book-list').addEventListener('click', (e) => {
  UI.deleteBook(e.target);

  // Remove book from store
  Store.removeBook(e.target.parentElement.previousElementSibling.textContent);

  // show success message
  UI.showAlert('Book deleted 😟!', 'success');
});