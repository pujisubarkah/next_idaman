import { supabase } from '../../../../../lib/supabaseClient'; // Adjust path accordingly

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      // Fetch data from Supabase
      const { data, error } = await supabase
        .schema('siap_skpd') // Ensure the schema is correct
        .from('monitoring_update_data_pegawai') // Ensure the table name is correct
        .select('*');

      if (error) throw error;

      // Initialize categories
      interface Item {
        progres: number;
        // Add other properties of the item here
      }

      const categories: { progres: string; jumlah_pegawai: number; items: Item[]; persentase: string }[] = [
        { progres: "100%", jumlah_pegawai: 0, items: [], persentase: '' },
        { progres: "75-99%", jumlah_pegawai: 0, items: [], persentase: '' },
        { progres: "50-74%", jumlah_pegawai: 0, items: [], persentase: '' },
        { progres: "<50%", jumlah_pegawai: 0, items: [], persentase: '' },
        { progres: "0%", jumlah_pegawai: 0, items: [], persentase: '' }
      ];

      // Categorize data based on 'progres' value and count items
      data.forEach(item => {
        const progres = item.progres; // Assuming progres is a number
        if (progres === 100) {
          categories[0].items.push(item);
          categories[0].jumlah_pegawai++;
        } else if (progres >= 75 && progres < 100) {
          categories[1].items.push(item);
          categories[1].jumlah_pegawai++;
        } else if (progres >= 50 && progres < 75) {
          categories[2].items.push(item);
          categories[2].jumlah_pegawai++;
        } else if (progres > 0 && progres < 50) {
          categories[3].items.push(item);
          categories[3].jumlah_pegawai++;
        } else if (progres === 0) {
          categories[4].items.push(item);
          categories[4].jumlah_pegawai++;
        }
      });

      // Calculate total number of employees
      const totalEmployees = categories.reduce((total, category) => total + category.jumlah_pegawai, 0);

      // Calculate percentage for each category and format it as a string with a '%' sign
      categories.forEach(category => {
        category.persentase = totalEmployees > 0 
          ? ((category.jumlah_pegawai / totalEmployees) * 100).toFixed(2) + '%' 
          : '0.00%'; // Handle division by zero
      });

      // Send the categorized data with counts, percentages, and total in the response
      return res.status(200).json({ Total: totalEmployees, categories });
    } catch (error) {
      // Return an error response if the data fetching fails
      return res.status(500).json({ message: 'Error fetching data', error: error.message });
    }
  } else {
    // Return method not allowed if not GET
    return res.status(405).json({ message: 'Method Not Allowed' });
  }
}
