const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const session = require('express-session');
const app = express();
const port = 3000;

// Create a MySQL connection
const db = mysql.createConnection({
  host: 'localhost',  
  user: 'root', 
  password: 'Hb1013515', 
  database: 'logbook', 
});

// Connect to MySQL
db.connect(err => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
  } else {
    console.log('Connected to MySQL');
  }
});
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
 
// create application/x-www-form-urlencoded parser
// var urlencodedParser = bodyParser.urlencoded({ extended: false })
// Routes
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
      res.send('Invalid username or password');
    }
    else {
      req.session.loggedin = true;
      req.session.username = username;
      res.render('welcome', {data: username})
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

    res.send(`User ${username} registered successfully!`);
  });
});

// Set up EJS as the view engine
app.set('view engine', 'ejs');

// ... (Views code remains the same)

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});