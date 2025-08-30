// Configuración base para las peticiones
const API_BASE_URL = 'http://localhost:3000/api'; // Corregido a /api/v1

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

// Función específica para FormData (solo para createMovie)
const postFormData = async (endpoint, formData, token = null) => {
    const headers = {};
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: 'POST',
            headers: headers,
            body: formData
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

export const getCategories = async (token) => {
    return await fetchData('/categories', token);
};

export const createMovie = async (movieData, token) => {
    const formData = new FormData();
    formData.append('title', movieData.title);
    formData.append('description', movieData.description);
    formData.append('category', movieData.category);
    formData.append('year', movieData.year);
    if (movieData.image) {
        formData.append('image', movieData.image);
    }
    return await postFormData('/movies', formData, token); // Usar postFormData para FormData
};