document.addEventListener("DOMContentLoaded", function () {
    const authenticatedUser = JSON.parse(localStorage.getItem('authenticatedUser'));
    const loginButton = document.getElementById('loginButton');
    const couponDisplay = document.getElementById('couponDisplay'); // Add this line for displaying the coupon
  
    if (authenticatedUser) {
      const lastLoginDate = authenticatedUser.lastLoginDate || null;
      const currentDate = new Date().toLocaleDateString();
  
      if (lastLoginDate !== currentDate) {
        // Update user info and perform actions for a new daily login
        const usernameDisplay = document.getElementById('usernameDisplay');
        const pointsDisplay = document.getElementById('pointsDisplay');
        const tierDisplay = document.getElementById('tierDisplay');
  
        usernameDisplay.innerText = authenticatedUser.Username;
        
        const apiTier = authenticatedUser.TierFromAPI;
        const apiPoints = authenticatedUser.PointsFromAPI;
        const points = apiPoints !== undefined ? parseInt(apiPoints) : (parseInt(authenticatedUser.Points) || 0);
        const tier = apiTier || authenticatedUser.Tier || 'Ordinary';
    
        pointsDisplay.innerText = points || '0';
    
        let tierColor = '';
    
        if (points >= 200) {
          tierColor = 'gold';
        } else if (points >= 100) {
          tierColor = 'silver';
        } else {
          tierColor = 'white';
        }
    
        tierDisplay.innerText = tier;
        tierDisplay.style.color = tierColor;
  
        // Update last login date
        authenticatedUser.lastLoginDate = currentDate;
        localStorage.setItem('authenticatedUser', JSON.stringify(authenticatedUser));
  
        // Update weekly login progress circles
        updateWeeklyProgress(currentDate);
  
        // Enable the daily login button
        loginButton.disabled = false;
  
        // Check for a successful login streak (e.g., a week)
        if (isSuccessfulLoginStreak(authenticatedUser, currentDate)) {
          // Generate a coupon code and display it
          const couponCode = generateCouponCode();
          couponDisplay.innerText = `Congratulations! Your coupon code: ${couponCode}`;
        }
  
        // Additional actions for a daily login can be added here
        console.log("Daily login success!");
      } else {
        console.log("User already logged in today");
      }
    } else {
      console.log("User not authenticated");
    }
  
    // window.addEventListener("beforeunload", function () {
    //   localStorage.removeItem('authenticatedUser');
    // });
  
    // Function to update the weekly login progress circles
    function updateWeeklyProgress(currentDate) {
      const daysOfWeek = ['day1', 'day2', 'day3', 'day4', 'day5', 'day6', 'day7'];
      const dayIndex = new Date(currentDate).getDay() - 1; // 0-based index, Sunday = 0
  
      // Update circles based on the current day's login status
      for (let i = 0; i <= dayIndex; i++) {
        const dayCircle = document.getElementById(daysOfWeek[i]);
        dayCircle.classList.add('logged-in'); // You can style this class to show a tick or change the color
      }
    }
  
    // Function to check for a successful login streak
// Function to check for a successful login streak and reset if needed
function isSuccessfulLoginStreak(user, currentDate) {
  const lastLoginDate = new Date(user.lastLoginDate);
  const currentDateTime = new Date(currentDate).getTime();
  const lastLoginDateTime = lastLoginDate.getTime();

  // Check if the difference in milliseconds is less than or equal to a day (24 hours)
  const isStreakWithinDay = currentDateTime - lastLoginDateTime <= 24 * 60 * 60 * 1000;

  // If streak is not within a day, reset the streak
  if (!isStreakWithinDay) {
      user.loginStreak = 1; // Reset the streak counter
  } else {
      user.loginStreak = (user.loginStreak || 0) + 1; // Increment the streak counter
  }

  // Update the last login date
  user.lastLoginDate = currentDate;
  localStorage.setItem('authenticatedUser', JSON.stringify(user));

  // Check if the streak is successful (adjust the threshold as needed)
  return user.loginStreak >= 7; // Considered successful after 7 consecutive logins
}

  
  
    // Function to generate a random coupon code
    function generateCouponCode() {
      const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
      const couponLength = 8;
      let couponCode = '';
  
      for (let i = 0; i < couponLength; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        couponCode += characters.charAt(randomIndex);
      }
  
      return couponCode;
    }
  
    // Function to handle the daily login button click
    function handleDailyLogin() {
      const currentDate = new Date().toLocaleDateString();
      updateWeeklyProgress(currentDate);
      console.log("Manual daily login success!");
      // Add any additional actions for a manual daily login here
    }
  
    // Attach the handleDailyLogin function to the button click event
    loginButton.addEventListener('click', handleDailyLogin);
  });
  // Add this function for the logout button click
function handleLogout() {
  // Clear user information from localStorage
  localStorage.removeItem('authenticatedUser');
  
  // Additional actions for logout can be added here
  console.log("User logged out successfully.");

  // Redirect to the login page or perform other actions as needed
  window.location.href = "Log in.html";
}
function updatePointsInProfile() {
  const pointsDisplayElement = document.getElementById('pointsDisplay');
  const storedPoints = localStorage.getItem('points');
  
  if (storedPoints) {
      pointsDisplayElement.textContent = points + storedPoints;
  } else {
      pointsDisplayElement.textContent = 'N/A'; // Set a default value if no points are stored
  }
}

// Call the function to update points when the page loads
updatePointsInProfile();