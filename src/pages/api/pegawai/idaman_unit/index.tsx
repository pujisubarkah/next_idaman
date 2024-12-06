import { supabase } from '../../../../../lib/supabaseClient';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { query } = req;
    const peg_id = query.peg_id; // Pastikan ini adalah string
    const page = query.page || 1;
    const itemsPerPage = query.itemsPerPage || 10;

    console.log('Request received at /api/pegawai');

    try {
      let queryBuilder = supabase
        .schema('siap_skpd')
        .from('spg_pegawai')
        .select('*', { count: 'exact' });

      queryBuilder = queryBuilder.eq('peg_status', true);

      if (peg_id) {
        // Pastikan peg_id adalah string saat dikirim ke Supabase
        queryBuilder = queryBuilder.eq('peg_id', peg_id);
      }

      const { data, error, count } = await queryBuilder.range(
        (page - 1) * itemsPerPage,
        page * itemsPerPage - 1
      );

      if (error) {
        console.error('Error fetching data:', error);
        return res.status(500).json({ error: error.message });
      }

      if (!data || data.length === 0) {
        console.log('No data found');
        return res.status(404).json({ message: 'Data not found' });
      }

      const basePhotoUrl = 'https://dtjrketxxozstcwvotzh.supabase.co/storage/v1/object/public/foto_pegawai/';

      const updatedData = data.map(item => {
        return {
          ...item,
          peg_foto: item.peg_foto ? `${basePhotoUrl}${item.peg_foto}` : null,
        };
      });

      return res.status(200).json({
        data: updatedData,
        totalItems: count || 0,
      });
    } catch (error) {
      console.error('Unexpected error:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ error: 'Method Not Allowed' });
  }
}
