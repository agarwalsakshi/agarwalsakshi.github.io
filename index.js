$(document).ready(function() {
$("div#form1").append(
$("<form/>", {
action: '#',
method: '#'
}).append(
$("<input/>", 
{
type: 'text',
id: 'vname',
name: 'name',
placeholder: 'Your Name'
}),



$("<input/>", {
type: 'text',
id: 'vemail',
name: 'email',
placeholder: 'Your Email'
}), 


$("<textarea/>", {
rows: '5px',
cols: '27px',
type: 'text',
id: 'vmsg',
name: 'msg',
placeholder: 'Message'
}), 


$("<br/>"), $("<input/>", {
type: 'submit',
id: 'submit',
value: 'Submit'
})))
});
