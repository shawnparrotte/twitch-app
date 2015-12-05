

$("#all-on-off-selector-wrapper div").click(function(){
  $("#all-on-off-selector-wrapper div").removeClass("selector-selected");
  $(this).addClass("selector-selected");
})

$("#add-button").click(function(){
  $("#add-button h2").addClass("animated tada");
  var streamerInput = $("#streamer-search").val();
  addStreamer(streamerInput);
})

$("#add-button h2").on('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
  $("#add-button h2").removeClass("animated tada")
});

$(document).keypress(function(e) {
  if(e.which == 13) {
    var streamerInput = $("#streamer-search").val();
    addStreamer(streamerInput);
  }
});

$("#online").click(function(){
  masterSelector($(this).prop('id'));
  console.log($(this).prop('id'));
});

$("#offline").click(function(){
  masterSelector($(this).prop('id'));
  console.log($(this).prop('id'));
});

$("#all").click(function(){
  masterSelector($(this).prop('id'));
  console.log($(this).prop('id'));
});

function masterSelector($thing){



  var streamerArray = Object.getOwnPropertyNames(streamers);

  if(streamerArray.length > 0){
    $("#streamer-list ul li").remove();
  }

  if($thing == "all") {
    CurrentArray = [];
    CurrentArray = AllSearchArray;
    for(var i in streamerArray){
      $("#streamer-list ul").append(streamers[streamerArray[i]].StreamerHTML);
    }
  } else if ($thing == "offline"){
    CurrentArray = [];
    CurrentArray = OffSearchArray;
    for(var i in streamerArray){
      if(streamers[streamerArray[i]].stream == null){
        $("#streamer-list ul").append(streamers[streamerArray[i]].StreamerHTML);
      }
    }
  } else if($thing == "online") {
    CurrentArray = [];
    CurrentArray = OnSearchArray;
    for(var i in streamerArray){

      console.log(streamers[streamerArray[i]].viewers);

      if(streamers[streamerArray[i]].stream !== null && streamers[streamerArray[i]].status !== null){
        $("#streamer-list ul").append(streamers[streamerArray[i]].StreamerHTML);
      }
    }
  }
}

$("#blast h1").on('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){

  if($("#blast h1").attr("class") == "animated zoomIn"){
    $("#blast h1").removeClass("animated zoomIn");
    $("#blast h1").addClass("animated zoomOut");
  } else if ($("#blast h1").attr("class") == "animated zoomOut"){
    $("#blast h1").removeClass("animated zoomOut");
    $("#blast").css("display", "none");
  }
});

$("#streamer-list").on("click", ".close-x", function() {
  var $sel = $(this).parent().parent()
  $sel.find(".sn").text();

  for(var i in streamers){

    if($sel.find(".sn").text() == streamers[i].name){
      delete streamers[i];
    }
  }

  for(var i in AllSearchArray){
    if($sel.find(".sn").text() == AllSearchArray[i]){
      var sl1 = AllSearchArray.indexOf(AllSearchArray[i]);
      AllSearchArray.splice(sl1,1);
    }
  }

  for(var i in OnSearchArray){
    if($sel.find(".sn").text() == OnSearchArray[i]){
      var sl2 = OnSearchArray.indexOf(OnSearchArray[i]);
      OnSearchArray.splice(sl2,1);
    }
  }

  for(var i in OffSearchArray){
    if($sel.find(".sn").text() == OffSearchArray[i]){
      var sl3 = OffSearchArray.indexOf(OffSearchArray[i]);
      OffSearchArray.splice(sl3,1);
    }
  }

  if(AllSearchArray.length == 0){
    $("#streamer-list ul").append('<li><h3 style="text-align:center;margin-left:-25px;">Search for Twitch.tv streamers!</h3></li>');
  }

  $sel.remove();

});
