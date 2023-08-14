let mongoose = require('mongoose');

let reviewModel = mongoose.Schema({
    review: String,
    rate: Number,
    storeId: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Store",
            required: "Store id is required"
        }
    ],
    reviewerId: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: "Review id is required"
        }
    ],
    reviewerName:String
}, {
    timestamps: true
}, {
    collections: "reviews"
});
module.exports = mongoose.model("Review", reviewModel);