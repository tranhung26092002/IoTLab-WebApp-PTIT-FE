export const tokenStorage = {
    setTokens(accessToken: string, refreshToken: string) {
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
    },

    getAccessToken() {
        return localStorage.getItem('accessToken');
    },

    getRefreshToken() {
        return localStorage.getItem('refreshToken');
    },

    clearTokens() {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
    },

    isTokenValid(token: string): boolean {
        if (!token) return false;
        try {
            // Basic structure check
            const parts = token.split('.');
            if (parts.length !== 3) return false;
            return true;
        } catch {
            return false;
        }
    },

    setRememberedLogin(phoneNumber: string) {
        localStorage.setItem('rememberMe', 'true');
        localStorage.setItem('phoneNumber', phoneNumber);
    },

    clearRememberedLogin() {
        localStorage.removeItem('rememberMe');
        localStorage.removeItem('phoneNumber');
    },

    getRememberedLogin() {
        const rememberMe = localStorage.getItem('rememberMe') === 'true';
        const phoneNumber = localStorage.getItem('phoneNumber');
        return rememberMe && phoneNumber ? { phoneNumber } : null;
    }
};