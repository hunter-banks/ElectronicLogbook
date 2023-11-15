const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

const flights = []; // In-memory storage, replace with a database in production

app.use(express.static('public'));
app.use(bodyParser.json());

app.get('/flights', (req, res) => {
  res.json(flights);
});

app.post('/add-flight', (req, res) => {
  const newFlight = req.body;
  flights.push(newFlight);
  res.json({ success: true });
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
