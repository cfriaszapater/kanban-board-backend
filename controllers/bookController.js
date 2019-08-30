/* jshint esversion: 8 */

var Book = require("../models/book");
var Author = require("../models/author");
var Genre = require("../models/genre");
var BookInstance = require("../models/bookinstance");
var NotFoundError = require("../errors/notFoundError");
var async = require("async");
const { body, validationResult } = require("express-validator");
const { sanitizeBody } = require("express-validator");
var debug = require("debug")("kanban-board-backend:controllers:bookController");

exports.index = function(req, res) {
  debug("Counting DB objects...");
  async.parallel(
    {
      book_count: function(callback) {
        Book.countDocuments({}, callback); // Pass an empty object as match condition to find all documents of this collection
      },
      book_instance_count: function(callback) {
        BookInstance.countDocuments({}, callback);
      },
      book_instance_available_count: function(callback) {
        BookInstance.countDocuments(
          {
            status: "Available"
          },
          callback
        );
      },
      author_count: function(callback) {
        Author.countDocuments({}, callback);
      },
      genre_count: function(callback) {
        Genre.countDocuments({}, callback);
      }
    },
    function(err, results) {
      debug("...finished counting DB objects");
      res.render("index", {
        title: "Kanban Board",
        error: err,
        data: results
      });
    }
  );
};

// Display list of all Books.
exports.book_list = function(req, res, next) {
  Book.find({}, "title author")
    .populate("author")
    .exec(function(err, books) {
      if (err) {
        return next(err);
      }
      // Successful, so render
      res.render("book_list", {
        title: "Book List",
        book_list: books
      });
    });
};

// Display detail page for a specific book.
exports.book_detail = function(req, res, next) {
  async.parallel(
    {
      book: function(callback) {
        Book.findById(req.params.id)
          .populate("author")
          .populate("genre")
          .exec(callback);
      },
      book_instance: function(callback) {
        BookInstance.find({
          book: req.params.id
        }).exec(callback);
      }
    },
    function(err, results) {
      if (err) {
        return next(err);
      }
      if (results.book == null) {
        // No results.
        return next(new NotFoundError("Book not found"));
      }
      // Successful, so render.
      res.render("book_detail", {
        title: results.book.title,
        book: results.book,
        book_instances: results.book_instance
      });
    }
  );
};

// Display book create form on GET.
exports.book_create_get = function(req, res, next) {
  // Get all authors and genres, which we can use for adding to our book.
  async.parallel(
    {
      authors: function(callback) {
        Author.find(callback);
      },
      genres: function(callback) {
        Genre.find(callback);
      }
    },
    function(err, results) {
      if (err) {
        return next(err);
      }
      res.render("book_form", {
        title: "Create Book",
        authors: results.authors,
        genres: results.genres
      });
    }
  );
};

// Handle book create on POST.
exports.book_create_post = [
  // Convert the genre to an array.
  (req, res, next) => {
    if (!(req.body.genre instanceof Array)) {
      if (typeof req.body.genre === "undefined") {
        req.body.genre = [];
      } else {
        req.body.genre = new Array(req.body.genre);
      }
    }
    next();
  },

  // Validate fields.
  body("title", "Title must not be empty.")
    .trim()
    .isLength({
      min: 1
    }),
  body("author", "Author must not be empty.")
    .trim()
    .isLength({
      min: 1
    }),
  body("summary", "Summary must not be empty.")
    .trim()
    .isLength({
      min: 1
    }),
  body("isbn", "ISBN must not be empty")
    .trim()
    .isLength({
      min: 1
    }),

  // Sanitize fields (not using * because the genre array got messed).
  sanitizeBody("title", "author", "summary", "isbn").escape(),
  sanitizeBody("genre.*").escape(),

  // Process request after validation and sanitization.
  (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create a Book object with escaped and trimmed data.
    var book = new Book({
      title: req.body.title,
      author: req.body.author,
      summary: req.body.summary,
      isbn: req.body.isbn,
      genre: req.body.genre
    });

    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values/error messages.

      // Get all authors and genres for form.
      async.parallel(
        {
          authors: function(callback) {
            Author.find(callback);
          },
          genres: function(callback) {
            Genre.find(callback);
          }
        },
        function(err, results) {
          if (err) {
            return next(err);
          }

          // Mark our selected genres as checked.
          for (let i = 0; i < results.genres.length; i++) {
            if (book.genre.indexOf(results.genres[i]._id) > -1) {
              results.genres[i].checked = "true";
            }
          }
          res.render("book_form", {
            title: "Create Book",
            authors: results.authors,
            genres: results.genres,
            book: book,
            errors: errors.array()
          });
        }
      );
    } else {
      // Data from form is valid. Save book.
      book.save(function(err) {
        if (err) {
          return next(err);
        }
        // successful - redirect to new book record.
        res.redirect(book.url);
      });
    }
  }
];

