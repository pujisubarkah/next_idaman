import Login from '../components/login';
import AutoLogout from '../components/autologout'; // Import komponen AutoLogout

export default function LoginPage() {
  return (
    <div>
      {/* Komponen AutoLogout ditambahkan di sini */}
      <AutoLogout timeout={10} warningTimeout={3} />
      <Login />
    </div>
  );
}
