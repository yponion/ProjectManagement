const {model, Schema} = require('mongoose')

const CommentSchema = new Schema({
    content: {type: String, require: true},
    name: {type: String, require: true},
}, {timestamps: true})

const Comment = model('comment', CommentSchema)
module.exports = {Comment}