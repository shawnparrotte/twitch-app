
Twitch.init({clientId: "4x25wjaou4h3wop7ih5quw2fjm4ovb4"}, function(error, status) {
  // the sdk is now loaded
});

var streamers = {};
var AllSearchArray = [];
var OnSearchArray = [];
var OffSearchArray = [];
var CurrentArray = [];
console.log(CurrentArray);
var idNum = 0;

function addStreamer(newStreamer){

  //***1*** create some local variables

  //create a new object in here that we will later push to the streamers object
  var newStreamerObject = {};
  //create an array of the property names of the global streamers object
  var streamerArray = Object.getOwnPropertyNames(streamers);
  //create an id number based on the length of the array plus one
  idNum += 1;
  //create an array of test conditions for streamer names
  var testArray = [];

  //////////////////

  //***1***// first check to see if the name is already in the streamers object

  //1.1 if there are no elements in the streamer array go to else
  if(streamerArray.length !== 0){

    //1.2 iterate through the streamerArray
    for(var i in streamerArray){
      //1.3 if the name of the current streamer is the same as the name of the supplied streamer
      if (streamers[streamerArray[i]].name == newStreamer){
        //push a negative value to the test array
        testArray.push(-1)
        //1.3 else
      } else {
        //push the current index value
        testArray.push(i);
      }
    }

    //1.4 sort the testArray in ascending order
    testArray.sort(function(a,b){
      return a-b
    })

    //1.5 if the first value of testArray is -1
    if(testArray[0] == -1){
      //1.6 message
      console.log("Already in the system")
      //1.7 return out of the addStreamer function
      return
      //1.5 else continue to the addNewStreamer function
    } else {
      addNewStreamer(newStreamer);
    }
    //else 1.1
  } else {
    //1.8 continue to the addNewStreamer function
    addNewStreamer(newStreamer);

  }

  //////////////////////

  function addNewStreamer(newStreamer){

    //***2*** create new streamer object

    //2.1 first we'll check to see if the channel even exists
    Twitch.api({method: '/channels/' + newStreamer, verb: 'GET' }, function(error, success) {
    //2.2 if there is an error of some kind
    if(error !== null){
      //2.3 log the error message
      console.log(error.status);
      //2.2 else there is no error
      } else {
        //2.4 create new object
        console.log("We're in!");
        newStreamerObject.id = idNum;
        newStreamerObject.name = newStreamer;
        newStreamerObject.status = success.status;
        newStreamerObject.logo = success.logo;
        //newStreamerObject.game = success.game;

        newStreamerObject.StreamerHTML = '<li><div class="streamer">';

        if(success.status == null){
          newStreamerObject.StreamerHTML += '<a href="https://www.twitch.tv/' + newStreamer + '"><img class="offline" src="https://assets.digital.cabinet-office.gov.uk/government/assets/blank-person-3102300fb523fc3b2fa629bc79f1df9f.png"></a>';
          newStreamerObject.StreamerHTML += '<div class="streamer-info"><h1 class="sn">' + newStreamer + '</h1><h3>Offline</h3></div><div class="close-x"><p>X</p></div></div></li>';
          OffSearchArray.push(newStreamer);
          newStreamerObject.stream = null;
          newStreamerObject.viewers = undefined;

          streamers[idNum] = newStreamerObject;
          AllSearchArray.push(newStreamer);

          var $thing = $(".selector-selected").prop('id');
          masterSelector($thing);

        } else {

          Twitch.api({method: '/streams/' + newStreamer, verb: 'GET' }, function(error2, success2) {

            console.log(success2)

            if(success2.stream == null){
              newStreamerObject.StreamerHTML += '<a href="http://www.twitch.tv/' + newStreamerObject.name + '"><img class="offline" src="' + newStreamerObject.logo + '"></a>';
              newStreamerObject.StreamerHTML += '<div class="streamer-info"><h1 class="sn">' + newStreamerObject.name + '</h1><h3>Offline</h3></div><div class="close-x"><p>X</p></div></div></li>';
              newStreamerObject.stream = null;
              newStreamerObject.viewers = undefined;

              OffSearchArray.push(newStreamer);

              streamers[idNum] = newStreamerObject;
              AllSearchArray.push(newStreamer);

              var $thing = $(".selector-selected").prop('id');
              masterSelector($thing);

            } else {
              newStreamerObject.stream = success2.stream
              newStreamerObject.viewers = success2.stream.viewers;
              newStreamerObject.StreamerHTML += '<a href="http://www.twitch.tv/' + newStreamerObject.name + '"><img class="online" src="' + newStreamerObject.logo + '"></a>';
              newStreamerObject.StreamerHTML += '<div class="streamer-info"><h1 class="sn">' + newStreamerObject.name + '</h1><h3>' + success2.stream.game + '</h3><h5>' + newStreamerObject.viewers + ' viewers</h5></div><div class="close-x"><p>X</p></div></div></li>';

              OnSearchArray.push(newStreamer);

              streamers[idNum] = newStreamerObject;
              AllSearchArray.push(newStreamer);

              var $thing = $(".selector-selected").prop('id');
              masterSelector($thing);
            }

          }); //finish second API call

        } //finish else above second API call



        $("#blast").css("display", "block");
        $("#blast h1").addClass("animated zoomIn");



        console.log($("#blast h1").attr("class"));

      } //finish else 2.2
    }); //finsih first API call
  } //finish addNewStreamer
} //finish addStreamer
