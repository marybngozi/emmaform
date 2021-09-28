const mongoose = require("mongoose");

const { Schema } = mongoose;

const documentSchema = new Schema(
  {
    lastName: {
      type: String,
    },
    firstName: {
      type: String,
    },
    otherName: {
      type: String,
    },
    dateOfBirth: {
      type: String,
    },
    positionInCompany: {
      type: String,
    },
    dateOfEmployment: {
      type: String
    },
    salary: {
      type: String
    },
    nationality: {
      type: String
    },
    stateOfOrigin: {
      type: String
    },
    lga: {
      type: String
    },
    maritalStatus: {
      type: String
    },
    sex: {
      type: String
    },
    contactAddress: {
      type: String
    },
    telephoneNo: {
      type: String
    },
    nextOfKinDetails: {
      type: String
    },
    nextOfKinAddress: {
      type: String
    },
    refereeDetails: {
      type: String
    },
    image: {
      type: String
    },
    imageID: {
      type: String
    }
  },
  {
    strict: false,
    timestamps: true,
    toObject: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      },
    },
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      },
    },
  }
);
module.exports = { Form: mongoose.model("Form", documentSchema) };
