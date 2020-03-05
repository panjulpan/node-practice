const express = require('express');
const port = 4000;
const fs = require('fs');
const app = express();

app.set('view engine', 'ejs');

// Get All Activities
app.get("/api/todo", (req, res) => {
    let data = JSON.parse(fs.readFileSync('data.json', 'utf8'));
    res.render("todo", {activityList: data});
});

// Get Activities by ID
app.get("/api/todo/:id", (req,res) => {
    // code get activities
});

app.post("/api/todo/", (req, res) => {
    // code to create activity
});

app.put("/api/todo/:id", (req, res) => {
    // code to update activity by id
});

app.delete("/api/todo/:id", (req, res) => {
    // code to delete activity
});

app.listen(port, () => {
    console.log("This server running at port " + port);
})

