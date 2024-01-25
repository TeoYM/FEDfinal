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
