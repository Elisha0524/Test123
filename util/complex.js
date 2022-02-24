function imsum(n1, n2) {
	var num1, num2, rpart, ipart
	num1 = complexSperate(n1)
	num2 = complexSperate(n2)
	rpart = num1[0] + num2[0];
	ipart = num1[1] + num2[1];
	//console.log(num1, num2)
	return complexMerge(rpart, ipart);
}

function imsub(n1, n2) {
	var num1, num2, rpart, ipart
	num1 = complexSperate(n1)
	num2 = complexSperate(n2)
	rpart = num1[0] - num2[0];
	ipart = num1[1] - num2[1];
	return complexMerge(rpart, ipart);
}

function immul(n1, n2) {
	var num1, num2, rpart, ipart
	num1 = complexSperate(n1)
	num2 = complexSperate(n2)
	//console.log(num1, num2)
	rpart = (num1[0]*num2[0] - num1[1]*num2[1]);
	ipart = (num1[0]*num2[1] + num1[1]*num2[0]);
	//console.log(rpart, ipart)
	return complexMerge(rpart, ipart);
}

function imdiv(n1, n2) {
	var num1, num2, rpart, ipart
	num3 = [];
	//console.log(n1, n2)
	num1 = complexSperate(n1)
	num2 = complexSperate(n2)
	//console.log(num1, num2)
	num3[0] = num2[0];
	num3[1] = num2[1] * -1;
	//console.log((Math.pow(num2[0], 2) + Math.pow(num2[1], 2)))
	rpart = (num1[0]*num3[0] - num1[1]*num3[1])/(Math.pow(num2[0], 2) + Math.pow(num2[1], 2));
	ipart = (num1[0]*num3[1] + num1[1]*num3[0])/(Math.pow(num2[0], 2) + Math.pow(num2[1], 2));
	return complexMerge(rpart, ipart);
}

function imexp(n) {
	var x, rpart, ipart
	x = complexSperate(n)
	//console.log(x)
	rpart = Math.exp(x[0])*Math.cos(x[1]);
	//console.log(rpart.toString())
	ipart = Math.exp(x[0])*Math.sin(x[1]);
	//console.log(rpart, ipart)
	return complexMerge(rpart, ipart);
}

function complexSperate(num) {
	num = num.toString();
	//console.log(num)
	if (num.indexOf("e") > 0) {
		return replace(num)
	}
	if (num.indexOf("+") == -1 & num.indexOf("-") == -1 ) {
		if (num.indexOf("i") != -1) {
			a = 0;
			if (num.length == 1) {
				b = 1;
			} else {
				b = parseFloat(num.replace("i", ""));
			}
		} else {
			a = parseFloat(num);
			b = 0;
		}
	} else if (num.indexOf("+") == -1) {
		if (num[0] == "-") {
			num = num.replace("-", "");
			//console.log(num)
			num = num.split("-");
			//console.log(num, num.length, num.indexOf("i"))
			if (num.length == 1 & num[0].indexOf("i") != -1) {
				a = 0;
				if (num[0].length == 1) {
					b = -1;
				} else {
					b = parseFloat(num[0].replace("i", "")) * -1;
				}
				//console.log(a,b, num[0])
			} else if (num.length == 1 & num[0].indexOf("i") == -1) {
				a = parseFloat(num[0]) * -1;
				b = 0;
			} else {
				if (num[1].length == 1) {
					b = -1;
				} else {
					b = parseFloat(num[1]) * -1;
				}
				a = parseFloat(num[0]) * -1;
			}
		} else {
			num = num.split("-");
			if (num[1].length == 1) {
				b = -1;
			} else {
				b = parseFloat(num[1]) * -1;
			}
			a = parseFloat(num[0]);
		}
	} else {
		num = num.split("+");
		if (num[1].length == 1) {
			b = 1;
		} else {
			b = parseFloat(num[1]);
		}
		a = parseFloat(num[0]);
	}
	return [a, b];
	
}

function complexMerge(rpart, ipart) {
	if (ipart < 0 & rpart != 0) {
		ipart = ipart * -1;
		if (ipart == 1) {
			return rpart.toString() + "-i";
		} else {
			return rpart.toString() + "-" + ipart.toString() + "i";
		}
	} else if (ipart == 0) {
		return rpart.toString();
	} else if (rpart == 0) {
		//console.log(rpart)
		if (ipart == 1) {
			return "i";
		} else {
			return ipart.toString() + "i";
		}
	} else {
			return rpart.toString() + "+" + ipart.toString() + "i";	
	}	
}
function getPosition(string, subString, index) {
  return string.split(subString, index).join(subString).length;
}
function replace(str) {
	var t = 0;
	var p;
	//console.log(str)
if (str.indexOf("i") > 0) {
		p = getPosition(str,".",2);
		//console.log(str)
		//console.log(parseFloat(str.substr(0,p)), parseFloat(str.substr(p-2,str.length)))
		return [parseFloat(str.substr(0,p)), parseFloat(str.substr(p-2,str.length))]
	} else {
		//console.log([parseFloat(str), 0])
		return [parseFloat(str), 0]
	}
	
	
	
	
	
	
	
	
	
	
	
	
}