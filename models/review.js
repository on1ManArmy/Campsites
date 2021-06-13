const mongoose = require('mongoose')
const Schema = mongoose.Schema;

// One to Bajillions 
const reviewSchema = new Schema({
    body: String,
    rating: Number
})


module.exports = mongoose.model("Review", reviewSchema);