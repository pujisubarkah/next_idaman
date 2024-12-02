import { supabase } from '../../../../lib/supabaseClient';

export default async function handler(req, res) {
    if (req.method === 'GET') {
        const { data, error } = await supabase
            .schema('siap_skpd')
            .from('m_spg_referensi_jfu')
            .select('*');

        if (error) {
            return res.status(500).json({ error: error.message });
        }

        return res.status(200).json(data);
    } else if (req.method === 'POST') {
        const { body } = req;
        const { data, error } = await supabase
            .from('m_spg_referensi_jfu')
            .insert([body]);

        if (error) {
            return res.status(500).json({ error: error.message });
        }

        return res.status(201).json(data);
    } else {
        res.setHeader('Allow', ['GET', 'POST']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}