const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });
const app = require('./app');

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => console.log('DB connection successful!'));

const port = process.env.port || 3000;
const server = app.listen(port, () => {
  console.log(`App running on port ${port}`);
});

// handling all unhandled rejections, safety net.
process.on('unhandledRejection', (err) => {
  console.log(err.name, err.message);
  console.log('Unhandled rejection! Shutting down...');
  server.close(() => {
    process.exit(1);
  });
});

// Handling uncaught exceptions
process.on('unhandledException', (err) => {
  console.log(err.name, err.message);
  console.log('Unhandled exception! Shutting down...');
  server.close(() => {
    process.exit(1);
  });
});
