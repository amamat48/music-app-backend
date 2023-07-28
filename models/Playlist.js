const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const model = mongoose.model;

const playlistSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'Users',
    },
    songs: [{
        type: String,
        required: true
    }]


})

const Playlist = model('Playlist', playlistSchema);

module.exports = Playlist;