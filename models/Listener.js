const mongoose = require('mongoose')


const ListenerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    createdAt:{
        type: Date,
        default: Date.now
    },
    notify:{
        type: Array,
        detault: []
    }
})

module.exports = mongoose.model('Listener',ListenerSchema)