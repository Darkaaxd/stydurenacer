// Verificar si hay un usuario autenticado al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    if (auth.isAuthenticated()) {
        const userData = auth.getCurrentUser();
        if (userData) {
            // Redirigir según el rol
            window.location.href = userData.role === 'admin' 
                ? 'admin/dashboard.html' 
                : 'student/dashboard.html';
        }
    }
}); 