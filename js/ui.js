class UI {
    constructor() {
        // Elementos del DOM
        this.loginForm = document.getElementById('loginForm');
        this.registerForm = document.getElementById('registerForm');
        this.registerModal = document.getElementById('registerModal');
        this.showRegisterBtn = document.getElementById('showRegister');
        this.closeModalBtn = document.querySelector('.close');

        // Inicializar eventos
        this.initializeEvents();
    }

    initializeEvents() {
        // Eventos de formularios
        this.loginForm.addEventListener('submit', this.handleLogin.bind(this));
        this.registerForm.addEventListener('submit', this.handleRegister.bind(this));

        // Eventos del modal
        this.showRegisterBtn.addEventListener('click', this.showRegisterModal.bind(this));
        this.closeModalBtn.addEventListener('click', this.hideRegisterModal.bind(this));
        window.addEventListener('click', (e) => {
            if (e.target === this.registerModal) {
                this.hideRegisterModal();
            }
        });

        // Verificar autenticación
        this.checkAuth();
    }

    async handleLogin(e) {
        e.preventDefault();
        
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        try {
            const userData = await auth.login(username, password);
            this.showMessage(CONFIG.SUCCESS_MESSAGES.LOGIN_SUCCESS, 'success');
            this.redirectToHome();
        } catch (error) {
            this.showMessage(error.message, 'error');
        }
    }

    async handleRegister(e) {
        e.preventDefault();

        const username = document.getElementById('regUsername').value;
        const password = document.getElementById('regPassword').value;
        const confirmPassword = document.getElementById('regConfirmPassword').value;

        if (password !== confirmPassword) {
            this.showMessage(CONFIG.ERROR_MESSAGES.PASSWORDS_NOT_MATCH, 'error');
            return;
        }

        try {
            const userData = await auth.register(username, password);
            this.showMessage(CONFIG.SUCCESS_MESSAGES.REGISTER_SUCCESS, 'success');
            this.hideRegisterModal();
            this.redirectToHome();
        } catch (error) {
            this.showMessage(error.message, 'error');
        }
    }

    showRegisterModal() {
        this.registerModal.style.display = 'block';
    }

    hideRegisterModal() {
        this.registerModal.style.display = 'none';
        this.registerForm.reset();
    }

    showMessage(message, type = 'info') {
        // Eliminar mensaje anterior si existe
        const existingMessage = document.querySelector('.message');
        if (existingMessage) {
            existingMessage.remove();
        }

        // Crear nuevo mensaje
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}-message`;
        messageDiv.textContent = message;

        // Insertar mensaje
        const container = document.querySelector('.form-container');
        container.insertBefore(messageDiv, container.firstChild);

        // Eliminar mensaje después de 3 segundos
        setTimeout(() => {
            messageDiv.remove();
        }, 3000);
    }

    checkAuth() {
        if (auth.isAuthenticated()) {
            this.redirectToHome();
        }
    }

    redirectToHome() {
        // Redirigir al dashboard
        window.location.href = 'dashboard/index.html';
    }
}

// Crear instancia global de UI
const ui = new UI(); 