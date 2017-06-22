$(document).ready(function($) {
var da;
$( ".button-correction_id5" ).mousedown(function() {
da = new Date();
selection = window.getSelection();
categoryid=$(this).attr("data-categoryid");
[focusOffset,focusNode,anchorOffset,anchorNode]=medium.returnOffset();
if(categoryid in categoryTypesHash){
position = $(this).offset();
var coords = {x:position.left, y:position.top};
if(selection.isCollapsed){
userChosenAttributesAndValues=[];
var categoryTable=categoriesInfo[categoryid];
getNextCollapsed('correction_id5',0, categoryTable,focusOffset,focusNode, notCollapsedArgsTable,coords,true);
}else{
tagSelectionWithType(categoryid, categoriesInfo, medium, 'correction_id5', focusOffset, focusNode, [anchorNode, anchorOffset], coords,true);
}
}else{
if(selection.isCollapsed){
collapsedNoAttributesInsertTag('correction_id5',focusOffset,focusNode);
}else{
medium.tagSelection3('correction_id5', [], anchorNode,focusNode,anchorOffset, focusOffset);
}
}
return false;
});
$( ".button-ambiguous_id1" ).mousedown(function() {
da = new Date();
selection = window.getSelection();
categoryid=$(this).attr("data-categoryid");
[focusOffset,focusNode,anchorOffset,anchorNode]=medium.returnOffset();
if(categoryid in categoryTypesHash){
position = $(this).offset();
var coords = {x:position.left, y:position.top};
if(selection.isCollapsed){
userChosenAttributesAndValues=[];
var categoryTable=categoriesInfo[categoryid];
getNextCollapsed('ambiguous_id1',0, categoryTable,focusOffset,focusNode, notCollapsedArgsTable,coords,true);
}else{
tagSelectionWithType(categoryid, categoriesInfo, medium, 'ambiguous_id1', focusOffset, focusNode, [anchorNode, anchorOffset], coords,true);
}
}else{
if(selection.isCollapsed){
collapsedNoAttributesInsertTag('ambiguous_id1',focusOffset,focusNode);
}else{
medium.tagSelection3('ambiguous_id1', [], anchorNode,focusNode,anchorOffset, focusOffset);
}
}
return false;
});
$( ".button-closing_id2" ).mousedown(function() {
da = new Date();
selection = window.getSelection();
categoryid=$(this).attr("data-categoryid");
[focusOffset,focusNode,anchorOffset,anchorNode]=medium.returnOffset();
if(categoryid in categoryTypesHash){
position = $(this).offset();
var coords = {x:position.left, y:position.top};
if(selection.isCollapsed){
userChosenAttributesAndValues=[];
var categoryTable=categoriesInfo[categoryid];
getNextCollapsed('closing_id2',0, categoryTable,focusOffset,focusNode, notCollapsedArgsTable,coords,true);
}else{
tagSelectionWithType(categoryid, categoriesInfo, medium, 'closing_id2', focusOffset, focusNode, [anchorNode, anchorOffset], coords,true);
}
}else{
if(selection.isCollapsed){
collapsedNoAttributesInsertTag('closing_id2',focusOffset,focusNode);
}else{
medium.tagSelection3('closing_id2', [], anchorNode,focusNode,anchorOffset, focusOffset);
}
}
return false;
});
$( ".button-comment_id4" ).mousedown(function() {
da = new Date();
selection = window.getSelection();
categoryid=$(this).attr("data-categoryid");
[focusOffset,focusNode,anchorOffset,anchorNode]=medium.returnOffset();
if(categoryid in categoryTypesHash){
position = $(this).offset();
var coords = {x:position.left, y:position.top};
if(selection.isCollapsed){
userChosenAttributesAndValues=[];
var categoryTable=categoriesInfo[categoryid];
getNextCollapsed('comment_id4',0, categoryTable,focusOffset,focusNode, notCollapsedArgsTable,coords,true);
}else{
tagSelectionWithType(categoryid, categoriesInfo, medium, 'comment_id4', focusOffset, focusNode, [anchorNode, anchorOffset], coords,true);
}
}else{
if(selection.isCollapsed){
collapsedNoAttributesInsertTag('comment_id4',focusOffset,focusNode);
}else{
medium.tagSelection3('comment_id4', [], anchorNode,focusNode,anchorOffset, focusOffset);
}
}
return false;
});
$( ".button-error_id8" ).mousedown(function() {
da = new Date();
selection = window.getSelection();
categoryid=$(this).attr("data-categoryid");
[focusOffset,focusNode,anchorOffset,anchorNode]=medium.returnOffset();
if(categoryid in categoryTypesHash){
position = $(this).offset();
var coords = {x:position.left, y:position.top};
if(selection.isCollapsed){
userChosenAttributesAndValues=[];
var categoryTable=categoriesInfo[categoryid];
getNextCollapsed('error_id8',0, categoryTable,focusOffset,focusNode, notCollapsedArgsTable,coords,true);
}else{
tagSelectionWithType(categoryid, categoriesInfo, medium, 'error_id8', focusOffset, focusNode, [anchorNode, anchorOffset], coords,true);
}
}else{
if(selection.isCollapsed){
collapsedNoAttributesInsertTag('error_id8',focusOffset,focusNode);
}else{
medium.tagSelection3('error_id8', [], anchorNode,focusNode,anchorOffset, focusOffset);
}
}
return false;
});
$( ".button-greeting_id12" ).mousedown(function() {
da = new Date();
selection = window.getSelection();
categoryid=$(this).attr("data-categoryid");
[focusOffset,focusNode,anchorOffset,anchorNode]=medium.returnOffset();
if(categoryid in categoryTypesHash){
position = $(this).offset();
var coords = {x:position.left, y:position.top};
if(selection.isCollapsed){
userChosenAttributesAndValues=[];
var categoryTable=categoriesInfo[categoryid];
getNextCollapsed('greeting_id12',0, categoryTable,focusOffset,focusNode, notCollapsedArgsTable,coords,true);
}else{
tagSelectionWithType(categoryid, categoriesInfo, medium, 'greeting_id12', focusOffset, focusNode, [anchorNode, anchorOffset], coords,true);
}
}else{
if(selection.isCollapsed){
collapsedNoAttributesInsertTag('greeting_id12',focusOffset,focusNode);
}else{
medium.tagSelection3('greeting_id12', [], anchorNode,focusNode,anchorOffset, focusOffset);
}
}
return false;
});
$( ".button-hyphen_id13" ).mousedown(function() {
da = new Date();
selection = window.getSelection();
categoryid=$(this).attr("data-categoryid");
[focusOffset,focusNode,anchorOffset,anchorNode]=medium.returnOffset();
if(categoryid in categoryTypesHash){
position = $(this).offset();
var coords = {x:position.left, y:position.top};
if(selection.isCollapsed){
userChosenAttributesAndValues=[];
var categoryTable=categoriesInfo[categoryid];
getNextCollapsed('hyphen_id13',0, categoryTable,focusOffset,focusNode, notCollapsedArgsTable,coords,true);
}else{
tagSelectionWithType(categoryid, categoriesInfo, medium, 'hyphen_id13', focusOffset, focusNode, [anchorNode, anchorOffset], coords,true);
}
}else{
if(selection.isCollapsed){
collapsedNoAttributesInsertTag('hyphen_id13',focusOffset,focusNode);
}else{
medium.tagSelection3('hyphen_id13', [], anchorNode,focusNode,anchorOffset, focusOffset);
}
}
return false;
});
$( ".button-indirect_speech_id14" ).mousedown(function() {
da = new Date();
selection = window.getSelection();
categoryid=$(this).attr("data-categoryid");
[focusOffset,focusNode,anchorOffset,anchorNode]=medium.returnOffset();
if(categoryid in categoryTypesHash){
position = $(this).offset();
var coords = {x:position.left, y:position.top};
if(selection.isCollapsed){
userChosenAttributesAndValues=[];
var categoryTable=categoriesInfo[categoryid];
getNextCollapsed('indirect_speech_id14',0, categoryTable,focusOffset,focusNode, notCollapsedArgsTable,coords,true);
}else{
tagSelectionWithType(categoryid, categoriesInfo, medium, 'indirect_speech_id14', focusOffset, focusNode, [anchorNode, anchorOffset], coords,true);
}
}else{
if(selection.isCollapsed){
collapsedNoAttributesInsertTag('indirect_speech_id14',focusOffset,focusNode);
}else{
medium.tagSelection3('indirect_speech_id14', [], anchorNode,focusNode,anchorOffset, focusOffset);
}
}
return false;
});
$( ".button-greeting_id26" ).mousedown(function() {
da = new Date();
selection = window.getSelection();
categoryid=$(this).attr("data-categoryid");
[focusOffset,focusNode,anchorOffset,anchorNode]=medium.returnOffset();
if(categoryid in categoryTypesHash){
position = $(this).offset();
var coords = {x:position.left, y:position.top};
if(selection.isCollapsed){
userChosenAttributesAndValues=[];
var categoryTable=categoriesInfo[categoryid];
getNextCollapsed('greeting_id26',0, categoryTable,focusOffset,focusNode, notCollapsedArgsTable,coords,true);
}else{
tagSelectionWithType(categoryid, categoriesInfo, medium, 'greeting_id26', focusOffset, focusNode, [anchorNode, anchorOffset], coords,true);
}
}else{
if(selection.isCollapsed){
collapsedNoAttributesInsertTag('greeting_id26',focusOffset,focusNode);
}else{
medium.tagSelection3('greeting_id26', [], anchorNode,focusNode,anchorOffset, focusOffset);
}
}
return false;
});
$( ".button-correction_id27" ).mousedown(function() {
da = new Date();
selection = window.getSelection();
categoryid=$(this).attr("data-categoryid");
[focusOffset,focusNode,anchorOffset,anchorNode]=medium.returnOffset();
if(categoryid in categoryTypesHash){
position = $(this).offset();
var coords = {x:position.left, y:position.top};
if(selection.isCollapsed){
userChosenAttributesAndValues=[];
var categoryTable=categoriesInfo[categoryid];
getNextCollapsed('correction_id27',0, categoryTable,focusOffset,focusNode, notCollapsedArgsTable,coords,true);
}else{
tagSelectionWithType(categoryid, categoriesInfo, medium, 'correction_id27', focusOffset, focusNode, [anchorNode, anchorOffset], coords,true);
}
}else{
if(selection.isCollapsed){
collapsedNoAttributesInsertTag('correction_id27',focusOffset,focusNode);
}else{
medium.tagSelection3('correction_id27', [], anchorNode,focusNode,anchorOffset, focusOffset);
}
}
return false;
});
$( ".button-error_id28" ).mousedown(function() {
da = new Date();
selection = window.getSelection();
categoryid=$(this).attr("data-categoryid");
[focusOffset,focusNode,anchorOffset,anchorNode]=medium.returnOffset();
if(categoryid in categoryTypesHash){
position = $(this).offset();
var coords = {x:position.left, y:position.top};
if(selection.isCollapsed){
userChosenAttributesAndValues=[];
var categoryTable=categoriesInfo[categoryid];
getNextCollapsed('error_id28',0, categoryTable,focusOffset,focusNode, notCollapsedArgsTable,coords,true);
}else{
tagSelectionWithType(categoryid, categoriesInfo, medium, 'error_id28', focusOffset, focusNode, [anchorNode, anchorOffset], coords,true);
}
}else{
if(selection.isCollapsed){
collapsedNoAttributesInsertTag('error_id28',focusOffset,focusNode);
}else{
medium.tagSelection3('error_id28', [], anchorNode,focusNode,anchorOffset, focusOffset);
}
}
return false;
});
$( ".button-deletion_id29" ).mousedown(function() {
da = new Date();
selection = window.getSelection();
categoryid=$(this).attr("data-categoryid");
[focusOffset,focusNode,anchorOffset,anchorNode]=medium.returnOffset();
if(categoryid in categoryTypesHash){
position = $(this).offset();
var coords = {x:position.left, y:position.top};
if(selection.isCollapsed){
userChosenAttributesAndValues=[];
var categoryTable=categoriesInfo[categoryid];
getNextCollapsed('deletion_id29',0, categoryTable,focusOffset,focusNode, notCollapsedArgsTable,coords,true);
}else{
tagSelectionWithType(categoryid, categoriesInfo, medium, 'deletion_id29', focusOffset, focusNode, [anchorNode, anchorOffset], coords,true);
}
}else{
if(selection.isCollapsed){
collapsedNoAttributesInsertTag('deletion_id29',focusOffset,focusNode);
}else{
medium.tagSelection3('deletion_id29', [], anchorNode,focusNode,anchorOffset, focusOffset);
}
}
return false;
});
$( ".button-insertion_id30" ).mousedown(function() {
da = new Date();
selection = window.getSelection();
categoryid=$(this).attr("data-categoryid");
[focusOffset,focusNode,anchorOffset,anchorNode]=medium.returnOffset();
if(categoryid in categoryTypesHash){
position = $(this).offset();
var coords = {x:position.left, y:position.top};
if(selection.isCollapsed){
userChosenAttributesAndValues=[];
var categoryTable=categoriesInfo[categoryid];
getNextCollapsed('insertion_id30',0, categoryTable,focusOffset,focusNode, notCollapsedArgsTable,coords,true);
}else{
tagSelectionWithType(categoryid, categoriesInfo, medium, 'insertion_id30', focusOffset, focusNode, [anchorNode, anchorOffset], coords,true);
}
}else{
if(selection.isCollapsed){
collapsedNoAttributesInsertTag('insertion_id30',focusOffset,focusNode);
}else{
medium.tagSelection3('insertion_id30', [], anchorNode,focusNode,anchorOffset, focusOffset);
}
}
return false;
});
$( ".button-orthographic_error_id31" ).mousedown(function() {
da = new Date();
selection = window.getSelection();
categoryid=$(this).attr("data-categoryid");
[focusOffset,focusNode,anchorOffset,anchorNode]=medium.returnOffset();
if(categoryid in categoryTypesHash){
position = $(this).offset();
var coords = {x:position.left, y:position.top};
if(selection.isCollapsed){
userChosenAttributesAndValues=[];
var categoryTable=categoriesInfo[categoryid];
getNextCollapsed('orthographic_error_id31',0, categoryTable,focusOffset,focusNode, notCollapsedArgsTable,coords,true);
}else{
tagSelectionWithType(categoryid, categoriesInfo, medium, 'orthographic_error_id31', focusOffset, focusNode, [anchorNode, anchorOffset], coords,true);
}
}else{
if(selection.isCollapsed){
collapsedNoAttributesInsertTag('orthographic_error_id31',focusOffset,focusNode);
}else{
medium.tagSelection3('orthographic_error_id31', [], anchorNode,focusNode,anchorOffset, focusOffset);
}
}
return false;
});
$( ".button-orthographic_error_target_id32" ).mousedown(function() {
da = new Date();
selection = window.getSelection();
categoryid=$(this).attr("data-categoryid");
[focusOffset,focusNode,anchorOffset,anchorNode]=medium.returnOffset();
if(categoryid in categoryTypesHash){
position = $(this).offset();
var coords = {x:position.left, y:position.top};
if(selection.isCollapsed){
userChosenAttributesAndValues=[];
var categoryTable=categoriesInfo[categoryid];
getNextCollapsed('orthographic_error_target_id32',0, categoryTable,focusOffset,focusNode, notCollapsedArgsTable,coords,true);
}else{
tagSelectionWithType(categoryid, categoriesInfo, medium, 'orthographic_error_target_id32', focusOffset, focusNode, [anchorNode, anchorOffset], coords,true);
}
}else{
if(selection.isCollapsed){
collapsedNoAttributesInsertTag('orthographic_error_target_id32',focusOffset,focusNode);
}else{
medium.tagSelection3('orthographic_error_target_id32', [], anchorNode,focusNode,anchorOffset, focusOffset);
}
}
return false;
});
$( ".button-punctuation_error_missings_id34" ).mousedown(function() {
da = new Date();
selection = window.getSelection();
categoryid=$(this).attr("data-categoryid");
[focusOffset,focusNode,anchorOffset,anchorNode]=medium.returnOffset();
if(categoryid in categoryTypesHash){
position = $(this).offset();
var coords = {x:position.left, y:position.top};
if(selection.isCollapsed){
userChosenAttributesAndValues=[];
var categoryTable=categoriesInfo[categoryid];
getNextCollapsed('punctuation_error_missings_id34',0, categoryTable,focusOffset,focusNode, notCollapsedArgsTable,coords,true);
}else{
tagSelectionWithType(categoryid, categoriesInfo, medium, 'punctuation_error_missings_id34', focusOffset, focusNode, [anchorNode, anchorOffset], coords,true);
}
}else{
if(selection.isCollapsed){
collapsedNoAttributesInsertTag('punctuation_error_missings_id34',focusOffset,focusNode);
}else{
medium.tagSelection3('punctuation_error_missings_id34', [], anchorNode,focusNode,anchorOffset, focusOffset);
}
}
return false;
});
$( ".button-punctuation_error_wrongly_set_id35" ).mousedown(function() {
da = new Date();
selection = window.getSelection();
categoryid=$(this).attr("data-categoryid");
[focusOffset,focusNode,anchorOffset,anchorNode]=medium.returnOffset();
if(categoryid in categoryTypesHash){
position = $(this).offset();
var coords = {x:position.left, y:position.top};
if(selection.isCollapsed){
userChosenAttributesAndValues=[];
var categoryTable=categoriesInfo[categoryid];
getNextCollapsed('punctuation_error_wrongly_set_id35',0, categoryTable,focusOffset,focusNode, notCollapsedArgsTable,coords,true);
}else{
tagSelectionWithType(categoryid, categoriesInfo, medium, 'punctuation_error_wrongly_set_id35', focusOffset, focusNode, [anchorNode, anchorOffset], coords,true);
}
}else{
if(selection.isCollapsed){
collapsedNoAttributesInsertTag('punctuation_error_wrongly_set_id35',focusOffset,focusNode);
}else{
medium.tagSelection3('punctuation_error_wrongly_set_id35', [], anchorNode,focusNode,anchorOffset, focusOffset);
}
}
return false;
});
$( ".button-grammatic_error_id33" ).mousedown(function() {
da = new Date();
selection = window.getSelection();
categoryid=$(this).attr("data-categoryid");
[focusOffset,focusNode,anchorOffset,anchorNode]=medium.returnOffset();
if(categoryid in categoryTypesHash){
position = $(this).offset();
var coords = {x:position.left, y:position.top};
if(selection.isCollapsed){
userChosenAttributesAndValues=[];
var categoryTable=categoriesInfo[categoryid];
getNextCollapsed('grammatic_error_id33',0, categoryTable,focusOffset,focusNode, notCollapsedArgsTable,coords,true);
}else{
tagSelectionWithType(categoryid, categoriesInfo, medium, 'grammatic_error_id33', focusOffset, focusNode, [anchorNode, anchorOffset], coords,true);
}
}else{
if(selection.isCollapsed){
collapsedNoAttributesInsertTag('grammatic_error_id33',focusOffset,focusNode);
}else{
medium.tagSelection3('grammatic_error_id33', [], anchorNode,focusNode,anchorOffset, focusOffset);
}
}
return false;
});
$( ".button-verb_id36" ).mousedown(function() {
da = new Date();
selection = window.getSelection();
categoryid=$(this).attr("data-categoryid");
[focusOffset,focusNode,anchorOffset,anchorNode]=medium.returnOffset();
if(categoryid in categoryTypesHash){
position = $(this).offset();
var coords = {x:position.left, y:position.top};
if(selection.isCollapsed){
userChosenAttributesAndValues=[];
var categoryTable=categoriesInfo[categoryid];
getNextCollapsed('verb_id36',0, categoryTable,focusOffset,focusNode, notCollapsedArgsTable,coords,true);
}else{
tagSelectionWithType(categoryid, categoriesInfo, medium, 'verb_id36', focusOffset, focusNode, [anchorNode, anchorOffset], coords,true);
}
}else{
if(selection.isCollapsed){
collapsedNoAttributesInsertTag('verb_id36',focusOffset,focusNode);
}else{
medium.tagSelection3('verb_id36', [], anchorNode,focusNode,anchorOffset, focusOffset);
}
}
return false;
});
$( ".button-new_category_id37" ).mousedown(function() {
da = new Date();
selection = window.getSelection();
categoryid=$(this).attr("data-categoryid");
[focusOffset,focusNode,anchorOffset,anchorNode]=medium.returnOffset();
if(categoryid in categoryTypesHash){
position = $(this).offset();
var coords = {x:position.left, y:position.top};
if(selection.isCollapsed){
userChosenAttributesAndValues=[];
var categoryTable=categoriesInfo[categoryid];
getNextCollapsed('new_category_id37',0, categoryTable,focusOffset,focusNode, notCollapsedArgsTable,coords,true);
}else{
tagSelectionWithType(categoryid, categoriesInfo, medium, 'new_category_id37', focusOffset, focusNode, [anchorNode, anchorOffset], coords,true);
}
}else{
if(selection.isCollapsed){
collapsedNoAttributesInsertTag('new_category_id37',focusOffset,focusNode);
}else{
medium.tagSelection3('new_category_id37', [], anchorNode,focusNode,anchorOffset, focusOffset);
}
}
return false;
});
$( ".button-participle_id51" ).mousedown(function() {
da = new Date();
selection = window.getSelection();
categoryid=$(this).attr("data-categoryid");
[focusOffset,focusNode,anchorOffset,anchorNode]=medium.returnOffset();
if(categoryid in categoryTypesHash){
position = $(this).offset();
var coords = {x:position.left, y:position.top};
if(selection.isCollapsed){
userChosenAttributesAndValues=[];
var categoryTable=categoriesInfo[categoryid];
getNextCollapsed('participle_id51',0, categoryTable,focusOffset,focusNode, notCollapsedArgsTable,coords,true);
}else{
tagSelectionWithType(categoryid, categoriesInfo, medium, 'participle_id51', focusOffset, focusNode, [anchorNode, anchorOffset], coords,true);
}
}else{
if(selection.isCollapsed){
collapsedNoAttributesInsertTag('participle_id51',focusOffset,focusNode);
}else{
medium.tagSelection3('participle_id51', [], anchorNode,focusNode,anchorOffset, focusOffset);
}
}
return false;
});
$( ".button-adjective_id50" ).mousedown(function() {
da = new Date();
selection = window.getSelection();
categoryid=$(this).attr("data-categoryid");
[focusOffset,focusNode,anchorOffset,anchorNode]=medium.returnOffset();
if(categoryid in categoryTypesHash){
position = $(this).offset();
var coords = {x:position.left, y:position.top};
if(selection.isCollapsed){
userChosenAttributesAndValues=[];
var categoryTable=categoriesInfo[categoryid];
getNextCollapsed('adjective_id50',0, categoryTable,focusOffset,focusNode, notCollapsedArgsTable,coords,true);
}else{
tagSelectionWithType(categoryid, categoriesInfo, medium, 'adjective_id50', focusOffset, focusNode, [anchorNode, anchorOffset], coords,true);
}
}else{
if(selection.isCollapsed){
collapsedNoAttributesInsertTag('adjective_id50',focusOffset,focusNode);
}else{
medium.tagSelection3('adjective_id50', [], anchorNode,focusNode,anchorOffset, focusOffset);
}
}
return false;
});
$( ".button-verb_id52" ).mousedown(function() {
da = new Date();
selection = window.getSelection();
categoryid=$(this).attr("data-categoryid");
[focusOffset,focusNode,anchorOffset,anchorNode]=medium.returnOffset();
if(categoryid in categoryTypesHash){
position = $(this).offset();
var coords = {x:position.left, y:position.top};
if(selection.isCollapsed){
userChosenAttributesAndValues=[];
var categoryTable=categoriesInfo[categoryid];
getNextCollapsed('verb_id52',0, categoryTable,focusOffset,focusNode, notCollapsedArgsTable,coords,true);
}else{
tagSelectionWithType(categoryid, categoriesInfo, medium, 'verb_id52', focusOffset, focusNode, [anchorNode, anchorOffset], coords,true);
}
}else{
if(selection.isCollapsed){
collapsedNoAttributesInsertTag('verb_id52',focusOffset,focusNode);
}else{
medium.tagSelection3('verb_id52', [], anchorNode,focusNode,anchorOffset, focusOffset);
}
}
return false;
});
});