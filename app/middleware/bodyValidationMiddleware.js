const validateReqBody = (schemaToValidate) => {
    const validationMiddleware = (req, res, next) => {
        let missingFields = [];

        for (const field of schemaToValidate) {
            if (!req.body[field]) {
                missingFields.push(field)
            }
        }

        res.missingFieldsInBody = missingFields;
        next();
    }

    return validationMiddleware;
}

module.exports = validateReqBody;