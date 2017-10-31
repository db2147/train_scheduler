 // Initialize Firebase
  var config = {
    apiKey: "AIzaSyDuoao9FtYGSQVC26j7tD8Ek1qXbRdDC-o",
    authDomain: "train-schuduler.firebaseapp.com",
    databaseURL: "https://train-schuduler.firebaseio.com",
    projectId: "train-schuduler",
    storageBucket: "",
    messagingSenderId: "189953521156"
  };
  // create a variable to reference the database
  firebase.initializeApp(config);

    var database = firebase.database();

    // creating variables from the html ids in form group
    var trainname = "";
    var destination = "";
    var firsttraintime = "";
    var frequency = "";

  // creates an event listener with a click event for the submit button
  $("#submitBtn").on("click", function(event) {
        event.preventDefault();

        var tName = $("#trainname").val().trim();
        var tDestination = $("#destination").val().trim();
        var tStartTime = $("#firsttraintime").val().trim();
        var tFrequency = $("#frequency").val().trim();

        database.ref().push({
            name: tName,
            destination: tDestination,
            starttime: tStartTime,
            frequency: tFrequency
        });

        clearForm();

    });
    function clearForm() {
        $("#trainname").val("");
        $("#destination").val("");
        $("#firsttraintime").val("");
        $("#frequency").val("");
    }
    //calc next train
    database.ref().on("child_added", function(snapshot) {
        $("#trainInfo").append(`
            <tr>
                <td>${snapshot.val().name}</td>
                <td>${snapshot.val().destination}</td>
                <td>${snapshot.val().frequency}</td>
                <td>${calcNextTrain(snapshot.val().frequency,snapshot.val().starttime)[0]}</td>
                <td>${calcNextTrain(snapshot.val().frequency,snapshot.val().starttime)[1]}</td>
    
            </tr>
            `);
    });
      function calcNextTrain(p1, p2) {

        var tFrequency = p1;
        var firstTime = p2;

        // First Time (pushed back 1 year to make sure it comes before current time)
        var firstTimeConverted = moment(firstTime, "hh:mm").subtract(1, "years");

        var currentTime = moment();

        var diffTime = moment().diff(moment(firstTimeConverted), "minutes");

        var tRemainder = diffTime % tFrequency;

        tMinutesTillTrain = tFrequency - tRemainder;

        nextTrain = moment().add(tMinutesTillTrain, "minutes");
        nextTrain = moment(nextTrain).format("hh:mm A");

        return [nextTrain, tMinutesTillTrain];
    };
 


