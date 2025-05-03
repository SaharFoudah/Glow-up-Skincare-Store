/**
 * Skincare Shop - Main JavaScript
 * Modern e-commerce website for skincare products
 */

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize mobile menu
    initMobileMenu();
    
    // Initialize add to cart functionality
    initAddToCart();
    
    // Initialize product quantity selector (for product details page)
    initQuantitySelector();
    
    // Initialize product gallery (for product details page)
    initProductGallery();
    
    // Initialize newsletter form
    initNewsletterForm();
});

/**
 * Mobile Menu Functionality
 */
function initMobileMenu() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navMenu = document.querySelector('.nav-menu');
    
    if (mobileMenuBtn && navMenu) {
        mobileMenuBtn.addEventListener('click', function() {
            navMenu.classList.toggle('active');
        });
    }
}

/**
 * Add to Cart Functionality
 */
function initAddToCart() {
    const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
    const cartCount = document.querySelector('.cart-count');
    
    if (addToCartButtons.length > 0 && cartCount) {
        // Load cart from localStorage
        let cart = JSON.parse(localStorage.getItem('skincare-cart')) || [];
        
        // Update cart count display
        updateCartCount(cart.length);
        
        // Add event listeners to all "Add to Cart" buttons
        addToCartButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Get product info from parent elements
                const productCard = this.closest('.product-card') || this.closest('.product-details-container');
                if (!productCard) return;
                
                const productTitle = productCard.querySelector('.product-title') ? 
                                    productCard.querySelector('.product-title').textContent : '';
                const productPrice = productCard.querySelector('.product-price') ? 
                                    productCard.querySelector('.product-price').textContent : '';
                const productImage = productCard.querySelector('img') ? 
                                    productCard.querySelector('img').src : '';
                
                // Get quantity (default to 1 if not on product details page)
                const quantityInput = productCard.querySelector('.quantity-input');
                const quantity = quantityInput ? parseInt(quantityInput.value) : 1;
                
                // Create product object
                const product = {
                    id: generateProductId(productTitle),
                    title: productTitle,
                    price: productPrice,
                    image: productImage,
                    quantity: quantity
                };
                
                // Add to cart
                addProductToCart(product);
                
                // Show success message
                showNotification('The product has been added to the shopping cart!');
            });
        });
    }
}

/**
 * Generate a simple product ID from the title
 */
function generateProductId(title) {
    return title.toLowerCase().replace(/\s+/g, '-') + '-' + Math.floor(Math.random() * 1000);
}

/**
 * Add product to cart
 */
function addProductToCart(product) {
    // Get current cart
    let cart = JSON.parse(localStorage.getItem('skincare-cart')) || [];
    
    // Check if product already exists in cart
    const existingProductIndex = cart.findIndex(item => item.id === product.id);
    
    if (existingProductIndex > -1) {
        // Update quantity if product already exists
        cart[existingProductIndex].quantity += product.quantity;
    } else {
        // Add new product to cart
        cart.push(product);
    }
    
    // Save updated cart to localStorage
    localStorage.setItem('skincare-cart', JSON.stringify(cart));
    
    // Update cart count display
    updateCartCount(cart.length);
}

/**
 * Update cart count display
 */
function updateCartCount(count) {
    const cartCount = document.querySelector('.cart-count');
    if (cartCount) {
        cartCount.textContent = count;
    }
}

/**
 * Initialize quantity selector on product details page
 */
function initQuantitySelector() {
    const quantityInput = document.querySelector('.quantity-input');
    const decreaseBtn = document.querySelector('.quantity-btn.decrease');
    const increaseBtn = document.querySelector('.quantity-btn.increase');
    
    if (quantityInput && decreaseBtn && increaseBtn) {
        decreaseBtn.addEventListener('click', function() {
            let value = parseInt(quantityInput.value);
            if (value > 1) {
                quantityInput.value = value - 1;
            }
        });
        
        increaseBtn.addEventListener('click', function() {
            let value = parseInt(quantityInput.value);
            quantityInput.value = value + 1;
        });
        
        // Ensure quantity is always a valid number
        quantityInput.addEventListener('change', function() {
            let value = parseInt(this.value);
            if (isNaN(value) || value < 1) {
                this.value = 1;
            }
        });
    }
}

/**
 * Initialize product gallery on product details page
 */
