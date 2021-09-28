// import the external packages
const express = require("express");
const app = express();
const path = require("path");
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");
const session = require("express-session");

// import the database setup
const initializeDb = require("./db");

// import the authenticate middleware
const authenticate = require("./utils/middleware");

// import the validations
const validate = require("./utils/validations");

// import the route controllers
const adminController = require("./controllers/admin");
const formController = require("./controllers/form");

// set the port for the app
const port = process.env.PORT || 3030;

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

// use the express-fileupload for files
app.use(fileUpload());

// use express-session for tracking login
app.use(
  session({
    secret: "happy bog",
    saveUninitialized: true,
    resave: true,
  })
);

// set path to public folders and view folders
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

//use public folder for CSS etc.
app.use(express.static(__dirname + "/public"));

// connect to db
initializeDb.db();

app.use(async (req, res, next) => {
  res.locals.admin = req.session.username ? req.session.username : null;
  next();
});

// home route showing the home form
app.get("/", async (req, res) => {
  return res.render("home", {
    title: "Home",
  });
});


// login route for showing admin login form
app.get("/login", adminController.getLogin);

// login route for proccessing admin login
app.post("/login", validate.login, adminController.postLogin);

// load admin dashboard form
app.get("/dashboard", authenticate, adminController.dashboard);

// for showing an employee details
app.get("/view-form/:id", authenticate, formController.viewForm);

// load the add form
app.get("/add-form", authenticate, formController.loadAddForm);

// process the form for the add form
app.post("/add-form", authenticate, formController.processForm);

// load the edit forms
app.get("/list-forms", authenticate, formController.listForms);

// get a single form for edit
// app.get("/edit-form/:id", formController.getEditForm);
app.get("/edit-form/:id", authenticate, formController.getEditForm);

// edit a single form by id
app.post("/edit-form", authenticate, formController.editForm);

// delete a form
app.get("/delete-form/:id", authenticate, formController.deleteForm);

// admin logout
app.get("/logout", authenticate, adminController.logout);

// 404 not found for any wrong route
app.use("*", (req, res) => {
  return res.render("notfound", {
    title: "Form Not Found",
  });
});

// report error if the application cannot be started
app.on("error", (e) => {
  console.log("could not start server: ", e.message);
});

// start the app at the specified port
app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
