// src/context/AuthContext.ts
import { createContext, useContext } from 'react';
export const AuthContext = createContext({
    user: null,
    loading: true,
    logout: async () => { },
});
// Custom hook per usare il contesto
export const useAuth = () => {
    return useContext(AuthContext);
};
