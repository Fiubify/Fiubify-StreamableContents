const internalServicesUrls = {
    uidAuthValidationUrl: process.env.UID_AUTH_URL || "https://fiubify-users-staging.herokuapp.com/auth/validate/uid",
    userAuthValidationUrl: process.env.USER_AUTH_URL || "https://fiubify-users-staging.herokuapp.com/auth/validate/user"
}

module.exports = internalServicesUrls