'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';


// Dynamic imports for client-side only components
const Button = dynamic(() => import('./button'));
const ButoonUser = dynamic(() => import('./buttonuser')); // Dashboard for role_id 4

const Profilebutton = () => {
  const [roleId, setRoleId] = useState(null);

  useEffect(() => {
    // Retrieve and parse role_id from localStorage
    const storedData = localStorage.getItem('user'); // Assuming the key is 'user_data'
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData); // Parse the JSON string
        setRoleId(parsedData.role_id); // Access role_id
      } catch (error) {
        console.error('Error parsing localStorage data:', error);
      }
    }
  }, []);

  return (
    
      <div>
        {roleId === 1 && <Button />} {/* button for role_id 1 */}
        {roleId === 4 && <ButoonUser />} {/* button for role_id 4 */}
      
      </div>
   
  );
};

export default Profilebutton;

