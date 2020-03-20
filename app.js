const express = require('express');
const bodyParser = require('body-parser');
const {check, validationResult} = require('express-validator');
const port = 3000;
// const fs = require('fs');
const app = express();
const mysql = require('mysql');
const session = require('express-session');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'bebas123',
    database: 'test'
});
// let data = JSON.parse(fs.readFileSync('data.json', 'utf8'));

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json())
app.use(express.static(__dirname + '/public'));
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

// Back Code

// Login API
app.post("/api/login", (req, res) => {
  let username = req.body.username;
  let password = req.body.password;
    
  if(req.method == "POST"){
    conn.query('SELECT user_id, password, role FROM user WHERE email = ?', [username], (err, results, fields) => {
      const hash = results[0].password;
      const level = results[0].role;
      bcrypt.compare(password, hash, (err, response) => {
        if(response === true && level === 'user') {
          req.session.loggedin = true;
          req.session.username = username;
          req.session.userID = results[0].user_id;
          res.redirect('/api/todos');
        } else if (response === true && level === 'admin') {
            req.session.admin = true;
            req.session.username = username;
            res.redirect('/api/admin')
        } else {
            res.status(400).send({message: 'Incorrect username/password'});
        }
      });
    });
  }
});

// Register API
app.post('/api/register', [ 
  check('fullname', 'Cannot be empty').notEmpty(),
  check('phone', 'Cannot be empty').notEmpty(),
  check('username', 'Must an email').isEmail().notEmpty(),
  check('password', 'Password minimal 6 karakter').isLength({min: 6}).notEmpty()
], (req, res) => {
  if(req.method === "POST"){
    let name = req.body.fullname;
    let phone = req.body.phone;
    let usename = req.body.username;
    let password = req.body.password;
    let level = 'user';

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ error: errors.array() })
    }
      // console.log(name, phone, usename, password, level);
        
      conn.query('SELECT * FROM user WHERE email = ?', [usename], (err, results, fields) => {
        if (results.length) {
          res.status(400).send({message: "Email telah terdaftar"});
        } else {
          bcrypt.hash(password, saltRounds, (err, hash) => {
            conn.query('INSERT INTO user (username, phone_num, email, password, role) VALUES (?, ?, ?, ?, ?)', [name, phone, usename, hash, level], (err, results) => {
              if (err) {
                console.log(err);
              } else {
                res.status(200).send({message: "Akun anda berhasil di buat"});
              }
            });
          });
        }
      });
    } else {
      res.status(400).send({message: "bad request"});
    }
});

// Logout (destroy session) API
app.get("/api/logout", (req, res) => {
  if (req.session.loggedin) {
      req.session.destroy();
      res.status(200).send({message: "Logout Success"})
    } else if (req.session.admin) {
      req.session.destroy();
      res.status(200).send({message: "Logout Success"})
    } else {
      res.status(400).send({message: "You are not Login"})
  }
});

// Admin Page API
app.get("/api/admin", (req, res) => {
  if (req.session.admin) {
    conn.query("SELECT * FROM user WHERE role = 'user'", (err, results) => {
      if (err) {
          console.log(err);
      } else {
          res.status(200).send(results);
      }
    });
  } else {
    res.status(400).send({message: 'Incorrect username/password'});
  }
});

// Add new admin API
app.post("/api/admin/new", (req, res) => {
  if (req.session.admin) {
    if(req.method === "POST"){
      let name = req.body.fullname;
      let phone = req.body.phone;
      let usename = req.body.username;
      let password = req.body.password;
      let level = req.body.role;
      
      conn.query('SELECT * FROM user WHERE email = ?', [usename], (err, results, fields) => {
        if (results.length) {
          res.status(400).send({message: "Email telah terdaftar"});
        } else {
          bcrypt.hash(password, saltRounds, (err, hash) => {
            conn.query('INSERT INTO user (username, phone_num, email, password, role) VALUES (?, ?, ?, ?, ?)', [name, phone, usename, hash, level], (err, results) => {
              res.status(200).send({message: "Admin baru telah berhasil di buat"});
            });
          });
        }
      });
    } else {
      res.status(400).send({message: 'invalid request'});
    }
  } else {
    res.status(400).send({message: "anda bukan admin"});
  }
});

