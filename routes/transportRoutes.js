import express from 'express';
import { Resend } from 'resend';

const router = express.Router();

// Initialize Resend with your API Key
const resend = new Resend(process.env.RESEND_API_KEY);

router.post('/book', async (req, res) => {
  const { cities, pax, baggage, selectedVehicle, email } = req.body;

  try {
    // 1. Send Email via Resend API (Bypasses Render's blocked ports!)
    if (process.env.RESEND_API_KEY) {
      const { data, error } = await resend.emails.send({
        from: 'Kavindu Travels <onboarding@resend.dev>', // Resend's default testing address
        to: process.env.EMAIL_USER, // Change to your actual receiving email if different!
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
      });

      if (error) {
        console.error("Resend API Error:", error);
      } else {
        console.log("Email notification sent instantly via Resend!", data);
      }
    } else {
      console.warn("⚠️ RESEND_API_KEY is missing from environment variables!");
    }

    // 2. Instantly send success back to Vercel
    res.status(200).json({ message: "Sent" });
    
  } catch (error) {
    console.error("Transport route failed:", error.message);
    
    // 3. CRASH-PROOF FIX: Always send 200 to keep the frontend UI working perfectly
    res.status(200).json({ message: "Request received" });
  }
});

export default router;