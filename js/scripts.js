import { getMovies, registerUser, loginUser, getCategories, createMovie } from './api.js';
import { showAlert, formatRating } from './utils.js';

// Elementos del DOM
const movieList = document.getElementById('movie-list');
const authButtons = document.getElementById('auth-buttons');
const createPostBtn = document.getElementById('create-post-btn');
const registerForm = document.getElementById('register-form');
const loginForm = document.getElementById('login-form');
const createForm = document.getElementById('create-form');
const categorySelect = document.getElementById('category');

// Verificar autenticación al cargar
const checkAuth = () => {
    const token = localStorage.getItem('token');
    if (authButtons) { // Verificar si el elemento existe
        if (token) {
            authButtons.innerHTML = `<span id="user-name">${getUsernameFromToken(token)}</span>`;
            if (createPostBtn) createPostBtn.style.display = 'block';
            document.getElementById('user-name').addEventListener('click', () => {
                window.location.href = 'profile.html';
            });
        } else {
            authButtons.innerHTML = `
                <button id="login-btn">Iniciar Sesión</button>
                <button id="register-btn">Registrarse</button>
            `;
            if (createPostBtn) createPostBtn.style.display = 'none';
            document.getElementById('login-btn').addEventListener('click', () => {
                window.location.href = 'login.html';
            });
            document.getElementById('register-btn').addEventListener('click', () => {
                window.location.href = 'register.html';
            });
        }
    }
};

// Extraer nombre de usuario del token (simplificado, ajusta según tu JWT)
const getUsernameFromToken = (token) => {
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.name || 'Usuario';
    } catch (e) {
        return 'Usuario';
    }
};

// Cargar y renderizar películas
const loadMovies = async () => {
    try {
        const movies = await getMovies(localStorage.getItem('token'));
        if (movieList) {
            movieList.innerHTML = '';
            movies.forEach(movie => {
                const card = document.createElement('div');
                card.className = 'movie-card';
                card.innerHTML = `
                    <img src="${movie.image || 'https://via.placeholder.com/200x300'}" alt="${movie.title}">
                    <h3>${movie.title}</h3>
                    <div class="rating">${formatRating(movie.rating)}</div>
                `;
                card.addEventListener('click', () => {
                    window.location.href = `details.html?id=${movie._id}`;
                });
                movieList.appendChild(card);
            });
        }
    } catch (error) {
        showAlert('Error al cargar películas: ' + error.message);
    }
};

// Cargar categorías en el select
const loadCategories = async () => {
    if (categorySelect) {
        try {
            const categories = await getCategories(localStorage.getItem('token'));
            categorySelect.innerHTML = '<option value="">Selecciona una categoría</option>';
            categories.forEach(category => {
                const option = document.createElement('option');
                option.value = category.name;
                option.textContent = category.name;
                categorySelect.appendChild(option);
            });
        } catch (error) {
            showAlert('Error al cargar categorías: ' + error.message);
        }
    }
};

// Manejar registro
if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const username = document.getElementById('username').value;

        try {
            const data = await registerUser({ email, password, username });
            showAlert('Registro exitoso, inicia sesión', 'success');
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 2000);
        } catch (error) {
            showAlert(error.message);
        }
    });
}

// Manejar inicio de sesión
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value.trim();

        if (!email || !password) {
            showAlert('Por favor, completa todos los campos');
            return;
        }

        try {
            const data = await loginUser({ email, password });
            localStorage.setItem('token', data.token); // Asume que el backend devuelve { token }
            showAlert('Inicio de sesión exitoso', 'success');
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 2000);
        } catch (error) {
            showAlert(error.message || 'Error al iniciar sesión');
        }
    });
}

// Manejar creación de publicación
if (createForm) {
    document.addEventListener('DOMContentLoaded', loadCategories);
    createForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        if (!token) {
            showAlert('Debes iniciar sesión para crear una publicación');
            return;
        }

        const title = document.getElementById('title').value;
        const description = document.getElementById('description').value;
        const category = document.getElementById('category').value;
        const year = document.getElementById('year').value;
        const imageInput = document.getElementById('image');
        const image = imageInput.files[0];

        if (!image || !image.type.match('image/jpeg|image/png')) {
            showAlert('Por favor, sube un archivo JPG o PNG');
            return;
        }

        const movieData = { title, description, category, year, image };
        try {
            const data = await createMovie(movieData, token);
            showAlert('Publicación creada con éxito', 'success');
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 2000);
        } catch (error) {
            showAlert(error.message);
        }
    });
}

// Inicializar al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    if (document.getElementById('movie-list')) loadMovies();
});