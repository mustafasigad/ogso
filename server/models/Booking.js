const mongoose=require("mongoose");
module.exports=mongoose.model("Booking",new mongoose.Schema({
  ref:{type:String,default:""},
  businessId:{type:String,default:""},
  hotelName:{type:String,default:""},
  hotelPhone:{type:String,default:""},
  roomType:{type:String,default:""},
  roomName:{type:String,default:""},
  pricePerNight:{type:Number,default:0},
  totalPrice:{type:Number,default:0},
  currency:{type:String,default:"ETB"},
  checkIn:{type:String,default:""},
  checkOut:{type:String,default:""},
  nights:{type:Number,default:1},
  guests:{type:Number,default:2},
  guestName:{type:String,default:""},
  guestPhone:{type:String,default:""},
  notes:{type:String,default:""},
  status:{type:String,default:"pending"},
  paymentMethod:{type:String,default:"cash"},
  whatsappSent:{type:Boolean,default:false}
},{timestamps:true}));