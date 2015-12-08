var update = setInterval(updateStreamerInfo, 60000);

function updateStreamerInfo(){

  AllSearchArray = [];
  OnSearchArray = [];
  OffSearchArray = [];

  for(var i in streamers){

    console.log(streamers[i].name);
    var nameCache = streamers[i].name;
    var idCache = streamers[i].id;
    var logoCache = streamers[i].logo;

    updateStreamer(nameCache, idCache, logoCache)

  }
}


function updateStreamer(nameCache, idCache, logoCache){

  //***2*** create new streamer object

  //2.1 first we'll check to see if the channel even exists
  Twitch.api({method: '/channels/' + nameCache, verb: 'GET' }, function(error, success) {
  //2.2 if there is an error of some kind
  if(error !== null){
    //2.3 log the error message
    console.log(error.status);
    //2.2 else there is no error
    } else {
      //2.4 create new object
      streamers[idCache].status = success.status;
      streamers[idCache].game = success.game;

      streamers[idCache].StreamerHTML = '<li><div class="streamer">';

      if(success.status == null){
        streamers[idCache].StreamerHTML += '<a href="https://www.twitch.tv/' + nameCache + '"><img class="offline" src="https://assets.digital.cabinet-office.gov.uk/government/assets/blank-person-3102300fb523fc3b2fa629bc79f1df9f.png"></a>';
        streamers[idCache].StreamerHTML += '<div class="streamer-info"><h1 class="sn">' + nameCache + '</h1><h3>Offline</h3></div><div class="close-x"><p>X</p></div></div></li>';
        OffSearchArray.push(nameCache);

        var $thing = $(".selector-selected").prop('id');
        masterSelector($thing);
      } else {

        Twitch.api({method: '/streams/' + nameCache, verb: 'GET' }, function(error2, success2) {

          if(success2.stream == null){
            streamers[idCache].StreamerHTML += '<a href="http://www.twitch.tv/' + nameCache + '"><img class="offline" src="' + logoCache + '"></a>';
            streamers[idCache].StreamerHTML += '<div class="streamer-info"><h1 class="sn">' + nameCache + '</h1><h3>Offline</h3></div><div class="close-x"><p>X</p></div></div></li>';
            streamers[idCache].stream = null;
            streamers[idCache].viewers = undefined;
            OffSearchArray.push(nameCache);

            var $thing = $(".selector-selected").prop('id');
            masterSelector($thing);

          } else {
            streamers[idCache].stream = success2.stream;
            streamers[idCache].viewers = success2.stream.viewers;
            streamers[idCache].StreamerHTML += '<a href="http://www.twitch.tv/' + nameCache + '"><img class="online" src="' + logoCache + '"></a>';
            streamers[idCache].StreamerHTML += '<div class="streamer-info"><h1 class="sn">' + nameCache + '</h1><h3>' + success2.stream.game + '</h3><h5>' + success2.stream.viewers + ' viewers</h5></div><div class="close-x"><p>X</p></div></div></li>';

            OnSearchArray.push(nameCache);

            var $thing = $(".selector-selected").prop('id');
            masterSelector($thing);
          }
        }); //finish second API call
      } //finish else above second API call

      AllSearchArray.push(nameCache);


    } //finsih 2.2 else
  }); //finish first API call
} //finish updateStreamer
