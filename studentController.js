const mongoose=require('mongoose');
const Student=require('../models/Student');
const wrap=fn=>(req,res,next)=>Promise.resolve(fn(req,res,next)).catch(next);
exports.createStudent=wrap(async(req,res)=>{const data=await Student.create(req.body);res.status(201).json({success:true,message:'Student created successfully',data});});
exports.getAllStudents=wrap(async(req,res)=>{
 const {search='',course='',sort='newest'}=req.query;
 const page=Math.max(parseInt(req.query.page,10)||1,1), limit=Math.min(Math.max(parseInt(req.query.limit,10)||10,1),100);
 const filter={}; if(course) filter.course=course;
 if(search.trim()) filter.$or=[{name:{$regex:search.trim(),$options:'i'}},{email:{$regex:search.trim(),$options:'i'}},{prn:{$regex:search.trim(),$options:'i'}}];
 const sorts={newest:{createdAt:-1},oldest:{createdAt:1},name_asc:{name:1},name_desc:{name:-1}};
 const [data,total]=await Promise.all([Student.find(filter).sort(sorts[sort]||sorts.newest).skip((page-1)*limit).limit(limit),Student.countDocuments(filter)]);
 res.json({success:true,count:data.length,total,page,pages:Math.ceil(total/limit),data});
});
exports.getStudentById=wrap(async(req,res)=>{if(!mongoose.isValidObjectId(req.params.id))return res.status(400).json({success:false,message:'Invalid student ID format'});const data=await Student.findById(req.params.id);if(!data)return res.status(404).json({success:false,message:'Student not found'});res.json({success:true,data});});
exports.updateStudent=wrap(async(req,res)=>{if(!mongoose.isValidObjectId(req.params.id))return res.status(400).json({success:false,message:'Invalid student ID format'});const data=await Student.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true});if(!data)return res.status(404).json({success:false,message:'Student not found'});res.json({success:true,message:'Student updated successfully',data});});
exports.deleteStudent=wrap(async(req,res)=>{if(!mongoose.isValidObjectId(req.params.id))return res.status(400).json({success:false,message:'Invalid student ID format'});const data=await Student.findByIdAndDelete(req.params.id);if(!data)return res.status(404).json({success:false,message:'Student not found'});res.json({success:true,message:'Student deleted successfully',data});});
