const mongoose = require('mongoose')
const Schema = mongoose.Schema
const model = mongoose.model

const postSchema = new Schema({
    title: {
        type: String,
    },
    content: {
        type: String,
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: false
    }
})

const Post = model('Posts', postSchema)

module.exports = Post