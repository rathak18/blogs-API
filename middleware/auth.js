// customMiddleware.js
const customMiddleware = (req, res, next) => {
    console.log('Hi, middleware is working');
    res.json("middleware working")
  };
  
  module.exports = customMiddleware;
  