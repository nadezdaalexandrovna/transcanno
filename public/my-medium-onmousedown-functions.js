$(document).ready(function($) {
var da;
$( ".button-testy_catty" ).mousedown(function() {
da = new Date();
var categoryid=$(this).attr("data-categoryid");
if(categoryid in categoryTypesHash){
[focusOffset,focusNode,anchorOffset,anchorNode]=medium.returnOffset();
tagSelectionWithType(categoryid, categoryTypesHash, medium, 'testy_catty', focusOffset, focusNode, [anchorNode, anchorOffset]);
}else{
article.highlight();
medium.invokeElement('testy_catty', {
tagcode: da.getTime().toString()
});
}
return false;
});
});