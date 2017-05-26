$(document).ready(function($) {
var da;
$( ".button-correction" ).mousedown(function() {
da = new Date();
categoryid=$(this).attr("data-categoryid");
if(categoryid in categoryTypesHash){
[focusOffset,focusNode,anchorOffset,anchorNode]=medium.returnOffset();
position = $(this).offset();
nowX=position.left;
nowY=position.top;
tagSelectionWithType(categoryid, categoryTypesHash, medium, 'correction', focusOffset, focusNode, [anchorNode, anchorOffset]);
}else{
article.highlight();
medium.invokeElement('correction', {
tagcode: da.getTime().toString()
});
}
return false;
});
$( ".button-ambiguous" ).mousedown(function() {
da = new Date();
categoryid=$(this).attr("data-categoryid");
if(categoryid in categoryTypesHash){
[focusOffset,focusNode,anchorOffset,anchorNode]=medium.returnOffset();
position = $(this).offset();
nowX=position.left;
nowY=position.top;
tagSelectionWithType(categoryid, categoryTypesHash, medium, 'ambiguous', focusOffset, focusNode, [anchorNode, anchorOffset]);
}else{
article.highlight();
medium.invokeElement('ambiguous', {
tagcode: da.getTime().toString()
});
}
return false;
});
$( ".button-closing" ).mousedown(function() {
da = new Date();
categoryid=$(this).attr("data-categoryid");
if(categoryid in categoryTypesHash){
[focusOffset,focusNode,anchorOffset,anchorNode]=medium.returnOffset();
position = $(this).offset();
nowX=position.left;
nowY=position.top;
tagSelectionWithType(categoryid, categoryTypesHash, medium, 'closing', focusOffset, focusNode, [anchorNode, anchorOffset]);
}else{
article.highlight();
medium.invokeElement('closing', {
tagcode: da.getTime().toString()
});
}
return false;
});
$( ".button-comment" ).mousedown(function() {
da = new Date();
categoryid=$(this).attr("data-categoryid");
if(categoryid in categoryTypesHash){
[focusOffset,focusNode,anchorOffset,anchorNode]=medium.returnOffset();
position = $(this).offset();
nowX=position.left;
nowY=position.top;
tagSelectionWithType(categoryid, categoryTypesHash, medium, 'comment', focusOffset, focusNode, [anchorNode, anchorOffset]);
}else{
article.highlight();
medium.invokeElement('comment', {
tagcode: da.getTime().toString()
});
}
return false;
});
$( ".button-error" ).mousedown(function() {
da = new Date();
categoryid=$(this).attr("data-categoryid");
if(categoryid in categoryTypesHash){
[focusOffset,focusNode,anchorOffset,anchorNode]=medium.returnOffset();
position = $(this).offset();
nowX=position.left;
nowY=position.top;
tagSelectionWithType(categoryid, categoryTypesHash, medium, 'error', focusOffset, focusNode, [anchorNode, anchorOffset]);
}else{
article.highlight();
medium.invokeElement('error', {
tagcode: da.getTime().toString()
});
}
return false;
});
$( ".button-greeting" ).mousedown(function() {
da = new Date();
categoryid=$(this).attr("data-categoryid");
if(categoryid in categoryTypesHash){
[focusOffset,focusNode,anchorOffset,anchorNode]=medium.returnOffset();
position = $(this).offset();
nowX=position.left;
nowY=position.top;
tagSelectionWithType(categoryid, categoryTypesHash, medium, 'greeting', focusOffset, focusNode, [anchorNode, anchorOffset]);
}else{
article.highlight();
medium.invokeElement('greeting', {
tagcode: da.getTime().toString()
});
}
return false;
});
$( ".button-hyphen" ).mousedown(function() {
da = new Date();
categoryid=$(this).attr("data-categoryid");
if(categoryid in categoryTypesHash){
[focusOffset,focusNode,anchorOffset,anchorNode]=medium.returnOffset();
position = $(this).offset();
nowX=position.left;
nowY=position.top;
tagSelectionWithType(categoryid, categoryTypesHash, medium, 'hyphen', focusOffset, focusNode, [anchorNode, anchorOffset]);
}else{
article.highlight();
medium.invokeElement('hyphen', {
tagcode: da.getTime().toString()
});
}
return false;
});
$( ".button-indirect_speech" ).mousedown(function() {
da = new Date();
categoryid=$(this).attr("data-categoryid");
if(categoryid in categoryTypesHash){
[focusOffset,focusNode,anchorOffset,anchorNode]=medium.returnOffset();
position = $(this).offset();
nowX=position.left;
nowY=position.top;
tagSelectionWithType(categoryid, categoryTypesHash, medium, 'indirect_speech', focusOffset, focusNode, [anchorNode, anchorOffset]);
}else{
article.highlight();
medium.invokeElement('indirect_speech', {
tagcode: da.getTime().toString()
});
}
return false;
});
});