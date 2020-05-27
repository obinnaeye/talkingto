let mongoose = require('mongoose')

let messageSchema = new mongoose.Schema({
  mid: String,
  message: Object,
  senderId: String,
  type: String,
  createdAt: Date,
  updatedAt: Date
})

messageSchema.pre('save', function (next) {
    let now = Date.now()
        
    this.updatedAt = now
    if (!this.createdAt) {
        this.createdAt = now
    }
    next()    
})

module.exports = mongoose.model('Message', messageSchema)
