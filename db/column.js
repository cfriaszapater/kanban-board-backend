var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var ColumnSchema = new Schema({
  id: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: false
  },
  cardIds: [
    {
      type: String,
      required: false
    }
  ],
  user: {
    type: Schema.Types.ObjectId,
    required: true
  }
});

// Virtual property: column's URL
ColumnSchema.virtual("url").get(function() {
  return "/columns/" + this._id;
});

// Export model
module.exports = mongoose.model("Column", ColumnSchema);
