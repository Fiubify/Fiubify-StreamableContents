const mongoose = require("mongoose");

const setUpTestDb = async () => {
    if (process.env.NODE_ENV === "DEV") {
        await mongoose.connect("mongodb://mongodb:27017/test", {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
    } else {
        throw Error("Only use this function in Docker enviroment / DEV enviroment");
    }
};

const dropTestDbDatabase = async () => {
    if (process.env.NODE_ENV !== "DEV") {
        throw Error("Only use this function in Docker enviroment / DEV enviroment");
    }

    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
};

const dropTestDbCollections = async () => {
    if (process.env.NODE_ENV !== "DEV") {
        throw Error("Only use this function in Docker enviroment / DEV enviroment");
    }

    const collections = mongoose.connection.collections;

    for (const key in collections) {
        const collection = collections[key];
        await collection.deleteMany();
    }
};

module.exports = {
    setUpTestDb,
    dropTestDbDatabase,
    dropTestDbCollections,
};
