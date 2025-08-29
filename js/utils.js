// Mostrar alerta en pantalla
export const showAlert = (message, type = 'error') => {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert ${type}`;
    alertDiv.textContent = message;
    document.body.appendChild(alertDiv);
    setTimeout(() => alertDiv.remove(), 3000);
};

// Formatear rating (ej. 8.5/10)
export const formatRating = (rating) => {
    return rating ? `${rating.toFixed(1)}/10` : 'N/A';
};