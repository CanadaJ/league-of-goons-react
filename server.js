require('dotenv').config();
const express = require('express');
const form = require('express-form');
const bodyparser = require('body-parser');
const cookies = require('cookie-parser');
const logger = require('morgan');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const path = require('path');
const mysql = require('mysql');

const connection = mysql.createConnection(process.env.REACT_APP_DB_CONN_STRING);

passport.use(new LocalStrategy(
    (username, password, done) => {
        connection.query(`call user_login(?, ?)`, [username, password], (err, rows) => {
            if (err) return done(err);

            return done(null, rows[0][0]);
        });
    }
))

passport.serializeUser((user, cb) => {
    cb(null, user);
});

passport.deserializeUser((user, cb) => {
    connection.query(`select u.iduser, u.name, CASE WHEN u.iduser = 1 THEN 1 ELSE 0 END AS isadmin from users u where u.iduser = ?`, [user.iduser], (err, rows) => {
        cb(err, rows[0]);
    });
});

connection.connect((err) => {
    if (err) {
        console.err('error connecting to db', err.stack);
        return;
    }

    console.log('connected to db');
});

const app = express();
// app.use(express.static(path.join(__dirname, 'build')));
app.use(logger('dev'));
app.use(cookies());
app.use(bodyparser());
app.use(require('express-session')({ secret: 'fuck goodell' }));
app.use(passport.initialize());
app.use(passport.session());

app.get('/', isLoggedIn, function (req, res) {
    console.log('wtf');

    return res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.post('/api/pickems/update', isLoggedIn, function(req, res) {
    if (!req.body) {
        res.send({ success: false });
        return;
    }

    let pickRequest = JSON.parse(JSON.stringify(req.body));

    const idMatchup = pickRequest.idMatchup;
    const idUser = pickRequest.idUser;
    const idTeam = pickRequest.idTeam;

    if (!idMatchup || !idUser || !idTeam) {
        res.send({ success: false });
        return;
    }

    connection.query('call pickem_insertpick(?, ?, ?)', [idMatchup, idUser, idTeam], function(err, rows) {
        if (err) throw err;

        if (!rows || rows.length === 0 || rows.length > 1) {
            res.send({ success: false });
        } else {
            res.send({ success: true });
        }
    });
});

app.get('/api/pickems/week/:week*?', (req, res) => {
    let weekNum = req.params['week'];

    if (!weekNum || weekNum <= 0) {
        weekNum = null;
    }

    let userPicks = [];

    connection.query('call matchups_matchupsbyweek(?,?)', [1, weekNum], function(err, rows) {
        if (err) throw err;
        for (var idx in rows[0]) {
            userPicks.push({ 
                idmatchup: rows[0][idx].idmatchup,
                week: rows[0][idx].week,
                home: rows[0][idx].home, 
                away: rows[0][idx].away, 
                gametime: rows[0][idx].gametime, 
                userpick: rows[0][idx].userpick,
                canupdate: rows[0][idx].canupdate,
                idhometeam: rows[0][idx].idhometeam,
                idawayteam: rows[0][idx].idawayteam,
                userid: 1,
                winner: rows[0][idx].winner,
                idpickteam: rows[0][idx].idpickteam,
                istie: rows[0][idx].istie
            });
        }

        let correct = rows[1][0].correctpicks;
        let incorrect = rows[1][0].incorrectpicks;

        pickCounts = { correct: correct, incorrect: incorrect };

        return res.send({
            userPicks,
            pickCounts
        });
    });
});

app.get('/login', (req, res) => {
    return res.sendFile(path.join(__dirname, 'build', 'login.html'));
});

app.listen(process.env.PORT || 8080, () => {
    console.log('listening on port', process.env.PORT || 8080);
});

function isLoggedIn(req, res, next) {
    console.log(req);
    console.log(res);

    if (req.isAuthenticated())
        return next();

    res.redirect('/login');
}