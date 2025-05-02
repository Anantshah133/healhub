import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        default: "https://img.freepik.com/premium-vector/user-profile-icon-flat-style-member-avatar-vector-illustration-isolated-background-human-permission-sign-business-concept_157943-15752.jpg?semt=ais_hybrid&w=740",
    },
    address: {
        type: Object,
        default: {
            line1: '',
            line2: '',
        },
    },
    gender: {
        type: String,
        default: "Not Selected",
    },
    dob: {
        type: String,
        default: "Not Selected",
    },
    phone: {
        type: String,
        default: "0000000000",
    },
})

const userModel = mongoose.models.user || mongoose.model('user', userSchema);

export default userModel;