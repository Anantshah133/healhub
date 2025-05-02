import validator from 'validator';
import bycrypt from 'bcrypt';
import { v2 as cloudinary } from 'cloudinary';
import jwt from 'jsonwebtoken';
import doctorModel from '../models/doctorModel.js'

// API for adding a new Doctor
const addDoctor = async (req, res) => {
    try {
        const { name, email, password, speciality, degree, experience, about, fees, address } = req.body;
        const imageFile = req.file;
        
        if(!name || !email || !password || !speciality || !degree || !experience || !about || !fees || !address){
            return res.json({
                success: false, message: "Something is missing....",
            })
        }

        // validationg email format
        if(!validator.isEmail(email)){
            return res.json({
                success: false, message: "Please Enter a valid email.....",
            })
        }

        // validating strong password
        if(password.length < 8){
            return res.json({
                success: false, message: "Please Enter a strong password.....",
            })
        }

        // hashing doctor passowrd
        const salt = await bycrypt.genSalt(10);
        const hashedPassword = await bycrypt.hash(password, salt)

        // upload Image to cloudinary
        const imageUpload = await cloudinary.uploader.upload(imageFile.path, {resource_type: 'image'});
        const imageUrl = imageUpload.secure_url;

        const doctorData = {
            name,
            email,
            image: imageUrl,
            password: hashedPassword, 
            speciality, 
            degree, 
            experience, 
            about, 
            fees, 
            address: JSON.parse(address), 
            date: Date.now()
        }

        const newDoctor = new doctorModel(doctorData);
        await newDoctor.save();

        res.json({success: true, message: "Doctor added succesfully...."});

        console.log({ name, email, password, speciality, degree, experience, about, fees, address });
    } catch (err) {
        console.log(err);
        res.json({success: false, message: err.message});
    }
}

// API for the admin login

const loginAdmin = async (req, res) => {
    try {
        const {email, password} = req.body;

        if(email == process.env.ADMIN_EMAIL && password == process.env.ADMIN_PASSWORD){
            const token = jwt.sign(email + password, process.env.JWT_SECRET);
            res.json({success: true, token});
        } else {
            res.json({success: false, message: "Invalid Username or Password...."});
        }
    } catch (err) {
        console.log(err);
        res.json({success: false, message: err.message});
    }
}

// API to get All doctors list from Database
const allDoctors = async (req, res) => {
    try {
        const doctors = await doctorModel.find({}).select('-password');
        res.json({ success: true, doctors });
    } catch (err) {
        console.log(err)
        res.json({success: false, message: err.message});
    }
}

export { addDoctor, loginAdmin, allDoctors };