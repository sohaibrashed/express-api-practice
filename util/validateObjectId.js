const AppError = require("./appError");

const validateObjectId = async (Model, name) => {
  if (!name) {
    throw new AppError(`${Model.modelName} name is required`, 400);
  }

  const document = await Model.findOne({ name });

  if (!document) {
    throw new AppError(`Invalid ${Model.modelName} name: ${name}`, 404);
  }

  return document._id;
};

module.exports = validateObjectId;
