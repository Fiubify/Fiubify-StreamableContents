class QueryParser {
    constructor(listOfKeys) {
        this.listOfKeys = listOfKeys
    }

    parseRequest(req) {
        const query = {}

        for (const key of this.listOfKeys) {
            if (req.query[key]) {
                query[key] = req.query[key];
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