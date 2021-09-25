const express = require('express')
const mongoose = require('mongoose')
const session = require('express-session')
const MongoStore = require('connect-mongodb-session')(session)
const csrf = require('csurf')
const helmet = require('helmet')
const compression = require('compression')
const flash = require('connect-flash')
const path = require('path')
const Handlebars = require('handlebars')
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access')
const exphbs = require('express-handlebars')
const homeRoutes = require('./routes/home')
const addRoutes = require('./routes/add')
const coursesRoutes = require('./routes/courses')
const cardRoutes = require('./routes/card')
const ordersRoutes = require('./routes/orders')
const authRoutes = require('./routes/auth')
const profileRoutes = require('./routes/profile')
const varMiddleware = require('./middleware/variables')
const userMiddleware = require('./middleware/user')
const fileMiddleware = require('./middleware/file')
const errorHandler = require('./middleware/error')
const keys = require('./keys/index')
const app = express()

// Создаем движок
const hbs = exphbs.create({
    handlebars: allowInsecurePrototypeAccess(Handlebars),
    defaultLayout: 'main',
    extname: 'hbs',
    helpers: require('./utils/hbs-helpers')
})

const store = new MongoStore({
    collection: 'sessions',
    uri: keys.MONGODB_URI
})

// Регистрируем движок handlebars и указываем что файлы будут с расширением hbs
app.engine('hbs', hbs.engine)
// Первый зарезервированый параметр, второй расширение файлов, указывем что нужно использовать движок
app.set('view engine', 'hbs')
// Первый зарезервированый параметр, второй параметер папка с hbs файлами, указываем где нужно просматривать файлы
app.set('views', 'views')

// Указываем что нужно использовать файлы в папке public всегда
app.use(express.static(path.join(__dirname, 'public')))
app.use('/images', express.static(path.join(__dirname, 'images')))
// BodyParser настраиваем
app.use(express.urlencoded({extended: true}))
app.use(session({
    secret: keys.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: store
}))
app.use(compression())
app.use(fileMiddleware.single('avatar'))
app.use(csrf())
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            // "default-src": ["self"],
            "default-src": ["*"],
            // "script-src": ["self", "example.com"],
            "script-src": ["*"],
            // "img-src": ["self", "https:"],
            "img-src": ["*"],
            // "style-src": ["self", "example.com"],
            "style-src": ["*"],
        }
    }
}))
app.use(flash())
app.use(varMiddleware)
app.use(userMiddleware)

app.use('/', homeRoutes)
app.use('/add', addRoutes)
app.use('/courses', coursesRoutes)
app.use('/card', cardRoutes)
app.use('/orders', ordersRoutes)
app.use('/auth', authRoutes)
app.use('/profile', profileRoutes)

app.use(errorHandler)

const PORT = process.env.PORT || 3000

async function start() {
    try {
        await mongoose.connect(keys.MONGODB_URI)
        app.listen(PORT, () => {
            console.log(`Server started on port ${PORT}`)
        })
    } catch (e) {
        console.log(e)
    }
}

start()

