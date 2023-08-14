let mongoose = require("mongoose");
let passportLocalMongoose = require("passport-local-mongoose");

let userProfile = mongoose.Schema(
  {
    Name: {
      type: String,
      default: "",
      trim: true,
      
    },


    petName: {
      type: String,
      default: "",
      trim: true,
      
    },
    aboutPet: {
      type: String,
      default: "",
      trim: true,
      
    },
    weight: {
        type: Number,
        default: "",
        trim: true,
        
      },
    phoneNumber: {
        type: Number,
        default: "",
        trim: true,
        
    },

  },
  {
    collection: "userProfile",
  }
);

// configure options for User Model


module.exports.userProfile = mongoose.model("userProfile", userProfile);