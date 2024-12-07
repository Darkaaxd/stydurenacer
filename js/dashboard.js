class Dashboard {
    constructor() {
        this.currentUser = null;
        this.initializeUser();
        this.initializeEventListeners();
        this.loadUsers();
    }

    initializeUser() {
        // Verificar autenticación
        if (!auth.isAuthenticated()) {
            window.location.href = '../index.html';
            return;
        }

        // Obtener y mostrar datos del usuario
        this.currentUser = auth.getCurrentUser();
        if (this.currentUser) {
            document.getElementById('username').textContent = this.currentUser.username;
        }
    }

    initializeEventListeners() {
        // Manejar cierre de sesión
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                auth.logout();
                window.location.href = '../index.html';
            });
        }

        // Manejar navegación del sidebar
        const navItems = document.querySelectorAll('.sidebar-nav li');
        navItems.forEach(item => {
            item.addEventListener('click', () => {
                // Remover clase active de todos los items
                navItems.forEach(i => i.classList.remove('active'));
                // Agregar clase active al item clickeado
                item.classList.add('active');
                
                // Manejar navegación
                const section = item.querySelector('span:last-child').textContent;
                this.loadSection(section);
            });
        });
    }

    loadSection(section) {
        // Ocultar todas las secciones
        document.getElementById('materiasContent').style.display = 'none';
        document.getElementById('usuariosContent').style.display = 'none';

        // Actualizar título
        const headerTitle = document.querySelector('.header-title h1');
        headerTitle.textContent = section;

        // Mostrar la sección correspondiente
        switch (section) {
            case 'Materias':
                document.getElementById('materiasContent').style.display = 'block';
                break;
            case 'Usuarios':
                document.getElementById('usuariosContent').style.display = 'block';
                this.loadUsers();
                break;
        }
    }

    loadUsers() {
        const usersList = document.querySelector('.usuarios-list');
        const users = JSON.parse(localStorage.getItem(CONFIG.STORAGE_KEYS.USERS)) || [];
        
        usersList.innerHTML = ''; // Limpiar lista actual
        
        if (users.length === 0) {
            usersList.innerHTML = '<p class="empty-message">No hay usuarios registrados</p>';
            return;
        }

        // Ordenar usuarios: primero admins, luego estudiantes
        const sortedUsers = users.sort((a, b) => {
            if (a.role === b.role) return a.username.localeCompare(b.username);
            return a.role === 'admin' ? -1 : 1;
        });

        sortedUsers.forEach(user => {
            const userItem = document.createElement('div');
            userItem.className = 'user-item';
            userItem.innerHTML = `
                <div class="user-info">
                    <span class="material-icons">account_circle</span>
                    <div class="user-details">
                        <h3>${user.username}</h3>
                        <p class="user-role ${user.role}">${user.role === 'admin' ? 'Administrador' : 'Estudiante'}</p>
                    </div>
                </div>
                <div class="user-status ${user.isActive ? 'active' : 'inactive'}">
                    ${user.isActive ? 'Activo' : 'Inactivo'}
                </div>
            `;
            usersList.appendChild(userItem);
        });
    }
}

// Inicializar dashboard
const dashboard = new Dashboard(); 