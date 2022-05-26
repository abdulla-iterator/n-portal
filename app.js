require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const app = express()
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const authRoutes = require('./routes/auth')
const userRoutes = require('./routes/user')
const categoryRoutes = require('./routes/category')
const articleRoutes = require('./routes/article')

//db connection
mongoose
  .connect(process.env.DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => {
    console.log('db connected')
  })
  .catch((err) => {
    console.log(err)
  })

//midlewares
app.use(bodyParser.json())
app.use(cookieParser())
app.use(cors()) //hello world

//routes
app.get('/api', (req, res) => {
  res.send('hello')
})
app.use('/api', authRoutes)
app.use('/api', userRoutes)
app.use('/api', categoryRoutes)
app.use('/api', articleRoutes)

app.listen(process.env.PORT || 8000, () => {
  console.log('server at 8000')
})
