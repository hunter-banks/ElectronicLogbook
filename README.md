# Pilot Logbook Web Application

Welcome to the Pilot Logbook web application! This application allows for individual pilots to quickly log their flights, manage aircraft models, and view a list of entries.

## Features

- **User Authentication:** Secure user authentication with password hashing.
- **Add Flight Entries:** Log flight details including the date, aircraft type, tail number, and more.
- **Add Aircraft Models:** Manage different aircraft models with their details.
- **View Entries:** Display a list of flight entries in a user-friendly table.
- **Responsive Dashboard:** Modern and responsive design for ease of use.

## Setup
1. Run the command ```npm install``` to install package dependencies  
1. Fill in **config.js** file with MySQL credentials and database
1. Run the following command from the MySQL terminal to load precreated data. ```source generateData.sql;```
1. Run ```npm start``` and go to localhost:3000