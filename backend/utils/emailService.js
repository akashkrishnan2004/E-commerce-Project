
import nodemailer from "nodemailer";

// Function to generate a 6-digit OTP
export const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Function to send OTP email
export const sendEmailOTP = async (email, otp) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true, // Use true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"E-Commerce App" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Your OTP for Account Verification",
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #333;">
          <h2>Your OTP Code</h2>
          <p>Your OTP code is: <strong style="font-size: 18px; color: #d32f2f;">${otp}</strong></p>
          <p>This OTP will expire in <strong>10 minutes</strong>. Please do not share it with anyone.</p>
          <br>
          <p>Thank you,<br> Team <strong> Phonix</strong></p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ OTP sent successfully to ${email}`);
  } catch (error) {
    console.error("❌ Error sending OTP:", error.message);
    throw new Error("Failed to send OTP. Please check your email settings.");
  }
};
