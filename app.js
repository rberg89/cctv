const express = require('express'),
  createError = require('http-errors'),
  path = require('path'),
  cookieParser = require('cookie-parser'),
  logger = require('morgan'),
  { MongoClient } = require('mongodb'),
  app = express(),
  cors = require('cors');

require('dotenv').config();

const nms = require('./utils/nms');
nms.run();

//CORS for dev environment, whitelist angular dev server
var corsOptions = {
  origin: 'http://localhost:4200', //todo make dynamic?
  optionsSuccessStatus: 200 // For legacy browser support
}
app.use(cors(corsOptions));

const uri = 'mongodb+srv://' + process.env.MONGOUN + ':<' + process.env.MONGOPW + '>@cluster1337.budqz.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const collection = client.db("nodeStream").collection("test");
  // perform actions on the collection object
  client.close();
});



const usersRouter = require('./routes/users');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'dist')));

// app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
