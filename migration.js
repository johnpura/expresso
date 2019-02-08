const sqlite3 = require('sqlite3');
const db = new sqlite3.Database(process.env.TEST_DATABASE || './database.sqlite');

db.serialize(function () {
  // Drop and create Employee Table
  db.run('DROP TABLE IF EXISTS Employee', error => {
    if (error) {
      throw error;
    }
  });
  db.run('CREATE TABLE Employee (id INTEGER PRIMARY KEY NOT NULL, name TEXT NOT NULL, position TEXT NOT NULL, wage INTEGER NOT NULL, is_current_employee INTEGER DEFAULT 1)', error => {
    if (error) {
      throw error;
    }
  });
  // Drop and create Timesheet Table
  db.run('DROP TABLE IF EXISTS Timesheet', error => {
    if (error) {
      throw error;
    }
  });
  db.run('CREATE TABLE Timesheet (id INTEGER PRIMARY KEY NOT NULL, hours INTEGER NOT NULL, rate INTEGER NOT NULL, date INTEGER NOT NULL, employee_id INTEGER NOT NULL, FOREIGN KEY(employee_id) REFERENCES Employee(id))', error => {
    if (error) {
      throw error;
    }
  });
  // Drop and create Menu Table
  db.run('DROP TABLE IF EXISTS Menu', error => {
    if (error) {
      throw error;
    }
  });
  db.run('CREATE TABLE Menu (id INTEGER PRIMARY KEY NOT NULL, title TEXT NOT NULL)', error => {
    if (error) {
      throw error;
    }
  });
  // Drop and create MenuItem Table
  db.run('DROP TABLE IF EXISTS MenuItem', error => {
    if (error) {
      throw error;
    }
  });
  db.run('CREATE TABLE MenuItem (id INTEGER PRIMARY KEY NOT NULL, name TEXT NOT NULL, description TEXT, inventory INTEGER NOT NULL, price INTEGER NOT NULL, menu_id INTEGER NOT NULL, FOREIGN KEY(menu_id) REFERENCES Menu(id))', error => {
    if (error) {
      throw error;
    }
  });
});