function initProductGallery() {
    const mainImage = document.querySelector('.main-image img');
    const thumbnails = document.querySelectorAll('.thumbnail');
    
    if (mainImage && thumbnails.length > 0) {
        thumbnails.forEach(thumbnail => {
            thumbnail.addEventListener('click', function() {
                // Update main image src
                const newSrc = this.querySelector('img').src;
                mainImage.src = newSrc;
                
                // Update active thumbnail
                thumbnails.forEach(t => t.classList.remove('active'));
                this.classList.add('active');
            });
        });
    }
}

/**
 * Initialize newsletter form
 */
function initNewsletterForm() {
    const newsletterForm = document.querySelector('.newsletter-form');
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const emailInput = this.querySelector('input[type="email"]');
            const email = emailInput.value.trim();
            
            if (email) {
                // In a real application, you would send this to a server
                console.log('Newsletter subscription for:', email);
                
                // Show success message
                showNotification('Thank you for subscribing to our newsletter.');
                
                // Clear the form
                emailInput.value = '';
            }
        });
    }
}

/**
 * Show notification message
 */
function showNotification(message) {
    // Create notification element if it doesn't exist
    let notification = document.querySelector('.notification');
    
    if (!notification) {
        notification = document.createElement('div');
        notification.className = 'notification';
        document.body.appendChild(notification);
        
        // Add styles to notification
        notification.style.position = 'fixed';
        notification.style.bottom = '20px';
        notification.style.right = '20px';
        notification.style.backgroundColor = 'var(--accent-color)';
        notification.style.color = 'var(--light-text)';
        notification.style.padding = '10px 20px';
        notification.style.borderRadius = 'var(--border-radius-sm)';
        notification.style.boxShadow = 'var(--box-shadow)';
        notification.style.zIndex = '1000';
        notification.style.opacity = '0';
        notification.style.transform = 'translateY(20px)';
        notification.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    }
    
    // Set message and show notification
    notification.textContent = message;
    notification.style.opacity = '1';
    notification.style.transform = 'translateY(0)';
    
    // Hide notification after 3 seconds
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateY(20px)';
    }, 3000);
}

/**
 * Load and display cart items on cart page
 */
