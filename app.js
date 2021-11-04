const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

// 1) GLOBAL MIDDLEWARES
// Set security HTTP headers
app.use(helmet());

// Develoment logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Limit request from same API
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour!',
});
// we can specify for which route to use middleware
app.use('/api', limiter);

// Body parser, reading data from body in req.body. (limit size)
app.use(express.json({ limit: '10kb' }));

// Data sanitization against NOSQL query injections
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// Serving static files
app.use(express.static(`${__dirname}/public`));

// Prevent parameter polution, whitelisting wanted parameters
app.use(
  hpp({
    whitelist: [
      'duration',
      'difficulty',
      'price',
      'ratingsQuantity',
      'maxGroupSize',
      'ratingsAverage',
    ],
  })
);

// Test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// 3) routers
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

app.all('*', (req, res, next) => {
  /* Just send manual error */
  // res.status(404).json({
  //   status: 'failed',
  //   message: `Can't find ${req.originalUrl} on this server!`,
  // });

  /* create a new error and pass it to error handlign middeware */
  // const err = new Error(`Can't find ${req.originalUrl} on this server!`);
  // err.status = 'fail';
  // err.statusCode = 404;

  /* create a new custom error and pass it to error handlign middeware */
  // if Express receives argument in NEXT it will assume its an error
  next(new AppError(`Can't find ${req.originalUrl} on the server!`, 404));
});

// if you give 4 arg arrow function, express will recognise it as error middlware
app.use(globalErrorHandler);

// app.get('/api/v1/tours', getAllTours);
// app.get('/api/v1/tours/:id', getTour);
// app.post('/api/v1/tours', createTour)
// app.patch('/api/v1/tours/:id', updateTour)
// app.delete('/api/v1/tours/:id', deleteTour)

module.exports = app;
