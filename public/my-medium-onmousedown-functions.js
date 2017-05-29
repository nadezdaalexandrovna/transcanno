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
tagSelectionWithType(categoryid, categoryTypesHash, medium, 'correction-id5', focusOffset, focusNode, [anchorNode, anchorOffset]);
}else{
article.highlight();
medium.invokeElement('correction-id5', {
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
tagSelectionWithType(categoryid, categoryTypesHash, medium, 'ambiguous-id1', focusOffset, focusNode, [anchorNode, anchorOffset]);
}else{
article.highlight();
medium.invokeElement('ambiguous-id1', {
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
tagSelectionWithType(categoryid, categoryTypesHash, medium, 'closing-id2', focusOffset, focusNode, [anchorNode, anchorOffset]);
}else{
article.highlight();
medium.invokeElement('closing-id2', {
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
tagSelectionWithType(categoryid, categoryTypesHash, medium, 'comment-id4', focusOffset, focusNode, [anchorNode, anchorOffset]);
}else{
article.highlight();
medium.invokeElement('comment-id4', {
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
tagSelectionWithType(categoryid, categoryTypesHash, medium, 'error-id8', focusOffset, focusNode, [anchorNode, anchorOffset]);
}else{
article.highlight();
medium.invokeElement('error-id8', {
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
tagSelectionWithType(categoryid, categoryTypesHash, medium, 'greeting-id12', focusOffset, focusNode, [anchorNode, anchorOffset]);
}else{
article.highlight();
medium.invokeElement('greeting-id12', {
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
tagSelectionWithType(categoryid, categoryTypesHash, medium, 'hyphen-id13', focusOffset, focusNode, [anchorNode, anchorOffset]);
}else{
article.highlight();
medium.invokeElement('hyphen-id13', {
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
tagSelectionWithType(categoryid, categoryTypesHash, medium, 'indirect_speech-id14', focusOffset, focusNode, [anchorNode, anchorOffset]);
}else{
article.highlight();
medium.invokeElement('indirect_speech-id14', {
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
tagSelectionWithType(categoryid, categoryTypesHash, medium, 'greeting-id26', focusOffset, focusNode, [anchorNode, anchorOffset]);
}else{
article.highlight();
medium.invokeElement('greeting-id26', {
tagcode: da.getTime().toString()
});
}
return false;
});
$( ".button-correction" ).mousedown(function() {
da = new Date();
categoryid=$(this).attr("data-categoryid");
if(categoryid in categoryTypesHash){
[focusOffset,focusNode,anchorOffset,anchorNode]=medium.returnOffset();
position = $(this).offset();
nowX=position.left;
nowY=position.top;
tagSelectionWithType(categoryid, categoryTypesHash, medium, 'correction-id27', focusOffset, focusNode, [anchorNode, anchorOffset]);
}else{
article.highlight();
medium.invokeElement('correction-id27', {
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
tagSelectionWithType(categoryid, categoryTypesHash, medium, 'error-id28', focusOffset, focusNode, [anchorNode, anchorOffset]);
}else{
article.highlight();
medium.invokeElement('error-id28', {
tagcode: da.getTime().toString()
});
}
return false;
});
});