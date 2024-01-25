document.addEventListener("DOMContentLoaded", function() {
    const APIKEY = "65b11466a07ee8418b038306";
    // getContacts(); // Make sure this function is defined somewhere in your code
  
    let signupForm = document.getElementById("signup-form");
    signupForm.addEventListener("submit", function(e) {
        e.preventDefault();
  
        let password = document.getElementById("password").value;
        let passwordCheck = document.getElementById("password-check").value;

        // Check if password and confirm password are the same
        if (password !== passwordCheck) {
            alert("Password and Confirm Password must be the same.");
            return;
        }
  
        let name = document.getElementById("name").value;
        let username = document.getElementById("username").value;
        let email = document.getElementById("email").value;
        let phonenumber = document.getElementById("phonenumber").value;
  
        let jsondata = {
            "Name": name,
            "Username": username,
            "EmailAddress": email,
            "Password": password,
            "Phonenumber": phonenumber,
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
                // getContacts(); // Make sure this function is defined somewhere in your code

                // Clear the form
                signupForm.reset();
            })
            .catch(error => {
                console.error('Error:', error);
                document.getElementById("contact-submit").disabled = false;
            });          
    }); 
});
// In HTML, .display-area has the width of 4 cards = 880px. Each card is 200px width and margin set to 10px.
// .display-area has a .cards-wrapper which contains all the cards. .cards-wrapper is set to display flex.
// .display-area has overflow hidden to hide the portion of cards-wrapper which extends beyond the container's width.

const wrapper = document.querySelector('.cards-wrapper');
// console.log(wrapper.clientWidth);

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
