const mongoose = require('mongoose');

const OtpSchema = new mongoose.Schema({
    email: String,
    code: String,
    expireIn: Number,
}, { collection: 'otps' });

module.exports = mongoose.model('Otp', OtpSchema);
