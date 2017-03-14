var images = [ "apple", "lemon", "banana" ];
var svgNS = "http://www.w3.org/2000/svg";
var selectedElement = 0;
var currentX = 0;
var currentY = 0;
var currentMatrix = 0;
var widthRect = 100;
var heightRect = 100;
var startX = 0;
var startY = 0;
var distanceX = 15;
var distanceY = 20;
var fontSize=70;
var fontFamily="Verdana";
var xText=25;
var yText = 75;
var paddingX=20;
var word = images[2];
var letters =word;//word.split("").sort();
var rectObj1 = [letters.length];
var rectObj2 = [letters.length];
var textObjs = [letters.length];
var textColor="black";
var bgColor = "white";

var rectLine2IsEmpty =[letters.length];

$(document).ready(function() {
        letters = word.split("").sort();
      //  alert(letters);
	var svgObj = $("#svgObject");
	//initial new letters to spell
	//draw the first lines of  rectangles 
	var y = startY;
	for (var i = 0; i < letters.length; i++) {
		var x = startX + (i * distanceX) + (widthRect * i);
		rectObj1[i]=createRectObject(svgObj, x, y, widthRect, heightRect, bgColor);
		
	}
	//draw the second line of rectangles
	y = startY + distanceY + heightRect;
	for (var i = 0; i < letters.length; i++) {
		var x = startX + (i * distanceX) + (widthRect * i);
		rectObj2[i]=createRectObject(svgObj, x, y, widthRect, heightRect,bgColor);
	}
	// draw letters in the first line of rectangles and set empty for all rectangles in the second line
	for (var i = 0; i < letters.length; i++) {
		var x = xText + (i * distanceX) + (widthRect * i);
		var y= yText;
		textObjs[i]=createTextObject(svgObj,i, x, y, fontSize, fontFamily, textColor,letters[i]);
                //rect at line 2 is empty so items in array contains index = last index + 1
		rectLine2IsEmpty[i]= -1;
	}
});
function createTextObject(svgObj,index, x, y, theFontSize, theFontFamily, fill, char){
	
	var textObj = document.createElementNS(svgNS, 'text');
	textObj.setAttribute('x', x);
	textObj.setAttribute('y', y);
	textObj.setAttribute('fill', fill);
	textObj.setAttribute('font-size',theFontSize );
	textObj.setAttribute('font-family',theFontFamily );
	textObj.setAttribute('transform',"matrix(1 0 0 1 0 0)" );
	var  mouseDownHandler = "selectElement(evt,"+index+")";
	textObj.setAttribute('onmousedown', mouseDownHandler);
	textObj.setAttribute("id","letter"+index);
	$(textObj).text(char);
	$(svgObj).append(textObj);
	return textObj;
}

function createRectObject(svgObj, x, y, width, height, fill) {
	
	var rect = document.createElementNS(svgNS, 'rect');
	rect.setAttribute('x', x);
	rect.setAttribute('y', y);
	rect.setAttribute('width', width);
	rect.setAttribute('height', height);
	rect.setAttribute('fill', fill);
	$(svgObj).append(rect);
	return rect;
}
function createSVGObject(index, width, height, x, y, fill, char) {
	var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
	svg.setAttribute('xlink', 'http://www.w3.org/1999/xlink');
	svg.setAttribute('width', width);
	svg.setAttribute('height', height);
	svg.setAttribute("id", "sgv" + index);
	svg.setAttribute("");
	var text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
	text.setAttribute('x', y);
	text.setAttribute('y', y);
	text.setAttribute('fill', fill);
	text.textContent = char;

	svg.appendChild(text);

	var wp = document.getElementById('mainContent');
	wp.appendChild(svg);
}
function selectElement(evt,index) {
	selectedElement = evt.target;
	currentX = evt.clientX;
	currentY = evt.clientY;
        // check selectElement is in line 2 or line 1
        currentMatrix = $(selectedElement).attr("transform").slice(7, -1)
			.split(' ');

	for (var i = 0; i < currentMatrix.length; i++) {
		currentMatrix[i] = parseFloat(currentMatrix[i]);
	}
        
        for (var i=0;i<letters.length;i++){
            if (rectLine2IsEmpty[i] == index){
                rectLine2IsEmpty[i] = -1;
                break;
            }
        }
        var mouseMoveHandler = "moveElement(evt,"+index+")";
	var mouseOutHandler = "deselectElement(evt,"+index+")";
	var mouseUpHandler = "deselectElement(evt,"+index+")";
	$(selectedElement).attr("onmousemove", mouseMoveHandler);
	$(selectedElement).attr("onmouseout", mouseOutHandler);
	$(selectedElement).attr("onmouseup", mouseUpHandler);
}
function moveElement(evt,index) {
	dx = evt.clientX - currentX;
        dy = evt.clientY - currentY;
        currentMatrix[4] += dx;
	currentMatrix[5] += dy;
	calculateMatrix();
	currentX = evt.clientX;
	currentY = evt.clientY;
}
function calculateMatrix(){
        newMatrix = "matrix(" + currentMatrix.join(' ') + ")";
	$(selectedElement).attr("transform", newMatrix);
}

function moveTheLetter(index,clientX, clientY){
	
        var i=0;
        while (i<letters.length){
            // check rectObj2
            var topLeftX= rectObj2[i].getAttribute("x");
            var topLeftY = rectObj2[i].getAttribute("y");
            var bottomRightX= parseInt(topLeftX) + widthRect;
            var bottomRightY= parseInt(topLeftY) + heightRect;
            if ((clientX > topLeftX ) && (clientX < bottomRightX) && (clientY > topLeftY)
			&& (clientY < bottomRightY)) {
		// letter[index] moved to rectObj2[i]
                if (rectLine2IsEmpty[i]== -1){
                    //allowed moving, 
                    currentMatrix[4] = (i-index)*(widthRect + distanceX) ;
                    currentMatrix[5] = heightRect+ distanceY;
                    rectLine2IsEmpty[i]=index;
                    
                }else{
                    currentMatrix[4] = 0;
                    currentMatrix[5] = 0;
                }
                calculateMatrix();
                break;
            }
            i++;
        }
        if (i==letters.length){
            currentMatrix[4] = 0;
            currentMatrix[5] = 0;
            calculateMatrix();
        }
}
function deselectElement(evt, index) {
	// check offset where textObjs[index] move to
	moveTheLetter(index,evt.clientX,evt.clientY);
	currentX =0;
        currentY =0;
  	if (selectedElement != 0) {
		$(selectedElement).removeAttr("onmousemove");
		$(selectedElement).removeAttr("onmouseout");
		$(selectedElement).removeAttr("onmouseup");
		selectedElement = 0;
	}
}
