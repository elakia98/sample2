const express = require('express')
const router = express.Router();
const bcrypt = require('bcryptjs') //password hasing library
const jwt = require('jsonwebtoken') //for allowing authentication
const {check,validationResult} = require('express-validator')
const facultyModel = require("../models/faculty.model");
const subjectModel = require('../models/subject.model');

var jwtSecret = "mysecrettoken"

router.post('/login',[
    check("registrationNumber","Please enter a valid email").not().isEmpty(),
    check("password","Password is required").exists(),

],
async(req,res)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
    }
    const  {registrationNumber,password} = req.body;
    try{
        //see if user exist
        let user = await facultyModel.findOne({registrationNumber});
        if(!user){
           return res.status(400).json({errors:[{msg:"Invalid credentials"}]})
        }
        const isMatch = await bcrypt.compare(password,user.password);
        if(!isMatch){
            return res.status(400).json({errors:[{msg:"Invalid credentials"}]})

        }
        //Return json web token
        const payload = {
            
                id: user.id,user
            
        };
        jwt.sign(payload,jwtSecret,{expiresIn:"5 days"},(err,token)=>{
            if(err) throw err;
            res.json({token});
        });
    }catch(err){
        console.error(err.message);
        res.status(500).send("Internal Server error");
    }
}
)

//get all subjects
router.post('/getSubjects',async(req,res)=>{
    try {
        const allSubjects = await subjectModel.find({})
        if (!allSubjects) {
            return res.status(404).json({ message: "You havent registered any subject yet." })
        }
        res.status(200).json({ allSubjects })
    }
    catch (err) {
        res.status(400).json({ message: `error in getting all Subjects", ${err.message}` })
    }
})
module.exports = router;