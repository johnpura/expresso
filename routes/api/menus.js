const express = require("express");
const menuRouter = express.Router();

const sqlite3 = require('sqlite3');
const db = new sqlite3.Database(process.env.TEST_DATABASE || './database.sqlite');

const menuItemsRouter = require('./menu-items.js');

menuRouter.param('menuId', (req, res, next, menuId) => {
  const query = 'SELECT * FROM Menu WHERE Menu.id = $menuId';
  const placeholder = {$menuId: menuId};
  db.get(query, placeholder, (error, menu) => {
    if (error) {
      next(error);
    } else if (menu) {
      req.menu = menu;
      next();
    } else {
      res.sendStatus(404);
    }
  });
});

menuRouter.use('/:menuId/menu-items', menuItemsRouter);

/*
    @route          GET /api/menus
    @description    Gets all menus
*/
menuRouter.get("/", (req, res, next) => {
  const message = {};
  const query = "SELECT * FROM Menu";
  db.all(query, (error, menus) => {
    if(error) {
      next(error);
    } else if(menus) {
      res.status(200).json({menus:menus});
    } else {
      res.status(404).json({message: "No menus were found."});
    }
  });
});

/*
    @route          POST /api/menus
    @description    Creates a new menu
*/
menuRouter.post("/", (req, res, next) => {
  const newMenu = req.body.menu;
  const query = "INSERT INTO Menu (title) VALUES ($title)";
  const placeholder = {$title: req.body.menu.title};
  if(!newMenu || !newMenu.title) {
    return res.sendStatus(400);
  }
  db.run(query, placeholder, function (error) {
    if(error) {
      next(error);
    } else {
      db.get(`SELECT * FROM Menu WHERE Menu.id=${this.lastID}`, (error, menu) => {
        if(error) {
          next(error);
        } else {
          res.status(201).json({menu:menu});
        }
      });
    }
  });
});

/*
    @route          GET /api/menus/:menuId
    @description    Gets a menu
*/
menuRouter.get("/:menuId", (req, res, next) => {
  const query = "SELECT * FROM Menu WHERE Menu.id = $menuId";
  const placeholder = {$menuId: req.params.menuId};
  db.get(query, placeholder, (error, menu) => {
    if(error) {
      next(error);
    } else if(menu) {
      res.status(200).json({menu:menu});
    } else {
      res.sendStatus(404);
    }
  });
});

/*
    @route          PUT /api/menus/:menuId
    @description    Updates a menu
*/
menuRouter.put("/:menuId", (req, res, next) => {
  const query = "UPDATE Menu SET title = $title WHERE Menu.id = $menuId";
  const placeholders = {
    $title: req.body.menu.title,
    $menuId: req.params.menuId
  };
  if(!req.body.menu.title) {
    return res.sendStatus(400);
  }
  db.run(query, placeholders, function (error) {
    if(error) {
      next(error);
    } else {
      db.get(`SELECT * FROM Menu WHERE Menu.id = ${req.params.menuId}`, (error, menu) => {
        if(error) {
          next(error);
        } else if(menu) {
          res.status(200).json({menu:menu});
        } else {
          res.sendStatus(404);
        }
      });
    }
  });
});

/*
    @route          DELETE /api/menus/:menuId
    @description    Deletes a menu if the menu has no related menu items
*/
menuRouter.delete("/:menuId", (req, res, next) => {
  const menuId = req.params.menuId;
  const query = "DELETE FROM Menu WHERE Menu.id = $menuId";
  const placeholder = {$menuId: req.params.menuId};
  db.get(`SELECT * FROM Menu WHERE Menu.id = ${menuId}`, (error, menu) => {
    if(error) {
      next(error);
    } else if(menu) {
      db.get(`SELECT * FROM MenuItem WHERE MenuItem.menu_id = ${menuId}`, (error, menuItems) => {
        if(error) {
          next(error);
        } else if(menuItems) {
          res.sendStatus(400);
        } else {
          db.run(query, placeholder, (error) => {
            if(error) {
              next(error);
            } else {
              res.sendStatus(204);
            }
          });
        }
      });
    } else {
      res.sendStatus(404);
    }
  });
  /*

  */
});


module.exports = menuRouter;
