$(document).ready(function($) {
var da;
$( ".button-greeting_id2" ).mousedown(function() {
var position = $(this).offset();
var coords = {x:position.left, y:position.top};
var categoryid=$(this).attr("data-categoryid");
buttonFunction(categoryid,'greeting_id2',coords);
return false;
});
$( ".button-error_id1" ).mousedown(function() {
var position = $(this).offset();
var coords = {x:position.left, y:position.top};
var categoryid=$(this).attr("data-categoryid");
buttonFunction(categoryid,'error_id1',coords);
return false;
});
$( ".button-closing_id3" ).mousedown(function() {
var position = $(this).offset();
var coords = {x:position.left, y:position.top};
var categoryid=$(this).attr("data-categoryid");
buttonFunction(categoryid,'closing_id3',coords);
return false;
});
$( ".button-verb_id4" ).mousedown(function() {
var position = $(this).offset();
var coords = {x:position.left, y:position.top};
var categoryid=$(this).attr("data-categoryid");
buttonFunction(categoryid,'verb_id4',coords);
return false;
});
$( ".button-adjective_id5" ).mousedown(function() {
var position = $(this).offset();
var coords = {x:position.left, y:position.top};
var categoryid=$(this).attr("data-categoryid");
buttonFunction(categoryid,'adjective_id5',coords);
return false;
});
$( ".button-subject_id7" ).mousedown(function() {
var position = $(this).offset();
var coords = {x:position.left, y:position.top};
var categoryid=$(this).attr("data-categoryid");
buttonFunction(categoryid,'subject_id7',coords);
return false;
});
$( ".button-predicate_id8" ).mousedown(function() {
var position = $(this).offset();
var coords = {x:position.left, y:position.top};
var categoryid=$(this).attr("data-categoryid");
buttonFunction(categoryid,'predicate_id8',coords);
return false;
});
});