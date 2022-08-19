const errorHandler = (err, req, res, next) => {
     // FIX: check for bad status codes
    // a bad status code i.e. 2xx should not be sent as error response, only send good status code
    const statusCode = res.statusCode < 400 ? 500 : res.statusCode
    res.status(statusCode)
    res.json({
        message: err.message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack
})};

module.exports = { errorHandler };