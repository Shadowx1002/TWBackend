import express from 'express';
import nodemailer from 'nodemailer';
import Planner from '../models/Planner.js';

const router = express.Router();

// 1. GET ALL INQUIRIES
router.get('/all', async (req, res) => {
  try {
    const inquiries = await Planner.find().sort({ createdAt: -1 });
    res.status(200).json(inquiries);
  } catch (error) {
    res.status(500).json({ message: "Error fetching inquiries", error: error.message });
  }
});

// 2. CREATE NEW INQUIRY (Crash-Proof Version)
router.post('/send-quote', async (req, res) => {
  const p = req.body;

  try {
    // A. Save to MongoDB (This happens first!)
    const newInquiry = new Planner(p);
    await newInquiry.save();

    // B. Attempt to send email ONLY if variables exist
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      try {
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
          }
        });

        const mailOptions = {
          from: process.env.EMAIL_USER,
          to: process.env.EMAIL_USER, // Sends to yourself
          subject: `🌟 New Inquiry: ${p.fullName} from ${p.country}`,
          html: `
            <div style="font-family: sans-serif; padding: 20px; color: #333; border: 1px solid #eee; border-radius: 10px;">
              <h2 style="color: #2563eb;">KAVINDU TRAVELS - NEW QUOTATION REQUEST</h2>
              <hr />
              <p><strong>Customer:</strong> ${p.fullName}</p>
              <p><strong>Email:</strong> ${p.email}</p>
              <p><strong>WhatsApp:</strong> ${p.whatsapp || 'N/A'}</p>
              <p><strong>Target Budget:</strong> ${p.budget || 'Open'}</p>
            </div>
          `
        };

        await transporter.sendMail(mailOptions);
        console.log("Email notification sent!");
      } catch (emailError) {
        // If email fails, we log it, BUT WE DON'T CRASH THE APP!
        console.error("Database saved, but Email failed:", emailError.message);
      }
    } else {
      console.warn("EMAIL_USER or EMAIL_PASS not found in .env. Skipping email.");
    }

    // C. Always send success to the frontend if database save worked
    res.status(201).json({ message: "Inquiry saved successfully!" });
    
  } catch (error) {
    console.error("Planner Error:", error);
    res.status(500).json({ message: "Database Error", error: error.message });
  }
});

// 3. UPDATE INQUIRY STATUS
router.put('/:id', async (req, res) => {
  try {
    const { status } = req.body;
    const updatedInquiry = await Planner.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!updatedInquiry) return res.status(404).json({ message: "Inquiry not found" });
    res.status(200).json({ message: `Status updated to ${status}`, data: updatedInquiry });
  } catch (error) {
    res.status(500).json({ message: "Error updating status", error: error.message });
  }
});

// 4. DELETE INQUIRY
router.delete('/:id', async (req, res) => {
  try {
    const deletedInquiry = await Planner.findByIdAndDelete(req.params.id);
    if (!deletedInquiry) return res.status(404).json({ message: "Inquiry not found" });
    res.status(200).json({ message: "Inquiry deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting inquiry", error: error.message });
  }
});

export default router;