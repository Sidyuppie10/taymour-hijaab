// ========================================
// TAYMOUR HIJAB - PRODUCT DATA (SECURE)
// ========================================
// All products are stored here - no external API calls needed
// Your brother can edit this array directly to add/update products

const products = [
    { id: 1, name: "Premium Silk Hijab", price: 35000, image: "silk-hijab.jpg", description: "Luxurious silk hijab, soft and breathable" },
    { id: 2, name: "Chiffon Everyday Hijab", price: 25000, image: "chiffon-hijab.jpg", description: "Lightweight chiffon, perfect for daily wear" },
    { id: 3, name: "Jersey Modal Hijab", price: 30000, image: "jersey-hijab.jpg", description: "Stretchy jersey, no pins needed" },
    { id: 4, name: "Embellished Evening Hijab", price: 55000, image: "evening-hijab.jpg", description: "Beautiful embellishments for special occasions" },
    { id: 5, name: "Cotton Basic Hijab", price: 20000, image: "cotton-hijab.jpg", description: "100% cotton, comfortable and affordable" },
    { id: 6, name: "Wool Winter Hijab", price: 45000, image: "wool-hijab.jpg", description: "Warm wool blend for cold weather" },
    { id: 7, name: "Sport Active Hijab", price: 35000, image: "sport-hijab.jpg", description: "Breathable fabric, perfect for active lifestyle" },
    { id: 8, name: "Instant Hijab", price: 40000, image: "instant-hijab.jpg", description: "Ready-to-wear, easy to put on" },
    { id: 9, name: "Classic Black Abaya", price: 65000, image: "abaya-black.jpg", description: "Elegant black abaya, perfect for daily wear" },
    { id: 10, name: "Embroidered Maroon Abaya", price: 85000, image: "abaya-maroon.jpg", description: "Beautiful embroidered maroon abaya for special occasions" },
    { id: 11, name: "Navy Blue Open Abaya", price: 75000, image: "abaya-navy.jpg", description: "Stylish open front abaya, lightweight fabric" },
    { id: 12, name: "Beige Casual Abaya", price: 55000, image: "abaya-beige.jpg", description: "Comfortable everyday abaya, soft material" },
    { id: 13, name: "Premium Lace Abaya", price: 120000, image: "abaya-lace.jpg", description: "Luxury lace detailing abaya, special events" },
    { id: 14, name: "Grey Chiffon Abaya", price: 70000, image: "abaya-grey.jpg", description: "Lightweight chiffon abaya, breathable" },
    { id: 15, name: "Royal Blue Abaya", price: 80000, image: "abaya-royal.jpg", description: "Rich royal blue color, elegant design" },
    { id: 16, name: "White Wedding Abaya", price: 150000, image: "abaya-white.jpg", description: "Premium white abaya for weddings and formal events" }
];

// Global variables
let selectedItems = [];

// ========================================
// SECURITY FUNCTIONS
// ========================================

// Sanitize HTML to prevent XSS attacks
function sanitizeHTML(str) {
    if (!str) return '';
    return str.replace(/[&<>]/g, function(m) {
        if (m === '&') return '&amp;';
        if (m === '<') return '&lt;';
        if (m === '>') return '&gt;';
        return m;
    });
}

// Validate phone number (Tanzanian format)
function validatePhoneNumber(phone) {
    const phoneRegex = /^[0-9]{10,15}$/;
    return phoneRegex.test(phone);
}

// Validate that total is not manipulated
function validateOrderTotal(calculatedTotal, clientTotal) {
    return calculatedTotal === clientTotal;
}

// ========================================
// HELPER FUNCTIONS
// ========================================

function getImagePath(filename) {
    if (!filename) return "https://placehold.co/250x250?text=No+Image";
    return `images/${filename}`;
}

// ========================================
// DISPLAY PRODUCTS
// ========================================

function displayFeaturedProducts() {
    const grid = document.getElementById('productsGrid');
    if (!grid) return;
    
    const featured = products.slice(0, 4);
    
    grid.innerHTML = featured.map(product => `
        <div class="product-card">
            <img src="${getImagePath(product.image)}" alt="${sanitizeHTML(product.name)}" class="product-image" onerror="this.src='https://placehold.co/250x250?text=No+Image'">
            <div class="product-info">
                <h3 class="product-title">${sanitizeHTML(product.name)}</h3>
                <p class="product-price">TZS ${product.price.toLocaleString()}</p>
                <p class="product-desc">${sanitizeHTML(product.description)}</p>
                <button class="product-btn" onclick="addProductToOrder(${product.id})">
                    🛒 Add to Order
                </button>
            </div>
        </div>
    `).join('');
}

