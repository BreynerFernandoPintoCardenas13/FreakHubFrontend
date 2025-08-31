import { getMovies, registerUser, loginUser, getCategories, createMovie, getPendingMovies, approveMovie, createCategory } from './api.js';
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
    if (token) {
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            authButtons.innerHTML = `<span id="user-name">${payload.name || 'Usuario'}</span>`;
            if (createPostBtn) createPostBtn.style.display = 'block';
            document.getElementById('user-name').addEventListener('click', () => {
                window.location.href = 'profile.html';
            });
            // Mostrar botón de panel admin si es admin
            const adminButton = document.getElementById('admin-panel-button');
            if (adminButton && payload.role && payload.role.toLowerCase() === 'admin') {
                adminButton.style.display = 'block';
            }
        } catch (e) {
            console.error('Error al parsear el token:', e);
            authButtons.innerHTML = `<span id="user-name">Usuario</span>`;
        }
    } else {
        if (authButtons) {
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

// Cargar y renderizar películas pendientes (para admin)
const loadPendingMovies = async () => {
    try {
        const movies = await getPendingMovies(localStorage.getItem('token'));
        const pendingMovieList = document.getElementById('pending-movie-list');
        if (pendingMovieList) {
            pendingMovieList.innerHTML = '';
            movies.forEach(movie => {
                const card = document.createElement('div');
                card.className = 'movie-card';
                card.innerHTML = `
                    <img src="${movie.image || 'https://via.placeholder.com/200x300'}" alt="${movie.title}">
                    <h3>${movie.title}</h3>
                    <div class="rating">${formatRating(movie.rating)}</div>
                    <button class="approve-btn">Publicar</button>
                `;
                card.addEventListener('click', () => {
                    window.location.href = `details.html?id=${movie._id}`;
                });
                const approveBtn = card.querySelector('.approve-btn');
                approveBtn.addEventListener('click', async (e) => {
                    e.stopPropagation(); // Evitar redirigir al click en botón
                    try {
                        await approveMovie(movie._id, localStorage.getItem('token'));
                        showAlert('Película aprobada exitosamente', 'success');
                        loadPendingMovies(); // Recargar lista
                    } catch (error) {
                        showAlert(error.message);
                    }
                });
                pendingMovieList.appendChild(card);
            });
        }
    } catch (error) {
        showAlert('Error al cargar películas pendientes: ' + error.message);
    }
};


// Inicializar al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    if (document.getElementById('movie-list')) loadMovies();
    if (document.getElementById('pending-movie-list')) loadPendingMovies();
});


// Cargar y renderizar categorías existentes
/* const loadCategories = async () => {
    try {
        const categories = await getCategories(localStorage.getItem('token'));
        const categoryList = document.getElementById('category-list');
        if (categoryList) {
            categoryList.innerHTML = '';
            categories.forEach(category => {
                const div = document.createElement('div');
                div.innerHTML = `
                    <span>${category.name}</span>
                    <button class="edit-category-btn" data-id="${category._id}">Editar</button>
                `;
                categoryList.appendChild(div);
                const editBtn = div.querySelector('.edit-category-btn');
                editBtn.addEventListener('click', () => editCategory(category._id, category.name));
            });
        }
    } catch (error) {
        showAlert('Error al cargar categorías: ' + error.message);
    }
}; */

// Manejar creación/edición de categoría
const handleCategoryForm = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const categoryName = document.getElementById('category-name').value;
    const categoryId = document.getElementById('category-id').value;

    if (!categoryName) {
        showAlert('El nombre de la categoría es requerido');
        return;
    }

    try {
        if (categoryId) {
            // Editar categoría existente
            await updateCategory(categoryId, { name: categoryName }, token);
            showAlert('Categoría actualizada exitosamente', 'success');
        } else {
            // Crear nueva categoría
            await createCategory({ name: categoryName }, token);
            showAlert('Categoría creada exitosamente', 'success');
        }
        document.getElementById('category-form').reset();
        document.getElementById('category-id').value = '';
        document.getElementById('category-submit-btn').textContent = 'Crear Categoría';
        document.getElementById('category-cancel-btn').style.display = 'none';
        loadCategories();
        toggleCategoryManagement(false);
    } catch (error) {
        showAlert(error.message);
    }
};

// Editar categoría existente
const editCategory = (categoryId, currentName) => {
    const categoryNameInput = document.getElementById('category-name');
    const categoryIdInput = document.getElementById('category-id');
    const submitBtn = document.getElementById('category-submit-btn');
    const cancelBtn = document.getElementById('category-cancel-btn');

    categoryNameInput.value = currentName;
    categoryIdInput.value = categoryId;
    submitBtn.textContent = 'Guardar Cambios';
    cancelBtn.style.display = 'inline-block';
    toggleCategoryManagement(true);
};

// Alternar visibilidad de la sección de gestión de categorías
const toggleCategoryManagement = (show) => {
    const categoryManagement = document.getElementById('category-management');
    categoryManagement.style.display = show ? 'block' : 'none';
};

// Manejar eventos
document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    if (document.getElementById('movie-list')) loadMovies();
    if (document.getElementById('pending-movie-list')) loadPendingMovies();

    const createCategoryBtn = document.getElementById('create-category-btn');
    if (createCategoryBtn) {
        createCategoryBtn.addEventListener('click', () => toggleCategoryManagement(true));
    }

    const categoryForm = document.getElementById('category-form');
    if (categoryForm) {
        categoryForm.addEventListener('submit', handleCategoryForm);
    }

    const cancelBtn = document.getElementById('category-cancel-btn');
    if (cancelBtn) {
        cancelBtn.addEventListener('click', () => {
            document.getElementById('category-form').reset();
            document.getElementById('category-id').value = '';
            document.getElementById('category-submit-btn').textContent = 'Crear Categoría';
            cancelBtn.style.display = 'none';
            toggleCategoryManagement(false);
        });
    }

    if (document.getElementById('category-list')) loadCategories();
});