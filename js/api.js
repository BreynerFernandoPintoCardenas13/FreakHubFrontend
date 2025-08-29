// Configuración base para las peticiones
const API_BASE_URL = 'http://localhost:3000/api';

// Función para hacer peticiones GET
const fetchData = async (endpoint, token = null) => {
    const headers = { 'Content-Type': 'application/json' };
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: 'GET',
            headers: headers
        });
        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${await response.text()}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error en la API:', error);
        throw error;
    }
};

// Función para hacer peticiones POST
const postData = async (endpoint, data, token = null) => {
    const headers = { 'Content-Type': 'application/json' };
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(data)
        });
        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${await response.text()}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error en la API:', error);
        throw error;
    }
};

// Obtener todas las películas aceptadas
export const getMovies = async (token) => {
    return await fetchData('/movies', token);
};

// Registrar un nuevo usuario
export const registerUser = async (userData) => {
    return await postData('/register', userData);
};

// Iniciar sesión
export const loginUser = async (credentials) => {
    return await postData('/login', credentials);
};