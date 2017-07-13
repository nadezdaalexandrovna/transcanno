$(document).ready(function($) {
var da;
$( ".button-new_category_id16" ).mousedown(function() {
var position = $(this).offset();
var coords = {x:position.left, y:position.top};
var categoryid=$(this).attr("data-categoryid");
buttonFunction(categoryid,'new_category_id16',coords);
return false;
});
});