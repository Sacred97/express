const {Router} = require('express')
const {validationResult} = require('express-validator')
const auth = require('../middleware/auth')
const Course = require('../models/course')
const router = Router()
const {coursesValidators} = require('../utils/validators')

function isOwner(course, req) {
    return course.userId.toString() === req.user._id.toString()
}

router.get('/', async (req, res) => {
    try {
        const courses = await Course.find().populate('userId', 'email name')
        res.render('courses', {
            title: 'Courses',
            isCourses: true,
            userId: req.user ? req.user._id.toString() : null,
            courses
        })
    } catch (e) {
        console.log(e);
    }
})

router.get('/:id', async (req, res) => {
    // Два раза делает рендер где на втором данных нет
    try {
        const course = await Course.findById(req.params.id)
        res.render('course', {
            layout: 'empty',
            title: `Course ${course ? course.title : 'Express'}`,
            course
        })
    } catch (e) {
        console.log(e);
    }
})

router.post('/edit', auth, coursesValidators, async (req, res) => {
    const {id} = req.body
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(422).redirect(`/courses/${id}/edit?allow=true`)
    }

    try {
        delete req.body.id
        const course = await Course.findById(id)
        if (!isOwner(course, req)) {
            return res.redirect('/courses')
        }
        Object.assign(course, req.body)
        await course.save()
        res.redirect('/courses')
    } catch (e) {
        console.log(e);
    }
})

router.get('/:id/edit', auth, async (req, res) => {
    if (!req.query.allow) {
        return res.redirect('/')
    }
    try {
        const course = await Course.findById(req.params.id)

        if (!isOwner(course, req)) {
            return res.redirect('/courses')
        }

        res.render('course-edit', {
            title: `Edit ${course ? course.title : 'Express'}`,
            course
        })
    } catch (e) {
        console.log(e);
    }
})

router.post('/remove', auth, async (req, res) => {
    try {
        await Course.deleteOne({
            _id: req.body.id,
            userId: req.user._id
        })
        res.redirect('/courses')
    } catch (e) {
        console.log(e)
    }
})


module.exports = router
