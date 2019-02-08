const bodyParser = require('body-parser');
const morgan = require('morgan');
const express = require('express');
const sqlite3 = require('sqlite3');

const app = express();

const db = new sqlite3.Database(process.env.TEST_DATABASE || './db.sqlite');

const PORT = process.env.PORT || 4001;

app.use(bodyParser.json());
app.use(morgan('dev'));

app.use(express.static('public'));

app.get('/strips', (req, res, next) => {
  	let databaseStrips = {};
    db.all('SELECT * FROM Strip', function (error, rows) {
        if (error) {
            throw error;
        }
      	databaseStrips = rows;
        res.send({
          strips: databaseStrips
      	});
    });
});

app.post('/strips', (req, res, next) => {
  const newStrip = req.body.strip;
  if (newStrip && newStrip.head && newStrip.body && newStrip.background && newStrip.bubbleType) {
    db.run('INSERT INTO Strip (head, body, background, bubble_type, bubble_text, caption) VALUES ($head, $body, $background, $bubbleType, $bubbleText, $caption)',
            {
              $head: newStrip.head,
              $body: newStrip.body,
              $background: newStrip.background,
              $bubbleType: newStrip.bubbleType,
              $bubbleText: newStrip.bubbleText,
              $caption: newStrip.caption
            },
            function (error) {
              if(error) {
                res.sendStatus(500);
              }
              db.get("SELECT * FROM Strip WHERE id = $id", {$id: this.lastID}, (err, row) => {
                res.status(201).send({strip: row}});
              });
            });
    } else {
      res.status(400).send();
    }
});

app.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`));

module.exports = app;
