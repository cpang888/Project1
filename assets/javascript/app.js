<script type="text/javascript">
 
// Setup an event listener to make an API call once auth is complete
function onLinkedInLoad() {
  console.log("onLinkedInLoad")
 IN.Event.on(IN, "auth", getProfileData);
}

// Logout user
function logout(){
  IN.User.logout(onLogout);
}

function onLogout(){
  console.log('Logout successfully');
}

// Use the API call wrapper to request the member's basic profile data
function getProfileData() {

 IN.API.Profile("me").fields("first-name", "last-name", "email-address","picture-url",
    "summary", "specialties", "industry", "positions").result(function (data) {
  
  var userdata = data.values[0];

  console.log(userdata);
//   $.ajax({
//   //  url: "saveuser.php",
//    url: "https://api.linkedin.com/v2/me",
//    type: "post",
//    data: {"social_type": "linkedin","fname": userdata.firstName,"lname": userdata.lastName,"email": userdata.emailAddress, "profile_image": userdata.pictureUrl },
//    success: function(response){

//     $('#tableUser').css('display','block');
//     $('#fullname').text( userdata.firstName + " " + userdata.lastName);
//     $('#email').text( userdata.emailAddress );
//     $('#profile_photo').attr( 'src',userdata.pictureUrl );
//     logout();
//    }
//  });

}).error(function (data) {
  console.log(data);
});
}

</script>