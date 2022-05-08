const admin = require('firebase-admin')
const serviceAccount = require('../config/fiubify-firebase-adminsdk-5fktf-c29a583ecf.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: 'gs://fiubify.appspot.com'
});

module.exports = {
    storage: admin.storage().bucket()
};
