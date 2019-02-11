const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const errorhandler = require('errorhandler');
const employeeRouter = require("./routes/api/employees.js");
//const menuRouter = require("./routes/api/menus.js");

// Create express app
const app = express();

// Environmental variables
const PORT = process.env.PORT || 4000;

// serve static files such as images, CSS, and JavaScript
app.use(express.static('public'));

// Middleware
app.use(bodyParser.json());
app.use(errorhandler());
app.use(morgan('dev'));

// Route handlers
app.use("/api/employees", employeeRouter);
//app.use("/api/menus", menuRouter);

// Invoke the app's `.listen()` method below:
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});

module.exports = app;
