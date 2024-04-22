const {model, Schema, Types: {ObjectId}} = require('mongoose')

const CommentSchema = new Schema({
    content: {type: String, require: true},
    name: {type: String, require: true},
    email: {type: String, require: true},
    notice: {type: ObjectId, require: true},
    project: {type: ObjectId, require: true},
}, {timestamps: true})

const Comment = model('comment', CommentSchema)
module.exports = {Comment}