
document.addEventListener("DOMContentLoaded", function() {
    const APIKEY = "65b11466a07ee8418b038306";
    // getContacts(); // Make sure this function is defined somewhere in your code
  
    let signupForm = document.getElementById("signup-form");
    signupForm.addEventListener("submit", function(e) {
        e.preventDefault();
  
        let additionalPoints = 0;
        let password = document.getElementById("password").value;
        let passwordCheck = document.getElementById("password-check").value;        
        let friendCode = document.getElementById("friendCode").value;

        // Check if the friend code is valid (you may need to implement a proper validation logic)
        if (friendCode.length === 8) {
            // If valid, award 10 points
            additionalPoints += 10;
        }

        // Check if password and confirm password are the same
        if (password !== passwordCheck) {
            alert("Password and Confirm Password must be the same.");
            return;
        }
  
        let name = document.getElementById("name").value;
        let username = document.getElementById("username").value;
        let email = document.getElementById("email").value;
        let phonenumber = document.getElementById("phonenumber").value;
        let points = 0;
        let tier = "Ordinary"
        let dailylogin = 1;
        let lastlogin = new Date();
  
        let jsondata = {
            "Name": name,
            "Username": username,
            "EmailAddress": email,
            "Password": password,
            "Phonenumber": phonenumber,
            "Points": points + additionalPoints,
            "tier": tier,
            "dailylogin": dailylogin,
            "lastlogin": lastlogin
        };
  
        let settings = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-apikey": APIKEY,
                "Cache-Control": "no-cache"
            },
            body: JSON.stringify(jsondata),
        };
  
        // Disable the submit button here
        document.getElementById("contact-submit").disabled = true;
  
        fetch("https://userdata-f68d.restdb.io/rest/contact-info", settings)
            .then(response => response.json())
            .then(data => {
                console.log(data);
                document.getElementById("contact-submit").disabled = false;
                 //getContacts(APIKEY); // Make sure this function is defined somewhere in your code
                document.getElementById("signup-success-message").style.display = "block";


                // Clear the form
                signupForm.reset();
                window.location.href = "../index.html";
            })
            .catch(error => {
                console.error('Error:', error);
                document.getElementById("contact-submit").disabled = false;
            });          
    });  
    function getContacts(APIKEY) {
        let settings = {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "x-apikey": APIKEY,
                "Cache-Control": "no-cache"
            },
        };

        fetch("https://userdata-f68d.restdb.io/rest/contact-info", settings)
            .then(response => response.json())
            .then(data => {
                // Assuming each data entry has a unique identifier, use the username as the key in the dictionary
                let contactsDictionary = {};
                data.forEach(contact => {
                    contactsDictionary[contact.Username] = contact;
                });

                console.log("Contacts Dictionary:", contactsDictionary);
                document.getElementById("login-form").addEventListener("submit", function (e) {
                    e.preventDefault();
      
                    let loginUsername = document.getElementById("Login-username").value;
                    let loginPassword = document.getElementById("Login-password").value;
      
                    if (!contactsDictionary[loginUsername]) {
                      alert("User not registered");
                    } else if (contactsDictionary[loginUsername].Password !== loginPassword) {
                      alert("Wrong password");
                    } else {
                      alert("Login success");
                    }
                  });
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }
});
// if log in successful add the username and password to local storage

