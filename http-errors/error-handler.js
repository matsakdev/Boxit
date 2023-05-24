const ErrorHandler = (err, req, res, next) => {
    console.log(err);
    if (err.statusCode) {
        res.status(err.statusCode);
        res.json({
            status: "failed",
            message: err.message
        });
    }
    else {
        return res.status(500).json({message: 'Unexpected Server Error'});
    }
}

module.exports = ErrorHandler;