// Delete User via Admin API
app.delete("/api/admin/delete/:id", (req, res) => {
  if (req.session.admin) {    
    const id = req.params.id;
    conn.query("DELETE FROM user WHERE user_id = ?", [id], (err, results) => {
      if (err) {
        console.log(err);
      } else {
        res.status(200).send({message: "Success delete one user"});
      }
    });
  } else {
    res.status(400).send({message: "You are not admin"});
  }
});

// Get All Activities
app.get("/api/todos", (req, res) => {
    // res.send(data);
    if (req.session.loggedin) {
      conn.query("SELECT id, title FROM activity WHERE user_id = ?", [req.session.userID], (err, results) =>{
        if (err) {
          console.log(err);
        } else {
          res.send(results);
        }
      });
    } else {
      res.status(400).send({error: "You are not Logged In"});
    }
});

// Get Activities by ID
app.get("/api/todo/:id", (req,res) => {
  // let index = id - 1;
  // let actId = data[index];
  
  // res.send(actId);
  if (req.session.loggedin) {
      let id = req.params.id;
      conn.query("SELECT * FROM activity WHERE id = ?", [id], (err, results) => {
        if (err) {
          console.log(err);
        } else {
          res.status(200).send(results);
        }
      })
    } else {
      res.status(400).send({error: "You are not Logged In"});
    }

});

app.post("/api/todos/", (req, res) => {
  // data.push({id: data.length + 1, title: act});
  // fs.writeFileSync('data.json', JSON.stringify(data));
  if(req.session.loggedin) {
    const act = req.body.title;
    conn.query("INSERT INTO activity (title, user_id) VALUES (?, ?)", [act, req.session.userID], (err, results) =>{
      if (err) {
        console.log(err);
      } else {
        res.status(200).send({message: "Ok"});
      }
    });
  } else {
    res.status(400).send({error: "You are not Logged In"});
  }
});

// Update activity by id
app.put("/api/todo/:id", (req, res) => {
    if (req.session.loggedin) {
      const id = req.params.id;
      const act = req.body.title;
      conn.query("UPDATE activity SET title='"+act+"' WHERE id = ?", [id], (err, results) =>{
        if (err) {
          console.log(err);
        } else {
          res.status(200).send({message: "Success update activity"});
        }
      })
    } else {
      res.status(400).send({error: "You are not Logged In"});
    }

    // let activityId;
    // for (let i = 0; i < data.length; i++) {
    //     if (Number(id) === data[i].id) {
    //         activityId = i;
    //     }
    // }

    // data[activityId].title = act;
    // fs.writeFileSync('data.json', JSON.stringify(data));
    // res.redirect('api/todos/')
});

// Delete activity
app.delete("/api/todo/:id", (req, res) => {
  if (req.session.loggedin) {
    const id = req.params.id;
    conn.query("DELETE FROM activity WHERE id = ?", [id], (err, results) => {
      if (err) {
        console.log(err);
      } else {
        res.status(200).send({message: "Success delete one activity"})
      }
    })
  } else {
    res.status(400).send({error: "You are not Logged In"});
  }

    // const newData = [];
    // for (let i = 0; i < data.length; i++) {
    //     if (Number(id) !== data[i].id) {
    //         newData.push(data[i]);
    //     }
    // }
    // data = newData;
    // fs.writeFileSync('data.json', JSON.stringify(data));
    // res.redirect('/api/todos/')
});

// Login Code

