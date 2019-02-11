const express = require("express");
const sqlite3 = require('sqlite3');

// Employees API router
const Router = express.Router();

// Create database object
const db = new sqlite3.Database(process.env.TEST_DATABASE || './database.sqlite');

/*
    @route          GET /api/employees
    @description    Gets all currently employed employees
*/
Router.get("/", (req, res, next) => {
  query = "SELECT * FROM Employee WHERE is_current_employee = 1";
  db.all(query, (error, employees) => {
    if(error) {
      next(error);
    } else {
      res.status(200).send({employees: employees});
    }
  });
});

/*
    @route          POST /api/employees
    @description    Creates a new employee
*/
Router.post("/", (req, res, next) => {
  const newEmployee = req.body.employee;
  const query = "INSERT INTO Employee (id, name, position, wage, is_current_employee) VALUES ($id, $name, $position, $wage, $isCurrentEmployee)";
  const placeholders = {
    $name: newEmployee.name,
    $position: newEmployee.position,
    $wage: newEmployee.wage,
    $isCurrentEmployee: newEmployee.is_current_employee === 0 ? 0 : 1  // sets the default value
  };
  if(newEmployee.name && newEmployee.position && newEmployee.wage) {
    db.run(query, placeholders, function(error) {
      if(error) {
        next(error);
      }
      db.get("SELECT * FROM Employee WHERE id = $id", {$id: this.lastID}, (error, employee) => {
        if(error) {
          next(error);
        }
        if(employee) {
          res.status(201).send({employee:employee});
        }
      });
    });
  } else {
    res.sendStatus(400);
  }
});

/*
    @route          GET /api/employees/:employeeId
    @description    Gets an employee
*/
Router.get("/:employeeId", (req, res, next) => {
  const employeeId = req.params.employeeId;
  db.get("SELECT * FROM Employee WHERE id = $id", {$id: employeeId}, (error, employee) => {
    if(error) {
      next(error)
    } else if(employee){
      res.status(200).send({employee:employee});
    } else {
      res.sendStatus(404);
    }
  });
});

/*
    @route          PUT /api/employees/:employeeId
    @description    Updates an employee's information
*/
Router.put("/:employeeId", (req, res, next) => {
  const employeeData = req.body.employee;
  const query = "UPDATE Employee SET name = $name, position = $position, wage = $wage, is_current_employee = $isCurrentEmployee WHERE id = $employeeId";
  const placeholders = {
    $name: employeeData.name,
    $position: employeeData.position,
    $wage: employeeData.wage,
    $isCurrentEmployee: employeeData.is_current_employee === 0 ? 0 : 1,  // sets the default value
    $employeeId: req.params.employeeId
  };
  if(employeeData.name && employeeData.position && employeeData.wage) {
    db.run(query, placeholders, function(error) {
      if(error) {
        next(error);
      } else {
        db.get("SELECT * FROM Employee WHERE id = $id", {$id: req.params.employeeId}, (error, employee) => {
          if(error) {
            next(error);
          } else if(employee) {
            res.status(200).send({employee:employee});
          } else {
            res.sendStatus(404);
          }
        });
      }
    });
  } else {
    res.sendStatus(400);
  }
});

/*
    @route          DELETE /api/employees/:employeeId
    @description    Updates an employee's employment status to be unemployed
*/
Router.delete("/:employeeId", (req, res, next) => {
  const placeholder = {$employeeId: req.params.employeeId};
  db.run("UPDATE Employee SET is_current_employee = 0 WHERE id = $employeeId", placeholder, function (error) {
    if(error) {
      next(error);
    }
  });
  db.get("SELECT * FROM Employee WHERE id = $employeeId", placeholder, (error, employee) => {
    if(employee) {
      res.status(200).send({employee:employee});
    } else {
      res.sendStatus(404);
    }
  });
});

/*
    @route          GET /api/employees/:employeeId/timesheets
    @description    Get an employee's timesheets
*/
Router.get("/:employeeId/timesheets", (req, res, next) => {
  const placeholder = {$employeeId: req.params.employeeId};
  const query = "SELECT * FROM Timesheet WHERE employee_id = $employeeId";
  db.get("SELECT * FROM Employee WHERE id = $employeeId", placeholder, (error, employee) => {
    if(employee) {
      db.all(query, placeholder, (error, timesheets) => {
        if(error) {
          next(error);
        } else {
          res.status(200).send({timesheets:timesheets});
        }
      });
    } else {
      res.sendStatus(404);
    }
  });
});

/*
    @route          POST /api/employees/:employeeId/timesheets
    @description    Creates a new timesheet for an employee
*/
Router.post("/:employeeId/timesheets", (req, res, next) => {
  const query = "";
  const placeholders = {};
  //db.run(query, placeholders, (error) => {

  //});

});

/*
    @route          PUT /api/employees/:employeeId/timesheets/:timesheetId
    @description    Updates an employee's timesheet
*/
Router.put("/:employeeId/timesheets/:timesheetId", (req, res, next) => {
  const query = "";
  const placeholders = {};
  //db.run(query, placeholders, (error) => {

  //});

});

/*
    @route          DELETE /api/employees/:employeeId/timesheets/:timesheetId
    @description    Delete an employee's timesheet
*/
Router.delete("/:employeeId/timesheets/:timesheetId", (req, res, next) => {
  const query = "";
  const placeholders = {};
  //db.run(query, placeholders, (error) => {

  //});

});

module.exports = Router;
