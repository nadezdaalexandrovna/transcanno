$(document).ready(function($) {
var da;
var transcriptionModule = Object.create(TranscriptionModule);
transcriptionModule.init();
setInterval(function () {
transcriptionModule.repeatingFunction();
}, transcriptionModule.getTranscriptionSavingInterval());
$( ".button-People_id1" ).mousedown(function() {
var position = $(this).offset();
var coords = {x:position.left, y:position.top};
var categoryid=$(this).attr("data-categoryid");
transcriptionModule.buttonFunction(categoryid,'People_id1',coords);
return false;
});
$( ".button-Places_id2" ).mousedown(function() {
var position = $(this).offset();
var coords = {x:position.left, y:position.top};
var categoryid=$(this).attr("data-categoryid");
transcriptionModule.buttonFunction(categoryid,'Places_id2',coords);
return false;
});
});