app.post("/login", (req, res) => {
    let username = req.body.username;
    let password = req.body.password;
    
    if(req.method == "POST"){
        conn.query('SELECT user_id, password, role FROM user WHERE email = ?', [username], (err, results, fields) => {
            const hash = results[0].password;
            const level = results[0].role;
            bcrypt.compare(password, hash, (err, response) => {
                if(response === true && level === 'user') {
                    req.session.loggedin = true;
                    req.session.username = username;
                    req.session.userID = results[0].user_id;
                    res.redirect('/');
                  } else if (response === true && level === 'admin') {
                    req.session.admin = true;
                    req.session.username = username;
                    res.redirect('/')
                } else {
                    res.send('Incorrect username/password');
                }
            });
        });
    }
});

app.get("/", (req, res) => {
    if (req.session.loggedin) {
        res.redirect("/todos");
    } else if (req.session.admin) {
        res.redirect("/admin");
    } else {
        res.redirect("/login");
    }
});

app.get("/login", (req, res) => {
    if (req.session.loggedin || req.session.admin) {
        res.redirect('/')
    } else {
        res.render("login");
    }
});


// Register

app.post('/register', [ 
  check('password', 'Password minimal 6 karakter').isLength({min: 6})
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ error: errors.array() })
  }
    if(req.method === "POST"){
        let name = req.body.fullname;
        let phone = req.body.phone;
        let usename = req.body.username;
        let password = req.body.password;
        let level = 'user';
        
        conn.query('SELECT * FROM user WHERE email = ?', [usename], (err, results, fields) => {
            if (results.length) {
                console.log("Email telah terdaftar");
                res.redirect("/register");
            } else {
                bcrypt.hash(password, saltRounds, (err, hash) => {
                    conn.query('INSERT INTO user (username, phone_num, email, password, role) VALUES (?, ?, ?, ?, ?)', [name, phone, usename, hash, level], (err, results) => {
                        console.log("Akun anda berhasil di buat");
                        res.redirect("/login");
                    });
                });
            }
        });
    } else {
        res.render('register');
    }
});

app.get("/register", (req, res) => {
    if (req.session.loggedin) {
        res.redirect("/");
    } else {
        res.render("register");
    }
});

// Logout

app.get("/logout", (req, res) => {
    if (req.session.loggedin) {
        res.redirect("/");
        req.session.destroy();
      } else if (req.session.admin) {
        res.redirect("/");
        req.session.destroy();
      } else {
        res.redirect('/');
    }
});

// Admin Activity

// Get All User

app.get('/admin', (req, res) => {
  if(req.session.admin){
    conn.query("SELECT * FROM user WHERE role = 'user'", (err, results) => {
        if (err) {
            console.log(err);
        } else {
            res.render("admin", {activityList: results});
        }
    });
  } else {
    res.redirect("/");
  }
})

// Add user

app.get("/admin/new", (req, res) => {
  if(req.session.admin) {
      res.render("newUser",);
  } else {
      res.redirect('/')
  }
});

app.post("/admin/new", (req, res) => {
  if(req.method === "POST"){
    let name = req.body.fullname;
    let phone = req.body.phone;
    let usename = req.body.username;
    let password = req.body.password;
    let level = req.body.role;
    
    conn.query('SELECT * FROM user WHERE email = ?', [usename], (err, results, fields) => {
      if (results.length) {
        console.log("Email telah terdaftar");
        res.redirect("/admin/new");
      } else {
        bcrypt.hash(password, saltRounds, (err, hash) => {
          conn.query('INSERT INTO user (username, phone_num, email, password, role) VALUES (?, ?, ?, ?, ?)', [name, phone, usename, hash, level], (err, results) => {
            console.log("Akun anda berhasil di buat");
            res.redirect("/admin");
          });
        });
      }
    });
} else {
    res.render('register');
}
});

// Update User Data

