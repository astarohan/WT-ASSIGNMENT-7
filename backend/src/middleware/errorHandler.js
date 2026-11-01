module.exports=(err,req,res,next)=>{
 console.error(err);
 if(err.code===11000){const field=Object.keys(err.keyValue||{})[0]||'field';return res.status(409).json({success:false,message:`${field} already exists`});}
 if(err.name==='ValidationError'||err.name==='CastError')return res.status(400).json({success:false,message:err.message});
 res.status(500).json({success:false,message:'Internal server error'});
};
