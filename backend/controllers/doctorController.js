import doctorModel from "../models/doctorModel.js";
import appointmentsModel from "../models/appointmentModel.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const changeAvailability = async (req, res) => {
    try {
        const { docId } = req.body;
        const docData = await doctorModel.findById(docId);
        await doctorModel.findByIdAndUpdate(docId, { available: !docData.available });
        res.json({ success: true, message: "Availability Changed..." });
    } catch (err) {
        console.log(err)
        res.json({ success: false, message: err.message });
    }
}

const doctorList = async (req, res) => {
    try {
        const doctors = await doctorModel.find({}).select(['-password', '-email']);
        res.json({ success: true, doctors });
    } catch (err) {
        console.log(err)
        res.json({ success: false, message: err.message });
    }
}

const loginDoctor = async (req, res) => {
    try {
        const { email, password } = req.body;
        const doctor = await doctorModel.findOne({ email });

        if (!doctor) {
            return res.json({ success: false, messgae: "Invalid Email...." });
        }

        const isMatch = await bcrypt.compare(password, doctor.password);

        if (isMatch) {
            const token = jwt.sign({ id: doctor._id }, process.env.JWT_SECRET);
            res.json({ success: true, token });
        } else {
            return res.json({ success: false, messgae: "Invalid Password...." });
        }
    } catch (err) {
        console.log(err)
        res.json({ success: false, message: err.message });
    }
}

// API To get doctor Appointments for doctor for doctor panel

const appointmentsDoctor = async (req, res) => {
    try {
        const docId = req.docId;
        const appointments = await appointmentsModel.find({ docId });
        res.json({success: true, appointments});
    } catch (err) {
        console.log(err)
        res.json({ success: false, message: err.message });
    }
}

export { changeAvailability, doctorList, loginDoctor, appointmentsDoctor };