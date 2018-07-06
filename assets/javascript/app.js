function start() {

    IN.Event.on(IN, "auth", getProfileData);
    // $("#page-2").show();

    // Logout user
    function logout(){
       

      IN.User.logout(onLogout);
    //   $("#page-2").hide();
    }
  
    function onLogout(){
      console.log('Logout successfully');
      location.reload();
    }
  
    $( "#logout" ).click(function() {
      console.log("onclick");
      logout();
    });
  
    // Use the API call wrapper to request the member's basic profile data
    
    function getProfileData() {
      IN.API.Profile("me").fields("first-name", "last-name", "email-address","picture-url",
          "summary", "specialties", "industry", "positions").result(function (data) {
        var userdata = data.values[0];

        var name = userdata.firstName + " " + userdata.lastName;
        var imageUrl = userdata.pictureUrl;
        var emailAddress = userdata.emailAddress;
        var industry = userdata.industry;
        var summary = userdata.summary;

        console.log(userdata);
        dispayUserInfo( name, imageUrl,emailAddress, industry, summary);
        pullJobs();


  
      }).error(function (data) {
        console.log(data);
      });
    }
  }
  
//Display first and last name on the navbar

function dispayUserInfo(name, imageUrl, emailAddress, industry, summary ){
    $("#loggedin-user").html(name);
    $("#user-image").attr({
        'src': imageUrl,
        'height' : '195 px',
        'width' : '208 px',
        // 'border' : '1 px solid black'
    });
    $("#name").text(" " + name);
    $("#email").html(" " + emailAddress);
    $("#industry").html(" " + industry);
    $("#summary").html(" " + summary);

    // displayInTable();
}

function pullJobs(){
        var url = "https://jobs.github.com/positions.json?description=python&location=sf&full_time=true"; 
        $.ajax({
            url: url,
            method : 'GET',
            dataType: 'jsonp'
        }).then( function (response){
            console.log(response);

            for(var i = 0; i < response.length; i++){
                var datePosted = response[i].created_at;
                var location = response[i].location;
                var title = response[i].title;
                var description = response[i].description;
                // console.log(description);
                var type = response[i].type;
                var link = response[i].how_to_apply;
                // console.log(link);

                displayInTable(datePosted,location, title, type, description );
            }
        });
}

function displayInTable(datePosted,location, title, type, description ){
  var tablebody = $('<tr><td>'
                   + datePosted +'</td><td>'
                   + location + "</td><td class='CellWithComment'>"
                   + title
                   + "<span class='CellComment'>" + description + '</span></td><td>'
                   + 'description </td><td>'
                   + type + '</td><td>'
                   + "link" + '</td><tr>');
  $("#tableBody").append(tablebody);
 }

function addPreferedLocations(){
  alert("when this icon is clcked, add it to an array or firebase")
}

  $(document).ready(function() {
    // when document is ready, call the start method
    start();
    
  })

  