$(document).ready(function($) {
var da;
var transcriptionModule = Object.create(TranscriptionModule);
transcriptionModule.init();
setInterval(function () {
transcriptionModule.repeatingFunction();
}, 180000);
$( ".button-greeting_id2" ).mousedown(function() {
var position = $(this).offset();
var coords = {x:position.left, y:position.top};
var categoryid=$(this).attr("data-categoryid");
transcriptionModule.buttonFunction(categoryid,'greeting_id2',coords);
return false;
});
$( ".button-hey_id3" ).mousedown(function() {
var position = $(this).offset();
var coords = {x:position.left, y:position.top};
var categoryid=$(this).attr("data-categoryid");
transcriptionModule.buttonFunction(categoryid,'hey_id3',coords);
return false;
});
$( ".button-new_coll_first_subject_id4" ).mousedown(function() {
var position = $(this).offset();
var coords = {x:position.left, y:position.top};
var categoryid=$(this).attr("data-categoryid");
transcriptionModule.buttonFunction(categoryid,'new_coll_first_subject_id4',coords);
return false;
});
$( ".button-second_new_coll__id5" ).mousedown(function() {
var position = $(this).offset();
var coords = {x:position.left, y:position.top};
var categoryid=$(this).attr("data-categoryid");
transcriptionModule.buttonFunction(categoryid,'second_new_coll__id5',coords);
return false;
});
$( ".button-third_new_coll_id6" ).mousedown(function() {
var position = $(this).offset();
var coords = {x:position.left, y:position.top};
var categoryid=$(this).attr("data-categoryid");
transcriptionModule.buttonFunction(categoryid,'third_new_coll_id6',coords);
return false;
});
$( ".button-second_coll_first_id7" ).mousedown(function() {
var position = $(this).offset();
var coords = {x:position.left, y:position.top};
var categoryid=$(this).attr("data-categoryid");
transcriptionModule.buttonFunction(categoryid,'second_coll_first_id7',coords);
return false;
});
$( ".button-second_coll_second_id8" ).mousedown(function() {
var position = $(this).offset();
var coords = {x:position.left, y:position.top};
var categoryid=$(this).attr("data-categoryid");
transcriptionModule.buttonFunction(categoryid,'second_coll_second_id8',coords);
return false;
});
$( ".button-preposition_id9" ).mousedown(function() {
var position = $(this).offset();
var coords = {x:position.left, y:position.top};
var categoryid=$(this).attr("data-categoryid");
transcriptionModule.buttonFunction(categoryid,'preposition_id9',coords);
return false;
});
$( ".button-bolt_id13" ).mousedown(function() {
var position = $(this).offset();
var coords = {x:position.left, y:position.top};
var categoryid=$(this).attr("data-categoryid");
transcriptionModule.buttonFunction(categoryid,'bolt_id13',coords);
return false;
});
$( ".button-bullet_id11" ).mousedown(function() {
var position = $(this).offset();
var coords = {x:position.left, y:position.top};
var categoryid=$(this).attr("data-categoryid");
transcriptionModule.buttonFunction(categoryid,'bullet_id11',coords);
return false;
});
$( ".button-link_id12" ).mousedown(function() {
var position = $(this).offset();
var coords = {x:position.left, y:position.top};
var categoryid=$(this).attr("data-categoryid");
transcriptionModule.buttonFunction(categoryid,'link_id12',coords);
return false;
});
$( ".button-verb_id15" ).mousedown(function() {
var position = $(this).offset();
var coords = {x:position.left, y:position.top};
var categoryid=$(this).attr("data-categoryid");
transcriptionModule.buttonFunction(categoryid,'verb_id15',coords);
return false;
});
$( ".button-paragraph_id16" ).mousedown(function() {
var position = $(this).offset();
var coords = {x:position.left, y:position.top};
var categoryid=$(this).attr("data-categoryid");
transcriptionModule.buttonFunction(categoryid,'paragraph_id16',coords);
return false;
});
$( ".button-greeting_id18" ).mousedown(function() {
var position = $(this).offset();
var coords = {x:position.left, y:position.top};
var categoryid=$(this).attr("data-categoryid");
transcriptionModule.buttonFunction(categoryid,'greeting_id18',coords);
return false;
});
$( ".button-error_id21" ).mousedown(function() {
var position = $(this).offset();
var coords = {x:position.left, y:position.top};
var categoryid=$(this).attr("data-categoryid");
transcriptionModule.buttonFunction(categoryid,'error_id21',coords);
return false;
});
});