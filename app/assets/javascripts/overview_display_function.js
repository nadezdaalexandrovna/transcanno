$(document).ready(function($) {
//delete the header categories from the preview
document.getElementsByClassName("page-preview")[0].innerHTML=document.getElementsByClassName("page-preview")[0].innerHTML.replace(/\<textinfoheader>.*?\<\/textinfoheader\>/, '');
});