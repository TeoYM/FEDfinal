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
    const authenticatedUserString = localStorage.getItem('authenticatedUser');
    const authenticatedUser = JSON.parse(authenticatedUserString);
    const userpoints = authenticatedUser.Points
    document.getElementById('display-points').textContent = userpoints;


}

function updateTotal() {
    const total = cartItems.reduce((acc, item) => acc + item.price, 0);
    //const discountCode = document.getElementById('Discountcode').value;
    //const isDiscountCodeValid = isValidDiscountCode(discountCode);

    let discount = 0;

    // If the discount code is valid, apply the discount
    // if (isDiscountCodeValid) {
    //     alert('Discount code applied! $5 off.');
    //     discount = 5;
    // }

    // Calculate the final price after applying the discount
    const deliveryFee = 3
    const finalPrice = total + deliveryFee - discount;

    cartTotalElement.textContent = total.toFixed(2);
    document.getElementById('discount-amount').textContent = discount.toFixed(2);
    document.getElementById('final-price').textContent = finalPrice.toFixed(2);

    // Update the points globally
    pointsEarned = Math.round(finalPrice * 0.05);
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
    // if (isDiscountCodeValid) {
    //     alert('Discount code applied! $5 off.');
    //     total -= discount; // Apply a $5 discount
    // }
    pointsEarned = Math.round(total * 0.05);
    const cardNumber = document.getElementById('cardnumber').value;
    localStorage.setItem('points',pointsEarned)
    const cvv = document.getElementById('cvv').value;
    redeemPoints();

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
            const authenticatedUserString = localStorage.getItem('authenticatedUser');
            const redeemPointsValue = localStorage.getItem('redeemedpoints');
            const authenticatedUser = JSON.parse(authenticatedUserString);
            const UserId = authenticatedUser._id;
            const name = authenticatedUser.Name;
            const EmailAddress = authenticatedUser.EmailAddress;
            const password = authenticatedUser.Password;
            const Phonenumber = authenticatedUser.Phonenumber;
            const username = authenticatedUser.Username;
            let tier = authenticatedUser.tier;
            const userpoints = authenticatedUser.Points
            console.log(userpoints)
            console.log(pointsEarned)
            const newPoints = userpoints + pointsEarned - redeemPointsValue;
            console.log(newPoints)
            if (newPoints >= 100) {
                tier = 'Gold';
              } else if (points >= 50) {
                tier = 'Silver';
              } else {
                tier = 'Ordinary';
              }
              console.log(tier)
            fetch(`https://userdata-f68d.restdb.io/rest/contact-info/${UserId}`, {
                method: 'PUT', // or 'PATCH' if your API supports it
                headers: {
                    "Content-Type": "application/json",
                    "x-apikey": APIKEY,
                    "Cache-Control": "no-cache"
                    
                },
                body: JSON.stringify(
                    {
                        "Name" : name,
                        "Username" : username,
                        "EmailAddress":EmailAddress,
                        "Password": password,
                        "Phonenumber":Phonenumber,
                        "Points": newPoints,
                        "tier":tier,
                    }
                ),
            })
            localStorage.setItem('authenticatedUser', JSON.stringify(authenticatedUser));

            console.log("success")
            //window.location.href = "index1.html";
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
// Function to apply discount
function applyDiscount() {
    const discountCodeInput = document.getElementById('Discountcode');
    const discountCode = discountCodeInput.value;
    const total = cartItems.reduce((acc, item) => acc + item.price, 0);
    const delivery = 3;

    if (isValidDiscountCode(discountCode)) {
        alert('Discount code applied! $5 off.');
        const discount = 5;
        const discountedTotal = total - discount + delivery;

        // Update the UI with the discounted total
        cartTotalElement.textContent = discountedTotal.toFixed(2);
        document.getElementById('discount-amount').textContent = discount.toFixed(2);
        document.getElementById('final-price').textContent = discountedTotal.toFixed(2);

        // Optionally, you can update the local storage or perform other actions
    } else {
        alert('Invalid discount code. Please enter a valid code.');
        // Optionally, you can clear the input field or take other actions
    }
}

function redeemPoints() {
    const redeemPointsInput = document.getElementById('redeemPoints');
    const redeemPointsValue = parseInt(redeemPointsInput.value, 10);

    // Fetch user points and final price from local storage
    const authenticatedUserString = localStorage.getItem('authenticatedUser');
    const authenticatedUser = JSON.parse(authenticatedUserString);
    let userPoints = authenticatedUser.Points;
    let finalPrice = parseFloat(document.getElementById('final-price').textContent);
    let discount = parseFloat(document.getElementById('discount-amount').textContent);

    if (redeemPointsValue > 0 && redeemPointsValue <= userPoints) {
        // Calculate the discount based on the redemption rate (e.g., 1 point = $1)
        const redemptionRate = 1;

        // Deduct the redeemed points from user points
        userPoints -= redeemPointsValue;

        // Calculate the discount based on redeemed points
        const redeemedDiscount = redeemPointsValue * redemptionRate;

        // Add the redeemed discount to the existing discount
        discount += redeemedDiscount;

        // Update the local storage with the new user points and redeemed points
        localStorage.setItem('redeemedpoints', redeemPointsValue);

        // Update the display element for user points
        document.getElementById('display-points').textContent = userPoints;

        // Update the UI with the new discount amount
        document.getElementById('discount-amount').textContent = discount.toFixed(2);

        // Update the final price by subtracting the total discount
        finalPrice -= discount;

        // Update the UI with the new final price
        document.getElementById('final-price').textContent = finalPrice.toFixed(2);

        // Optionally, you can send a request to update the user's points in the database
        // ... (Add your database update logic here)

        alert(`Successfully redeemed ${redeemPointsValue} points!`);
    } else {
        alert('Invalid points redemption amount. Please enter a valid value.');
    }
}




