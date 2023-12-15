const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const session = require('express-session');
const json2csv = require('json2csv').Parser;
const app = express();
const port = 3000;
let config = require('./config.js')

// Create a MySQL connection
const db = mysql.createConnection(config);

db.connect(err => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
  } else {
    console.log('Connected to MySQL');
  }
});
app.use(express.static('public'));
app.use(
  bodyParser.urlencoded({
  extended: true
}));
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}));

var jsonParser = bodyParser.json()

app.get('/', (req, res) => {
  res.render('login');
});

app.post('/login', jsonParser, (req, res) => {
  const { username, password } = req.body;

  db.query('SELECT * FROM User WHERE username = ? AND password_hash = SHA2(?, 256)', [username, password], (err, results) => {
    if (err) {
      console.error(err);
      return res.sendStatus(500);
    }
    if (results.length == 0) {
      // res.send('<script>alert("hello")</script>');
      res.redirect('/');
      
    }
    else {
      req.session.loggedin = true;
      req.session.username = username;
      db.query('SELECT * FROM Entry WHERE user = ? ORDER BY date DESC', [username], (err, entries) => {
        if (err) {
          console.error(err);
          return res.sendStatus(500);
        }
        db.query('SELECT id FROM Aircraft ORDER BY make, model', (err, types) => {
          if (err) {
            console.error(err);
            return res.sendStatus(500);
          }
          db.query('SELECT id FROM Type ORDER BY id DESC', (err, typeInfo) => {
            if (err) {
              console.error(err);
              return res.sendStatus(500);
            }
            res.render('welcome', {user: {username, password}, entry: entries, AircraftTypes: types, TypeInfo: typeInfo})
          });
          
        });
      });
    }
  });
});
app.post('/add-entry', (req, res) => {
  db.query('INSERT INTO Entry (user, date, aircraft_type, tail_num, origin, dest, total_time) VALUES (?, ?, ?, ?, ?, ?, ?)', [req.body.username, req.body.entryDate, req.body.aircraftType, req.body.tailNumber, req.body.origin, req.body.destination, req.body.time], (err) => {
    if (err) {
      console.error(err);
      return res.sendStatus(500);
    }
    const form = `
      <form id="loginForm" action="/login" method="post">
        <input type="hidden" name="username" value="${req.body.username}">
        <input type="hidden" name="password" value="${req.body.password}">
      </form>
      <script>
        document.getElementById('loginForm').submit();
      </script>
    `;
    res.send(form);
  });
});

app.post('/add-aircraft', (req, res) => {
  db.query('INSERT INTO Aircraft VALUES (?, ?, ?, ?)', [req.body.model, req.body.make, req.body.name, req.body.type], (err) => {
    if (err) {
      console.error(err);
      return res.sendStatus(500);
    }
    const form = `
      <form id="loginForm" action="/login" method="post">
        <input type="hidden" name="username" value="${req.body.username}">
        <input type="hidden" name="password" value="${req.body.password}">
      </form>
      <script>
        document.getElementById('loginForm').submit();
      </script>
    `;
    res.send(form);
  });
});

app.post('/export-csv', (req, res) => {
  db.query('SELECT Entry.date, Entry.aircraft_type, Entry.tail_num, Entry.origin, Entry.dest, Entry.total_time, Aircraft.type_id FROM Entry JOIN Aircraft ON Entry.aircraft_type = Aircraft.id WHERE user=?', [req.body.username], (err, results) => {
    if (results && results.length > 0) {
      const json2csvParser = new json2csv();
      const csv = json2csvParser.parse(results);

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=logbook.csv');

      res.status(200).send(csv);
    }
    else {
      res.status(404).send('No data found for the specified criteria.');
    }
  });
});

app.post('/export-model', (req, res) => {
  db.query('SELECT Entry.date, Entry.aircraft_type, Entry.tail_num, Entry.origin, Entry.dest, Entry.total_time, Aircraft.type_id FROM Entry JOIN Aircraft ON Entry.aircraft_type = Aircraft.id WHERE user=? AND Aircraft.type_id=?', [req.body.username, req.body.modelTypeDropdown], (err, results) => {
    if (results && results.length > 0) {
      const json2csvParser = new json2csv();
      const csv = json2csvParser.parse(results);

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=model_info.csv');

      res.status(200).send(csv);
    }
    else {
      res.status(404).send('No data found for the specified criteria.');
    }
  });
});

app.post('/export-type', (req, res) => {
  db.query('SELECT Entry.date, Entry.aircraft_type, Entry.tail_num, Entry.origin, Entry.dest, Entry.total_time, Aircraft.type_id FROM Entry JOIN Aircraft ON Entry.aircraft_type = Aircraft.id WHERE user=? AND Entry.aircraft_type=?', [req.body.username, req.body.aircraftTypeDropdown], (err, results) => {
    if (results && results.length > 0) {
      const json2csvParser = new json2csv();
      const csv = json2csvParser.parse(results);

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=type_info.csv');

      res.status(200).send(csv);
    }
    else {
      res.status(404).send('No data found for the specified criteria.');
    }
  });
});


app.get('/register', (req, res) => {
  res.render('register');
});

app.post('/register', (req, res) => {
  const { username, password } = req.body;

  db.query('INSERT INTO User VALUES (?, SHA2(?, 256))', [username, password], (err) => {
    if (err) {
      console.error(err);
      return res.sendStatus(500);
    }
    res.redirect('/')
  });
});

app.set('view engine', 'ejs');

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});