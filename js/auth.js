class Auth {
    constructor() {
        this.users = JSON.parse(localStorage.getItem(CONFIG.STORAGE_KEYS.USERS)) || [];
        this.initializeAdminUsers();
        this.initializeStudentUsers();
    }

    // Inicializar usuarios administradores
    initializeAdminUsers() {
        const adminUsernames = Object.keys(CONFIG.ADMIN_USERS);
        
        // Verificar si ya existen los admins
        const existingAdmins = this.users.filter(user => 
            adminUsernames.includes(user.username)
        );

        if (existingAdmins.length === adminUsernames.length) {
            return; // Todos los admins ya están creados
        }

        // Crear usuarios admin que no existan
        adminUsernames.forEach(username => {
            if (!this.users.some(user => user.username === username)) {
                const adminUser = {
                    id: 'admin_' + Date.now() + Math.random().toString(36).substr(2),
                    username: username,
                    password: this.hashPassword(CONFIG.ADMIN_USERS[username]),
                    role: 'admin',
                    isActive: true,
                    createdAt: new Date().toISOString()
                };
                this.users.push(adminUser);
            }
        });

        this.saveUsers();
    }

    // Inicializar usuarios estudiantes predefinidos
    initializeStudentUsers() {
        const studentUsernames = Object.keys(CONFIG.STUDENT_USERS);
        
        // Verificar si ya existen los estudiantes
        const existingStudents = this.users.filter(user => 
            studentUsernames.includes(user.username)
        );

        if (existingStudents.length === studentUsernames.length) {
            return; // Todos los estudiantes ya están creados
        }

        // Crear usuarios estudiantes que no existan
        studentUsernames.forEach(username => {
            if (!this.users.some(user => user.username === username)) {
                const studentUser = {
                    id: 'student_' + Date.now() + Math.random().toString(36).substr(2),
                    username: username,
                    password: this.hashPassword(CONFIG.STUDENT_USERS[username]),
                    role: 'student',
                    isActive: true,
                    createdAt: new Date().toISOString()
                };
                this.users.push(studentUser);
            }
        });

        this.saveUsers();
    }

    // Guardar usuarios en localStorage
    saveUsers() {
        localStorage.setItem(CONFIG.STORAGE_KEYS.USERS, JSON.stringify(this.users));
    }

    // Registrar usuario
    register(username, password) {
        return new Promise((resolve, reject) => {
            // Validaciones
            if (username.length < 3) {
                reject(new Error(CONFIG.ERROR_MESSAGES.INVALID_USERNAME));
                return;
            }

            if (password.length < 6) {
                reject(new Error(CONFIG.ERROR_MESSAGES.INVALID_PASSWORD));
                return;
            }

            // Verificar si el usuario ya existe
            if (this.users.some(user => user.username === username)) {
                reject(new Error(CONFIG.ERROR_MESSAGES.USER_EXISTS));
                return;
            }

            // Crear nuevo usuario
            const newUser = {
                id: Date.now().toString(),
                username,
                password: this.hashPassword(password),
                role: 'student',
                isActive: true,
                createdAt: new Date().toISOString()
            };

            // Agregar usuario y guardar
            this.users.push(newUser);
            this.saveUsers();

            // Crear token y datos de sesión
            const token = this.generateToken(newUser);
            const userData = this.getUserData(newUser);

            // Guardar sesión
            this.saveSession(token, userData);

            resolve(userData);
        });
    }

    // Login de usuario
    login(username, password) {
        return new Promise((resolve, reject) => {
            // Buscar usuario
            const user = this.users.find(u => u.username === username);

            if (!user) {
                reject(new Error(CONFIG.ERROR_MESSAGES.USER_NOT_FOUND));
                return;
            }

            if (!this.verifyPassword(password, user.password)) {
                reject(new Error(CONFIG.ERROR_MESSAGES.INVALID_CREDENTIALS));
                return;
            }

            if (!user.isActive) {
                reject(new Error('Usuario desactivado'));
                return;
            }

            // Crear token y datos de sesión
            const token = this.generateToken(user);
            const userData = this.getUserData(user);

            // Guardar sesión
            this.saveSession(token, userData);

            resolve(userData);
        });
    }

    // Cerrar sesión
    logout() {
        localStorage.removeItem(CONFIG.STORAGE_KEYS.AUTH_TOKEN);
        localStorage.removeItem(CONFIG.STORAGE_KEYS.USER_DATA);
    }

    // Verificar si el usuario está autenticado
    isAuthenticated() {
        return !!localStorage.getItem(CONFIG.STORAGE_KEYS.AUTH_TOKEN);
    }

    // Obtener usuario actual
    getCurrentUser() {
        const userData = localStorage.getItem(CONFIG.STORAGE_KEYS.USER_DATA);
        return userData ? JSON.parse(userData) : null;
    }

    // Funciones auxiliares
    hashPassword(password) {
        // En una aplicación real, usaríamos una función de hash real
        return btoa(password);
    }

    verifyPassword(password, hashedPassword) {
        return this.hashPassword(password) === hashedPassword;
    }

    generateToken(user) {
        // En una aplicación real, generaríamos un JWT real
        return btoa(JSON.stringify({
            id: user.id,
            username: user.username,
            role: user.role,
            exp: Date.now() + (24 * 60 * 60 * 1000) // 24 horas
        }));
    }

    getUserData(user) {
        return {
            id: user.id,
            username: user.username,
            role: user.role
        };
    }

    saveSession(token, userData) {
        localStorage.setItem(CONFIG.STORAGE_KEYS.AUTH_TOKEN, token);
        localStorage.setItem(CONFIG.STORAGE_KEYS.USER_DATA, JSON.stringify(userData));
    }
}

// Crear instancia global de Auth
const auth = new Auth(); 