function loadCartItems() {
    const cartItemsContainer = document.querySelector('.cart-items');
    
    if (cartItemsContainer) {
        // Get cart from localStorage
        const cart = JSON.parse(localStorage.getItem('skincare-cart')) || [];
        
        if (cart.length === 0) {
            // Display empty cart message
            cartItemsContainer.innerHTML = '<div class="empty-cart"><p>Empty Cart Shop Now</p><a href="../products/product-list.html" class="btn">Shop Now</a></div>';
            return;
        }
        
        // Clear container
        cartItemsContainer.innerHTML = '';
        
        // Add cart header
        const cartHeader = document.createElement('div');
        cartHeader.className = 'cart-header';
        cartHeader.innerHTML = `
            <div>Product</div>
            <div>Price   </div>
            <div>Quantity</div>
            <div>Total</div>
            <div></div>
        `;
        cartItemsContainer.appendChild(cartHeader);
        
        // Calculate total
        let total = 0;
        
        // Add cart items
        cart.forEach(item => {
            // Extract price as number
            const priceText = item.price;
            const priceMatch = priceText.match(/\d+(\.\d+)?/);
            const price = priceMatch ? parseFloat(priceMatch[0]) : 0;
            
            // Calculate item total
            const itemTotal = price * item.quantity;
            total += itemTotal;
            
            // Create cart item element
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                <div class="cart-product">
                    <div class="cart-product-image">
                        <img src="${item.image}" alt="${item.title}">
                    </div>
                    <div class="cart-product-info">
                        <h4>${item.title}</h4>
                    </div>
                </div>
                <div class="cart-price">${item.price}</div>
                <div class="cart-quantity">
                    <button class="quantity-btn decrease" data-id="${item.id}">-</button>
                    <input type="number" value="${item.quantity}" min="1" class="quantity-input" data-id="${item.id}">
                    <button class="quantity-btn increase" data-id="${item.id}">+</button>
                </div>
                <div class="cart-item-total">${itemTotal.toFixed(2)} S.R</div>
                <div class="cart-remove" data-id="${item.id}"><i class="fas fa-trash"></i></div>
            `;
            
            cartItemsContainer.appendChild(cartItem);
        });
        
        // Add cart summary
        const cartSummary = document.createElement('div');
        cartSummary.className = 'cart-summary';
        cartSummary.innerHTML = `
            <div class="summary-row">
                <span> Subtotal: </span>
                <span>${total.toFixed(2)} S.R</span>
            </div>
            <div class="summary-row">
                <span>Shipping:</span>
                <span>Free</span>
            </div>
            <div class="summary-row total">
                <span> Total: </span>
                <span>${total.toFixed(2)} S.R</span>
            </div>
            <a href="../pages/checkout.html" class="btn checkout-btn">Checkout</a>
        `;
        
        cartItemsContainer.appendChild(cartSummary);
        
        // Add event listeners for quantity buttons and remove buttons
        initCartControls();
    }
}

/**
 * Initialize cart controls (quantity buttons and remove buttons)
 */
function initCartControls() {
    // Quantity decrease buttons
    const decreaseButtons = document.querySelectorAll('.cart-quantity .decrease');
    decreaseButtons.forEach(button => {
        button.addEventListener('click', function() {
            const id = this.getAttribute('data-id');
            updateCartItemQuantity(id, 'decrease');
        });
    });
    
    // Quantity increase buttons
    const increaseButtons = document.querySelectorAll('.cart-quantity .increase');
    increaseButtons.forEach(button => {
        button.addEventListener('click', function() {
            const id = this.getAttribute('data-id');
            updateCartItemQuantity(id, 'increase');
        });
    });
    
    // Quantity input fields
    const quantityInputs = document.querySelectorAll('.cart-quantity .quantity-input');
    quantityInputs.forEach(input => {
        input.addEventListener('change', function() {
            const id = this.getAttribute('data-id');
            const value = parseInt(this.value);
            
            if (isNaN(value) || value < 1) {
                this.value = 1;
                updateCartItemQuantity(id, 'set', 1);
            } else {
                updateCartItemQuantity(id, 'set', value);
            }
        });
    });
    
    // Remove buttons
    const removeButtons = document.querySelectorAll('.cart-remove');
    removeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const id = this.getAttribute('data-id');
            removeCartItem(id);
        });
    });
}

/**
 * Update cart item quantity
 */
function updateCartItemQuantity(id, action, value = null) {
    // Get cart from localStorage
    let cart = JSON.parse(localStorage.getItem('skincare-cart')) || [];
    
    // Find the item
    const itemIndex = cart.findIndex(item => item.id === id);
    
    if (itemIndex > -1) {
        // Update quantity based on action
        if (action === 'decrease' && cart[itemIndex].quantity > 1) {
            cart[itemIndex].quantity -= 1;
        } else if (action === 'increase') {
            cart[itemIndex].quantity += 1;
        } else if (action === 'set' && value !== null) {
            cart[itemIndex].quantity = value;
        }
        
        // Save updated cart to localStorage
        localStorage.setItem('skincare-cart', JSON.stringify(cart));
        
        // Reload cart items
        loadCartItems();
    }
}

/**
 * Remove item from cart
 */
function removeCartItem(id) {
    // Get cart from localStorage
    let cart = JSON.parse(localStorage.getItem('skincare-cart')) || [];
    
    // Remove the item
    cart = cart.filter(item => item.id !== id);
    
    // Save updated cart to localStorage
    localStorage.setItem('skincare-cart', JSON.stringify(cart));
    
    // Update cart count
    updateCartCount(cart.length);
    
    // Reload cart items
    loadCartItems();
}

/**
 * Initialize checkout form
 */
function initCheckoutForm() {
    const checkoutForm = document.querySelector('.checkout-form');
    
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // In a real application, you would validate and process the form data
            
            // Show success message
            showNotification('Your request has been successfully submitted!');
            
            // Clear cart
            localStorage.removeItem('skincare-cart');
            
            // Redirect to thank you page or home page
            setTimeout(() => {
                window.location.href = '../index.html';
            }, 2000);
        });
    }
}

/**
 * Initialize contact form
 */
function initContactForm() {
    const contactForm = document.querySelector('.contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // In a real application, you would validate and process the form data
            
            // Show success message
            showNotification('Your message has been sent successfully!');
            
            // Clear form
            this.reset();
        });
    }
}

// Check if we're on the cart page and load cart items
if (window.location.pathname.includes('cart.html')) {
    loadCartItems();
}

// Check if we're on the checkout page and initialize checkout form
if (window.location.pathname.includes('checkout.html')) {
    initCheckoutForm();
}

// Check if we're on the contact page and initialize contact form
if (window.location.pathname.includes('contact.html')) {
    initContactForm();
}
