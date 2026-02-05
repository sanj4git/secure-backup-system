import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { sendOTPEmail } from "../utils/emailService.js";
import OTP from "../models/OTP.js";
import { generateOTP } from "../utils/otpService.js";

const registerUser = async (req, res) => {

    try {
        const { name, email, password } = req.body;

        // Check if user already exist in DB
        const userExists = await User.findOne({ email });

        if(userExists)
            return res.status(400).json({msg : "User already Exists!"});

        // Hash Password + Salt
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        
        // Create User
        const user = await User.create({
            name,
            email,
            password : hashedPassword
        });

        res.status(201).json({
            msg : "User registered successfully",
            user : {
                id : user._id,
                email : user.email,
                role : user.role
            }
        });

    } catch(error){
        res.status(500).json({msg : error.message});
    }

};

const loginUser = async (req, res) => {

    try {
        const {email, password} = req.body;

        // Find User
        const user = await User.findOne({email});
    
        if(!user)
            return res.status(400).json({msg : "Invalid email"});
    
        // Find Password
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch)
            return res.status(400).json({msg : "Invalid Password"});
        
        await OTP.deleteMany({ userId: user._id });
        
        const otp = generateOTP();
        const hashedOtp = await bcrypt.hash(otp, 10);

        // save otp in DB - expires in 5 mins
        await OTP.create({
            userId : user._id,
            otpHash : hashedOtp,
            expiresAt : new Date(Date.now() + 5 * 60 * 1000)
        });

        if (user.role === "USER") {

            await sendOTPEmail(user.email, otp);
        
        } else {
        
            console.log("OTP for testing :", otp);
        
        }
    
        res.status(200).json({
            msg : "Login Success, Enter OTP",
            user : {
                id : user._id,
                email : user.email,
                role : user.role
            }
        });

    } catch(error) {
        res.status(500).json({ msg : error.message });
    }

};

// Verify OTP, Issue JWT
export const verifyOTP = async (req, res) => {

    try {

        const { userId, otp } = req.body;

        const record = await OTP.findOne({ userId });

        if (!record)
            return res.status(400).json({ msg: "OTP not found. Please login again." });

        // Debug logs AFTER record exists
        console.log("Entered OTP from frontend:", otp);
        console.log("Type of entered OTP:", typeof otp);
        console.log("Stored hash from DB:", record.otpHash);

        const enteredOtp = String(otp).trim();

        const isValid = await bcrypt.compare(enteredOtp, record.otpHash);

        console.log("bcrypt result:", isValid);

        if(record.expiresAt < new Date())
            return res.status(400).json({msg : "OTP Expired"});

        if(!isValid)
            return res.status(400).json({msg : "Invalid OTP"});

        await OTP.deleteMany({ userId });

        const user = await User.findById(userId);

        const token = jwt.sign(
            { id : userId },
            process.env.JWT_SECRET,
            { expiresIn : "1d" }
        );

        res.json({
            msg : "OTP Verification Complete!",
            token,
            user : {
                id : user._id,
                email : user.email,
                role : user.role
            }
        });

    } catch(error) {
        console.log(error);
        res.status(500).json({msg : error.message});
    }
};

export {registerUser, loginUser};
