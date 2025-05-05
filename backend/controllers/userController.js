import validator from 'validator';
import bcrypt from 'bcrypt';
import userModel from '../models/userModel.js';
import jwt from 'jsonwebtoken'
import { v2 as cloudinary } from 'cloudinary'
import doctorModel from '../models/doctorModel.js';
import appointmentModel from '../models/appointmentModel.js';

const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.json({ success: false, message: "Some Details are missing or Invalid..." });
        }

        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Enter a valid Email ID...." });
        }

        if (password.length < 8) {
            return res.json({ success: false, message: "Enter a Strong password...." });
        }

        // Hashing User Password.....
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const userData = {
            name,
            email,
            password: hashedPassword,
        }

        const newUser = new userModel(userData);
        const user = await newUser.save();

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
        res.json({ success: true, token });

    } catch (err) {
        console.log(err)
        if (err.code == 11000) {
            return res.json({ success: false, message: "Email ID already exists...." });
        }
        // res.json({ success: false, message: err.message });
    }
}

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.json({ success: false, message: "User doesn't exist with this email Id..." });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (isMatch) {
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
            res.json({ success: true, token });
        } else {
            res.json({ success: false, message: "Invalid Password....." });
        }
    } catch (err) {
        console.log(err);
        res.json({ success: false, message: err.message });
    }
}

// API to get user Profile Data 
const getProfile = async (req, res) => {
    try {
        const userId = req.userId;
        const userData = await userModel.findById(userId).select('-password');

        res.json({ success: true, userData });
    } catch (err) {
        console.log(err);
        res.json({ success: false, message: err.message });
    }
}

// API to update the user Detail....

const updateProfile = async (req, res) => {
    try {
        const { name, phone, address, dob, gender } = req.body;
        const userId = req.userId;
        const imageFile = req.file;

        if (!name || !phone || !dob || !gender) {
            return res.json({ success: false, message: "Some details are missing...." });
        }

        await userModel.findByIdAndUpdate(userId, {
            name, phone, dob, gender, address: JSON.parse(address)
        })

        if (imageFile) {
            // Image Upload to cloudinary
            const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: 'image' })
            const imageURL = imageUpload.secure_url;
            await userModel.findByIdAndUpdate(userId, { image: imageURL });
        }

        res.json({ success: true, message: "Profile Updated....." });

    } catch (err) {
        console.log(err);
        res.json({ success: false, message: err.message });
    }
}

// API to book account

const bookAppointment = async (req, res) => {
    try {
        const userId = req.userId;
        const { docId, slotDate, slotTime } = req.body;
        
        if (!docId || !slotDate || !slotTime) {
            return res.json({ success: false, message: "Missing appointment details." });
        }
        
        const docData = await doctorModel.findById(docId).select('-password');
        
        if (!docData) {
            return res.json({ success: false, message: "Doctor not found." });
        }
        
        if (!docData.available) {
            return res.json({ success: false, message: "Doctor Not Available." });
        }
        
        // Create a copy of slots_booked to avoid direct mutation
        let slots_booked = {...docData.slots_booked};
        
        // Check if slot is already booked
        if (slots_booked[slotDate] && slots_booked[slotDate].includes(slotTime)) {
            return res.json({ success: false, message: "This time slot is already booked." });
        }
        
        // Add the new slot to the booked slots
        if (slots_booked[slotDate]) {
            slots_booked[slotDate].push(slotTime);
        } else {
            slots_booked[slotDate] = [slotTime];
        }
        
        const userData = await userModel.findById(userId).select('-password');
        
        if (!userData) {
            return res.json({ success: false, message: "User not found." });
        }
        
        // Create a copy of docData to avoid sending slots_booked to the appointment
        const docDataForAppointment = {
            _id: docData._id,
            name: docData.name,
            image: docData.image,
            speciality: docData.speciality,
            fees: docData.fees,
            degree: docData.degree,
            experience: docData.experience,
            address: docData.address
        };
        
        const appointmentData = {
            userId,
            docId,
            userData,
            docData: docDataForAppointment,
            amount: docData.fees,
            slotTime,
            slotDate,
            date: Date.now(),
        };
        
        const newAppointment = new appointmentModel(appointmentData);
        await newAppointment.save();
        
        // Update doctor's booked slots
        await doctorModel.findByIdAndUpdate(docId, { slots_booked });
        
        res.json({ success: true, message: "Appointment Booked Successfully." });
    } catch (err) {
        console.log(err);
        res.json({ success: false, message: err.message || "Error booking appointment" });
    }
};


// API to get User Appointment

const listAppointment = async (req, res) => {
    try {
        const userId = req.userId;
        const appointments = await appointmentModel.find({ userId });

        res.json({ success: true, appointments });
    } catch (err) {
        console.log(err);
        res.json({ success: false, message: err.message });
    }
}

// API to cancel user Appointment
const cancelAppointment = async (req, res) => {
    try {
        const userId = req.userId;
        const { appointmentID } = req.body;
        const appointmentData = await appointmentModel.findById(appointmentID);
        
        if (!appointmentData) {
            return res.json({ success: false, message: "Appointment not found." });
        }
        
        if (appointmentData.userId.toString() !== userId.toString()) {
            return res.json({ success: false, message: "Unauthorized access." });
        }
        
        await appointmentModel.findByIdAndUpdate(appointmentID, { cancelled: true });
        
        const { docId, slotDate, slotTime } = appointmentData;
        const doctorData = await doctorModel.findById(docId);
        
        if (doctorData && doctorData.slots_booked && doctorData.slots_booked[slotDate]) {
            let slots_booked = {...doctorData.slots_booked};
            slots_booked[slotDate] = slots_booked[slotDate].filter(time => time !== slotTime);
            
            // If the array is empty, clean it up
            if (slots_booked[slotDate].length === 0) {
                delete slots_booked[slotDate];
            }
            
            await doctorModel.findByIdAndUpdate(docId, { slots_booked });
        }
        
        res.json({ success: true, message: 'Appointment Cancelled Successfully.' });
    } catch (err) {
        console.log(err);
        res.json({ success: false, message: err.message || "Error cancelling appointment" });
    }
};


export { registerUser, loginUser, getProfile, updateProfile, bookAppointment, listAppointment, cancelAppointment };