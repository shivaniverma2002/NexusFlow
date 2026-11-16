
export const notFoundMiddleware = (req, res, next) => {
    res.status(404).json({
        success: false,
        message: `Route not found: ${req.method} ${req.originalUrl}`
    });
};

export const errorMiddleware = (err, req, res, next) => {
    const statusCode = err.statusCode || err.status || 500;

    console.error("API Error:", err);

    res.status(statusCode).json({
        success: false,
        message:
            statusCode === 500
                ? "Internal server error"
                : err.message || "Something went wrong"
    });
};
