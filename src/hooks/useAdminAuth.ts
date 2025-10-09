import { useState, useEffect } from 'react';
import { tokenStorage } from '../services/tokenStorage';

export const useAdminAuth = () => {
    const [isAdmin, setIsAdmin] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const checkAdminRole = () => {
            const token = tokenStorage.getAccessToken();
            
            if (!token) {
                setIsAdmin(false);
                setIsLoading(false);
                return;
            }

            try {
                const decoded = JSON.parse(atob(token.split('.')[1]));
                const hasAdminRole = decoded.authorities?.includes('ROLE_ADMIN') || 
                                    decoded.authorities?.includes('ROLE_TEACHER');
                
                // Debug để kiểm tra token và quyền admin
                console.log('Token decoded:', decoded);
                console.log('Has admin role:', hasAdminRole);
                
                setIsAdmin(hasAdminRole);
            } catch (error) {
                console.error('Error decoding token:', error);
                setIsAdmin(false);
            } finally {
                setIsLoading(false);
            }
        };

        checkAdminRole();
    }, []);

    return { isAdmin, isLoading };
}; 