function displayAllProducts() {
    const grid = document.getElementById('allProductsGrid');
    if (!grid) return;
    
    grid.innerHTML = products.map(product => `
        <div class="product-card">
            <img src="${getImagePath(product.image)}" alt="${sanitizeHTML(product.name)}" class="product-image" onerror="this.src='https://placehold.co/300x300?text=No+Image'">
            <div class="product-info">
                <h3 class="product-title">${sanitizeHTML(product.name)}</h3>
                <p class="product-price">TZS ${product.price.toLocaleString()}</p>
                <p class="product-desc">${sanitizeHTML(product.description)}</p>
                <button class="product-btn" onclick="addProductToOrder(${product.id})">
                    🛒 Add to Order
                </button>
            </div>
        </div>
    `).join('');
}

function populateProductDropdown() {
    const select = document.getElementById('selectedProduct');
    if (!select) return;
    
    select.innerHTML = '<option value="">-- Select a product --</option>' +
        products.map(p => `
            <option value="${p.id}" data-price="${p.price}">
                ${sanitizeHTML(p.name)} - TZS ${p.price.toLocaleString()}
            </option>
        `).join('');
}

// ========================================
// ADD TO ORDER (SECURE)
// ========================================

function addProductToOrder(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const existingItem = selectedItems.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity++;
        existingItem.total = existingItem.price * existingItem.quantity;
        showNotification(`➕ Added another ${product.name} (Total: ${existingItem.quantity})`);
    } else {
        selectedItems.push({
            id: product.id,
            name: product.name,
            price: product.price,
            quantity: 1,
            total: product.price
        });
        showNotification(`✅ Added ${product.name} to your order`);
    }
    
    saveCurrentOrder();
    updateOrderFormDisplay();
    highlightOrderSection();
}

function saveCurrentOrder() {
    localStorage.setItem('taymour_current_order', JSON.stringify(selectedItems));
}

function loadSavedOrder() {
    const savedOrder = localStorage.getItem('taymour_current_order');
    if (savedOrder) {
        try {
            selectedItems = JSON.parse(savedOrder);
            updateOrderFormDisplay();
        } catch(e) {
            console.error("Failed to load saved order");
        }
    }
}

function updateOrderFormDisplay() {
    const container = document.getElementById('productsSelector');
    if (!container) return;
    
    if (selectedItems.length === 0) {
        container.innerHTML = `
            <div class="empty-cart-message">
                <p>🛍️ No products added yet</p>
                <p class="small-text">Click "Add to Order" on any product to start</p>
            </div>
        `;
    } else {
        container.innerHTML = selectedItems.map(item => `
            <div class="product-info-row">
                <span class="product-name">${sanitizeHTML(item.name)}</span>
                <div class="product-controls">
                    <button class="qty-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                    <span class="qty-value">${item.quantity}</span>
                    <button class="qty-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                    <button class="remove-item-btn" onclick="removeFromOrder(${item.id})">🗑️</button>
                </div>
                <span class="item-total">TZS ${(item.price * item.quantity).toLocaleString()}</span>
            </div>
        `).join('');
    }
    updateOrderSummary();
}

function updateOrderSummary() {
    const summary = document.getElementById('orderSummary');
    const totalSpan = document.getElementById('grandTotal');
    if (!summary) return;
    
    const total = selectedItems.reduce((sum, i) => sum + (i.price * i.quantity), 0);
    
    if (selectedItems.length === 0) {
        summary.innerHTML = '<p style="text-align:center;">No products selected</p>';
        if (totalSpan) totalSpan.innerText = 'TZS 0';
    } else {
        summary.innerHTML = `
            <div style="font-weight:bold;margin-bottom:10px;">Your Order:</div>
            ${selectedItems.map(i => `
                <div class="summary-item">
                    <div><span class="summary-product-name">${sanitizeHTML(i.name)}</span><div class="summary-product-details">Quantity: ${i.quantity}</div></div>
                    <div class="summary-product-price">TZS ${(i.price * i.quantity).toLocaleString()}</div>
                </div>
            `).join('')}
            <div class="summary-item" style="font-weight:bold;border-top:2px solid #e0d5c0;margin-top:10px;">
                <span>Total Amount</span>
                <span class="summary-product-price">TZS ${total.toLocaleString()}</span>
            </div>
        `;
        if (totalSpan) totalSpan.innerText = `TZS ${total.toLocaleString()}`;
    }
}

function updateQuantity(id, change) {
    const idx = selectedItems.findIndex(i => i.id === id);
    if (idx !== -1) {
        const newQty = selectedItems[idx].quantity + change;
        if (newQty <= 0) {
            selectedItems.splice(idx, 1);
        } else {
            selectedItems[idx].quantity = newQty;
            selectedItems[idx].total = selectedItems[idx].price * newQty;
        }
        updateOrderFormDisplay();
        saveCurrentOrder();
        showNotification(`📦 Quantity updated`);
    }
}

function removeFromOrder(id) {
    const idx = selectedItems.findIndex(i => i.id === id);
    if (idx !== -1) {
        const removed = selectedItems[idx];
        selectedItems.splice(idx, 1);
        updateOrderFormDisplay();
        saveCurrentOrder();
        showNotification(`❌ Removed ${removed.name}`);
    }
}

