const util = require('./common/util');
//let file = 'qw.er.sd.jpg?a=2&d=d&a=d2.3&a=d2.3';
let file='alma.jpg';
//const file = 'qw.er.sd.jpg';
if (file.indexOf('?') !== -1) {
     file=file.substring(0, file.indexOf('?'));
}
file=file.split('.');
file.pop();
console.log(file.join('.'));
/*
const a = file.split('.');
a.pop();
const b=a.join('.');
console.log(b);
//util.getFileName('a.b.jpg');

 */