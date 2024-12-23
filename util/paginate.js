const AppError = require("./appError");

const paginate = async (
  model,
  queryParams,
  sortOrder = {},
  populateFields = [],
  page = 1,
  limit = process.env.LIMIT || 10
) => {
  try {
    const { ...filters } = queryParams;

    const currentPage = Math.max(1, parseInt(page));
    const itemsPerPage = Math.max(1, parseInt(limit));
    const skip = (currentPage - 1) * itemsPerPage;

    let query = model
      .find(filters)
      .sort(sortOrder)
      .skip(skip)
      .limit(itemsPerPage);

    if (populateFields.length > 0) {
      populateFields.forEach((field) => {
        query = query.populate(field);
      });
    }

    const results = await query;
    const totalItems = await model.countDocuments(filters);
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    return {
      data: results,
      pagination: {
        currentPage,
        itemsPerPage,
        totalPages,
        totalItems,
      },
    };
  } catch (error) {
    throw new AppError(`Pagination failed: ${error.message}`);
  }
};

module.exports = paginate;
