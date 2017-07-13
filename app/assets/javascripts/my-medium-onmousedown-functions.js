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
$( ".button-hyphen_id9" ).mousedown(function() {
var position = $(this).offset();
var coords = {x:position.left, y:position.top};
var categoryid=$(this).attr("data-categoryid");
buttonFunction(categoryid,'hyphen_id9',coords);
return false;
});
$( ".button-adverb_id10" ).mousedown(function() {
var position = $(this).offset();
var coords = {x:position.left, y:position.top};
var categoryid=$(this).attr("data-categoryid");
buttonFunction(categoryid,'adverb_id10',coords);
return false;
});
$( ".button-pronoun_id11" ).mousedown(function() {
var position = $(this).offset();
var coords = {x:position.left, y:position.top};
var categoryid=$(this).attr("data-categoryid");
buttonFunction(categoryid,'pronoun_id11',coords);
return false;
});
$( ".button-article_id12" ).mousedown(function() {
var position = $(this).offset();
var coords = {x:position.left, y:position.top};
var categoryid=$(this).attr("data-categoryid");
buttonFunction(categoryid,'article_id12',coords);
return false;
});
$( ".button-first_name_id13" ).mousedown(function() {
var position = $(this).offset();
var coords = {x:position.left, y:position.top};
var categoryid=$(this).attr("data-categoryid");
buttonFunction(categoryid,'first_name_id13',coords);
return false;
});
$( ".button-last_name_id14" ).mousedown(function() {
var position = $(this).offset();
var coords = {x:position.left, y:position.top};
var categoryid=$(this).attr("data-categoryid");
buttonFunction(categoryid,'last_name_id14',coords);
return false;
});
$( ".button-exclamation_id15" ).mousedown(function() {
var position = $(this).offset();
var coords = {x:position.left, y:position.top};
var categoryid=$(this).attr("data-categoryid");
buttonFunction(categoryid,'exclamation_id15',coords);
return false;
});
});