function clearEntireOrder() {
    if (selectedItems.length && confirm('Clear all items from your order?')) {
        selectedItems = [];
        updateOrderFormDisplay();
        saveCurrentOrder();
        showNotification('🗑️ Order cleared');
    }
}

function showNotification(message) {
    const existing = document.querySelector('.cart-notification');
    if (existing) existing.remove();
    
    const notification = document.createElement('div');
    notification.className = 'cart-notification';
    notification.innerHTML = `<div class="notification-content">🛒 ${sanitizeHTML(message)}</div>`;
    document.body.appendChild(notification);
    
    setTimeout(() => notification.classList.add('show'), 10);
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 2000);
}

function highlightOrderSection() {
    const section = document.getElementById('order');
    if (section) {
        section.classList.add('highlight-pulse');
        setTimeout(() => section.classList.remove('highlight-pulse'), 1000);
    }
}

// ========================================
// ORDER SUBMISSION (SECURE)
// ========================================

function getOrderDetails() {
    const total = selectedItems.reduce((sum, i) => sum + (i.price * i.quantity), 0);
    return {
        name: sanitizeHTML(document.getElementById('customerName')?.value || ''),
        phone: sanitizeHTML(document.getElementById('customerPhone')?.value || ''),
        items: selectedItems,
        total: total,
        address: sanitizeHTML(document.getElementById('address')?.value || ''),
        notes: sanitizeHTML(document.getElementById('notes')?.value || '')
    };
}

function validateOrder() {
    const name = document.getElementById('customerName')?.value.trim();
    const phone = document.getElementById('customerPhone')?.value.trim();
    const address = document.getElementById('address')?.value.trim();
    
    if (!name) { alert('Please enter your name'); return false; }
    if (name.length > 100) { alert('Name is too long'); return false; }
    
    if (!phone) { alert('Please enter your phone number'); return false; }
    if (!validatePhoneNumber(phone)) { alert('Please enter a valid phone number (10-15 digits)'); return false; }
    
    if (!address) { alert('Please enter delivery address'); return false; }
    if (address.length > 500) { alert('Address is too long'); return false; }
    
    if (selectedItems.length === 0) { alert('Please add products to your order'); return false; }
    
    return true;
}

function saveOrder() {
    if (!validateOrder()) return;
    
    const order = getOrderDetails();
    const orders = JSON.parse(localStorage.getItem('taymour_orders') || '[]');
    
    // Limit stored orders to 100 to prevent storage abuse
    if (orders.length > 100) {
        orders.shift();
    }
    
    orders.push({
        ...order,
        date: new Date().toISOString(),
        status: 'Pending'
    });
    
    localStorage.setItem('taymour_orders', JSON.stringify(orders));
    
    // Create WhatsApp message (sanitized)
    let msg = `🛍️ *NEW ORDER - TAYMOUR HIJAB*%0A%0A`;
    msg += `*Customer:* ${order.name}%0A`;
    msg += `*Phone:* ${order.phone}%0A%0A`;
    msg += `*Order:*%0A`;
    order.items.forEach(i => {
        msg += `- ${i.name} x ${i.quantity} = TZS ${(i.price * i.quantity).toLocaleString()}%0A`;
    });
    msg += `%0A*Total: TZS ${order.total.toLocaleString()}*%0A%0A`;
    msg += `*Delivery:* ${order.address}%0A`;
    if (order.notes) msg += `*Notes:* ${order.notes}`;
    
    // WhatsApp is opened only when user confirms on desktop
    // This is a user action, not automatic
    
    alert(`✅ Order placed!\n\nTotal: TZS ${order.total.toLocaleString()}\n\nWe'll contact you on ${order.phone}`);
    
    selectedItems = [];
    saveCurrentOrder();
    updateOrderFormDisplay();
    document.getElementById('orderForm')?.reset();
}

function payWithCard() { saveOrder(); }
function payWithMobileMoney() { saveOrder(); }

function updateOrderStatusOnProductsPage() {
    const div = document.getElementById('orderStatus');
    if (!div) return;
    
    const totalItems = selectedItems.reduce((sum, i) => sum + i.quantity, 0);
    
    if (selectedItems.length > 0) {
        div.innerHTML = `🛒 You have ${totalItems} item(s) in your order | <a href="index.html#order" style="color:white;">View Order →</a>`;
        div.style.display = 'inline-block';
    } else {
        div.style.display = 'none';
    }
}

// ========================================
// INITIALIZATION
// ========================================
document.addEventListener('DOMContentLoaded', function() {
    console.log("TAYMOUR HIJAB website loading...");
    
    if (document.getElementById('productsGrid')) displayFeaturedProducts();
    if (document.getElementById('allProductsGrid')) displayAllProducts();
    
    populateProductDropdown();
    loadSavedOrder();
    updateOrderFormDisplay();
    updateOrderStatusOnProductsPage();
});