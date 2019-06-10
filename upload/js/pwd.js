




function password() {
var testV = 1;
var pass1 = prompt('Please enter password.','');
while (testV < 9999999999999999999) {
	if (!pass1)
	history.go(-1);
	
     var token =  md5(pass1);
	if (token == "b59c67bf196a4758191e42f76670ceba") {
//		alert('密码正确!');
		break;
	}
	testV+=1;
	var pass1 =
	prompt('Wrong password.');
}
//if (pass1!="password" & testV ==3)
//history.go(-1);
return " ";
}
document.write(password());