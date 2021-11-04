/* Allows us to get rid of the Try Catch blocks in each controller, makes sense */
module.exports = (fn) => (req, res, next) => fn(req, res, next).catch(next);

/* Returns a callable function that takes the same parametes as a middleware, but also handles an error with .catch() */
// const catchAsync = function(fn){
//   return (req, res, next) => {
//     fn(req, res, next).catch(next);
//   };
// };
