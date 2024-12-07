// Configuración global
const CONFIG = {
    // Lista de administradores permitidos con sus contraseñas
    ADMIN_USERS: {
        'jean': 'Barahona2009',
        'garaah': 'Diegoluis2008.1',
        'kevin': 'kevin123',
        'jose': 'Hello5500',
        'owner': 'Hello5500'
    },
    
    // Lista de estudiantes predefinidos
    STUDENT_USERS: {
        'maily': 'maily123'
    },
    
    // Configuración de almacenamiento
    STORAGE_KEYS: {
        USER_DATA: 'userData',
        AUTH_TOKEN: 'authToken',
        USERS: 'users'
    },
    
    // Mensajes de error
    ERROR_MESSAGES: {
        INVALID_CREDENTIALS: 'Usuario o contraseña incorrectos',
        USER_EXISTS: 'El usuario ya existe',
        PASSWORDS_NOT_MATCH: 'Las contraseñas no coinciden',
        INVALID_USERNAME: 'El nombre de usuario debe tener al menos 3 caracteres',
        INVALID_PASSWORD: 'La contraseña debe tener al menos 6 caracteres',
        USER_NOT_FOUND: 'Usuario no encontrado'
    },
    
    // Mensajes de éxito
    SUCCESS_MESSAGES: {
        LOGIN_SUCCESS: 'Inicio de sesión exitoso',
        REGISTER_SUCCESS: 'Registro exitoso',
        LOGOUT_SUCCESS: 'Sesión cerrada exitosamente'
    }
}; 