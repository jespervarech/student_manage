// utils/auth.js
export const isAuthenticated = () => {
    const token = localStorage.getItem("token");
    if (!token) return false;

    try {
        // Décoder et valider le token si nécessaire (exemple avec JWT)
        const payload = JSON.parse(atob(token.split(".")[1]));
        const isExpired = payload.exp * 1000 < Date.now();
        return !isExpired;
    } catch (error) {
        return false;
    }
};
