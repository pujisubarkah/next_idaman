import axios from 'axios';  
import type { NextApiRequest, NextApiResponse } from 'next';  
  
export default async function handler(req: NextApiRequest, res: NextApiResponse) {  
  const { filePath } = req.query;  
  
  const username = process.env.BASIC_AUTH_USERNAME || 'kepegawaian';  
  const password = process.env.BASIC_AUTH_PASSWORD || 'Sdmmaju2023!';  
  
  if (!filePath || typeof filePath !== 'string') {  
    return res.status(400).json({ error: 'File path is required and must be a valid string.' });  
  }  
  
  try {  
    const fileUrl = `https://idaman.lan.go.id/uploads/file/${filePath}`;  
    console.log(`Fetching file from: ${fileUrl}`);  
  
    const response = await axios.get(fileUrl, {  
      auth: {  
        username,  
        password,  
      },  
      responseType: 'arraybuffer',  
    });  
  
    // Check if the response contains data  
    if (!response.data) {  
      throw new Error('No data received from the file URL.');  
    }  
  
    res.setHeader('Content-Type', 'application/pdf');  
    res.setHeader('Content-Disposition', 'inline; filename="' + filePath.split('/').pop() + '"');  
    res.status(200).send(response.data);  
  } catch (error) {  
    console.error("Error fetching file:", error.response ? error.response.data : error.message);  
  
    const statusCode = error.response?.status || 500;  
    const errorMessage = error.response?.data || 'Failed to fetch the file.';  
    res.status(statusCode).json({ error: errorMessage });  
  }  
}  
