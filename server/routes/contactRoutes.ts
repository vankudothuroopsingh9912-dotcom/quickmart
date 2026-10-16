import { Router } from 'express';
import { db } from '../db/database';
import { ContactMessage } from '../../src/types';

export const contactRouter = Router();

contactRouter.post('/', (req, res) => {
  const { name, email, subject, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ success: false, message: 'Please provide name, email, and message.' });
  }

  const newMessage: ContactMessage = {
    id: `msg-${Date.now()}`,
    name: name.trim(),
    email: email.trim(),
    subject: subject ? subject.trim() : 'General Inquiry',
    message: message.trim(),
    createdAt: new Date().toISOString()
  };

  db.messages.push(newMessage);

  return res.json({
    success: true,
    message: `Thank you, ${name}! Your message has been received. Our customer support team will reply to ${email} within 24 hours.`
  });
});
