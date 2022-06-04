const validateReqBody = (schemaToValidate) => {
    const validationMiddleware = (req, res, next) => {
        let missingFields = [];

        for (const field in schemaToValidate) {
            if (!req.body[field] && schemaToValidate[field].required) {
                missingFields.push(field)
            }
        }

        res.missingFieldsInBody = missingFields;
        next();
    }

    return validationMiddleware;
}

module.exports = validateReqBody;