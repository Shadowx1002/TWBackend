import express from 'express';
import { Resend } from 'resend';
import Planner from '../models/Planner.js';

const router = express.Router();

// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY);

// 1. GET ALL INQUIRIES
router.get('/all', async (req, res) => {
  try {
    const inquiries = await Planner.find().sort({ createdAt: -1 });
    res.status(200).json(inquiries);
  } catch (error) {
    res.status(500).json({ message: "Error fetching inquiries", error: error.message });
  }
});

// 2. CREATE NEW INQUIRY (Using Resend)
router.post('/send-quote', async (req, res) => {
  const p = req.body;

  try {
    // A. Save to MongoDB
    const newInquiry = new Planner(p);
    await newInquiry.save();

    // B. Send Email via Resend
    if (process.env.RESEND_API_KEY) {
      const { data, error } = await resend.emails.send({
        from: 'Kavindu Travels <onboarding@resend.dev>',
        to: process.env.EMAIL_USER, 
        subject: `🌟 New Tour Inquiry: ${p.fullName} from ${p.country}`,
        html: `
          <div style="font-family: sans-serif; padding: 20px; color: #333; border: 1px solid #eee; border-radius: 10px;">
            <h2 style="color: #2563eb;">KAVINDU TRAVELS - NEW QUOTATION REQUEST</h2>
            <hr />
            <p><strong>Customer:</strong> ${p.fullName}</p>
            <p><strong>Country:</strong> ${p.country}</p>
            <p><strong>Email:</strong> ${p.email}</p>
            <p><strong>WhatsApp:</strong> ${p.whatsapp || 'N/A'}</p>
            <br />
            <h3 style="color: #2563eb;">TOUR DETAILS</h3>
            <p><strong>Arrival:</strong> ${p.arrivalDate} | <strong>Departure:</strong> ${p.departureDate}</p>
            <p><strong>Group Size:</strong> ${p.pax} Pax | <strong>Rooms Needed:</strong> ${p.rooms}</p>
            <p><strong>Hotel Categories:</strong> ${p.hotelCategories?.join(', ') || 'Any'}</p>
            <p><strong>Meal Plan:</strong> ${p.mealPlans?.join(', ') || 'Any'}</p>
            <br />
            <h3 style="color: #2563eb;">PREFERENCES</h3>
            <p><strong>Interests:</strong> ${p.interests?.join(', ') || 'General'}</p>
            <p><strong>Target Budget:</strong> ${p.budget || 'Open'}</p>
            <p><strong>Special Requirements:</strong> ${p.otherRequirements || 'None'}</p>
          </div>
        `
      });

      if (error) {
        console.error("Resend API Error (Planner):", error);
      } else {
        console.log("Planner email sent instantly via Resend!", data);
      }
    }

    // C. Send success back to frontend
    res.status(201).json({ message: "Inquiry saved successfully!" });
    
  } catch (error) {
    console.error("Planner Route Error:", error);
    // Crash-proof: Send 200 so UI doesn't break
    res.status(200).json({ message: "Database Error handled cleanly", error: error.message });
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