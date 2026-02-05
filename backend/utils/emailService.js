import nodemailer from "nodemailer";

export const sendOTPEmail = async (toEmail, otp) => {

  try {

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: toEmail,
      subject: "Your Secure Backup OTP",
      text: `Your OTP is: ${otp}`
    });

    console.log("OTP email sent successfully");

  } catch (error) {

    console.log("Email sending failed:", error);

  }
};