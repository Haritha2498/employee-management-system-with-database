const {Schema}=require('mongoose');
const {model}=require('mongoose');

const empdbschema=new Schema({
    id:{type:String,required:true},
    name:{type:String,required:true},
    role:{type:String,required:true}
})


const empdbmodel=model("empdetails",empdbschema);
module.exports=empdbmodel;