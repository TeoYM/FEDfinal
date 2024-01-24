//[STEP 0]: Make sure our document is A-OK
document.addEventListener("DOMContentLoaded", function() {
  // What kind of interface we want at the start 
  const APIKEY = "65b11466a07ee8418b038306";
  getContacts();

  //[STEP 1]: Create our submit form listener
  document.getElementById("contact-submit").addEventListener("click", function(e) {
      // Prevent default action of the button 
      e.preventDefault();

      //[STEP 2]: Let's retrieve form data
      // For now, we assume all information is valid
      // You are to do your own data validation
      let name = document.getElementById("name").value;
      let username = document.getElementById("username").value;
      let email = document.getElementById("email").value;
      let password = document.getElementById("password").value;
      let phonenumber = document.getElementById("phonenumber").value;

      //[STEP 3]: Get form values when the user clicks on send
      // Adapted from restdb API
      let jsondata = {
          "Name": name,
          "Username": username,
          "EmailAddress": email,
          "Password": password,
          "Phonenumber": phonenumber,
      };

      //[STEP 4]: Create our AJAX settings. Take note of API key
      let settings = {
          method: "POST", //[cher] we will use post to send info
          headers: {
              "Content-Type": "application/json",
              "x-apikey": APIKEY,
              "Cache-Control": "no-cache"
          },
          body: JSON.stringify(jsondata),
          beforeSend: function() {
              //@TODO use loading bar instead
              // Disable our button or show loading bar
              document.getElementById("contact-submit").disabled = true;
              // Clear our form using the form ID and triggering its reset feature
              //document.getElementById("add-contact-form").reset();
          }
      };

      //[STEP 5]: Send our AJAX request over to the DB and print response of the RESTDB storage to console.
      fetch("https://userdata-f68d.restdb.io/rest/contact-info", settings)
          .then(response => response.json())
          .then(data => {
              console.log(data);
              document.getElementById("contact-submit").disabled = false;
              // Update our table 
              getContacts();
          });
  });//end click 
});
