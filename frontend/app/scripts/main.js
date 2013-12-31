'use strict';
/*jshint undef:false */
/*jshint unused:false */
/*jshint latedef:false */

var gradientSize = 200; //size of gradient square
var colorStopHandleArray = []; //array of handles for slider
var colors = ['fbb85d','ed257b']; //create array for building gradient
var currentColorStopValues = [gradientSize, 0]; //initial values for handle position


//add new handle to slider
function addColorStopHandle(){
	$('.add-new').click(function(){
		createColorStopHandle(gradientSize);
		colors.push('000000');
	});
}

//create new handle object
function createColorStopHandle(handlePosition){
	var newHandle = handlePosition;
	colorStopHandleArray.push(newHandle);
	initSlider(); //reinit to include new handle
	addNewColor(); // create pickacolor for new handle
}

//load slider with current handles
function initSlider(){
	$('.slider').slider({
		orientation: 'vertical',
		range: [0, gradientSize],
		values: colorStopHandleArray,
		stop: function( event, ui ) {
			currentColorStopValues = [];
			updateColorStopArray();
			createGradient(colors);
	    }
	});
}

function addNewColor() {
	$('.ui-slider-handle').each(function(i){
		console.log('# of sliders: ' + i);
		if($(this).children('.minicolors').length > 0){
			var offset = $(this).offset();
		} else {
			var input = document.createElement('input');
			input.type = 'hidden';
			input.value= colors[i];
			input.className = 'pick-a-color'; // set the CSS class
			$(this).append(input);
			callPicker(input);
			updateColorArray(input);
		}
	});
}

function updateColorStopArray() {
	$('.ui-slider-handle').each(function(){
		var offset = $(this).position();
		var offsetTop = offset.top;
		//sometimes the handle slides too far and this value gets negative. clean it up.
		if (offsetTop < 0) {
			offsetTop = 0;
		}
		console.log('offset top: ' + offsetTop);
		currentColorStopValues.push(offsetTop);
	});
}

//calls pick-a-color on an input
function callPicker(input){
	$(input).minicolors({
		theme: 'digitalSunset',
		defaultValue: '#000000'
	});
}

// build array of colors from pick-a-color inputs
function updateColorArray(input){
	$(input).change(function() {
		colors = [];
		$('.pick-a-color').each(function(){
			colors.push(this.value);
		});
		createGradient(colors);

	});
}

function createGradient(colors){
	var gradient = document.getElementById('gradient');
	var gradContext = gradient.getContext('2d');
	var myGradient = gradContext.createLinearGradient(0, 0, 0, gradientSize);
	if(colors.length <= 1){
		return;
	} else {
		var modifiedColorLength = colors.length - 1;
	}
	var i;
	for (i = 0; i < colors.length; ++i) {
		console.log(i);
		console.log('colors: ' + colors);
		console.log('colorstop values: ' + currentColorStopValues);
		myGradient.addColorStop((currentColorStopValues[i] / gradientSize), colors[i]);
	}
	gradContext.fillStyle = myGradient;
	gradContext.fillRect(0, 0, gradientSize, gradientSize);
}

function saveCanvas(){
	$('.save-button').click(function(){
		var canvas = document.getElementById('gradient');
		var img    = canvas.toDataURL('image/png');
		$('.modal-save .modal-body .img').replaceWith('<div class="img"></div><img src="'+img+'"/></div>');
		$('.modal-save').modal();

		//save to form
		gradientForm = document.getElementById('form-gradient');
		gradientForm.value = img;
	});
}

function startGradient(){
	$('.start-gradient').click(function(){
		$(this).hide();
		$('.sunset-maker').show();
	});
}


//Load methods on document ready
$(document).ready(function(){

	// create initial handles
	createColorStopHandle(0);
	createColorStopHandle(gradientSize);

	// click to add new handle
	addColorStopHandle();

	//load initial gradient
	createGradient(colors);

	// print canvas to jpg
	saveCanvas();

	//unhide gradient maker
	startGradient();

});