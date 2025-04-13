// context/UserContext.tsx
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';

type UserContextType = {
  role: string;
  setRole: React.Dispatch<React.SetStateAction<string>>;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUserContext = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUserContext must be used within a UserProvider');
  }
  return context;
};

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [role, setRole] = useState<string>('user'); // Default role

  useEffect(() => {
    const fetchedRole = localStorage.getItem('userRole') || 'user'; // Can be adjusted to use API or other sources
    setRole(fetchedRole);
  }, []);

  return (
    <UserContext.Provider value={{ role, setRole }}>
      {children}
    </UserContext.Provider>
  );
};