app.get("/admin/update/:id", (req, res) => {
  if (req.session.admin) {
      let id = req.params.id;
      conn.query("SELECT * FROM user WHERE user_id = ?", [id], (err, results) =>{
          let singleData = results[0];
          if (err) {
              console.log(err);
          } else {
              res.render("updateUser", {activityList: singleData});
          }
      })
  } else {
      res.redirect('/');
  }
});

app.post("/admin/update/:id", (req, res) => {
  const id = req.params.id;
  const name = req.body.name;
  const email = req.body.email;
  const phone = req.body.phone;

  conn.query("UPDATE user SET username='"+name+"', email='"+email+"', phone_num='"+phone+"' WHERE user_id = ?", [id]);
  res.redirect('/admin/')
});

// Delete A user

app.get("/admin/delete/", (req, res) => {
  if(req.session.admin){
      conn.query("SELECT * FROM user WHERE role = 'user'", (err, results) => {
          if (err) {
              console.log(err);
          } else {
              res.render("deleteUser", {activityList: results});
          }
      });
  } else {
      res.redirect("/");
  }
});

app.get("/todo/delete/:id", (req, res) => {
  const id = req.params.id;
  conn.query("DELETE FROM user WHERE user_id = ?", [id]);
  res.redirect('/admin')
});

// Front code

// Profile User
app.get('/profile', (req, res) => {
  if (req.session.loggedin) {
    conn.query("SELECT * FROM user WHERE email = ?", [req.session.username], (err, results) =>{      
      res.render('profile', {userData: results[0]});
    })
  } else {
    res.redirect('/');
  }
});

// Profile Admin
app.get('/admin/profile', (req, res) => {
  if (req.session.admin) {
    conn.query("SELECT * FROM user WHERE email = ?", [req.session.username], (err, results) =>{      
      res.render('profileAdmin', {userData: results[0]});
    })
  } else {
    res.redirect('/');
  }
});

// Get All data with views
app.get("/todos", (req, res) => {
    if(req.session.loggedin){
        conn.query("SELECT * FROM activity WHERE user_id = '"+req.session.userID+"'", (err, results) => {
            if (err) {
                console.log(err);
            } else {
                res.render("todo", {activityList: results});
            }
        });
    } else {
        res.redirect("/");
    }
});


// Create an Activity
app.get("/todo/new", (req, res) => {
    if(req.session.loggedin) {
        res.render("new");
    } else {
        res.redirect('/')
    }
});

app.post("/todos/new", (req, res) => {
    if (req.session.loggedin) {
        let act = req.body.title;
        conn.query("INSERT INTO activity (title, user_id) VALUES ('"+act+"', '"+req.session.userID+"')");
        res.redirect("/")
    }
    res.end();
});

// Edit an Activity

app.get("/todo/update/:id", (req, res) => {
    if (req.session.loggedin) {
        let id = req.params.id;
        conn.query("SELECT * FROM activity WHERE id = ?", [id], (err, results) =>{
            let singleData = results[0];
            if (err) {
                console.log(err);
            } else {
                res.render("update", {activityList: singleData});
            }
        })
    } else {
        res.redirect('/');
    }
});

app.post("/todo/update/:id", (req, res) => {
    const id = req.params.id;
    const act = req.body.title;

    conn.query("UPDATE activity SET title='"+act+"' WHERE id = ?", [id]);
    res.redirect('/todos/')
});

// Delete Activity

app.get("/todo/delete/", (req, res) => {
    if(req.session.loggedin){
        conn.query("SELECT * FROM activity WHERE user_id = '"+req.session.userID+"'", (err, results) => {
            if (err) {
                console.log(err);
            } else {
                res.render("delete", {activityList: results});
            }
        });
    } else {
        res.redirect("/");
    }
});

app.get("/todo/delete/:id", (req, res) => {
    const id = req.params.id;
    conn.query("DELETE FROM activity WHERE id = ?", [id]);
    res.redirect('/todos/')
});

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

