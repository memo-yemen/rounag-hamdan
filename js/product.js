
const initProductPage = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');

    if (!productId) {
        window.location.href = 'shop.html';
        return;
    }

    const product = DB.getProduct(productId);

    if (!product) {
        document.getElementById('productDetailWrapper').innerHTML = '<div style="padding: 100px; text-align: center;"><h2>المنتج غير موجود</h2><a href="shop.html">العودة للمتجر</a></div>';
        return;
    }

    renderProductDetail(product);
};

const renderProductDetail = (product) => {
    const wrapper = document.getElementById('productDetailWrapper');
    const finalPrice = product.discount > 0 ? product.price * (1 - (product.discount / 100)) : product.price;
    const stars = '★'.repeat(Math.floor(product.rating)) + '☆'.repeat(5 - Math.floor(product.rating));

    const imagesHtml = product.images.map((img, index) => `
        <img src="${img}" class="thumbnail ${index === 0 ? 'active' : ''}" onclick="changeMainImage('${img}', this)" alt="صورة ${index + 1}">
    `).join('');

    wrapper.innerHTML = `
        <div class="product-detail-container">
            <div class="product-gallery">
                <img src="${product.images[0]}" id="mainProductImage" class="main-image" alt="${product.name}">
                <div class="thumbnail-list">
                    ${imagesHtml}
                </div>
            </div>
            <div class="product-info-detail">
                <h1 class="product-title-detail">${product.name}</h1>
                <div class="product-rating-detail">${stars}</div>
                <div class="product-price-detail">
                    <span style="color: #c0392b;">${finalPrice.toLocaleString()} ر.ي</span>
                    ${product.discount > 0 ? `
                        <span class="product-old-price-detail" style="font-size: 1.1rem; margin-right: 10px;">${product.price.toLocaleString()} ر.ي</span>
                        <span style="background: #c0392b; color: white; padding: 2px 8px; border-radius: 5px; font-size: 0.9rem; margin-right: 10px;">خصم ${product.discount}%</span>
                    ` : ''}
                </div>
                <div class="product-desc-detail">
                    ${product.description.replace(/\n/g, '<br>')}
                </div>
                
                <div class="add-to-cart-group">
                    <input type="number" id="buyQty" class="quantity-input" value="1" min="1">
                    <button class="btn-add-cart-large" onclick="addToCart('${product.id}')">
                        <i class="fas fa-shopping-cart"></i> إضافة إلى السلة
                    </button>
                </div>

                <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
                    <p><strong>القسم:</strong> ${product.category}</p>
                    <p style="margin-top: 10px; color: #27ae60;"><i class="fas fa-truck"></i> توصيل وتركيب مجاني</p>
                </div>
            </div>
        </div>
    `;
};

window.changeMainImage = (src, thumb) => {
    document.getElementById('mainProductImage').src = src;
    document.querySelectorAll('.thumbnail').forEach(t => t.classList.remove('active'));
    thumb.classList.add('active');
};

window.addToCart = (id) => {
    const qty = parseInt(document.getElementById('buyQty').value);
    DB.addToCart(id, qty);
    alert('تمت إضافة المنتج إلى السلة بنجاح!');
    // Update global cart count
    if (window.updateCartCount) window.updateCartCount();
};

document.addEventListener('DOMContentLoaded', initProductPage);
