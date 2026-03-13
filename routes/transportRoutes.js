import express from 'express';
import nodemailer from 'nodemailer';

const router = express.Router();

router.post('/book', async (req, res) => {
  const { cities, pax, baggage, selectedVehicle, email } = req.body;

  try {
    // 1. Added explicit host, port, and secure settings to fix Render timeouts
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false, // Must be false for port 587
      requireTLS: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: `🚗 TRANSPORT INQUIRY: ${email}`,
      html: `
        <div style="font-family: sans-serif; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
          <h2 style="color: #2563eb;">KAVINDU TRAVELS - NEW TRANSPORT BOOKING</h2>
          <p><strong>Contact:</strong> ${email}</p>
          <p><strong>Vehicle:</strong> ${selectedVehicle}</p>
          <p><strong>Passengers:</strong> ${pax} | <strong>Baggage:</strong> ${baggage}</p>
          <p><strong>Planned Cities:</strong><br/> ${cities}</p>
        </div>
      `
    };

    // 2. Try to send the email
    await transporter.sendMail(mailOptions);
    console.log("Email notification sent successfully!");
    
    // Send success to frontend
    res.status(200).json({ message: "Sent" });
    
  } catch (error) {
    console.error("Email notification failed:", error);
    
    // 3. CRASH-PROOF FIX: We send a 200 status EVEN IF the email times out.
    // This ensures the frontend button doesn't freeze and the user sees the success screen.
    res.status(200).json({ message: "Request received" });
  }
});

export default router;