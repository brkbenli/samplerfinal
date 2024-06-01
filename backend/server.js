const express = require("express");
const mysql = require('mysql');
const cors = require('cors');
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const bcrypt = require('bcrypt');
const saltRounds = 10;
const fs = require('fs');

const isAuthenticated = (req, res, next) => {
    if (req.session.user) {
        next();
    } else {
        res.status(401).json({ message: 'Please log in to access this feature.' });
    }
};

const app = express();

app.use(express.json());
app.use(cors({
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST"],
    credentials: true
}));
app.use(cookieParser())
app.use(bodyParser.urlencoded({extended: true}));

app.use(session({
    key: "userID",
    secret: "subscribe",
    resave: false,
    saveUninitialized: false,
    cookie: {
        expires: null
    }
}));

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "signup"
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL database');
        throw err;
    }
    console.log('Connected to MySQL database');
});

app.post('/signup', (req, res) => {
    const sql = "INSERT INTO login (name, email, password) VALUES (?, ?, ?)";
    
    const username = req.body.name
    const email = req.body.email
    const password = req.body.password
    
    bcrypt.hash(password, saltRounds, (err, hash) => {
        if (err) {
            console.log(err);
        }

        db.query(sql, [username, email, hash], (err, data) => {
            if(err) {
                return res.json("Error");
            }
            return res.json(data);
        })
    })
});

app.get("/login", (req, res) => {
    if (req.session.user) {
        res.send({loggedIn: true, user: req.session.user});
    } else {
        res.send({loggedIn: false });
    }
});

app.post('/login', (req, res) => {
    const sql = "SELECT * FROM login WHERE email = ?";
    
    db.query(sql, [req.body.email], (err, data) => {
        if(err) {
            return res.json("Error");
        }
        if(data.length > 0) {
            bcrypt.compare(req.body.password, data[0].password, (error, response) => {
                if (response) {
                    req.session.user = data;
                    console.log("yurrr")
                    console.log(req.session.user);
                    return res.json("Success");
                } else {
                    return res.json("Fail");
                }
            });
            
        }
        else {
            res.send({message: "User doesnt exist"});
        }
    });
});

app.post("/logout", (req, res) => {
    req.session.destroy(err => {
      if (err) {
        return res.json({ message: "Error logging out" });
      }
      res.clearCookie("userID");
      res.send({ loggedIn: false });
    });
  });


  app.post('/favorite', isAuthenticated, (req, res) => {
    const userId = req.session.user[0].id;
    const { songId } = req.body;
    const checkSql = "SELECT * FROM user_favorites WHERE user_id = ? AND song_id = ?";
    const insertSql = "INSERT INTO user_favorites (user_id, song_id) VALUES (?, ?)";

    db.query(checkSql, [userId, songId], (checkErr, checkResult) => {
        if (checkErr) {
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        if (checkResult.length > 0) {
            return res.status(400).json({ message: 'Song already in favorites' });
        } else {
            db.query(insertSql, [userId, songId], (insertErr, insertResult) => {
                if (insertErr) {
                    return res.status(500).json({ error: 'Internal Server Error' });
                }
                res.status(200).json({ message: 'Song added to favorites' });
            });
        }
    });
});

app.get('/favorite_songs', isAuthenticated, (req, res) => {
    const userId = req.session.user[0].id;
    const sql = `
        SELECT audio_tracks.* FROM audio_tracks
        JOIN user_favorites ON audio_tracks.id = user_favorites.song_id
        WHERE user_favorites.user_id = ?`;

    db.query(sql, [userId], (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        res.status(200).json(data);
    });
});

app.post('/unfavorite', isAuthenticated, (req, res) => {
    const userId = req.session.user[0].id;
    const { songId } = req.body;
    const sql = "DELETE FROM user_favorites WHERE user_id = ? AND song_id = ?";

    db.query(sql, [userId, songId], (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        res.status(200).json({ message: 'Song removed from favorites' });
    });
});

app.get('/audio_tracks', (req, res) => {
    const sql = "SELECT * FROM audio_tracks";
    db.query(sql, (err, data) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ error: "Internal Server Error" });
        }
        return res.status(200).json(data);
    });
});

const PORT = process.env.PORT || 8081;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});