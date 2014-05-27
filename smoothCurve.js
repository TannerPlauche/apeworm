//returns an array that if plotted gives you a smooth curve version of an parameter array
//uses numeric javascript
"use strict";
function smoothCurve(y, window_size, order, derive, rate) {
	//probably we don't need to parseInt anything or take the absolute value if we always make sure that our windown size and order are positive.  "golay.py" gave a window size of 55 and said that anything higuer will make a flatter graph
//window size must be positive and an odd number for this to work better
	var windowSize = Math.abs(parseInt(window_size));
	var order = Math.abs(parseInt(order));
	var order_range = order + 1;

	var half_window = (windowSize - 1)/2;
	var b = new Array();
	
	for(var k = -half_window; k < half_window+1; k++) {
		var row = new Array();
		for(var i = 0; i < order_range; i++) {
			row.push(Math.pow(k,i));	
		}
		b.push(row);	
	}
	//This line needs to be changed if you use something other than 0 for derivative
	var temp = numeric.pinv(b);
	var m = temp[0];
	//if you take a look at firstvals in the python code, and then at this code you'll see that I've only broken firstvals down into different parts such as first taking a sub array, flipping it, and so on
	var yTemp = new Array();
	yTemp = subArray(y, 1, half_window+1);
	yTemp = flipArray(yTemp);
	yTemp = subtractFromArray(yTemp, y[0]);
	yTemp = arrayAbs(yTemp);
	yTemp = negArrayAddValue(yTemp, y[0]);
	var firstvals = yTemp;
	
	//Same thing was done for lastvals
	var yTemp2 = new Array();
	yTemp2 = subArrayNegPos(y, -half_window - 1, -1);
	yTemp2 = flipArray(yTemp2);
	yTemp2 = subtractFromArray(yTemp2, y[y.length-1]);
	yTemp2 = arrayAbs(yTemp2);
	yTemp2 = addToArray(yTemp2, y[y.length-1]);
	var lastvals = yTemp2;
	
	y = concatenate(firstvals, y, lastvals);
	console.log(y);
	m = flipArray(m);
	var result = new Array();
	result = convolve(m,y);
	return result;

}

function convolve(m, y) {
	//var size = Math.abs(m.length - y.length) + 1;
	var result = new Array(),
      first  = null,
      second = null;

  if(m.length > y.length) {
    first  = y;
    second = m;
  }
  else
  {
    first  = m;
    second = y;
  }
  var size = second.length - first.length + 1;	
  first = flipArray(first);	
  for(var i = 0; i < size; i++) {
    if(i != 0) {
      first[first.length-1] = second.length;			
    }
    var newNum = 0;
    for(var j = 0; j < first.length; j++) {
      newNum = newNum + first[j]*second[j+i];
    }
    result.push(newNum);
  }
  return result;	 		
}

function concatenate(firstvals, y, lastvals) {
	var p = new Array();
	for(var i = 0; i < firstvals.length; i++) {
		p.push(firstvals[i]);
	}
	for(var i = 0; i < y.length; i++) {
		p.push(y[i]);	
	}
	for(var i = 0; i < lastvals.length; i++) {
		p.push(lastvals[i]);
	}
	return p;
}

function subArray(y, leftBoundary, rightBoundary) {
	var p = new Array();	
	for(var i = leftBoundary; i < rightBoundary; i++) {
		p.push(y[i]);
	}
	return p;
}

function subArrayNegPos(y, leftBoundary, rightBoundary) {
	var p = new Array();
	//var i = -1;
	var rightTemp = -1 - rightBoundary; 
	var rightBound = y.length - 1 - rightTemp;
	
	var leftTemp = -1 -leftBoundary;
	var leftBound = y.length - 1 - leftTemp;

	for(var i = leftBound; i < rightBound; i++) {
		p.push(y[i]);
	}  
	return p;
}

function arrayAbs(y) {
	for(var i = 0; i < y.length; i++) {
		y[i] = Math.abs(y[i]);
	}
	return y;
}

function flipArray(y) {
	var p = new Array();
	for(var i = y.length-1; i > -1; i--) {
		p.push(y[i]);	
	}
	return p;
}

function subtractFromArray(y,value) {
	for(var i = 0; i < y.length; i++) {
		y[i] = y[i] - value;
	}
	return y;
}

function negArrayAddValue(y, value) {
	for(var i =0; i < y.length; i++) {
		y[i] = -y[i] + value;
	}
	return y;
}

function addToArray(y, value) {
	for(var i = 0; i < y.length; i++) {
		y[i] = y[i] + value;
	}
	return y;
}


