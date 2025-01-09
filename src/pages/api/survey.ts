// pages/api/survey.ts  

import { supabase } from '../../../lib/supabaseClient'; // Adjust the import path to your Supabase client  



export default async function handler(req, res) {  
    if (req.method === 'POST') {  
        const { ip_addres, rating, question1, question2, question3 } = req.body;  

        // Validate the input  
        if (!ip_addres || !rating || !question1 || !question2 || !question3) {  
            return res.status(400).json({ error: "All fields are required." });  
        }  

        // Insert the survey response into the database  
        const { data, error } = await supabase
            .schema('siap_skpd')  
            .from('survey')  
            .insert([  
                {  
                    ip_addres,  
                    rating,  
                    question_1: question1,  
                    question_2: question2,  
                    question_3: question3,  
                },  
            ]);  

      // Handle any errors during the insert  
if (error) {  
    console.error("Error inserting survey response:", error);  
    return res.status(500).json({ error: error.message || "Failed to insert data." });  
}



        // Respond with success  
        return res.status(200).json({ message: 'Survey submitted successfully!', data });  
    } else {  
        res.setHeader('Allow', ['POST']);  
        return res.status(405).end(`Method ${req.method} Not Allowed`);  
    }  
}