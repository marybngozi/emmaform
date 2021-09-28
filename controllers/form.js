// import some external packages
const fs = require("fs");
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: "dnbbhvcbt",
  api_key: "822993235498835",
  api_secret: "lxcuiJTe4jwvjvvPDpCyIZ2mg-c",
});

const uploadFileToCloud = async (file) => {
  return await cloudinary.uploader.upload(file, {
    folder: "emmaform/"
  })
}

const deleteFileFromCloud = async (file) => {
  return await cloudinary.uploader.destroy(file);
}

// import the admin schema model
const { Form } = require("../models/form");

// for serving the forms
const viewForm = async (req, res) => {
  try {
    // go to notFound if id is not provided
    if (!req.params.id) {
      return res.render("notfound", {
        title: "Employee Not Found",
      });
    }

    // get the details of the form from the database
    const form = await Form.findById(req.params.id);

    // go to notFoundForm if id is not found in the database
    if (!form) {
      return res.render("notfound", {
        title: "Employee Not Found",
      });
    }

    return res.render("viewForm", {
      title: "Employee Details",
      d: form,
    });
  } catch (error) {
    console.log("formController-form", error);
    return res.render("notfound", {
      title: "Employee Not Found",
      error,
    });
  }
};

// for loading add form
const loadAddForm = async (req, res) => {
  try {
    return res.render("addForm", {
      title: "Add Form",
      addSuccess: false,
    });
  } catch (e) {
    console.log("formController-loadAddForm", e);

    return res.render("addForm", {
      title: "Add Form",
      addSuccess: false,
    });
  }
};

// for  processing form creation
const processForm = async (req, res) => {
  try {
    let imageName = null;
    let imageID = null;
    // check if a file was added, if not return error
    if (req.files && Object.keys(req.files).length > 0) {
      // get the image and move it to the uploads folder

      imageName = req.files.passPort.name;
      const image = req.files.passPort;
      const imagePath = `public/uploads/${imageName}`;
      await image.mv(imagePath);

      const imageUpload = await uploadFileToCloud(imagePath);

      // remove the image from temp folder
      fs.unlink(imagePath, (err) => {
        if (err) console.log(err);
        console.log(`temp image ${imagePath} was removed`);
      });

      imageName = imageUpload.url;
      imageID = imageUpload.public_id;
    }

    // add the data to the database
    await Form.create({
      ...req.body,
      image: imageName,
      imageID: imageID
    });

    return res.render("addForm", {
      title: "Add Form",
      addSuccess: true,
    });
  } catch (e) {
    console.log("formController-processForm", e);
    return res.render("addForm", {
      title: "Add Form",
      addSuccess: false,
    });
  }
};

// for loading all forms
const listForms = async (req, res) => {
  try {
    // get all the forms
    const forms = await Form.find({});

    return res.render("listForms", {
      title: "List Employees",
      forms,
    });
  } catch (e) {
    console.log("formController-EditForms", e);

    return res.render("listForms", {
      title: "List Employees",
    });
  }
};

// get a single form for edit
const getEditForm = async (req, res) => {
  try {
    // check if the form Id was provided
    if (!req.params.id) {
      // return to the edit forms
      return res.redirect("/list-forms");
    }

    // get the requested form editSuccess
    const form = await Form.findById(req.params.id);

    // check if the form Id is correct
    if (!form) {
      // return to the edit forms
      return res.redirect("/list-forms");
    }

    return res.render("editForm", {
      title: "Edit Form",
      editSuccess: false,
      form,
    });
  } catch (error) {
    console.log("formController-getEditForm", error);

    return res.render("editForm", {
      title: "Edit Form",
      editSuccess: false,
      form: {
        id: null,
        menu: null,
        title: null,
        post: null,
      },
    });
  }
};

// edit a single form by id
const editForm = async (req, res) => {
  try {
    let imageName = null;
    let imageID = null;

    // check if a file was added, update the file, remove the old one
    if (req.files && Object.keys(req.files).length > 0) {
      // get the image and move it to the uploads folder
      imageName = req.files.passPort.name;
      const image = req.files.passPort;
      const imagePath = `public/uploads/${imageName}`;
      await image.mv(imagePath);

      const imageUpload = await uploadFileToCloud(imagePath);

      // remove the image from temp folder
      fs.unlink(imagePath, (err) => {
        if (err) console.log(err);
        console.log(`temp image ${imagePath} was removed`);
      });

      imageName = imageUpload.url;
      imageID = imageUpload.public_id;
    }

    // create the update object
    const updateData = {
      lastName: req.body.lastName,
      firstName: req.body.firstName,
      otherName: req.body.otherName,
      dateOfBirth: req.body.dateOfBirth,
      positionInCompany: req.body.positionInCompany,
      dateOfEmployment: req.body.dateOfEmployment,
      salary: req.body.salary,
      nationality: req.body.nationality,
      stateOfOrigin: req.body.stateOfOrigin,
      lga: req.body.lga,
      maritalStatus: req.body.maritalStatus,
      sex: req.body.sex,
      contactAddress: req.body.contactAddress,
      telephoneNo: req.body.telephoneNo,
      nextOfKinDetails: req.body.nextOfKinDetails,
      nextOfKinAddress: req.body.nextOfKinAddress,
      refereeDetails: req.body.refereeDetails,
    };

    // only update image if it was changed
    if (imageName) {
      updateData.image = imageName;
      updateData.imageID = imageID;
    }

    // update the data to the database
    const oldForm = await Form.findByIdAndUpdate(req.body.id, updateData);

    // if image was updated, remove the old one
    if (imageName && oldForm.imageID) {
      // remove the old image from cloudinary
      await deleteFileFromCloud(oldForm.imageID);
    }

    return res.render("editForm", {
      title: "Edit Form",
      editSuccess: true,
      form: req.body,
    });
  } catch (e) {
    console.log("formController-editForm", e);
    return res.render("editForm", {
      title: "Edit Form",
      editSuccess: false,
      form: req.body,
    });
  }
};

// delete a form
const deleteForm = async (req, res) => {
  try {
    // check if the form Id was provided
    if (!req.params.id) {
      // return to the edit forms
      return res.redirect("/list-forms");
    }

    // delete the data from the database
    const oldForm = await Form.findByIdAndDelete(req.params.id);

    // remove the old image if there is any
    if(oldForm && oldForm.imageID){
      await deleteFileFromCloud(oldForm.imageID);
    }

    return res.render("deleteForm", {
      title: "Delete Form",
      message: "You have successfully deleted the form!",
      deleteSuccess: true,
    });
  } catch (e) {
    console.log("formController-deleteForm", e);
    return res.render("deleteForm", {
      title: "Delete Form",
      message: "Delete form failed",
      deleteSuccess: false,
    });
  }
};

module.exports = {
  viewForm,
  loadAddForm,
  processForm,
  listForms,
  getEditForm,
  editForm,
  deleteForm,
};
