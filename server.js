require('dotenv').config();
const express = require('express');
const bodyparser = require('body-parser');
const cookies = require('cookie-parser');
const logger = require('morgan');
const path = require('path');
const mysql = require('mysql');
const withAuth = require('./src/components/middleware');
const Sequelize = require('sequelize');
const jwt = require('jsonwebtoken');

const sequelize = new Sequelize(process.env.REACT_APP_DB_CONN_STRING, {
    dialect: 'mysql',
    define: {
        timestamps: false
    }
});

sequelize
    .authenticate()
    .then(() => {
        console.log('Connected to db');
    })
    .catch(err => {
        console.log('Error connecting to db:', err);
    });

const User = sequelize.import(__dirname + '/models/user');
const connection = mysql.createConnection(process.env.REACT_APP_DB_CONN_STRING);

connection.connect((err) => {
    if (err) {
        console.err('error connecting to db', err.stack);
        return;
    }

    console.log('connected to db');
});

const app = express();
const _secret = process.env.REACT_APP_SECRET;

app.use(express.static(path.join(__dirname, 'build')));
app.use(logger('dev'));
app.use(cookies());
app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());

app.post('/api/pickems/update', withAuth, function(req, res) {
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

app.post('/api/authenticate', (req, res) => {
    const { username, password } = req.body;

    User.findOne({
        where: {
            username: username,
            password: password
        }
    })
    .then(user => {
        if (!user) {
            res.status(401)
                .json({
                error: 'Incorrect email or password'
            });

            return;
        }

        // Issue token
        const payload = {  
            name: user.dataValues.name,
            iduser: user.dataValues.iduser,
            isadmin: user.dataValues.isadmin
        };

        const token = jwt.sign(payload, _secret, {
          expiresIn: '1h'
        });
        res.cookie('token', token, { httpOnly: true }).sendStatus(200);
    });
});

app.get('/api/checktoken', withAuth, (req, res) => {
    res.status(200).json(res.user);
});

app.get('/api/logout', withAuth, (req, res) => {
    res.clearCookie('token').sendStatus(200);
});

app.get('/*', (req, res) => {
    return res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(process.env.PORT || 8080, () => {
    console.log('listening on port', process.env.PORT || 8080);
});