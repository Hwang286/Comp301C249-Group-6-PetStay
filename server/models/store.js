let mongoose = require('mongoose');
const User = require('./user');

let storeModel = mongoose.Schema({
    storeName: String,
    owner: String,
    //Foreign Key : One user can own many stores
    ownerId:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
            required:"Owner id is required"
        }
    ],
    type: String,
    location: String,
    about: String,
},{
    timestamps:true
}
,{
    collection:"stores"
})

module.exports = mongoose.model('Store', storeModel);