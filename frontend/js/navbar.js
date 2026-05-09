function createNavbar() {
  const userData = JSON.parse(localStorage.getItem('user') || 'null');

  let rightLinks = '';

  if (userData) {
    rightLinks = `
      <li>
        <span style="font-size:0.88rem; font-weight:700; color:var(--sage-dark); letter-spacing:0.06em;">
          Hello, ${userData.firstName} ˚ʚ♡ɞ˚
        </span>
      </li>

      ${
        Number(userData.roleId) === 3
          ? `<li><a href="restaurant-dashboard.html">Dashboard</a></li>`
          : `<li><a href="user-dashboard.html">My Orders</a></li>`
      }

      <li><a href="#" class="nav-btn" onclick="logout()">Logout</a></li>
    `;
  } else {
    rightLinks = `
      <li><a href="login.html" class="nav-btn">Login</a></li>
    `;
  }

  const navHTML = `
    <nav>
      <div class="nav-left-area">

        <div class="main-menu-wrapper">
          <button type="button" class="menu-toggle" onclick="toggleMainMenu(event)">
            ☰
          </button>

          <div class="main-menu-dropdown" id="main-menu-dropdown">

            <button type="button" class="menu-row" onclick="toggleRestaurantMenu(event)">
              Restaurants
              <span>⌄</span>
            </button>

            <div class="restaurant-submenu" id="restaurant-submenu">
              <a class="restaurant-item" href="browse.html">All Restaurants</a>
              <span class="restaurant-item empty-item">Loading restaurants...</span>
            </div>

            <a class="menu-row" href="user-dashboard.html">
              History
              <span>›</span>
            </a>

          </div>
        </div>

        <a href="index.html" class="nav-logo">Crave <span>n</span> Save˚ʚ♡ɞ˚</a>
      </div>

      <ul class="nav-links">
        <li><a href="browse.html">Browse</a></li>
        ${rightLinks}
      </ul>
    </nav>
  `;

  const navbarContainer =
    document.getElementById('navbar-container') ||
    document.getElementById('main-navbar');

  if (navbarContainer) {
    navbarContainer.innerHTML = navHTML;
  }

  loadRestaurantsIntoMenu();
}

async function loadRestaurantsIntoMenu() {
  const submenu = document.getElementById('restaurant-submenu');

  if (!submenu) return;

  try {
    const response = await fetch('http://localhost:3000/api/restaurants');
    const restaurants = await response.json();

    let restaurantLinks = `
      <a class="restaurant-item" href="browse.html">All Restaurants</a>
    `;

    if (Array.isArray(restaurants) && restaurants.length > 0) {
      restaurantLinks += restaurants.map((restaurant) => {
        return `
          <a class="restaurant-item" href="browse.html?restaurantId=${restaurant.id}">
            ${restaurant.name}
          </a>
        `;
      }).join('');
    } else {
      restaurantLinks += `
        <span class="restaurant-item empty-item">No restaurants found</span>
      `;
    }

    submenu.innerHTML = restaurantLinks;

  } catch (err) {
    console.error('Could not load restaurants:', err);

    submenu.innerHTML = `
      <a class="restaurant-item" href="browse.html">All Restaurants</a>
      <span class="restaurant-item empty-item">Could not load restaurants</span>
    `;
  }
}

function toggleMainMenu(event) {
  event.preventDefault();
  event.stopPropagation();

  const dropdown = document.getElementById('main-menu-dropdown');
  const submenu = document.getElementById('restaurant-submenu');

  if (!dropdown) return;

  dropdown.classList.toggle('show');

  if (!dropdown.classList.contains('show') && submenu) {
    submenu.classList.remove('show');
  }
}

function toggleRestaurantMenu(event) {
  event.preventDefault();
  event.stopPropagation();

  const submenu = document.getElementById('restaurant-submenu');

  if (!submenu) return;

  submenu.classList.toggle('show');
}

function logout() {
  localStorage.removeItem('user');
  localStorage.removeItem('loggedIn');
  localStorage.removeItem('user_id');
  localStorage.removeItem('role');
  localStorage.removeItem('first_name');
  localStorage.removeItem('restaurant_id');

  window.location.href = 'index.html';
}

document.addEventListener('click', function (event) {
  const menuWrapper = document.querySelector('.main-menu-wrapper');
  const dropdown = document.getElementById('main-menu-dropdown');
  const submenu = document.getElementById('restaurant-submenu');

  if (menuWrapper && !menuWrapper.contains(event.target)) {
    if (dropdown) dropdown.classList.remove('show');
    if (submenu) submenu.classList.remove('show');
  }
});

document.addEventListener('DOMContentLoaded', createNavbar);