import { supabase } from '../../../../../lib/supabaseClient'; // Adjust path accordingly

export default async function handler(req, res) {
    if (req.method === 'GET') {
        // Fetch users with their role information
        const { data: users, error } = await supabase
            .schema('siap_skpd')
            .from('users')
            .select(`
                *,
                m_status:role_id (*)
            `);

        if (error) {
            return res.status(500).json({ error: error.message });
        }

        // Fetch related satuan_kerja_nama from m_spg_satuan_kerja table
        const satuanKerjaIds = users.map(user => user.satuan_kerja_id).filter(Boolean);
        const { data: satuanKerjaData, error: satuanKerjaError } = await supabase
            .schema('siap')
            .from('m_spg_satuan_kerja')
            .select('satuan_kerja_id, satuan_kerja_nama')
            .in('satuan_kerja_id', satuanKerjaIds);

        if (satuanKerjaError) {
            return res.status(500).json({ error: satuanKerjaError.message });
        }

        // Map satuan_kerja_nama to users
        const satuanKerjaMap = satuanKerjaData.reduce((acc, curr) => {
            acc[curr.satuan_kerja_id] = curr.satuan_kerja_nama;
            return acc;
        }, {});

        users.forEach(user => {
            user.satuan_kerja_nama = satuanKerjaMap[user.satuan_kerja_id] || null;
        });

        return res.status(200).json(users);
    } else if (req.method === 'POST') {
        // Create a new user
        const { name, email, role_id } = req.body;

        const { data, error } = await supabase
            .from('users')
            .insert([{ name, email, role_id }]);

        if (error) {
            return res.status(500).json({ error: error.message });
        }

        return res.status(201).json(data);
    } else {
        res.setHeader('Allow', ['GET', 'POST']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
