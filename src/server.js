import createError from "http-errors";
import express, { json, urlencoded } from "express";
import { join } from "path";
import cookieParser from "cookie-parser";
import { json as _json, urlencoded as _urlencoded } from "body-parser";
import logger from "morgan";
import validator from "express-validator";

// routes import
import indexRouter from "./routes/index";
import uploadRouter from "./routes/upload";

// Initialize a new instance of express
var server = express();

// view engine setup
server.set('views', join(__dirname, 'views'));
server.set('view engine', 'ejs');

// express js setup
server.use(logger('dev'));
server.use(validator());
server.use(_json());
server.use(_urlencoded({ extended: true }));
server.use(json());
server.use(urlencoded({ extended: false }));
server.use(cookieParser());
server.use(express.static(join(__dirname, 'public')));

// router configuration with middlewares
server.use('/', indexRouter);
server.use('/v0/upload', uploadRouter);

// middleware for headers cheacker
server.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// catch 404 and forward to error handler
server.use((req, res, next) => {
  next(createError(404));
});

// error handler
server.use((err, req, res) => {

  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

export default server;
