$(document).ready(function($) {
var da;
var transcriptionModule = Object.create(TranscriptionModule);
transcriptionModule.init();
setInterval(function () {
transcriptionModule.repeatingFunction();
}, transcriptionModule.getTranscriptionSavingInterval());
$( ".button-infinitive_id1" ).mousedown(function() {
var position = $(this).offset();
var coords = {x:position.left, y:position.top};
var categoryid=$(this).attr("data-categoryid");
transcriptionModule.buttonFunction(categoryid,'infinitive_id1',coords);
return false;
});
$( ".button-adv2_id2" ).mousedown(function() {
var position = $(this).offset();
var coords = {x:position.left, y:position.top};
var categoryid=$(this).attr("data-categoryid");
transcriptionModule.buttonFunction(categoryid,'adv2_id2',coords);
return false;
});
});