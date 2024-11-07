const responseFormatter = (res, statusCode, message, data = {}) => {
  return res.status(statusCode).json({
    status: "success",
    message,
    data,
  });
};

export default responseFormatter;
