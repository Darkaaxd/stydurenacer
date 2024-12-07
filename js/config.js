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
    
    // Lista de estudiantes predefinidos con fecha de expiración
    STUDENT_USERS: {
        'maily': {
            password: 'maily123',
            expirationDate: '2024-02-07'
        },
        'test': {
            password: 'test1234',
            expirationDate: '2024-02-07'
        }
    },
    
    // Configuración de almacenamiento
    STORAGE_KEYS: {
        USER_DATA: 'userData',
        AUTH_TOKEN: 'authToken',
        USERS: 'users',
        USER_IPS: 'userIPs',
        SUBSCRIPTION_DATA: 'subscriptionData'
    },
    
    // Mensajes de error
    ERROR_MESSAGES: {
        INVALID_CREDENTIALS: 'Usuario o contraseña incorrectos',
        USER_EXISTS: 'El usuario ya existe',
        INVALID_USERNAME: 'Usuario no válido',
        INVALID_PASSWORD: 'Contraseña incorrecta',
        USER_NOT_FOUND: 'Usuario no encontrado',
        INVALID_IP: 'Esta cuenta solo puede ser accedida desde su dispositivo original',
        IP_ALREADY_REGISTERED: 'Esta cuenta ya está registrada para otro dispositivo',
        SUBSCRIPTION_EXPIRED: 'Tu tiempo de sesión ha terminado'
    },
    
    // Mensajes de éxito
    SUCCESS_MESSAGES: {
        LOGIN_SUCCESS: 'Inicio de sesión exitoso',
        LOGOUT_SUCCESS: 'Sesión cerrada exitosamente',
        PAYMENT_REQUEST_SENT: 'Solicitud de pago enviada correctamente'
    },

    // Configuración de seguridad
    SECURITY: {
        ENABLE_IP_LOCK: true,
        ADMIN_BYPASS_IP: true,
        CHECK_INTERVAL: 60000 // Verificar cada minuto
    },

    // Información de contacto para pagos
    CONTACT: {
        WHATSAPP: '+573183159634', // Agregado el código de país
        EMAIL: 'darkaxd897@gmail.com',
        PAYMENT_MESSAGE: '¡Hola! Me gustaría renovar mi suscripción. Usuario: '
    }
}; 