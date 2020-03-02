const express = require('express')
const app = express()

const coursesController = require('./controllers/coursesController')

app.get('/populate', coursesController.pupulateData)
app.get('/courses', coursesController.filterCurses)

app.listen(3000,()=>{
    console.log('Server ready on port 3000')
})