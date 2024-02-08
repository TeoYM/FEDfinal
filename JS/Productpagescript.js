const productsContainer = document.getElementById('products-container');
const cart = [];

function addToCart(product) {
    cart.push(product);
    updateCartUI();
}

function showCategory(category) {
    // Clear existing products
    productsContainer.innerHTML = '';
    document.querySelectorAll('.category-buttons button').forEach(btn => {
btn.classList.remove('active-category');
});

    // Fetch products from the API
    fetch('https://fakestoreapi.com/products')
        .then(res => res.json())
        .then(products => {
            // Filter products based on the selected category
            const filteredProducts = category === 'all'
                ? products
                : products.filter(product => product.category.toLowerCase() === category.toLowerCase());

            // Process the filtered products and update the DOM
            filteredProducts.forEach(product => {
                const productElement = document.createElement('div');
                productElement.className = 'Pcard';
                productElement.innerHTML = `
                <a href="product description.html?title=${encodeURIComponent(product.title)}&description=${encodeURIComponent(product.description)}&price=${encodeURIComponent(product.price)}&image=${encodeURIComponent(product.image)}">
                    <img src="${product.image}" class="Pcard-img-top" alt="${product.title}" width="250" height="250">
                </a>
                <div class="Pcard-body">
                    <h5 class="Pcard-title">
                        <a href="product_details.html?title=${encodeURIComponent(product.title)}&description=${encodeURIComponent(product.description)}&price=${encodeURIComponent(product.price)}">${product.title}</a>
                    </h5>
                    <p class="Pcard-text">Price: $${product.price}</p>
                    <button class="btn btn-primary" onclick="addToCart('${product.title}', ${product.price}, '${product.image}')" style="color: white; background-color: lightblue; font-size: 20px;">Add to Cart</button>
                </div>
            `;
                const btn = productElement.querySelector('.btn');
                btn.style.marginTop = 'auto';
                productsContainer.appendChild(productElement);
            });
            const activeButton = document.querySelector(`.category-buttons button[data-category="${category}"]`);
    if (activeButton) {
        activeButton.classList.add('active-category');
    }
        })
        .catch(error => console.error('Error:', error));
}

// Function to add product to cart
function addToCart(productTitle, productPrice, productImage) {
    // Create or retrieve cart from local storage
    var cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Add product to cart
    var product = {
        title: productTitle,
        price: productPrice,
        image: productImage
    };
    cart.push(product);

    // Save updated cart to local storage
    localStorage.setItem('cart', JSON.stringify(cart));

    // Display a message (you can customize this part)
    alert('Product added to cart!');
}

// Initially show all products
showCategory('all');