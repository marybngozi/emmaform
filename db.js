module.exports.db = async () => {
  const mongoose = require("mongoose");
  // const MONGODB_URI = "mongodb://localhost:27017/cms";
  const MONGODB_URI =
    "mongodb+srv://greatnonso7:12345@cluster0.7jtz0.mongodb.net/emma_form";

  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(
      `----------------------------
      Database Connected (${MONGODB_URI})
  ----------------------------
          `
    );
  } catch (error) {
    console.log(
      `-------------------------------------
			Db connection to (${MONGODB_URI}) failed Due to :
			${error}
		-------------------------------------`
    );
  }
};
