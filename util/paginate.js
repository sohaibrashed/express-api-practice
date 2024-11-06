const paginate = async (model, queryParams) => {
  const { page = 1, limit = process.env.LIMIT, ...filters } = queryParams;

  const currentPage = Math.max(1, parseInt(page));
  const itemsPerPage = Math.max(1, parseInt(limit));
  const skip = (currentPage - 1) * itemsPerPage;

  // pipeline not working due to type casting
  // const pipeline = [
  //   { $match: filters },
  //   { $skip: skip },
  //   { $limit: itemsPerPage },
  // ];

  // const results = await model.aggregate(pipeline);

  const results = await model.find(filters).skip(skip).limit(itemsPerPage);
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
};

module.exports = paginate;
