const {body} = require('express-validator')
const User = require('../models/user')

exports.registerValidators = [
    body('email').isEmail().withMessage('Email is not corrected')
        .custom(async (value, {req}) => {
            try {
                const user = await User.findOne({email: value})
                if (user) {
                    return Promise.reject('Email already busy')
                }
            } catch (e) {
                console.log(e)
            }
        })
        .normalizeEmail(),
    body('password', 'Password length min 6')
        .isLength({min: 6, max: 64})
        .isAlphanumeric()
        .trim()
    ,
    body('confirm')
        .custom((value, {req}) => {
            if (value !== req.body.password) {
                throw new Error('Passwords is not matching')
            }
            return true
        })
        .trim(),
    body('name')
        .isLength({min: 3})
        .withMessage('Name length min 3')
        .trim()
]

exports.coursesValidators = [
    body('title').isLength({min: 3}).withMessage('Title length min 3').trim(),
    body('price').isNumeric().withMessage('Price is not corrected').trim(),
    body('img', 'URL image is not corrected').isURL().trim()
]
