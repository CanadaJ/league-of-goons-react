require('dotenv').config();
const express = require('express');
const path = require('path');
const mysql = require('mysql');

const app = express();
app.use(express.static(path.join(__dirname, 'build')));

const connection = mysql.createConnection(process.env.REACT_APP_DB_CONN_STRING);

connection.connect((err) => {
    if (err) {
        console.err('error connecting to db', err.stack);
        return;
    }

    console.log('connected to db');
});

app.get('/ping', function (req, res) {
    connection.query('SELECT 1', (err, results, fields) => {
        return res.send(results);
    });
});

app.get('/', function (req, res) {
    return res.sendFile(path.join(__dirname, 'build', 'index.html'));
})

app.listen(process.env.PORT || 8080, () => {
    console.log('listening on port', process.env.PORT || 8080);
});