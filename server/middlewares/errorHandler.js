import createError from "http-errors";

const errorHandler = (err, req, res, next) => {
  if (!(err instanceof createError.HttpError)) {
    err = createError(500, err.message || "Internal Server Error");
  }

  const status = err.status || 500;

  const message = err.message || "Internal Server Error";

  if (process.env.NODE_ENV === "development") {
    console.error(err.stack);
  }

  res.status(status).json({
    status: "error",
    message,

    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
};

export default errorHandler;
