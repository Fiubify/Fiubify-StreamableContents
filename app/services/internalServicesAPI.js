const internalServicesUrls = {
    uidAuthValidationUrl: process.env.UID_AUTH_URL || "https://fiubify-users-staging.herokuapp.com/auth/validate/uid",
    userAuthValidationUrl: process.env.USER_AUTH_URL || "https://fiubify-users-staging.herokuapp.com/auth/validate/user",
    multipleUsersAuthValidationUrl: process.env.USERS_AUTH_URL || "https://fiubify-users-staging.herokuapp.com/auth/validate/users"
}

module.exports = internalServicesUrls