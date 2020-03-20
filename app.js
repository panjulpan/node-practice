const express = require('express');
const bodyParser = require('body-parser');
const port = 3000;
const app = express();
const session = require('express-session');
const conn = require('./app/models/db.js')

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json())
app.use(express.static(__dirname + '/public'));
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

require("./app/routes/routes.js")(app);

app.listen(port, () => {
    console.log("This server running at port " + port);
});

conn.connect((err) => {
    if(!err) {
        console.log("Database is connected");
    } else {
        console.log("Error Connecting Database");
    }
});

