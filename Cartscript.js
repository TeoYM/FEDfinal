// Retrieve cart items from local storage
let cartItems = JSON.parse(localStorage.getItem('cart')) || [];
const cartContainer = document.getElementById('cart-items');
const cartTotalElement = document.getElementById('cart-total');
const cartPointsElement = document.getElementById('cart-points');

// Declare a global variable to store points
let pointsEarned = 0;

// Function to render cart items on the page
function renderCartItems() {
    cartContainer.innerHTML = '';
    cartItems.forEach((item, index) => {
        const cartItemElement = document.createElement('div');
        cartItemElement.className = 'cart-item';
        cartItemElement.innerHTML = `
            <img src="${item.image}" alt="${item.name}" class="img-fluid">
            <h4 class="mt-3">Item Name: ${item.title}</h4>
            <p>Price: $${item.price}</p>
            <button class="btn btn-danger" onclick="removeFromCart(${index})">Remove</button>
        `;
        cartContainer.appendChild(cartItemElement);
    });
    updateTotal();
}

function updateTotal() {
    const total = cartItems.reduce((acc, item) => acc + item.price, 0);
    cartTotalElement.textContent = total.toFixed(2);
    // Update the points globally
    pointsEarned = Math.round(total * 0.05);
    cartPointsElement.textContent = pointsEarned;
}


function removeFromCart(index) {
    cartItems.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cartItems));
    renderCartItems();
}

// Function to calculate and update the total
function updatePoints() {
    const points = Math.round(cartItems.reduce((acc, item) => acc + item.price, 0) * 0.05);
    document.getElementById('cart-points').textContent = points;
}

// Function to make payment
async function makePayment() {
    // Calculate points
    const total = cartItems.reduce((acc, item) => acc + item.price, 0);
    const discountCode = document.getElementById('Discountcode').value;
    const isDiscountCodeValid = isValidDiscountCode(discountCode);

    // If the discount code is valid, apply the discount
    if (isDiscountCodeValid) {
        alert('Discount code applied! $5 off.');
        total -= 5; // Apply a $5 discount
    }
    pointsEarned = Math.round(total * 0.05);
    const cardNumber = document.getElementById('cardnumber').value;
    const cvv = document.getElementById('cvv').value;
    if (!isValidCreditCard(cardNumber)) {
        alert('Please enter a valid 16-digit credit card number.');
        return;
    }
    // Validate CVV
    if (!isValidCVV(cvv)) {
        alert('Please enter a valid 3 or 4-digit CVV.');
        return;
    }
    // Get authenticated user data from local storage
    const authenticatedUser = JSON.parse(localStorage.getItem('authenticatedUser'));

    // Check if the user is authenticated
    if (authenticatedUser) {
        try {
            localStorage.setItem('OrderedItems',JSON.stringify(cartItems))
            cartItems = [];
            // Update the local storage for the cart
            localStorage.setItem('cart', JSON.stringify(cartItems));

            // Alert and redirect
            alert('Payment successful!');
            const APIKEY = "65b11466a07ee8418b038306";
            const userId = localStorage.getItem('userId');
            const currentpoints = Number(localStorage.getItem('Points'));
            const newPoints = currentpoints + pointsEarned;
            const dataToUpdate = {
                Points: newPoints 
            }; 
            console.log('Data to update:', dataToUpdate);
            fetch(`https://userdata-f68d.restdb.io/rest/contact-info/${userId}`, {
                method: 'PUT', // or 'PATCH' if your API supports it
                headers: {
                    "Content-Type": "application/json",
                    "x-apikey": APIKEY,
                    "Cache-Control": "no-cache"
                    
                },
                body: JSON.stringify(
                    {
                        Points: Number(currentpoints + pointsEarned)
                    }
                ),
            })
            window.location.href = "index1.html";
        } catch (error) {
            console.error('Error updating points in the database:', error);
            alert('Error during payment. Please try again later.');
        }
    } else {
        console.error('User not authenticated. Unable to update points in the database.');
        alert('Error during payment. Please try again later.');
    }
}


function showSecondForm() {
    // Validate form 1 data here if needed
    // For now, let's assume the form is always valid

    // Hide the first form
    document.getElementById('form1').style.display = 'none';

    // Show the second form
    document.getElementById('form2').style.display = 'block';

    // Return false to prevent form submission (since we are handling it with JavaScript)
    return false;
}

// Initial rendering
renderCartItems();
function isValidCreditCard(cardNumber) {
    // Remove spaces and dashes from the card number
    const cleanedCardNumber = cardNumber.replace(/[\s-]/g, '');

    // Check if the cleaned card number has exactly 16 digits
    return /^\d{16}$/.test(cleanedCardNumber);
}

function isValidCVV(cvv) {
    // Check if the CVV has 3 or 4 digits
    return /^\d{3,4}$/.test(cvv);
}
function isValidDiscountCode(discountCode) {
    // Check if the discount code has exactly 8 characters
    return discountCode.length === 8;
}
