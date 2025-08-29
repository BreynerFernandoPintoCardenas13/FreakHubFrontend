import { getMovies, registerUser, loginUser } from './api.js';
import { showAlert, formatRating } from './utils.js';

// Elementos del DOM
const movieList = document.getElementById('movie-list');
const authButtons = document.getElementById('auth-buttons');
const createPostBtn = document.getElementById('create-post-btn');
const registerForm = document.getElementById('register-form');
const loginForm = document.getElementById('login-form');

// Verificar autenticación al cargar
const checkAuth = () => {
    const token = localStorage.getItem('token');
    if (token) {
        authButtons.innerHTML = `<span id="user-name">${getUsernameFromToken(token)}</span>`;
        createPostBtn.style.display = 'block';
        document.getElementById('user-name').addEventListener('click', () => {
            window.location.href = 'profile.html';
        });
    } else {
        authButtons.innerHTML = `
            <button id="login-btn">Iniciar Sesión</button>
            <button id="register-btn">Registrarse</button>
        `;
        createPostBtn.style.display = 'none';
        document.getElementById('login-btn').addEventListener('click', () => {
            window.location.href = 'login.html';
        });
        document.getElementById('register-btn').addEventListener('click', () => {
            window.location.href = 'register.html';
        });
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
    } catch (error) {
        showAlert('Error al cargar películas: ' + error.message);
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
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        try {
            const data = await loginUser({ email, password });
            localStorage.setItem('token', data.token); // Asume que el backend devuelve { token }
            showAlert('Inicio de sesión exitoso', 'success');
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
    if (document.getElementById('movie-list')) loadMovies(); // Solo en index.html
});