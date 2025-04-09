
document.addEventListener('DOMContentLoaded', function () {
    // Cart functionality
    const cart = [];
    const cartButton = document.getElementById('cartButton');
    const cartModal = document.getElementById('cartModal');
    const closeCart = document.getElementById('closeCart');
    const cartItems = document.getElementById('cartItems');
    const cartBadge = document.getElementById('cartBadge');
    const exportBtn = document.getElementById('exportOrder');
    const totalPrice = document.getElementById('totalPrice');

    // Filter functionality
    const filterChips = document.querySelectorAll('.filter-chip');
    const categorySections = document.querySelectorAll('.category-section');
    const searchInput = document.getElementById('searchInput');

    // Add to cart buttons
    const addToCartButtons = document.querySelectorAll('.add-to-cart');

    // Toggle cart modal
    cartButton.addEventListener('click', function () {
        cartModal.style.display = 'flex';
        renderCart();
    });

    closeCart.addEventListener('click', function () {
        cartModal.style.display = 'none';
    });

    // Add to cart functionality
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function () {
            const menuItem = this.closest('.menu-item');
            const itemName = menuItem.querySelector('.item-title').textContent;
            const itemPrice = parseInt(menuItem.querySelector('.item-price').textContent.replace(/,/g, ''));
            const itemImage = menuItem.querySelector('.item-image').src;

            // Check if item already in cart
            const existingItem = cart.find(item => item.name === itemName);
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                cart.push({
                    name: itemName,
                    price: itemPrice,
                    quantity: 1,
                    image: itemImage
                });
            }

            // Update cart badge
            cartBadge.textContent = cart.reduce((total, item) => total + item.quantity, 0);

            // Show feedback
            this.innerHTML = '<i class="fas fa-check"></i>';
            setTimeout(() => {
                this.innerHTML = '<i class="fas fa-plus"></i>';
            }, 1000);
        });
    });

    // Render cart items
    function renderCart() {
        cartItems.innerHTML = '';
        let total = 0;

        if (cart.length === 0) {
            cartItems.innerHTML = '<p style="text-align: center; padding: 2rem;">سبد خرید شما خالی است</p>';
            totalPrice.textContent = 'جمع کل: 0 تومان';
            return;
        }

        cart.forEach((item, index) => {
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                <div class="cart-item-info">
                    <img src="${item.image}" alt="${item.name}" class="cart-item-img">
                    <div>
                        <div>${item.name}</div>
                        <div>${item.price.toLocaleString()} تومان</div>
                    </div>
                </div>
                <div class="cart-item-quantity">
                    <button class="quantity-btn decrease" data-index="${index}">-</button>
                    <span>${item.quantity}</span>
                    <button class="quantity-btn increase" data-index="${index}">+</button>
                </div>
            `;
            cartItems.appendChild(cartItem);

            total += item.price * item.quantity;
        });

        totalPrice.textContent = `جمع کل: ${total.toLocaleString()} تومان`;

        // Add event listeners to quantity buttons
        document.querySelectorAll('.decrease').forEach(btn => {
            btn.addEventListener('click', function () {
                const index = parseInt(this.dataset.index);
                if (cart[index].quantity > 1) {
                    cart[index].quantity -= 1;
                } else {
                    cart.splice(index, 1);
                }
                renderCart();
                cartBadge.textContent = cart.reduce((total, item) => total + item.quantity, 0);
            });
        });

        document.querySelectorAll('.increase').forEach(btn => {
            btn.addEventListener('click', function () {
                const index = parseInt(this.dataset.index);
                cart[index].quantity += 1;
                renderCart();
                cartBadge.textContent = cart.reduce((total, item) => total + item.quantity, 0);
            });
        });
    }

    // Export order functionality
    exportBtn.addEventListener('click', function () {
        if (cart.length === 0) {
            alert('سبد خرید شما خالی است');
            return;
        }

        let orderText = 'سفارش از رستوران WEEKEND\n\n';
        orderText += 'تاریخ: ' + new Date().toLocaleString('fa-IR') + '\n\n';
        orderText += 'موارد سفارش:\n';

        cart.forEach(item => {
            orderText += `- ${item.name} (${item.quantity} عدد) - ${item.price.toLocaleString()} تومان\n`;
        });

        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        orderText += `\nجمع کل: ${total.toLocaleString()} تومان`;

        // Create a blob and download link
        const blob = new Blob([orderText], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `سفارش_WEEKEND_${new Date().toISOString().slice(0, 10)}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    });

    // Filter functionality
    filterChips.forEach(chip => {
        chip.addEventListener('click', function () {
            filterChips.forEach(c => c.classList.remove('active'));
            this.classList.add('active');

            const category = this.dataset.category;

            categorySections.forEach(section => {
                if (category === 'all' || section.dataset.category === category) {
                    section.style.display = 'block';
                } else {
                    section.style.display = 'none';
                }
            });
        });
    });

    // Search functionality
    // searchInput.addEventListener('input', function () {
    //     const searchTerm = this.value.toLowerCase();

    //     document.querySelectorAll('.menu-item').forEach(item => {
    //         const itemName = item.querySelector('.item-title').textContent.toLowerCase();
    //         const itemDesc = item.querySelector('.item-desc').textContent.toLowerCase();

    //         if (itemName.includes(searchTerm) || itemDesc.includes(searchTerm)) {
    //             item.style.display = 'flex';
    //         } else {
    //             item.style.display = 'none';
    //         }
    //     });
    // });
});
