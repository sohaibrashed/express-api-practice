const exceptionHandler = require("../middlewares/exceptionHandler");

const validateObjectId = exceptionHandler(async (Model, name) => {
  if (!name) {
    throw new Error(`${Model.modelName} name is required`);
  }

  const document = await Model.findOne({ name });

  if (!document) {
    throw new Error(`Invalid ${Model.modelName}: ${name}`);
  }

  return document._id;
});

module.exports = validateObjectId;
