// server/routes/reports.js
const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const axios = require('axios'); // We use axios to talk to Google's API

const dns = require('dns');
dns.setDefaultResultOrder('ipv4first');

router.post('/', async (req, res) => {
  const { firstName, lastName, email, phone, issueType, otherSpecify, details, recaptchaToken } = req.body;

  if (!recaptchaToken) {
    return res.status(400).json({ error: 'Missing reCAPTCHA token.' });
  }

  try {
    const secretKey = process.env.RECAPTCHA_SECRET_KEY;
    const verifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${recaptchaToken}`;
    
    const recaptchaResponse = await axios.post(verifyUrl);
    
    if (!recaptchaResponse.data.success) {
      return res.status(400).json({ error: 'reCAPTCHA verification failed. Please try again.' });
    }

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
      from: `"PDPA Portal" <${process.env.SMTP_USER}>`, 
      replyTo: email, 
      to: 'compliance@otp.go.th', 
      cc: process.env.SMTP_USER, 
      subject: `แจ้งเรื่องใหม่ PDPA Portal: ${issueLabel}`, 
      text: `มีการแจ้งเรื่องใหม่จากระบบ PDPA Portal\nชื่อ-นามสกุล: ${firstName} ${lastName}\nอีเมล: ${email}\nเบอร์โทรศัพท์: ${phone || '-'}\nประเภทการแจ้ง: ${issueLabel}\nรายละเอียด: ${details}`,
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
    console.error('Error in report route:', error);
    res.status(500).json({ error: 'Failed to process request.' });
  }
});

module.exports = router;