// Display book delete form on GET.
exports.book_delete_get = function(req, res) {
  res.send("NOT IMPLEMENTED: Book delete GET");
};

// Handle book delete on POST.
exports.book_delete_post = function(req, res) {
  res.send("NOT IMPLEMENTED: Book delete POST");
};

// Display book update form on GET.
exports.book_update_get = function(req, res, next) {
  // Get book, authors and genres for form.
  async.parallel(
    {
      book: function(callback) {
        Book.findById(req.params.id)
          .populate("author")
          .populate("genre")
          .exec(callback);
      },
      authors: function(callback) {
        Author.find(callback);
      },
      genres: function(callback) {
        Genre.find(callback);
      }
    },
    function(err, results) {
      if (err) {
        return next(err);
      }
      if (results.book == null) {
        // No results.
        return next(new NotFoundError("Book not found"));
      }
      // Success.
      // Mark our selected genres as checked.
      for (var genre = 0; genre < results.genres.length; genre++) {
        for (
          var bookGenre = 0;
          bookGenre < results.book.genre.length;
          bookGenre++
        ) {
          if (
            results.genres[genre]._id.toString() ===
            results.book.genre[bookGenre]._id.toString()
          ) {
            results.genres[genre].checked = "true";
          }
        }
      }
      res.render("book_form", {
        title: "Update Book",
        authors: results.authors,
        genres: results.genres,
        book: results.book
      });
    }
  );
};

// Handle book update on POST.
exports.book_update_post = [
  // Convert the genre to an array
  (req, res, next) => {
    if (!(req.body.genre instanceof Array)) {
      if (typeof req.body.genre === "undefined") {
        req.body.genre = [];
      } else {
        req.body.genre = new Array(req.body.genre);
      }
    }
    next();
  },

  // Validate fields.
  body("title", "Title must not be empty.")
    .trim()
    .isLength({
      min: 1
    }),
  body("author", "Author must not be empty.")
    .trim()
    .isLength({
      min: 1
    }),
  body("summary", "Summary must not be empty.")
    .trim()
    .isLength({
      min: 1
    }),
  body("isbn", "ISBN must not be empty")
    .trim()
    .isLength({
      min: 1
    }),

  // Sanitize fields (not using * because the genre array got messed).
  sanitizeBody("title", "author", "summary", "isbn").escape(),
  sanitizeBody("genre.*").escape(),

  // Process request after validation and sanitization.
  (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create a Book object with escaped/trimmed data and old id.
    var book = new Book({
      title: req.body.title,
      author: req.body.author,
      summary: req.body.summary,
      isbn: req.body.isbn,
      genre: typeof req.body.genre === "undefined" ? [] : req.body.genre,
      _id: req.params.id // This is required, or a new ID will be assigned!
    });

    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values/error messages.

      // Get all authors and genres for form.
      async.parallel(
        {
          authors: function(callback) {
            Author.find(callback);
          },
          genres: function(callback) {
            Genre.find(callback);
          }
        },
        function(err, results) {
          if (err) {
            return next(err);
          }

          // Mark our selected genres as checked.
          for (let i = 0; i < results.genres.length; i++) {
            if (book.genre.indexOf(results.genres[i]._id) > -1) {
              results.genres[i].checked = "true";
            }
          }
          res.render("book_form", {
            title: "Update Book",
            authors: results.authors,
            genres: results.genres,
            book: book,
            errors: errors.array()
          });
        }
      );
    } else {
      // Data from form is valid. Update the record.
      Book.findByIdAndUpdate(req.params.id, book, {}, function(err, thebook) {
        if (err) {
          return next(err);
        }
        // Successful - redirect to book detail page.
        res.redirect(thebook.url);
      });
    }
  }
];
