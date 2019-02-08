const express = require("express");
const sqlite3 = require('sqlite3');

// Employees API router
const Router = express.Router();

// Create database object
const db = new sqlite3.Database(process.env.TEST_DATABASE || './database.sqlite');

/*
    @route          GET /api/employees
    @description    Retrieves all currently-employed employees
*/
Router.get("/", (req, res, next) => {
  db.all("SELECT * FROM Employee WHERE is_current_employee = 1", (error, rows) => {
    if(error) {
      throw error;
    } else {
      res.status(200).send({employees: rows});
    }
  });
});

/*
    @route          POST /api/employees
    @description    Creates a new employee
*/
Router.post("/", (req, res, next) => {
  const newEmployee = req.body.employee;
  if(newEmployee && newEmployee.id && newEmployee.name && newEmployee.position && newEmployee.position) {
    db.run("INSERT INTO Employee (id, name, postion, wage, is_current_employee) VALUES ($id, $name, $postion, $wage, $isCurrentEmployee)",
    {
      $id: newEmployee.id,
      $name: newEmployee.name,
      $postion: newEmployee.position,
      $wage: newEmployee.position,
      $isCurrentEmployee: newEmployee.is_current_employee
    },
    (error) => {
      if(error) {
        throw error;
      }
      db.get("SELECT * FROM Employee WHERE id = $id", {$id: this.lastID}, (err, row) => {
        if(err) {
          throw err;
        }
        res.status(201).send({employee:row});
      });
    });
  } else {
    res.sendStatus(400);
  }
});

module.exports = Router;
