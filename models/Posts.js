const mongoose = require('mongoose')
const Schema = mongoose.Schema
const model = mongoose.model

const postSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    Likes: {
        type: Number,
        default: 0
    },
    Comments: [{
        type: Schema.Types.ObjectId,
        ref: 'Comments',
    }]
})

const Post = model('Posts', postSchema)

module.exports = Post