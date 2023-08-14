let mongoose = require('mongoose');


let productModel = mongoose.Schema({
    productName: String,
    type: String,
    about: String,
    price: Number,
    condition: String,
    storeId:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Store",
            required:"Store id is required"
        }
    ]
},{
    timestamps:true
},{
    collection:"products"
})

module.exports = mongoose.model('Product', productModel);