const admin = require('firebase-admin')
const serviceAccount = require('../config/fiubify-firebase-adminsdk-5fktf-c29a583ecf.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

module.exports = {
    storage: admin.storage()
};
