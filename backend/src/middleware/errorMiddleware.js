
export const notFoundMiddleware = (req, res, next) => {
    return res.status(404).json({
        success: false,
        message: `Route not found: ${req.method} ${req.originalUrl}`
    });
};

export const errorMiddleware = (err, req, res, next) => {
    console.error("API Error:", err);

    // Delegate if response headers have already been sent
    if (res.headersSent) {
        return next(err);
    }

    const requestedStatus = err.statusCode || err.status || 500;

    const statusCode =
        Number.isInteger(requestedStatus) &&
        requestedStatus >= 400 &&
        requestedStatus <= 599
            ? requestedStatus
            : 500;

    return res.status(statusCode).json({
        success: false,
        message:
            statusCode === 500
                ? "Internal server error"
                : err.message || "Something went wrong"
    });
};
