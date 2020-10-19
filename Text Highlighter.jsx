// TextHighlighter.jsx
// Version: 1.0
// Copyright (c) 2020 pravbk. All rights reserved.
// Name: TextHighlighter
// Legal Note:
// This script is provided "as is," without warranty of any kind, expressed
// or implied. In no event shall the author be held liable for any damages 
// arising in any way from the use of this script.

var mCompdow = new Window("palette", "Bk Text Highlighter",undefined);
g = mCompdow.graphics;
myBrush = g.newBrush( g.BrushType.SOLID_COLOR, [ 0.18, 0.17, 0.2, 1 ] ); 
g.backgroundColor = myBrush;
mCompdow.orientation = "column";
var gpA = mCompdow.add("group",undefined,"gpOne");
gpA.orientation = "row";
var gpB = gpA.add("group",undefined,"gpTwo");
gpB.orientation = "column";
var stTextA = gpB.add("statictext",undefined,"Input");
var userInputT = gpB.add("edittext",[0,0,70,25],"");
var gpC = gpA.add("group",undefined,"gpTwo");
gpC.orientation = "column";
var stTextA = gpC.add("statictext",undefined,"Occurance");
var otherInputNumber = gpC.add("edittext",[0,0,30,25],"");
var DoIt = gpA.add("button", [0,0,40,60], "DoIt");
var helpB = gpA.add("button", [0,0,25,25], "?");

helpB.onClick = function(){
    app.beginUndoGroup("bk");
    alert(" Text Highlighter \
    Input ---> type your text. \
    ----------------------------------\
    Occurance ---> type number, which occurance \
    you want. \
    example - \
    if you want 2nd occurance to hightlight \
    type 2 there.\
    if third then type 3. \
    if first then leave it blank. \
    ----------------------------------\
    It will create 2 color controls. \
    These color controls will control \
    highlighter color. \
    ----------------------------------\
    It will create 2 keyframes with an expression, \
    for these colors. \
    Color change animation will occur before \
    the 1st keyframe & after the 2nd keyframe. \
    so there will be STAY time between these \
    two keyframes. \
    ----------------------------------\
    Duplicate these 2 keyframes n amount of times, \
    to have color change animation repeatedly.");
    app.endUndoGroup();
}

DoIt.onClick = function(){
    app.beginUndoGroup("bk");
    pTThings();
    userInputT.text = "";
    otherInputNumber.text = "";
    app.endUndoGroup();
}
function pTThings(){
    if (app.project === null){
        return;
    }
    var mComp = app.project.activeItem;
    if ((mComp === null) || !(mComp instanceof CompItem))
		{
            alert("Select the Comp");
            return;
        }
    var otherInNumber = otherInputNumber.text;
    if (isNaN(otherInNumber)){
        alert("Type a Number or keep it empty.");
        return;
    };
    var othNum = (otherInNumber == "") ? 1 : parseInt(otherInNumber);
    var UserinputText = userInputT.text;
    if (UserinputText == ""){
        alert("Type text in Input please.");
        return;
    }
    var myLayer = app.project.activeItem.selectedLayers[0];
    if (myLayer instanceof TextLayer){
    var effectsGroup = myLayer("Effects");
    var effectsOnLayer = new Array();
    var colControlA = myLayer.Effects.addProperty("ADBE Color Control");
    var colControlAIndex = colControlA.propertyIndex;
    colControlA.name = "Col" + colControlAIndex;
    var colControlnameA = colControlA.name;
    var colControlB = myLayer.Effects.addProperty("ADBE Color Control");
    var colControlBIndex = colControlB.propertyIndex;
    colControlB.name = "Col" + colControlBIndex;
    var colControlnameB = colControlB.name;
    //adding animator props//
    var AnimatorA = myLayer.property("Text").property("Animators").addProperty("ADBE Text Animator");
    AnimatorA.name = UserinputText;
    var texta = myLayer.text.sourceText.value;
    var textastr = texta.text;
    var inNumber = ranger(textastr,UserinputText,othNum);
    var aniexpression = 'var animator = thisProperty.propertyGroup(3);'+
    'var animatorName = animator.name;'+
    'var a = animatorName.length;'+
    'var b = ' + inNumber + ';'+
    'var UserinText = a+b;'+
    'myArray = [b+1,UserinText];'+
    'included = false;'+
    'for (i = 0; i < myArray.length; i += 2){'+
      'if (i < myArray.length-1){'+
        'if (textIndex >= myArray[i] && textIndex <= myArray[i+1]){'+
         ' included = true;'+
          'break;'+
        '}'+
      '}'+
    '}'+
    'included ? 100 : 0';
    var fillA = AnimatorA.property("ADBE Text Animator Properties").addProperty("ADBE Text Fill Color");
    var expressionA = AnimatorA.property("ADBE Text Selectors").addProperty("ADBE Text Expressible Selector");
    expressionA.property("Amount").expression = aniexpression;
    AnimatorA.property("Properties").property("Fill Color").addKey(mComp.time);
    AnimatorA.property("Properties").property("Fill Color").addKey(mComp.time + (12 * mComp.frameDuration));
    var fillexpression = 'x1 = effect("'+ colControlnameA +'")("Color");'+
    'x2 = effect("'+ colControlnameB +'")("Color");'+
    'for(i=1; i <= numKeys; i++){'+
    'if (i%2 != 0){'+
    'if (time <= key(i).time) {'+
    'x1 = linear(time,(key(i).time - (12/25)),key(i).time,x1,x2)'+
    '}else{'+
    'x1 = linear(time,key(i+1).time,key(i+1).time+(12/25),x2,x1)'+
    '}'+
    '}'+
    '}'+
    'x1';   
    var exprforCol = AnimatorA.property("Properties").property("Fill Color").expression = fillexpression;

    }
}

function ranger(string, subString, index){
    return string.split(subString, index).join(subString).length;
}


mCompdow.show();