document.addEventListener("DOMContentLoaded", function () {
    const APIKEY = "65b11466a07ee8418b038306";
  
    document.getElementById("Log-in").addEventListener("submit", function (e) {
      e.preventDefault();
  
      let loginUsername = document.getElementById("Login-username").value;
      let loginPassword = document.getElementById("Login-password").value;
  
      // Simulate a login check (replace this with your actual authentication logic)
      authenticateUser(APIKEY, loginUsername, loginPassword);
    });
  
    function authenticateUser(apiKey, username, password) {
    // Fetch user data from the API (replace this with your actual API call)
    fetch(`https://userdata-f68d.restdb.io/rest/contact-info?Username=${username}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-apikey": apiKey,
        "Cache-Control": "no-cache"
      },
    })
      .then(response => response.json())
      .then(data => {
        let user = data.find(user => user.Username === username && user.Password === password);
        if (user) {
          // Show the Lottie animation
          document.body.style.backgroundColor = 'white';
          // document.getElementById('lottieContainer').removeAttribute('hidden');
          document.getElementById('lottieContainer').removeAttribute('hidden');
          const lottiePlayer = document.createElement('dotlottie-player');
          lottiePlayer.setAttribute('src', 'https://lottie.host/fd5cc3a4-2683-4e6e-81c0-85f4c2ec16c2/cwV5WLalOi.json');
          lottiePlayer.setAttribute('background', 'white');
          lottiePlayer.setAttribute('speed', '1');
          lottiePlayer.setAttribute('style', 'width: 100vw; height: 100vh;');
          lottiePlayer.setAttribute('loop', '');
          lottiePlayer.setAttribute('autoplay', '');
          document.getElementById('lottieContainer').appendChild(lottiePlayer);

          setTimeout(() => {
            localStorage.setItem('authenticatedUser', JSON.stringify(user));
            //alert("Login success");
            window.location.href = "HTML/index1.html";
          }, 3000); // Wait for 3 seconds
        } else {
          alert("Invalid credentials");
        }
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }
  
  });


// load the local storage into the profile page
// document.addEventListener("DOMContentLoaded", function () {
//     // Retrieve user data from localStorage
//     const authenticatedUser = JSON.parse(localStorage.getItem('authenticatedUser'));
  
//     if (authenticatedUser) {
//       // Update user info with the username
//       const usernameDisplay = document.getElementById('usernameDisplay');
//       usernameDisplay.innerText = authenticatedUser.Username;
//     } else {
//       // Handle the case when the user is not authenticated
//       console.log("User not authenticated");
//     }
//     window.addEventListener("beforeunload", function () {
//       localStorage.removeItem('authenticatedUser');
//     });
//   });

//navigation menu
const hamburger = document.querySelector(".hamburger");
const navMenu = document.querySelector(".nav-menu");

hamburger.addEventListener("click",() => {
    hamburger.classList.toggle("active");
    navMenu.classList.toggle("active");
})

document.querySelectorAll(".nav-link").forEach(n => n.
addEventListener("click", ()=>{
    hamburger.classList.remove("active");
    navMenu.classList.remove("active");
}))




document.addEventListener("DOMContentLoaded", function () {
    // Retrieve user data from localStorage
    const authenticatedUser = JSON.parse(localStorage.getItem('authenticatedUser'));
  
    if (authenticatedUser) {
      // User is authenticated, you can use the data as needed
      console.log("Authenticated User:", authenticatedUser);
    } else {
      // User is not authenticated, handle accordingly
      console.log("User not authenticated");
    }
  });





const wrapper = document.querySelector('.cards-wrapper');
// grab the dots
const dots = document.querySelectorAll('.dot');
// the default active dot num which is array[0]
let activeDotNum = 0;

dots.forEach((dot, idx) => {  
//   number each dot according to array index
  dot.setAttribute('data-num', idx);
  
//   add a click event listener to each dot
  dot.addEventListener('click', (e) => {
    
    let clickedDotNum = e.target.dataset.num;
    // console.log(clickedDotNum);
//     if the dot clicked is already active, then do nothing
    if(clickedDotNum == activeDotNum) {
      // console.log('active');
      return;
    }
    else {
      // console.log('not active');
      // shift the wrapper
      let displayArea = wrapper.parentElement.clientWidth;
      // let pixels = -wrapper.clientWidth * clickedDotNum;
      let pixels = -displayArea * clickedDotNum
      wrapper.style.transform = 'translateX('+ pixels + 'px)';
//       remove the active class from the active dot
      dots[activeDotNum].classList.remove('active');
//       add the active class to the clicked dot
      dots[clickedDotNum].classList.add('active');
//       now set the active dot number to the clicked dot;
      activeDotNum = clickedDotNum;
    }
    
  });
});
// const productsContainer = document.getElementById('products-container');

//     fetch('https://fakestoreapi.com/products')
//         .then(res => res.json())
//         .then(products => {
//             // Process the products and update the DOM
//             products.forEach(product => {
//                 const productElement = document.createElement('div');
//                 productElement.innerHTML = `
//                 <img src="${product.image}" alt="${product.title}" style = "max-width: 250px; height: 250px;">
//                 <h3>${product.title}</h3>
//                 <p>Price: $${product.price}</p>
//                 `;
//                 productsContainer.appendChild(productElement);
//             });
//         })
//         .catch(error => console.error('Error:', error));

//localStorage.removeItem('authenticatedUser');

