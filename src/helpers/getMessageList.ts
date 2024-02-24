import { NextApiRequest, NextApiResponse } from 'next';
import Message from '@/models/messageModel';

export default async function getMessageList(request: NextApiRequest) {
  const messages = await Message.find({}).sort({ createdAt: 'asc' }); // sort by date ascending
  return messages;
}

// export a handler to handle the request
export const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const messages = await getMessageList(req);
    if (!messages || !Array.isArray(messages)) {
      return res.status(500).json({ error: 'Error getting messages' });
    }
    return res.status(200).json(messages);
  } catch (error) {
    console.log('ERROR in /api/users/chat', error);
    return res.status(400).json({
      error: 'Error getting messages',
    });
  }
};
