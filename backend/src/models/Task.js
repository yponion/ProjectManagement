const {model, Schema, Types: {ObjectId}} = require('mongoose')

const taskSchema = new Schema({
    title: {type: String, require: true},
    memo: {type: String, require: true},
    start: {type: Date, require: true},
    end: {type: Date, require: true},
    project: {type: ObjectId, require: true},
})

const Task = model('task', taskSchema)
module.exports = {Task}