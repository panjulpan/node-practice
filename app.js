const express = require('express');
const bodyParser = require('body-parser');
const port = 4000;
const fs = require('fs');
const app = express();
let data = JSON.parse(fs.readFileSync('data.json', 'utf8'));
// const element = []

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json())
// app.use(express.static(__dirname + '/views'));

// Back Code

// Get All Activities
app.get("/api/todos", (req, res) => {
    // for(let i=0; i<data.length; i++){
    //     let list = data[i].title;
    //     element.push(list)
    // }
    // console.log(element);
    res.send(data);
});

// Get Activities by ID
app.get("/api/todo/:id", (req,res) => {
    // code get activities
    let id = req.params.id;
    let index = id - 1;
    let actId = data[index];

    res.send(actId);

});

app.post("/api/todos/", (req, res) => {
    // code to create activity
    const act = req.body.title;
    // console.log(act);

    data.push({id: data.length + 1, title: act});
    fs.writeFileSync('data.json', JSON.stringify(data));
    res.redirect('/api/todos/')

});

app.put("/api/todo/:id", (req, res) => {
    // code to update activity by id
    const id = req.params.id;
    const act = req.body.title;

    let activityId;
    for (let i = 0; i < data.length; i++) {
        if (Number(id) === data[i].id) {
            activityId = i;
        }
    }

    data[activityId].title = act;
    fs.writeFileSync('data.json', JSON.stringify(data));
    res.redirect('api/todos/')
});

app.delete("/api/todo/:id", (req, res) => {
    // code to delete activity
    const id = req.params.id;

    const newData = [];
    for (let i = 0; i < data.length; i++) {
        if (Number(id) !== data[i].id) {
            newData.push(data[i]);
        }
    }
    data = newData;
    fs.writeFileSync('data.json', JSON.stringify(data));
    res.redirect('/api/todos/')
});

// Front code

// Get All data with views
app.get("/todos", (req, res) => {
    res.render("todo", {activityList: data});
});


// Create an Activity
app.get("/todo/new", (req, res) => {
    res.render("new",);
});

app.post("/todos/new", (req, res) => {
    // code to create activity
    const act = req.body.title;
    // console.log(act);

    data.push({id: data.length + 1, title: act});
    fs.writeFileSync('data.json', JSON.stringify(data));
    res.redirect('/todos/')

});

// Edit an Activity

app.get("/todo/update/:id", (req, res) => {
    const id = req.params.id;

    let activityId;
    for (let i = 0; i < data.length; i++) {
        if (Number(id) === data[i].id) {
            activityId = i;
        }
    }

    res.render("update", {activityList: data[activityId]});
});

app.post("/todo/update/:id", (req, res) => {
    const id = req.params.id;
    const act = req.body.title;

    let activityId;
    for (let i = 0; i < data.length; i++) {
        if (Number(id) === data[i].id) {
            activityId = i;
        }
    }

    data[activityId].title = act;
    fs.writeFileSync('data.json', JSON.stringify(data));
    res.redirect('/todos/')
});

// Delete Activity

app.get("/todo/delete/", (req, res) => {
    res.render("delete", {activityList: data});
});

app.get("/todo/delete/:id", (req, res) => {
    const id = req.params.id;

    const newData = [];
    for (let i = 0; i < data.length; i++) {
        if (Number(id) !== data[i].id) {
            newData.push(data[i]);
        }
    }
    data = newData;
    fs.writeFileSync('data.json', JSON.stringify(data));
    res.redirect('/todos/')
});

app.listen(port, () => {
    console.log("This server running at port " + port);
})

