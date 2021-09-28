// import some external packages
const { validationResult } = require("express-validator");

// import the admin schema model
const { Admin } = require("../models/admin");

// to verify admin password
const verifyPassword = async (id, password) => {
  const admin = await Admin.findById(id);

  return await admin.comparePassword(password);
};

// for serving admin login
const getLogin = async (req, res) => {
  try {
    return res.render("login", {
      title: "Admin Login",
      form: {
        username: null,
        password: null,
      },
      errors: null,
    });
  } catch (e) {
    console.log("adminController-getlogin", e);

    return res.render("login", {
      title: "Admin Login",
      form: {
        username: null,
        password: null,
      },
      error: e,
    });
  }
};

// for posting and processing admin login
const postLogin = async (req, res) => {
  try {
    const { errors } = validationResult(req);

    // check if there is an error and return
    const errorInfo = {};

    if (errors.length) {
      // convert the errors to key-value pair for proper display
      errors.forEach((err) => {
        errorInfo[err.param] = err.msg;
      });

      // return to the login page with the errors object
      return res.render("login", {
        title: "Admin Login",
        errors: errorInfo,
        form: req.body,
      });
    }

    // get the admin details
    const admin = await Admin.findOne({
      username: req.body.username,
    });

    // if no admin was found return
    if (!admin) {
      errorInfo["login"] = "Admin username is wrong";

      return res.render("login", {
        title: "Admin Login",
        errors: errorInfo,
        form: req.body,
      });
    }

    // verify admin password
    const passwordCorrect = await verifyPassword(admin.id, req.body.password);

    // if password is wrong return
    if (!passwordCorrect) {
      errorInfo["login"] = "Admin password is wrong";

      return res.render("login", {
        title: "Admin Login",
        errors: errorInfo,
        form: req.body,
      });
    }

    // create admin sessions
    req.session.username = admin.username;

    //  go to dashboard on success
    return res.redirect("/dashboard");
  } catch (e) {
    console.log("adminController-postlogin", e);
    return res.render("login", {
      title: "Admin Login",
      errors: e,
      form: req.body,
    });
  }
};

// for admin loading dashboard
const dashboard = async (req, res) => {
  try {
    return res.render("dashboard", {
      title: "Admin Dashboard",
      message: `Hello ${req.session.username}, Welcome to the dashboard`,
    });
  } catch (e) {
    console.log("adminController-dashboard", e);

    return res.render("dashboard", {
      title: "Admin Dashboard",
      message: "You have successfully logged out!",
    });
  }
};

const logout = async (req, res) => {
  // clear the sessions
  req.session.destroy();

  // clear the local variables
  res.locals.admin = null;

  return res.render("logout", {
    title: "Logout",
    message: "You have successfully logged out!",
  });
};

module.exports = {
  getLogin,
  postLogin,
  dashboard,
  logout,
};
