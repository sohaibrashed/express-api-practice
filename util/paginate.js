// utils/pagination.js

const paginate = (query, page, limit) => {
  const currentPage = Math.max(1, parseInt(page) || 1);
  const itemsPerPage = Math.max(1, parseInt(limit) || process.env.LIMIT);

  const skip = (currentPage - 1) * itemsPerPage;

  query = query.skip(skip).limit(itemsPerPage);

  return {
    query,
    pagination: {
      currentPage,
      itemsPerPage,
    },
  };
};

module.exports = paginate;
