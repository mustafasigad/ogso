const mongoose=require('mongoose');
module.exports=mongoose.model('Review',new mongoose.Schema({
  business:{type:mongoose.Schema.Types.ObjectId,ref:'Business',required:true},
  user:{type:mongoose.Schema.Types.ObjectId,ref:'User'},
  guestName:{type:String,default:'Guest'},
  rating:{type:Number,required:true,min:1,max:5},
  text:{type:String,required:true},
  language:{type:String,default:'so'},
  verified:{type:Boolean,default:false}
},{timestamps:true}));