import PermohonanTable from '../../../components/list_permohonan'; // Path ke komponen
import RootLayout from '../../home/layout'; // Mengimpor layout dari home/layout.js

export default function ListPermohonan() {
  return (
    <div>
       <RootLayout>
       <PermohonanTable />
       </RootLayout>
      
    </div>
  );
}
