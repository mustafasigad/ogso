const mongoose=require("mongoose");
const roomSchema=new mongoose.Schema({
  type:{type:String,default:"standard"},
  name:{type:String,default:""},
  price:{type:Number,default:0},
  beds:{type:String,default:""},
  popular:{type:Boolean,default:false},
  photo:{type:String,default:""},
});
const s=new mongoose.Schema({
  name:{type:String,required:true},
  category:{type:String,required:true},
  city:{type:String,required:true},
  territory:{type:String,default:"ET-SO"},
  address:{type:String,default:""},
  phone:{type:String,required:true},
  whatsapp:{type:String,default:""},
  email:{type:String,default:""},
  description:{type:String,default:""},
  photos:[String],
  tags:[String],
  amenities:[String],
  price:{type:Number,default:0},
  rooms:[roomSchema],
  verified:{type:Boolean,default:false},
  featured:{type:Boolean,default:false},
  plan:{type:String,default:"free"},
  views:{type:Number,default:0},
  rating:{type:Number,default:0},
  reviewCount:{type:Number,default:0},
  active:{type:Boolean,default:true}
},{timestamps:true});
s.index({name:"text",city:"text"});
module.exports=mongoose.model("Business",s);