const apiError = require("../errors/apiError");

function errorHandler(err, req, res, _next) {
    if (err instanceof apiError) {
        err.constructResponse(res);
        return;
    }

    res.status(500).json({error: {msg: "Internal error"}});
}

module.exports = errorHandler;
