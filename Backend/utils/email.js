import nodemailer from "nodemailer";

// Configure email transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Generate OTP
export const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send OTP via email
export const sendOTPEmail = async (email, otp, otpType) => {
  try {
    const subject = otpType === "login" ? "Your Login OTP" : "Password Reset OTP";
    const message =
      otpType === "login"
        ? `Your OTP for login is: ${otp}. This OTP will expire in 10 minutes.`
        : `Your OTP for password reset is: ${otp}. This OTP will expire in 10 minutes.`;

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f5f5f5;">
          <div style="background-color: white; padding: 30px; border-radius: 8px; max-width: 500px; margin: 0 auto;">
            <h2 style="color: #333; text-align: center;">Easy Travel OTP Verification</h2>
            <p style="color: #666; font-size: 14px;">Hi there,</p>
            <p style="color: #666; font-size: 14px;">${message}</p>
            <div style="background-color: #f9f9f9; padding: 20px; text-align: center; border-radius: 5px; margin: 20px 0;">
              <p style="font-size: 32px; color: #007bff; font-weight: bold; letter-spacing: 5px; margin: 0;">${otp}</p>
            </div>
            <p style="color: #999; font-size: 12px; text-align: center;">Please do not share this OTP with anyone. This OTP is valid for 10 minutes.</p>
          </div>
        </div>
      `,
    });

    return true;
  } catch (error) {
    console.error("Error sending OTP email:", error);
    return false;
  }
};
