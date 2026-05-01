
// Global variables & Utilities
window.toggleMenu = () => {
    const navLinks = document.getElementById('navLinks');
    navLinks.classList.toggle('active');
};

window.formatPrice = (price) => {
    return new Intl.NumberFormat('ar-YE', { style: 'currency', currency: 'YER' }).format(price);
};

window.updateCartCount = () => {
    if (typeof DB === 'undefined') return;
    const cart = DB.getCart() || [];
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    const cartCountElement = document.getElementById('cartCount');
    if (cartCountElement) {
        cartCountElement.innerText = count;
    }
};

window.addToCart = (productId) => {
    DB.addToCart(productId, 1);
    updateCartCount();
    alert('تم إضافة المنتج إلى السلة بنجاح!');
};

window.toggleFavorite = (productId, btnElement) => {
    const isFav = DB.toggleWishlist(productId);
    if (isFav) {
        btnElement.classList.add('active');
        btnElement.innerHTML = '<i class="fas fa-heart"></i>';
    } else {
        btnElement.classList.remove('active');
        btnElement.innerHTML = '<i class="far fa-heart"></i>';
    }
};

const renderStarRating = (rating) => {
    let starsHtml = '';
    for (let i = 1; i <= 5; i++) {
        if (i <= rating) {
            starsHtml += '<i class="fas fa-star"></i>';
        } else if (i - 0.5 === rating) {
            starsHtml += '<i class="fas fa-star-half-alt"></i>';
        } else {
            starsHtml += '<i class="far fa-star"></i>';
        }
    }
    return starsHtml;
};

window.generateProductCard = (product) => {
    const wishlist = DB.getWishlist();
    const isFav = wishlist.includes(product.id);
    const finalPrice = product.discount > 0
        ? product.price - (product.price * (product.discount / 100))
        : product.price;

    return `
        <div class="product-card">
            ${product.discount > 0 ? `<div class="product-badge" style="background:red; color:white; padding:2px 8px; border-radius:3px; position:absolute; top:10px; left:10px; z-index:2;">خصم ${product.discount}%</div>` : ''}
            <a href="product.html?id=${product.id}">
                <img src="${product.images[0]}" alt="${product.name}" class="product-img" style="width:100%; height:200px; object-fit:cover;">
            </a>
            <div class="product-info" style="padding:15px;">
                <a href="product.html?id=${product.id}" style="text-decoration:none; color:inherit;"><h3 class="product-title" style="font-size:1rem; margin-bottom:10px;">${product.name}</h3></a>
                <div class="product-price" style="margin-bottom:15px;">
                    <span style="color:#c0392b; font-weight:bold; font-size:1.1rem;">${finalPrice.toLocaleString()} ر.ي</span>
                    ${product.discount > 0 ? `<span style="text-decoration:line-through; color:#999; font-size:0.9rem; margin-right:10px;">${product.price.toLocaleString()} ر.ي</span>` : ''}
                </div>
                <div class="product-actions" style="display:flex; gap:10px;">
                    <button class="btn-cart" onclick="addToCart('${product.id}')" style="flex:1; background:#333; color:white; border:none; padding:8px; border-radius:5px; cursor:pointer;">
                        <i class="fas fa-cart-plus"></i> أضف للسلة
                    </button>
                    <button class="btn-fav ${isFav ? 'active' : ''}" onclick="toggleFavorite('${product.id}', this)" style="background:none; border:1px solid #ccc; padding:8px; border-radius:5px; cursor:pointer; color:${isFav ? 'red' : '#333'}">
                        <i class="${isFav ? 'fas' : 'far'} fa-heart"></i>
                    </button>
                </div>
            </div>
        </div>
    `;
};

const initHomePage = () => {
    const categoryGrid = document.getElementById('categoryGrid');
    if (categoryGrid) {
        const categories = DB.getCategories();
        categoryGrid.innerHTML = categories.map(cat => `
            <a href="shop.html?category=${cat.id}" class="category-card">
                <img src="${cat.image}" alt="${cat.name}">
                <div class="category-overlay">${cat.name}</div>
            </a>
        `).join('');
    }

    const featuredGrid = document.getElementById('featuredProducts');
    if (featuredGrid) {
        const featured = DB.getFeaturedProducts();
        featuredGrid.innerHTML = featured.map(generateProductCard).join('');
    }
};

document.addEventListener('DOMContentLoaded', () => {
    if (typeof DB !== 'undefined') DB.init();
    updateCartCount();
    
    const homepageCheck = document.getElementById('categoryGrid');
    if (homepageCheck) initHomePage();

    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && searchInput.value.trim() !== '') {
                window.location.href = `shop.html?search=${encodeURIComponent(searchInput.value.trim())}`;
            }
        });
    }
});
