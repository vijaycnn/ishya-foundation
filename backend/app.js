const createError = require('http-errors');
const express = require('express');
var debug = require('debug')('app.multi-tenant-node-app.api:server');
var http = require('http');
// const logger = require('morgan');
const bodyParser = require('body-parser');
const cors = require("cors");
const fs = require('fs');
const helmet = require("helmet");

const dotenv = require('dotenv');
dotenv.config();
const userRouter = require('./routes/users.route');
const enquiryRouter = require('./routes/enquiry.route');
const locationRouter = require('./routes/location.route');
const faqRouter = require('./routes/faq.route');
const mentorRouter = require('./routes/mentor.route');
const bannerRouter = require('./routes/banner.route');
const slideRouter = require('./routes/slidecontext.route');
const galleryRouter = require('./routes/gallery.route');
const slideFileRouter = require('./routes/slidefile.route');

conn = require("./models");  
Op = conn.Sequelize.Op;  
const app = express();

console.log(`Your port is ${process.env.PORT}`); 
// app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// app.use((req, res, next) => {
//   console.log("REQ PATH:", req.originalUrl);
//   console.log("REQ HOST:", req.headers.host);
//   next();
// });
app.use(async function (req, res, next) {
  next();
});

// allow-cors
//VAPT Issues 4-8 for https, hsts, frameguard, clickjacking and cachecontrol
 const frameguard = require("frameguard");
 app.use(frameguard({ action: "SAMEORIGIN" }));

 app.use(
   helmet({
     contentSecurityPolicy: false,
     frameguard: { action: "sameorigin" },
   })
 );

// Add headers before the routes are definedtrim
 
 app.use(function (req, res, next) {
   res.setHeader("Access-Control-Allow-Origin", "*");
   
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, authorization");

   res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");

   res.setHeader("Strict-Transport-Security", "max-age=3600");
  
   res.setHeader("Cache-control", "no-store");
  
   res.setHeader("Pragma", "no-cache");

   res.setHeader("X-Frame-Options", "ALLOW-FROM http://localhost");

   // Set to true if you need the website to include cookies in the requests sent
   // to the API (e.g. in case you use sessions)
   res.setHeader("Access-Control-Allow-Credentials", true);

  // Pass to next layer of middleware
  next();
 });

app.use(async function (req, res, next) {
  if (req.method == 'POST' || req.method == 'GET' || req.method == 'OPTIONS') {
      next();
  }
  else{
       return res.status(401).send(`Method ${req.method} not allowed`);
  }
});


// let routePrefix = process.env.ROUTE_PREFIX.trim();
app.use('/api/user',  userRouter);
app.use('/api/enquiry',  enquiryRouter);
app.use('/api/location',  locationRouter);
app.use('/api/faq',  faqRouter);
app.use('/api/mentor',  mentorRouter);
app.use('/api/banner',  bannerRouter);
app.use('/api/slide',  slideRouter);
app.use('/api/gallery',  galleryRouter);
app.use('/api/slideFile',  slideFileRouter);


/**
 * Get port from environment and store in Express.
 */

var port = normalizePort(process.env.PORT || '4000');
console.log("Running port ",port)
app.set('port', port);

/**
 * Create HTTP server.
 */
// const keyFile = __dirname + '/config/star_havells_com.key';
// const crtFile = __dirname + '/config/star_havells_com.crt';
// // console.log('keyFile', keyFile);

// var options = {
//   key: fs.readFileSync(keyFile),
//   cert: fs.readFileSync(crtFile),
//   // ca: fs.readFileSync("/home/ec2-user/IntermediateCA23.crt"),
// };
var server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port, "0.0.0.0");
// server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404, 'Route not found'));
});

// error handler
app.use((err, req, res, next) => {
  console.error("Global Error:", err);
  res.status(err.status || 500).json({
    status: 'error',
    data: err.message,
    message: "Something went wrong!!! Please try again later."
  });
});
/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  debug('Listening on ' + bind);
}

module.exports = app;

