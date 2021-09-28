const mongoose = require("mongoose");
const crypto = require("crypto");

const SALT = "f844b09ff50c";
const SALT_WORK_FACTOR = 10;

const { Schema } = mongoose;

const documentSchema = new Schema(
  {
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    password: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
  },
  {
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

documentSchema.pre("save", function (next) {
  // only hash the password if it has been modified (or is new)
  if (!this.isModified("password")) return next();

  // hash user password and save
  this.password = crypto
    .pbkdf2Sync(this.password, SALT, SALT_WORK_FACTOR, 64, `sha512`)
    .toString(`hex`);
  next();
});

// compare the passwords, return boolean
documentSchema.methods.comparePassword = function (candidatePassword) {
  const candidatePasswordHash = crypto
    .pbkdf2Sync(candidatePassword, SALT, SALT_WORK_FACTOR, 64, `sha512`)
    .toString(`hex`);
  return candidatePasswordHash == this.password;
};
module.exports = { Admin: mongoose.model("Admin", documentSchema) };
