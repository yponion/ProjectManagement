const {Schema, model, Types: {ObjectId}} = require('mongoose')

const NoticeSchema = new Schema({
    title: {type: String, require: true},
    content: {type: String, require: true},
    name: {type: String, require: true},
    email: {type: String, require: true},
    project: {type: ObjectId, required: true, ref: 'project'},
}, {timestamps: true})

const Notice = model('notice', NoticeSchema)
module.exports = {Notice}