// server/routes/reports.js
const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');

const dns = require('dns');
dns.setDefaultResultOrder('ipv4first');

router.post('/', async (req, res) => {
  const { firstName, lastName, email, phone, issueType, otherSpecify, details } = req.body;

  try {
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true, 
      auth: {
        user: process.env.SMTP_USER, 
        pass: process.env.SMTP_PASSWORD 
      }
    });

    const issueLabel = issueType === 'other' ? `อื่นๆ (${otherSpecify})` : issueType;

    const mailOptions = {
      from: `"PDPA Portal" <no-reply@otp.go.th>`,
      to: 'compliance@otp.go.th',
      subject: `[PDPA Portal] แจ้งเรื่องใหม่: ${issueLabel}`,
      html: `
        <div style="font-family: sans-serif; color: #333;">
            <h2>มีการแจ้งเรื่องใหม่จากระบบ PDPA Portal</h2>
            <p><strong>ชื่อ-นามสกุล:</strong> ${firstName} ${lastName}</p>
            <p><strong>อีเมล:</strong> ${email}</p>
            <p><strong>เบอร์โทรศัพท์:</strong> ${phone || '-'}</p>
            <p><strong>ประเภทการแจ้ง:</strong> ${issueLabel}</p>
            <hr />
            <p><strong>รายละเอียด:</strong></p>
            <p style="white-space: pre-wrap; background-color: #f9f9f9; padding: 15px; border-left: 4px solid #1e3a8a;">${details}</p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Report sent successfully' });

  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ error: 'Failed to send report email' });
  }
});

module.exports = router;