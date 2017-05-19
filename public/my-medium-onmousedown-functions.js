$(document).ready(function($) {
var da;
$( ".button-ambiguous" ).mousedown(function() {
da = new Date();
article.highlight();
medium.invokeElement('ambiguous', {
tagcode: da.getTime().toString()
});
return false;
});
$( ".button-closing" ).mousedown(function() {
da = new Date();
article.highlight();
medium.invokeElement('closing', {
tagcode: da.getTime().toString()
});
return false;
});
$( ".button-alternative" ).mousedown(function() {
da = new Date();
article.highlight();
medium.invokeElement('alternative', {
tagcode: da.getTime().toString()
});
return false;
});
$( ".button-comment" ).mousedown(function() {
da = new Date();
article.highlight();
medium.invokeElement('comment', {
tagcode: da.getTime().toString()
});
return false;
});
$( ".button-correction" ).mousedown(function() {
	da = new Date();

	var categoryid=$(this).attr("data-categoryid");
	console.log("categoryid: "+categoryid);

	if(categoryid in categoryTypesHash){

      tagSelectionWithType(categoryid, categoryTypesHash, medium, categoryName, focusOffset,focusNode, anchorNode, anchorOffset);
                  
    }else{
    	article.highlight();
		medium.invokeElement('correction', {
			tagcode: da.getTime().toString()
		});
    }

return false;
});

$( ".button-insertion" ).mousedown(function() {
da = new Date();
article.highlight();
medium.invokeElement('insertion', {
tagcode: da.getTime().toString()
});
return false;
});
$( ".button-deletion" ).mousedown(function() {
da = new Date();
article.highlight();
medium.invokeElement('deletion', {
tagcode: da.getTime().toString()
});
return false;
});
$( ".button-error" ).mousedown(function() {
da = new Date();
article.highlight();
medium.invokeElement('error', {
tagcode: da.getTime().toString()
});
return false;
});
$( ".button-errorType" ).mousedown(function() {
da = new Date();
article.highlight();
medium.invokeElement('errorType', {
tagcode: da.getTime().toString()
});
return false;
});
$( ".button-originalForm" ).mousedown(function() {
da = new Date();
article.highlight();
medium.invokeElement('originalForm', {
tagcode: da.getTime().toString()
});
return false;
});
$( ".button-targetForm" ).mousedown(function() {
da = new Date();
article.highlight();
medium.invokeElement('targetForm', {
tagcode: da.getTime().toString()
});
return false;
});
$( ".button-greeting" ).mousedown(function() {
da = new Date();
article.highlight();
medium.invokeElement('greeting', {
tagcode: da.getTime().toString()
});
return false;
});
$( ".button-hyphen" ).mousedown(function() {
da = new Date();
article.highlight();
medium.invokeElement('hyphen', {
tagcode: da.getTime().toString()
});
return false;
});
});