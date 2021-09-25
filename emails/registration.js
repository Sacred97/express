const keys = require('../keys/index')

module.exports = function (email) {
    return {
        to: email,
        from: keys.EMAIL_FROM,
        subject: 'Accounted has been created',
        html: `
            <h1>Welcome to us shop</h1>
            <p>You successful created account with email - ${email}</p>
            <hr>
            <a href="${keys.BASE_URL}">Courses shop</a>
        `
    }
}
