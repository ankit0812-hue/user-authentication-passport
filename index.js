const express = require('express');
const http = require('http');
const morgan = require('morgan');
const bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var FileStore = require('session-file-store')(session);
var passport = require('passport');
var authenticate = require('./authenticate');
const dishRouter = require('./routes/dishRouter');
const promoRouter = require('./routes/promoRouter');
const leaderRouter = require('./routes/leaderRouter');
const userRouter = require('./routes/users');
const mongoose = require('mongoose');
const Dishes = require('./models/dishes');

const url = 'mongodb://localhost:27017/conFusion';
const connect = mongoose.connect(url);

connect.then((db) =>{
      console.log('Connected correctly to server');
},(err) =>{
      console.log(err);
});
const hostname = 'localhost';
const port = 3000;
const app = express();
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(session({
      name: 'session-id',
      secret: '12345-67890-09876-54321',
      saveUninitialized: false,
      resave: false,
      store: new FileStore()

}));
app.use(passport.initialize());
app.use(passport.session());
app.use(cookieParser('12345-67890-09876-54321'));
app.use('/users',userRouter);
function auth(req,res,next){
      if(!req.user){
           var err = new Error('You are not authenticated!');
           err.status = 403;
           return next(err);
      }
      else{
            next();
      }
}
app.use(auth);
app.use(express.static(__dirname+ '/public'));
app.use('/dishes',dishRouter);
app.use('/promotions',promoRouter);
app.use('/leaders',leaderRouter);
app.use((req,res,next) => {
      console.log(req.headers);
      res.statusCode = 200;
      res.setHeader('Content-Type','text/html');
      res.end('<html><body><h1>Hello World</h1></body></html>');
});
const server = http.createServer(app);
server.listen(port,hostname);