
Twitch.init({clientId: "4x25wjaou4h3wop7ih5quw2fjm4ovb4"}, function(error, status) {
  // the sdk is now loaded
});

//creates streamers object
var streamers = {}
//creates streamers array
var AllSearchArray = []
var OnSearchArray = []
var OffSearchArray = []
var CurrentArray = []
//creates unique ids for each streamer *** might need to change this with local storage
var idNum = 0
var lsArray = (localStorage.twitchStreamers).split(",")
console.log(lsArray)


//the main addStreamer function
function addStreamer(newStreamer){

  //***1*** create some local variables

  //create a new object in here that we will later push to the streamers object
  var newStreamerObject = {}
  //create an array of the property names of the global streamers object
  var streamerArray = Object.getOwnPropertyNames(streamers)
  //add one to the current state of the id number
  idNum += 1
  //create an array of test conditions for streamer names
  var testArray = []

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
        //push the current idNum value
        testArray.push(i)
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
    addNewStreamer(newStreamer)

  }

  //////////////////////

  function addNewStreamer(newStreamer){

    //***2*** create new streamer object

    //2.1 first we'll check to see if the channel even exists
    Twitch.api({method: '/channels/' + newStreamer, verb: 'GET' }, function(error, success) {
    //2.2 if there is an error of some kind
    if(error !== null){
      //2.3 log the error message
      console.log(error.status)
      //2.2 else there is no error
      } else {
        //2.4 create new object

        //id is idNum
        newStreamerObject.id = idNum
        //name is supplied username
        newStreamerObject.name = newStreamer
        //status is the users status
        newStreamerObject.status = success.status
        //logo is logo
        newStreamerObject.logo = success.logo
        //2.5 start HTML
        newStreamerObject.StreamerHTML = '<li><div class="streamer">';
        //2.6 if the status is null the user is no longer registered...
        if(success.status == null){

          //2.7 add null HTML
          newStreamerObject.StreamerHTML += '<a href="https://www.twitch.tv/' + newStreamer + '"><img class="offline" src="https://assets.digital.cabinet-office.gov.uk/government/assets/blank-person-3102300fb523fc3b2fa629bc79f1df9f.png"></a>';
          newStreamerObject.StreamerHTML += '<div class="streamer-info"><h1 class="sn">' + newStreamer + '</h1><h3>Offline</h3></div><div class="close-x"><p>X</p></div></div></li>';
          //2.8 push streamer into the Off array
          OffSearchArray.push(newStreamer)
          //2.9 stream object is null
          newStreamerObject.stream = null
          //2.1.0 viewers is undefined
          newStreamerObject.viewers = undefined

          defaultStreamer();

        //2.6 else
        } else {
          //2.1.3 check if the streamer is streaming
          Twitch.api({method: '/streams/' + newStreamer, verb: 'GET' }, function(error2, success2) {

            //2.1.4 if stream is null they are not streaming
            if(success2.stream == null){
              //2.1.5 add html data
              newStreamerObject.StreamerHTML += '<a href="http://www.twitch.tv/' + newStreamerObject.name + '"><img class="offline" src="' + newStreamerObject.logo + '"></a>';
              newStreamerObject.StreamerHTML += '<div class="streamer-info"><h1 class="sn">' + newStreamerObject.name + '</h1><h3>Offline</h3></div><div class="close-x"><p>X</p></div></div></li>';
              //2.1.6 stream is null
              newStreamerObject.stream = null
              //2.1.7 viewers is undefined
              newStreamerObject.viewers = undefined
              //2.1.8 push streamer to Off array
              OffSearchArray.push(newStreamer)

              defaultStreamer();

            //2.1.4 else
            } else {
              //2.2.1 add stream object to streamer
              newStreamerObject.stream = success2.stream
              //2.2.2 add viewers to streamer
              newStreamerObject.viewers = success2.stream.viewers;
              //2.2.3 add HTML
              newStreamerObject.StreamerHTML += '<a href="http://www.twitch.tv/' + newStreamerObject.name + '"><img class="online" src="' + newStreamerObject.logo + '"></a>';
              newStreamerObject.StreamerHTML += '<div class="streamer-info"><h1 class="sn">' + newStreamerObject.name + '</h1><h3>' + success2.stream.game + '</h3><h5>' + newStreamerObject.viewers + ' viewers</h5></div><div class="close-x"><p>X</p></div></div></li>';
              //2.2.4 push streamer to On array
              OnSearchArray.push(newStreamer);

              defaultStreamer();

            }

          }); //finish second API call

        } //finish else above second API call

        $("#blast").css("display", "block");
        $("#blast h1").addClass("animated zoomIn");

      } //finish else 2.2
    }); //finsih first API call

    //default streamer add
    function defaultStreamer(){

      //***3*** default behavior for each streamer added

      //3.1 add newStreamerObject to streamer object
      streamers[idNum] = newStreamerObject
      //3.2 adds streamer to the All array
      AllSearchArray.push(newStreamer)

      console.log("adding " + newStreamer);

      localStorage.twitchStreamers = AllSearchArray;

      console.log(localStorage.twitchStreamers);

      //3.3 stores which tab are we on...
      var $thing = $(".selector-selected").prop('id')
      //3.4 go to masterSelector function with tab name
      masterSelector($thing)

      if(idNum < lsArray.length){
        addStreamer(lsArray[idNum])
      }

    }
  } //finish addNewStreamer
} //finish addStreamer

$(document).ready(function(){
    if(lsArray.length > 0){
      addStreamer(lsArray[0])
    }
});
