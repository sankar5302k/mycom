import nodemailer from "nodemailer";

let otpStore = {}; // Temporary storage for OTPs. In production, use a database.

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com", // Use SMTP directly instead of service: "gmail"
  port: 587, // TLS port for secure email sending
  secure: false, // Must be false when using TLS on port 587
  auth: {
    user: process.env.EMAIL, // Your email
    pass: process.env.EMAIL_PASSWORD, // App Password or email password
  },
  tls: {
    rejectUnauthorized: false, // ✅ Fix for self-signed certificate issue
  },
});

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { email } = req.body;

    // Validate email format
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      return res.status(400).json({ error: "Invalid email address" });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    otpStore[email] = { otp, expires: Date.now() + 5 * 60 * 1000 };

    console.log(`Generated OTP for ${email}: ${otp}`);

    // Send OTP email
    try {
      let info = await transporter.sendMail({
        from: `"Your App Name" <${process.env.EMAIL}>`, // Sender name
        to: email,
        subject: "Your OTP Code",
        text: `Your OTP code is: ${otp}`,
      });

      console.log(`OTP sent successfully: ${info.response}`);
      return res.status(200).json({ message: "OTP sent successfully" });
    } catch (error) {
      console.error("Email sending failed:", error);
      return res
        .status(500)
        .json({ error: "Failed to send OTP", details: error.message });
    }
  } else if (req.method === "PUT") {
    const { email, otp } = req.body;

    // Check if OTP exists
    if (!otpStore[email]) {
      return res.status(400).json({ error: "OTP not found for this email" });
    }

    const storedOtp = otpStore[email];

    // Check OTP expiry
    if (Date.now() > storedOtp.expires) {
      delete otpStore[email]; // Cleanup expired OTP
      return res.status(400).json({ error: "OTP expired" });
    }

    // Check if OTP matches
    if (storedOtp.otp !== otp) {
      return res.status(400).json({ error: "Invalid OTP" });
    }

    // OTP is correct, allow next step (e.g., registration)
    delete otpStore[email]; // Cleanup after success

    return res.status(200).json({ message: "OTP verified successfully" });
  } else {
    return res.status(405).json({ error: "Method not allowed" });
  }
}
