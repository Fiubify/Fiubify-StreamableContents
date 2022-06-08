class QueryParser {
    constructor(listOfKeys, listOfKeysContained) {
        this.listOfKeys = listOfKeys
        this.listOfKeysContained = listOfKeysContained
    }

    parseRequest(req) {
        const query = {}

        for (const key of this.listOfKeys) {
            if (req.query[key]) {
                query[key] = req.query[key];
            }
        }

        for (const key of this.listOfKeysContained) {
            if (req.query[key]) {
                query[key] = {$regex: req.query[key], $options: "i"};
            }
        }

        return query;
    }

    getErrorMessageNotFound(req) {
        let listOfMessages = [];
        for (const key of this.listOfKeys) {
            if (req.query[key]) {
                const message = `${key}:${req.query[key]}`;
                listOfMessages.push(message);
            }
        }

        return `No element for this query: ${listOfMessages.join(', ')}`
    }
}

module.exports = QueryParser;