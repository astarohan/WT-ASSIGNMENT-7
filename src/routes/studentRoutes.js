const express=require('express');
const {body,validationResult}=require('express-validator');
const c=require('../controllers/studentController');
const router=express.Router();
const rules=[
 body('name').trim().isLength({min:2,max:60}).withMessage('Name must contain 2 to 60 characters.'),
 body('email').trim().isEmail().withMessage('Enter a valid email address.'),
 body('prn').trim().matches(/^\\d{12}$/).withMessage('PRN must contain exactly 12 digits.'),
 body('mobile').trim().matches(/^[6-9]\\d{9}$/).withMessage('Mobile must be 10 digits and start with 6–9.'),
 body('course').isIn(['B.Tech','M.Tech','BCA','MCA']).withMessage('Select a valid course.'),
 body('year').optional().isInt({min:1,max:5}).withMessage('Year must be between 1 and 5.')
];
function validate(req,res,next){const e=validationResult(req);if(!e.isEmpty())return res.status(400).json({success:false,message:'Validation failed',errors:e.array().map(x=>x.msg)});next();}
router.post('/',rules,validate,c.createStudent);
router.get('/',c.getAllStudents);
router.get('/:id',c.getStudentById);
router.put('/:id',rules,validate,c.updateStudent);
router.delete('/:id',c.deleteStudent);
module.exports=router;
