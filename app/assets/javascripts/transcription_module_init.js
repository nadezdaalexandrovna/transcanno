$(document).ready(function($) {
var da;
transcriptionModule = Object.create(TranscriptionModule);
transcriptionModule.init();
setInterval(function () {
transcriptionModule.repeatingFunction();
}, transcriptionModule.getTranscriptionSavingInterval());

});

//When a user selects a header category value from a dropdown list, the selected value is automatically put into the corresponding user input field if this field exists
function putValueInInputField(that){
      document.getElementById("input_"+that.id).value=that.value;
}