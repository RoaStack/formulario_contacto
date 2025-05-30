document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('contactForm');
  const messageDiv = document.getElementById('message');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData(form);
      const data = Object.fromEntries(formData.entries());

      const response = await fetch('/api/contacto', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      const result = await response.json();

      messageDiv.textContent = result.message || 
        (response.ok ? '¡Mensaje enviado con éxito!' : 'Error al enviar');
      messageDiv.className = `message ${response.ok ? 'success' : 'error'}`;

      // Scroll suave al mensaje
      messageDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

      // Ocultar después de 5 segundos
      setTimeout(() => {
        messageDiv.textContent = '';
        messageDiv.className = 'message';
      }, 5000);

      if (response.ok) form.reset();

    } catch (error) {
      messageDiv.textContent = 'Error de conexión. Intenta nuevamente.';
      messageDiv.className = 'message error';

      messageDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

      setTimeout(() => {
        messageDiv.textContent = '';
        messageDiv.className = 'message';
      }, 5000);
    }
  });
});
