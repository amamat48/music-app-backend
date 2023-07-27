const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const model = mongoose.model;

const commentsSchema = new Schema({
  comment: {
    type: String,
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: "Users",
  },
});

const Comments = model("Comments", commentsSchema);

module.exports = Comments;
