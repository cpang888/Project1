var config = {
  apiKey: "AIzaSyA9m27aMxgZT72WS_2w3r7GR5hU0p_ZMTQ",
  authDomain: "project1-2fe91.firebaseapp.com",
  databaseURL: "https://project1-2fe91.firebaseio.com",
  projectId: "project1-2fe91",
  storageBucket: "project1-2fe91.appspot.com",
  messagingSenderId: "6725199791"
};

// init firebase
firebase.initializeApp(config);
// init variables
var database = firebase.database();
var locationArr = [];
var skillsArr = [];
var name = '';

// User clicks on the <+> to add location
function addPreferedLocations(){
  // alert("when this icon is clcked, add it to an array or firebase");
  var tempLocation = $("#preferedLocations").val();
  console.log("addPreferedLocations: " + tempLocation);

  if(locationArr.indexOf(tempLocation) < 0 ) {
    // add new location to array
    locationArr.push(tempLocation);
    var key = "locations"
    if (name != "") {
      key = name + "/locations";
    }
    
    // push all info to Firebase
    database.ref(key).push({
      location: tempLocation
    }).then(function(data){
      console.log(data);
    });
  }
  console.log("end addPreferedLocations");
}

// User clicks on the <+> to add skill
function addInputSkills() {
  console.log("add inout skill");
  var tempSkill = $("#inputSkills").val();
  console.log("inputSkills: " + tempSkill);

  if(skillsArr.indexOf(tempSkill) < 0 ) {
    skillsArr.push(tempSkill);
    var key = "skills"
    if (name != "") {
      key = name + "/skills";
    }
    
    // push all info to Firebase
    database.ref(key).push({
        skills: tempSkill
        // skill: JSON.stringify(tempSkill)
    }).then(function(data){
      console.log(data);
    });
  }
}

// When document is completely loaded
function start() {
  // default url to pull opening jobs
  var url = "https://jobs.github.com/positions.json?description=python&location=sf&full_time=true";
  var location = "";
  var skillSet = "";

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
      
      // TO DO
      // need to clear all input fields and table  *****
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

        name = userdata.firstName + " " + userdata.lastName;
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

  database.ref('cindy pang/locations').limitToLast(10).on("child_added", function(snapshot) {
    if(snapshot != null) {
      var key = snapshot.key;
      console.log("key: " + snapshot.key);
      console.log(snapshot.val());
      locationArr.push(snapshot.val());
      console.log("locationArr: ");
      console.log(locationArr);
    }
  });

  database.ref('cindy pang/skills').limitToLast(10).on("child_added", function(snapshot) {
    console.log(snapshot.val());
    if(snapshot != null) {
      var key = snapshot.key;
      console.log("key: " + snapshot.key);
      skillsArr.push(snapshot.val());
      console.log("skillsArr: ");
      console.log(skillsArr);
    }
  });

  // build the query on the fly based on user input
  function buildQuery() {
    console.log("buildQuery");
    if($("#preferedLocations").val() != "") {
      location = "&location=" + $("#preferedLocations").val();
    }
    console.log("location: " + location);

    // skill
    if($("#inputSkills").val() != "") {
      skillSet = "description=" + $("#inputSkills").val();
    }
    console.log("skillSet: " + skillSet);

    // get the drop down selected item
    // build the url based on the selected item 'Government Jobs' or other
    console.log("option: " + $("#thirdInputDiv :selected").text()); 
    if($("#thirdInputDiv :selected").text() === 'Government Jobs') {
      url = "https://jobs.search.gov/jobs/search.json?query=" + skillSet + "jobs+in+" + location;
    } else {
      url = "https://jobs.github.com/positions.json?" 
              + skillSet + location + "&full_time=true"; 
    }
    console.log("buildQuery::" + url);

    return url;
  }

  function saveJob() {
    // TO DO *****
    console.log($(".rowJob").datePosted);
  }

  // Click on <Submit> button
  $("#submitUserInput").click(function() {
    event.preventDefault();
    console.log("submit");

    pullJobs();
  })
  
  $("#btnPreferedLocations").click(function() {
    addPreferedLocations();
  })

  $("#btnInputSkills").click(function() {
    addInputSkills();
  })

  $("#btnSave").click(function() {
    saveJob();
  })

  $( "#tableBody tbody tr" ).on( "click", function( event ) {
    saveJob();
  })

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
     
      url = buildQuery();

      $.ajax({
          url: url,
          method : 'GET',
          dataType: 'jsonp'
      }).then( function (response){
          console.log(response);
          $("#tableBody").empty();

          if($("#thirdInputDiv :selected").text() === 'Government Jobs') {
            for(var i = 0; i < response.length; i++){
              var datePosted = response[i].start_date;
              var location = response[i].locations;
              var title = response[i].position_title;
              var description = "";
              var type = "Full Time";
              var link = response[i].url;

              displayInTable(datePosted,location, title, type, description );
            }
          } else {
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
          }
      });
  }

  function displayInTable(datePosted,location, title, type, description ){
    var tablebody = $("<tr class='rowJob'><td>"
                    + datePosted +'</td><td>'
                    + location + "</td><td class='CellWithComment'>"
                    + title
                    + "<span class='CellComment'>" + description + '</span></td><td>'
                    + "<button class='btn btn-success' id='btnSave'>Save</button> </td><td>"
                    + type + '</td><td>'
                    + "link" + '</td><tr>');
    $("#tableBody").append(tablebody);
  }
}

  $(document).ready(function() {
    // when document is ready, call the start method
    start();
  })

  

