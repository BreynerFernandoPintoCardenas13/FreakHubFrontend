// Configuración base para las peticiones
const API_BASE_URL = 'http://localhost:3000/api'; 
const fetchData = async (endpoint, token = null) => {
    const headers = { 'Content-Type': 'application/json' };
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
        console.log('Token enviado:', token); // Depuración
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
// Obtener todas las películas aceptadas (con filtros opcionales)
// Obtener todas las películas aceptadas (con filtros opcionales)
export const getMovies = async (token, category = null, title = null) => {
    let endpoint = '/movies';
    const params = new URLSearchParams();
    if (category) {
        // usar el endpoint correcto para categorías
        endpoint = '/movies/category';
        params.append('category', category);
    }
    if (title) {
        endpoint = '/movies/title'; 
        params.append('title', title);
    }
    if (params.toString()) endpoint += '?' + params.toString();
    return await fetchData(endpoint, token);
};
// Registrar un nuevo usuario
export const registerUser = async (userData) => {
    return await postData('/register', userData);
};

// Iniciar sesión
export const loginUser = async (credentials) => {
    return await postData('/login', credentials);
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

// Obtener películas pendientes (para admin)
export const getPendingMovies = async (token) => {
    return await fetchData('/movies/pending', token);
};  

// Aprobar una película (para admin)
export const approveMovie = async (movieId, token) => {
    const headers = { 'Content-Type': 'application/json' };
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/movies/${movieId}/approve`, {
            method: 'PUT',
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

// Obtener todas las categorías
export const getCategories = async (token) => {
    return await fetchData('/categories', token);
};

// Crear una nueva categoría
export const createCategory = async (categoryData, token) => {
    return await postData('/categories', categoryData, token);
};

// Actualizar una categoría existente
export const updateCategory = async (categoryId, categoryData, token) => {
    const headers = { 'Content-Type': 'application/json' };
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/categories/${categoryId}`, {
            method: 'PUT',
            headers: headers,
            body: JSON.stringify(categoryData)
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

// Obtener detalles de una película
export const getMovieDetails = async (movieId, token) => {
    return await fetchData(`/movies/get/${movieId}`, token);
};

// Crear una reseña
export const createReview = async (movieId, reviewData, token) => {
    return await postData(`/movies/create/${movieId}/reviews`, reviewData, token);
};

// Agregar comentario a una reseña
export const addComment = async (reviewId, commentData, token) => {
    return await postData(`/reviews/${reviewId}/comments`, commentData, token);
};

// Gestionar like/dislike en una reseña
export const toggleReviewReaction = async (reviewId, isLike, token) => {
    return await postData(`/reviews/${reviewId}/like`, { isLike }, token);
};

// Obtener una reseña por ID
export const getReviewById = async (reviewId, token) => {
    return await fetchData(`/reviews/${reviewId}`, token);
};

export const getReviewsByMovie = async (movieId) => {
    return await fetchData(`/movies/${movieId}/reviews`);
};


