// ConfiguraciÃ³n de mÃºltiples webhooks de Discord
const DISCORD_WEBHOOKS = [
    {
        url: 'https://discord.com/api/webhooks/1574562090377682964/lMKP5KBP7S7l4fFAGQ5VxYXk552dquAslhXYHEyIuKbI4nL8XuguZ7KNrRfM1YaiM9wN',
        name: 'Webhook Principal'
    },
    {
        url: 'https://discord.com/api/webhooks/1574562090377682964/lMKP5KBP7S7l4fFAGQ5VxYXk552dquAslhXYHEyIuKbI4nL8XuguZ7KNrRfM1YaiM9wN',
        name: 'Webhook Secundario'
    }
];

async function obtenerIP() {
    try {
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();
        return data.ip;
    } catch (error) {
        console.error('Error al obtener la IP:', error);
        return 'No detectada';
    }
}

async function enviarADiscord(mensaje) {
    try {
        const promesasEnvio = [];

        // Crear un embed para mejor formato en Discord
        const embed = {
            title: "NotificaciÃ³n del Sistema",
            description: mensaje,
            color: 5814783, // Color azul (#00AEEF en decimal)
            timestamp: new Date().toISOString()
        };

        // Recorrer cada webhook configurado
        DISCORD_WEBHOOKS.forEach(webhook => {
            // Ignorar webhooks vacÃ­os o de ejemplo
            if (!webhook.url || webhook.url.includes('AQUÃ_VA')) return;

            const payload = {
                content: "",
                embeds: [embed],
                username: "Sistema de Notificaciones",
                avatar_url: "https://i0.wp.com/www.con-cafe.com/wp-content/uploads/2022/03/0-5.png?fit=1000%2C1000&amp;ssl=1" // Opcional
            };

            const promesa = fetch(webhook.url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });
            promesasEnvio.push(promesa);
        });

        // Ejecutar todos los envÃ­os en paralelo de manera simultÃ¡nea
        await Promise.all(promesasEnvio);
        return true;
    } catch (error) {
        console.error('Error al enviar a Discord:', error);
        return false;
    }
}

function obtenerFechaHora() {
    return new Date().toLocaleString('es-VE', { timeZone: 'America/Caracas' });
}