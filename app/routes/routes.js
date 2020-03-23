module.exports = app => {
  const controller = require("../controllers/controllers.js");

                                            // Back Code

  // Login API
  app.post("/api/login", controller.login);

  // Register API
  app.post("/api/register", controller.register);

  // Logout With Session API
  app.get("/api/logout", controller.logout);

  // Login Admin Page API
  app.get("/api/admin", controller.admin);

  // Add New Admin API
  app.post("/api/admin/new", controller.adminNew);

  // Admin Delete a User
  app.delete("/api/admin/delete/:id", controller.deleteUser);

  // Get all Activities
  app.get("/api/todos", controller.getAll);

  // Get Activities by ID
  app.get("/api/todo/:id", controller.getById);

  // Creat a new activity
  app.post("/api/todos/", controller.create);

  // Update activity by id
  app.put("/api/todo/:id", controller.updateById);

  // Delete activity
  app.delete("/api/todo/:id", controller.deleteActivity);

                                    // Front Code

  // Login Post
  app.post("/login", controller.loginPost);

  // Home Page
  app.get("/", controller.homePage);

  // Login Page
  app.get("/login", controller.loginView);

  // Register Post
  app.post("/register", controller.registerPost);

  // Register View
  app.get("/register", controller.registerView);

  // Logout View
  app.get("/logout", controller.logoutView);

  // Admin Page with View
  app.get("/admin", controller.adminView);

  // Admin add user page
  app.get("/admin/new", controller.adminNewView);

  // Admin add user post
  app.post("/admin/new", controller.adminNewPost);

  // Admin get data user by id with view
  app.get("/admin/update/:id", controller.adminEditView);

  // Admin update data user by id
  app.post("/admin/update/:id", controller.adminEditPost);

  // Admin get user data by id for delete View
  app.get("/admin/delete", controller.adminDeleteView);

  // Admin delete user data
  app.get("/admin/delete/:id", controller.adminDeleteUser);

  // Get Profile User
  app.get("/profile", controller.profileUser);

  // Get Profile Admin
  app.get("/admin/profile", controller.profileAdmin);

  // Get all activity data
  app.get("/todos", controller.getActivityAll);

  // Get add activity page
  app.get("/todos/new", controller.getNewActivity);

  // Post new activity
  app.post("/todos/new", controller.postNewActivity);

  // Get update activity page
  app.get("/todo/update/:id", controller.getUpdateActivity);

  // Post edited activity
  app.post("/todo/update/:id", controller.postUpdateActivity);

  // Get delete activity page
  app.get("/todo/delete/", controller.getDeleteActivity);

  // Delete activity by id
  app.get("/todo/delete/:id", controller.deleteActivityView);
};