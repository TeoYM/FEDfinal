document.addEventListener("DOMContentLoaded", function () {
  try {
    const authenticatedUserString = localStorage.getItem('authenticatedUser');
    
    if (!authenticatedUserString) {
      console.error("No authenticated user data found in local storage.");
      return;
    }

    const authenticatedUser = JSON.parse(authenticatedUserString);

    // Add or update dailylogin and lastlogin properties
    authenticatedUser.dailylogin = authenticatedUser.dailylogin ? authenticatedUser.dailylogin + 1 : 1;
    authenticatedUser.lastlogin = new Date().toISOString();

    // Update local storage
    localStorage.setItem('authenticatedUser', JSON.stringify(authenticatedUser));

    // Check if required properties exist
    if (!authenticatedUser || !authenticatedUser.Username || !authenticatedUser.Points || !authenticatedUser.tier) {
      console.error("Invalid or incomplete user data in local storage.");
      return;
    }

    const username = authenticatedUser.Username;
    const userpoints = authenticatedUser.Points;
    const tier = authenticatedUser.tier;

    // Check if HTML elements exist
    const usernameDisplay = document.getElementById('usernameDisplay');
    const tierDisplay = document.getElementById('tierDisplay');
    const pointsDisplay = document.getElementById('pointsDisplay');

    if (!usernameDisplay || !tierDisplay || !pointsDisplay) {
      console.error("One or more required HTML elements not found.");
      return;
    }

    // Update HTML content
    usernameDisplay.innerText = username;
    tierDisplay.innerText = tier;
    pointsDisplay.innerText = userpoints;

    // Display daily login progress
    displayDailyLoginProgress();

  } catch (error) {
    console.error("An error occurred:", error);
  }
});

function handleLogout() {
  // Clear user information from localStorage
  localStorage.removeItem('authenticatedUser');
  
  // Additional actions for logout can be added here
  console.log("User logged out successfully.");
  localStorage.clear();
  window.location.href = "../index.html";
}

function displayOrderedItems() {
  const orderedItemsContainer = document.getElementById('orderedItemsContainer');
  const orderedItems = JSON.parse(localStorage.getItem('OrderedItems')) || [];

  if (orderedItems.length > 0) {
      orderedItemsContainer.innerHTML = '';
      orderedItems.forEach((item, index) => {
          const orderedItemElement = document.createElement('div');
          orderedItemElement.className = 'ordered-item';
          orderedItemElement.innerHTML = `
              <img src="${item.image}" alt="${item.name}" class="img-fluid" width = "250" height = "250">
              <h4 class="mt-3">Item Name: ${item.title}</h4>
              <p>Price: $${item.price}</p>
          `;
          orderedItemsContainer.appendChild(orderedItemElement);
      });
  } else {
      orderedItemsContainer.innerHTML = '<p style = "text-align:center;">No ordered items yet.</p>';
  }
}

// Call this function to display ordered items when the page loads
displayOrderedItems();

function generateCode() {
  const randomCode = generateRandomCode();
  document.getElementById('codeDisplay').innerHTML = `Your referral code: ${randomCode}`;
}

function generateRandomCode() {
  const length = 8;
  const characters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let code = '';

  for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      code += characters.charAt(randomIndex);
  }

  return code;
}

function clearCode() {
  document.getElementById('codeDisplay').innerHTML = '';
}

function displayDailyLoginProgress() {
  const authenticatedUser = JSON.parse(localStorage.getItem('authenticatedUser'));
  let totalLogins = authenticatedUser ? authenticatedUser.dailylogin || 0 : 0;

  // Calculate the remainder when dividing total logins by 7
  const remainder = totalLogins % 7;

  // Display the circles
  for (let i = 1; i <= 7; i++) {
    const dayCircle = document.getElementById(`day${i}`);
    if (dayCircle) {
      dayCircle.style.display = 'block';
      dayCircle.classList.remove('logged-in');

      // Add special effect to the first circle
      if (i === 1) {
        dayCircle.classList.add('first-login');
      } else {
        dayCircle.classList.remove('first-login');
      }

      // Additional logic for highlighting other circles based on the remainder
      const isVisible = i <= remainder;
      if (isVisible && i !== 1) {
        dayCircle.classList.add('logged-in');
        totalLogins++; // Increment totalLogins for each visible circle
      } else {
        dayCircle.classList.remove('logged-in');
      }
    }
  }

  // Check if the user has logged in for 7 consecutive days
  if (totalLogins >= 7 && remainder === 0) {
    generateCouponCode();
  }
}




function generateCouponCode() {
  const couponCode = generateRandomCode();
  const couponDisplay = document.getElementById('couponDisplay');

  // Display coupon code to the user
  couponDisplay.innerHTML = `Congratulations! You've earned a coupon code: ${couponCode}`;
}

// Uncomment this button where you want it in the body of your HTML
// <button id="loginButton" onclick="handleDailyLogin()">Log In Today</button>

// Call this function to display ordered items when the page loads
displayOrderedItems();
function generateCode() {
  const randomCode = generateRandomCode();
  document.getElementById('codeDisplay').innerHTML = `Your referral code: ${randomCode}`;
}

function generateRandomCode() {
  const length = 8;
  const characters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let code = '';

  for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      code += characters.charAt(randomIndex);
  }

  return code;
}

function clearCode() {
  document.getElementById('codeDisplay').innerHTML = '';
}
function handleDailyLogin() {
  try {
    const authenticatedUserString = localStorage.getItem('authenticatedUser');

    if (!authenticatedUserString) {
      console.error("No authenticated user data found in local storage.");
      return;
    }

    const authenticatedUser = JSON.parse(authenticatedUserString);
    const APIKEY = "65b11466a07ee8418b038306";
    const UserId = authenticatedUser._id;
    const name = authenticatedUser.Name;
    const EmailAddress = authenticatedUser.EmailAddress;
    const password = authenticatedUser.Password;
    const Phonenumber = authenticatedUser.Phonenumber;
    const username = authenticatedUser.Username;
    const tier = authenticatedUser.tier;
    const userpoints = authenticatedUser.Points;
    const logincount = authenticatedUser.dailylogin;
    let time = new Date();
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
              "Points": userpoints,
              "tier":tier,
              "dailylogin":logincount,
              "lastlogin": time
              
          }
      ),
  })
  localStorage.setItem('authenticatedUser', JSON.stringify(authenticatedUser));

    // Check if required properties exist
    // if (!authenticatedUser || !authenticatedUser.Username || !authenticatedUser.Points || !authenticatedUser.tier) {
    //   console.error("Invalid or incomplete user data in local storage.");
    //   return;
    // }

    // Check if the user has already logged in today
    const today = new Date().toISOString().split('T')[0];
    const lastLoginDate = authenticatedUser.lastlogin ? authenticatedUser.lastlogin.split('T')[0] : '';

    if (today === lastLoginDate) {
      console.log("User has already logged in today.");
      return;
    }

    // Update daily login and last login properties
    authenticatedUser.dailylogin = authenticatedUser.dailylogin ? authenticatedUser.dailylogin + 1 : 1;
    authenticatedUser.lastlogin = today;

    // Update local storage
    localStorage.setItem('authenticatedUser', JSON.stringify(authenticatedUser));

    // Display updated daily login progress
    displayDailyLoginProgress();

    console.log("User logged in today successfully.");
    

  } catch (error) {
    console.error("An error occurred:", error);
  }
}

