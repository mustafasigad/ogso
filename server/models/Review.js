const mongoose=require("mongoose");
module.exports=mongoose.model("Review",new mongoose.Schema({
  business:{type:mongoose.Schema.Types.ObjectId,ref:"Business",required:true},
  guestName:{type:String,default:"Guest"},
  rating:{type:Number,required:true,min:1,max:5},
  text:{type:String,required:true},
  language:{type:String,default:"en"},
  approved:{type:Boolean,default:false},
  verified:{type:Boolean,default:false},
},{timestamps:true}));