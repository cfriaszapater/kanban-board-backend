var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var CardSchema = new Schema({
  id: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: false
  },
  user: {
    type: Schema.Types.ObjectId,
    required: true
  }
});

// Virtual property: card's URL
CardSchema.virtual("url").get(function() {
  return "/cards/" + this._id;
});

// Export model
module.exports = mongoose.model("Card", CardSchema);
