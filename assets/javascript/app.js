// 1. Initialize Firebase
  var config = {
    apiKey: "AIzaSyBDvrV4HIQZXM-fhBoKmf2-nzEC2FDZel0",
    authDomain: "trainscheduler-9687f.firebaseapp.com",
    databaseURL: "https://trainscheduler-9687f.firebaseio.com",
    projectId: "trainscheduler-9687f",
    storageBucket: "trainscheduler-9687f.appspot.com",
    messagingSenderId: "161153947854"
  };
  firebase.initializeApp(config);

var database = firebase.database();

// 2. Button for adding Trains
$("#add-train-btn").on("click", function(event) {
  event.preventDefault();

  // Grabs user input
  var trainName = $("#train-name-input").val().trim();
  var trainDestination = $("#destination-input").val().trim();
  var trainStart = $("#start-input").val().trim();
  var trainFrequency = $("#frequency-input").val().trim();

  // Creates local "temporary" object for holding employee data
  var newTrain = {
    name: trainName,
    destination: trainDestination,
    start: trainStart,
    frequency: trainFrequency
  };

console.log(newTrain)
  // Uploads employee data to the database
  database.ref().push(newTrain);

  // Logs everything to console
  console.log(newTrain.name);
  console.log(newTrain.destination);
  console.log(newTrain.start);
  console.log(newTrain.frequency);

  // Alert
  alert("Train successfully added");

  // Clears all of the text-boxes
  $("#train-name-input").val("");
  $("#destination-input").val("");
  $("#start-input").val("");
  $("#frequency-input").val("");
});

// 3. Create Firebase event for adding trains to the database and a row in the html when a user adds an entry
database.ref().on("child_added", function(childSnapshot, prevChildKey) {

  console.log(childSnapshot.val());

  // Store everything into a variable.
  var tName = childSnapshot.val().name;
  var tDestination = childSnapshot.val().destination;
  var tStart = childSnapshot.val().start;
  var tFrequency = childSnapshot.val().frequency;

  // Employee Info
  console.log(tName);
  console.log(tDestination);
  console.log(tStart);
  console.log(tFrequency);

  var convertedStartTime = moment(tStart, "hh:mm").subtract(1,"years")
  console.log(convertedStartTime)

  var timeDiff = moment().diff(moment(convertedStartTime),"minutes")
  console.log(timeDiff)

  var timeApart = timeDiff % tFrequency; 

  var minutesTillTrain = tFrequency - timeApart;

  var nextArrival = moment().add(minutesTillTrain, "m").format("LT");//localized format

  console.log(nextArrival);
  
  var tr = $(`<tr data-key=${ childSnapshot.key }>`)
  tr.append($('<td>').text(tName))
  tr.append($('<td>').text(tDestination))
  tr.append($('<td>').text(tFrequency))
  tr.append($('<td>').text(nextArrival))
  tr.append($('<td>').text(minutesTillTrain))
  tr.append($('<td>').append($('<button class="delete">').text('Delete me!')))

  $("#train-table > tbody").append(tr);
});

$(document).on('click', '.delete', function() {
  var tableRow = $(this).parent().parent()
  var key = tableRow.attr('data-key')

  database.ref().child(key).remove()
  tableRow.remove()

})

// Example Time Math
// -----------------------------------------------------------------------------
// Assume Employee start date of January 1, 2015
// Assume current date is March 1, 2016

// We know that this is 15 months.
// Now we will create code in moment.js to confirm that any attempt we use meets this test case