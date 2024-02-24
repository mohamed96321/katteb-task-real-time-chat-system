import { connect } from '@/dbConfig/dbConfig';
import { NextApiRequest, NextApiResponse } from 'next';
import Message from '@/models/messageModel';

connect();

export async function GET(req: NextApiRequest, res: NextApiResponse) {
  try {
    const messages = await Message.find({}).sort({ createdAt: 'asc' });
    return res.status(200).json(messages);
  } catch (error) {
    console.log('Error getting messages', error);
    return res.status(500).json({ error: 'Error getting messages' });
  }
}

// Add a new message to the database
export async function POST(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { sender, receiver, message } = req.body;
    if (!sender || !receiver || !message) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    const newMessage = new Message({ sender, receiver, message });
    await newMessage.save();
    return res.status(201).json(newMessage);
  } catch (error) {
    console.log('Error creating new message', error);
    return res.status(500).json({ error: 'Error creating new message' });
  }
}
