const mongoose = require('mongoose')
const Schema = mongoose.Schema
const model = mongoose.model

const userSchema = new Schema(
    {
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
        },
        password: {
            type: String,
            required: true,
            minlength: 8
        },
        playlists: {
            type: [{ name: String, songs: []}],
            default: []
        },
        favoriteSongs: {
            type: Array,
            default: []
        }
    }, {
        toJSON: {
            transform: function(doc, ret) {
              delete ret.password;
              return ret;
            }
          }
    }
)

const User = model('Users', userSchema)

module.exports = User