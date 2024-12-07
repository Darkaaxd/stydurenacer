class Auth {
    constructor() {
        this.users = this.loadUsers();
        this.userIPs = this.loadUserIPs();
        this.checkSubscriptionStatus = this.checkSubscriptionStatus.bind(this);
        
        // Verificar estado de suscripción si está autenticado
        if (this.isAuthenticated()) {
            this.startSubscriptionCheck();
        }
    }

    loadUsers() {
        const storedUsers = localStorage.getItem(CONFIG.STORAGE_KEYS.USERS);
        let users = storedUsers ? JSON.parse(storedUsers) : {};
        
        // Agregar usuarios predefinidos si no existen
        Object.entries(CONFIG.ADMIN_USERS).forEach(([username, password]) => {
            if (!users[username]) {
                users[username] = {
                    username,
                    password,
                    role: 'admin'
                };
            }
        });

        Object.entries(CONFIG.STUDENT_USERS).forEach(([username, userData]) => {
            if (!users[username]) {
                users[username] = {
                    username,
                    password: userData.password,
                    role: 'student',
                    expirationDate: userData.expirationDate
                };
            }
        });

        this.saveUsers(users);
        return users;
    }

    loadUserIPs() {
        const storedIPs = localStorage.getItem(CONFIG.STORAGE_KEYS.USER_IPS);
        return storedIPs ? JSON.parse(storedIPs) : {};
    }

    saveUsers(users) {
        localStorage.setItem(CONFIG.STORAGE_KEYS.USERS, JSON.stringify(users));
        this.users = users;
    }

    saveUserIPs(userIPs) {
        localStorage.setItem(CONFIG.STORAGE_KEYS.USER_IPS, JSON.stringify(userIPs));
        this.userIPs = userIPs;
    }

    async getCurrentIP() {
        try {
            const response = await fetch('https://api.ipify.org?format=json');
            const data = await response.json();
            return data.ip;
        } catch (error) {
            console.error('Error obteniendo IP:', error);
            return null;
        }
    }

    startSubscriptionCheck() {
        // Iniciar verificación periódica
        this.subscriptionCheckInterval = setInterval(() => {
            this.checkSubscriptionStatus();
        }, CONFIG.SECURITY.CHECK_INTERVAL);
        
        // Verificar inmediatamente
        this.checkSubscriptionStatus();
    }

    stopSubscriptionCheck() {
        if (this.subscriptionCheckInterval) {
            clearInterval(this.subscriptionCheckInterval);
        }
    }

    checkSubscriptionStatus() {
        const currentUser = this.getCurrentUser();
        if (!currentUser || currentUser.role === 'admin') return;

        const user = this.users[currentUser.username];
        if (!user || !user.expirationDate) return;

        const expirationDate = new Date(user.expirationDate);
        const now = new Date();

        if (now > expirationDate) {
            this.showSubscriptionExpiredModal();
            this.stopSubscriptionCheck(); // Detener verificación una vez que expire
        }
    }

    showSubscriptionExpiredModal() {
        const userData = localStorage.getItem(CONFIG.STORAGE_KEYS.USER_DATA);
        console.log('Datos de usuario en modal:', userData);
        const currentUser = userData ? JSON.parse(userData) : null;
        console.log('Usuario actual en modal:', currentUser);

        // Asegurarnos de tener el nombre de usuario
        const username = currentUser ? currentUser.username : 'Usuario';
        console.log('Nombre de usuario para el mensaje:', username);

        // Crear el mensaje de WhatsApp
        const whatsappMessage = `Hola! Soy el usuario: ${username} y quiero renovar mi suscripción`;
        console.log('Mensaje a enviar:', whatsappMessage);

        // Crear modal si no existe
        let modal = document.getElementById('subscriptionExpiredModal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'subscriptionExpiredModal';
            modal.className = 'modal';
            modal.innerHTML = `
                <div class="modal-content">
                    <h2>Tiempo de Sesión Terminado</h2>
                    <p>Tu tiempo de sesión ha terminado. ¿Deseas renovar tu suscripción?</p>
                    <div class="modal-buttons">
                        <button id="payButton" class="primary-button">Pagar</button>
                        <button id="logoutButton" class="secondary-button">Aceptar</button>
                    </div>
                </div>
            `;
            document.body.appendChild(modal);

            // Agregar event listeners
            document.getElementById('payButton').addEventListener('click', () => {
                // Abrir WhatsApp
                window.open('https://wa.me/+573183159634?text=' + encodeURIComponent(whatsappMessage), '_blank');
                
                // Enviar correo
                emailjs.send('service_jzt3rzr', 'template_sokkuqf', {
                    from_name: username,
                    message: 'Un estudiante ha solicitado renovar su suscripción. Por favor, revisa tu WhatsApp para más detalles.',
                    system_date: new Date().toLocaleString()
                });

                // Redirigir al login
                window.location.href = './index.html';
            });

            document.getElementById('logoutButton').addEventListener('click', () => {
                window.location.href = './index.html';
            });

            // Agregar estilos si no existen
            if (!document.getElementById('subscriptionModalStyles')) {
                const styles = document.createElement('style');
                styles.id = 'subscriptionModalStyles';
                styles.textContent = `
                    .modal {
                        display: block;
                        position: fixed;
                        z-index: 1000;
                        left: 0;
                        top: 0;
                        width: 100%;
                        height: 100%;
                        background-color: rgba(0,0,0,0.5);
                    }
                    .modal-content {
                        background-color: white;
                        margin: 15% auto;
                        padding: 20px;
                        border-radius: 8px;
                        width: 80%;
                        max-width: 500px;
                        text-align: center;
                    }
                    .modal-buttons {
                        margin-top: 20px;
                    }
                    .modal-buttons button {
                        margin: 0 10px;
                        padding: 10px 20px;
                        border-radius: 4px;
                        cursor: pointer;
                    }
                    .primary-button {
                        background-color: var(--primary-color);
                        color: white;
                        border: none;
                    }
                    .secondary-button {
                        background-color: #ddd;
                        border: none;
                    }
                `;
                document.head.appendChild(styles);
            }
        }

        modal.style.display = 'block';
    }

    async requestPayment() {
        const currentUser = this.getCurrentUser();
        if (!currentUser) return;

        const message = encodeURIComponent(`${CONFIG.CONTACT.PAYMENT_MESSAGE}${currentUser.username}`);
        const whatsappURL = `https://wa.me/${CONFIG.CONTACT.WHATSAPP}?text=${message}`;
        
        // Abrir WhatsApp en una nueva pestaña
        window.open(whatsappURL, '_blank');
        
        // Mostrar mensaje de confirmación
        alert(CONFIG.SUCCESS_MESSAGES.PAYMENT_REQUEST_SENT);
        
        // Cerrar sesión después de enviar la solicitud
        this.logout();
    }

    async login(username, password) {
        const user = this.users[username];

        if (!user || user.password !== password) {
            throw new Error(CONFIG.ERROR_MESSAGES.INVALID_CREDENTIALS);
        }

        // Guardar datos de sesión primero
        const userData = {
            username: username,
            role: user.role,
            expirationDate: user.expirationDate
        };

        localStorage.setItem(CONFIG.STORAGE_KEYS.USER_DATA, JSON.stringify(userData));
        console.log('Usuario guardado:', userData);

        // Verificar suscripción para estudiantes
        if (user.role === 'student' && user.expirationDate) {
            const expirationDate = new Date(user.expirationDate);
            const now = new Date();

            if (now > expirationDate) {
                this.showSubscriptionExpiredModal();
                throw new Error(CONFIG.ERROR_MESSAGES.SUBSCRIPTION_EXPIRED);
            }
        }

        // Verificar IP solo si está habilitado y no es admin
        if (CONFIG.SECURITY.ENABLE_IP_LOCK && 
            (!CONFIG.SECURITY.ADMIN_BYPASS_IP || user.role !== 'admin')) {
            
            const currentIP = await this.getCurrentIP();
            
            if (!currentIP) {
                throw new Error('No se pudo verificar la dirección IP');
            }

            if (this.userIPs[username] && this.userIPs[username] !== currentIP) {
                throw new Error(CONFIG.ERROR_MESSAGES.INVALID_IP);
            }

            if (!this.userIPs[username]) {
                this.userIPs[username] = currentIP;
                this.saveUserIPs(this.userIPs);
            }
        }

        return userData;
    }

    logout() {
        this.stopSubscriptionCheck();
        localStorage.removeItem(CONFIG.STORAGE_KEYS.USER_DATA);
        window.location.href = this.getBasePath();
    }

    getCurrentUser() {
        const userData = localStorage.getItem(CONFIG.STORAGE_KEYS.USER_DATA);
        console.log('Datos de usuario recuperados:', userData); // Debug log
        return userData ? JSON.parse(userData) : null;
    }

    isAuthenticated() {
        return !!this.getCurrentUser();
    }

    // Método para que los admins agreguen o actualicen usuarios con fecha real
    addOrUpdateStudent(username, password, expirationDate) {
        const currentUser = this.getCurrentUser();
        if (!currentUser || currentUser.role !== 'admin') {
            throw new Error('No autorizado');
        }

        // Validar que la fecha de expiración sea válida
        const expDate = new Date(expirationDate);
        if (isNaN(expDate.getTime())) {
            throw new Error('Fecha de expiración inválida');
        }

        this.users[username] = {
            username,
            password,
            role: 'student',
            expirationDate: expirationDate
        };

        this.saveUsers(this.users);
    }

    // Método para verificar si un usuario está expirado
    isUserExpired(username) {
        const user = this.users[username];
        if (!user || user.role === 'admin' || !user.expirationDate) return false;

        const expirationDate = new Date(user.expirationDate);
        return new Date() > expirationDate;
    }

    getBasePath() {
        // Obtener la ruta base del proyecto
        const path = window.location.pathname;
        return path.substring(0, path.lastIndexOf('/')) + '/index.html';
    }
}

// Crear instancia global de Auth
const auth = new Auth(); 