# Sistema de Gestión Estudiantil

Sistema web para la gestión de la vida académica de los estudiantes, desarrollado con HTML, CSS y JavaScript puro.

## Características

### Usuarios y Roles
- **Administradores**: 5 usuarios predefinidos (jean, diego, kevin, owner, jose)
  - Pueden gestionar materias
  - Agregar y eliminar tareas
  - Ver progreso de estudiantes

- **Estudiantes**: Usuarios regulares
  - Pueden ver sus materias
  - Consultar tareas y exámenes
  - Ver consejos para pasar materias
  - Seguimiento de progreso académico

### Funcionalidades Principales
- Sistema de autenticación (login/registro)
- Gestión de materias
- Sistema de tareas y exámenes
- Seguimiento de progreso
- Interfaz responsive

## Estructura del Proyecto

```
project/
├── index.html          # Página principal con login
├── css/
│   ├── styles.css      # Estilos globales
│   └── login.css       # Estilos específicos del login
├── js/
│   ├── config.js       # Configuraciones globales
│   ├── auth.js         # Lógica de autenticación
│   ├── ui.js           # Interfaz de usuario
│   └── app.js          # Aplicación principal
└── img/                # Imágenes del proyecto
```

## Tecnologías Utilizadas
- HTML5
- CSS3 (con variables CSS y diseño responsive)
- JavaScript (ES6+)
- LocalStorage para persistencia de datos

## Instalación y Uso

1. Clona el repositorio:
```bash
git clone [URL_DEL_REPOSITORIO]
```

2. Abre el archivo `index.html` en tu navegador

3. Para acceder como administrador, usa uno de los siguientes usuarios:
   - jean
   - diego
   - kevin
   - owner
   - jose

4. Para acceder como estudiante, crea una nueva cuenta con cualquier otro nombre de usuario

## Seguridad
- Contraseñas encriptadas
- Control de acceso basado en roles
- Validación de formularios
- Protección contra inyección de código

## Desarrollo Local

No se requieren dependencias ni configuración especial. Solo necesitas:
- Un navegador web moderno
- Un editor de código
- (Opcional) Un servidor local como Live Server

## Contribución

1. Haz un Fork del proyecto
2. Crea una rama para tu función: `git checkout -b nueva-funcion`
3. Haz commit de tus cambios: `git commit -m 'Agrega nueva función'`
4. Empuja a la rama: `git push origin nueva-funcion`
5. Abre un Pull Request

## Autores
- [Tu Nombre]
- [Otros Colaboradores]

## Licencia
Este proyecto está bajo la Licencia MIT - ver el archivo LICENSE.md para más detalles 