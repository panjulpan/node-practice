module.exports = app => {
  const controller = require("../controllers/controllers.js");

  // Login API
  app.post("/api/login", controller.login);

  // Register API
  app.post('/api/register', controller.register);

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
};