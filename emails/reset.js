const keys = require('../keys/index')

module.exports = function (email, token) {
    return {
        to: email,
        from: keys.EMAIL_FROM,
        subject: 'Re-store password',
        html: `
            <h1>Re-store password</h1>
            <p>If not to ignore this letter</p>
            <p>Else put on reference</p>
            <p><a href="${keys.BASE_URL}/auth/password/${token}">Re-store access</a></p>
            <hr>
            <a href="${keys.BASE_URL}">Courses shop</a>
        `
    }
}
