$(document).ready(function($) {
var da;
$( ".button-indirect_speech" ).mousedown(function() {
da = new Date();
var categoryid=$(this).attr("data-categoryid");
if(categoryid in categoryTypesHash){
[focusOffset,focusNode,anchorOffset,anchorNode]=medium.returnOffset();
tagSelectionWithType(categoryid, categoryTypesHash, medium, 'indirect_speech', focusOffset, focusNode, [anchorNode, anchorOffset]);
}else{
article.highlight();
medium.invokeElement('indirect_speech', {
tagcode: da.getTime().toString()
});
}
return false;
});
$( ".button-direct_speech" ).mousedown(function() {
da = new Date();
var categoryid=$(this).attr("data-categoryid");
if(categoryid in categoryTypesHash){
[focusOffset,focusNode,anchorOffset,anchorNode]=medium.returnOffset();
tagSelectionWithType(categoryid, categoryTypesHash, medium, 'direct_speech', focusOffset, focusNode, [anchorNode, anchorOffset]);
}else{
article.highlight();
medium.invokeElement('direct_speech', {
tagcode: da.getTime().toString()
});
}
return false;
});
});