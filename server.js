// server.js
// SERVER-SIDE JAVASCRIPT


/////////////////////////////
//  SETUP and CONFIGURATION
/////////////////////////////

//require express in our app
var express = require('express'),
  bodyParser = require('body-parser'),
  db=require('./models');

// generate a new express app and call it 'app'
var app = express();

// serve static files in public
app.use(express.static('public'));

// body parser config to accept our datatypes
app.use(bodyParser.urlencoded({ extended: true }));

// define a root route: localhost:3000/
app.get('/', function (req, res) {
  res.sendFile('views/index.html' , { root : __dirname});
});

// get all books
app.get('/api/books', function (req, res) {
  // send all books as JSON response
  db.Book.find().populate('author').exec(function(err,books){
    if(err){
      console.log("index error: "+err);
    }
  console.log('books index');
  res.json(books);
});
});

// get one book
app.get('/api/books/:id', function (req, res) {

 var book_id=req.params.id;
 db.Book.findOne({_id:book_id},function(err,selectedbook)
  {
    res.json(selectedbook);
  })

});

// create new book
app.post('/api/books', function (req, res) {
      // create new book with form data (`req.body`)
      var newBook = new db.Book({
        title: req.body.title,
        image: req.body.image,
        releaseDate: req.body.releaseDate,
      });

      // this code will only add an author to a book if the author already exists
      db.Author.findOne({name: req.body.author}, function(err, author){
        newBook.author = author;
        // add newBook to database
        newBook.save(function(err, book){
          if (err) {
            return console.log("create error: " + err);
          }
          console.log("created ", book.title);
          res.json(book);
        });
      });

    });


// update book
app.put('/api/books/:id', function(req,res){

 var book_id=req.params.id;
 db.Book.findOne({ _id: book_id }, function(err, foundbook) {

        foundbook.title = (req.body.title) ? req.body.title : foundbook.title ;
        foundbook.author.name = (req.body.author) ? req.body.author.name: foundbook.author.name;
        foundbook.image = (req.body.image)? req.body.image :  foundbook.image ;
        foundbook.release_date = (req.body.release_date) ? req.body.release_date : foundbook.release_date ;

         foundbook.save(function(err, updatedbook) {
             res.json(updatedbook);
         });
     });
});

// delete book
app.delete('/api/books/:id', function (req, res) {

  var book_id=req.params.id;
  db.Book.findOneAndRemove({_id:book_id},function(err,deleted_item){
    res.json(deleted_item);
  })
});

app.listen(process.env.PORT || 3000, function () {
  console.log('Book app listening at http://localhost:3000/');
});
