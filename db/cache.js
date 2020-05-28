let mongoose = require("mongoose");

let cacheSchema = new mongoose.Schema({
  senderId: String,
  convoNumber: Number,
  dob: String,
  createdAt: Date,
  updatedAt: Date,
});

cacheSchema.pre("save", function (next) {
  let now = Date.now();

  this.updatedAt = now;
  if (!this.createdAt) {
    this.createdAt = now;
  }
  next();
});

module.exports = mongoose.model("Cache", cacheSchema);
