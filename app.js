const Koa = require('koa')
const parser = require('koa-bodyparser')
const InitManager = require('./core/init')
const catchError = require('./middlewares/exception')

const app = new Koa()

require('./app/models/user')
require('./app/models/announcement')
require('./app/models/chapter')
require('./app/models/exam')
require('./app/models/exercise')
require('./app/models/library')
require('./app/models/paper')
require('./app/models/record')
require('./app/models/user_exam')
require('./app/models/user_exercise')
require('./app/models/user_library')
require('./app/models/tag')


app.use(catchError)
app.use(parser())

InitManager.initCore(app)

app.listen(3000)