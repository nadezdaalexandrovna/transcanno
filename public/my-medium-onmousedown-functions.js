$(document).ready(function($) {
var da;
var transcriptionModule = Object.create(TranscriptionModule);
transcriptionModule.init();
setInterval(function () {
transcriptionModule.repeatingFunction();
}, transcriptionModule.getTranscriptionSavingInterval());
$( ".button-adjective_id1" ).mousedown(function() {
var position = $(this).offset();
var coords = {x:position.left, y:position.top};
var categoryid=$(this).attr("data-categoryid");
transcriptionModule.buttonFunction(categoryid,'adjective_id1',coords);
return false;
});
$( ".button-participle_id2" ).mousedown(function() {
var position = $(this).offset();
var coords = {x:position.left, y:position.top};
var categoryid=$(this).attr("data-categoryid");
transcriptionModule.buttonFunction(categoryid,'participle_id2',coords);
return false;
});
});