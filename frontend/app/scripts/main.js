'use strict';
/*jshint undef:false */
/*jshint unused:false */
/*jshint latedef:false */

var gradientSize = 200; //size of gradient square
var colorStopHandleArray = []; //array of handles for slider
var colors = ['fbb85d','ed257b']; //create array for building gradient
var currentColorStopValues = [gradientSize, 0]; //initial values for handle position


// convert RGB to hex
var bg;
$.cssHooks.backgroundColor = {
	get: function(elem) {
		if (elem.currentStyle) {
			bg = elem.currentStyle.backgroundColor;
		} else if (window.getComputedStyle) {
			bg = document.defaultView.getComputedStyle(elem,null).getPropertyValue('background-color');
		}
		if (bg.search('rgb') === -1) {
			return bg;
		} else {
			bg = bg.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);

			return '#' + hex(bg[1]) + hex(bg[2]) + hex(bg[3]);
		}
	}
};

function hex(x) {
	return ('0' + parseInt(x).toString(16)).slice(-2);
}

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

function addNewColor(){
	$('.ui-slider-handle').click(function(){
		$('.ui-slider-handle').removeClass('currentHandle');
		$('.modal-picker').modal();
		$(this).addClass('current-handle');
	});

	// $('.ui-slider-handle').each(function(i){
	// 	if($(this).children('.minicolors').length > 0){
	// 		var offset = $(this).offset();
	// 	} else {
	// 		updateColorArray(input);
	// 	}
	// });
}

function updateColorStopArray() {
	$('.ui-slider-handle').each(function(){
		var offset = $(this).position();
		var offsetTop = offset.top;
		//sometimes the handle slides too far and this value gets negative. clean it up.
		if (offsetTop < 0) {
			offsetTop = 0;
		}
		currentColorStopValues.push(offsetTop);
	});
}

//calls pick-a-color on an input
function callPicker(){

	var modalSwatch = $('.modal-swatch');

	$('.minicolors-input').minicolors({
		theme: 'digitalSunset',
		defaultValue: '#000000',
		inline: true,
		change: function(hex, opacity) {
			modalSwatch.css('background-color', hex);
		}
	});
}

function modalColorOk(){
	$('.modal-color-ok').click(function(){
		var swatchColor = $('.modal-swatch').css('background-color');
		$('.ui-slider-handle.current-handle').css('background-color', swatchColor);
		$('.ui-slider-handle.current-handle').removeClass('current-handle');
		updateColorArray();
	});
}

// build array of colors from pick-a-color inputs
function updateColorArray(){
	colors = [];
	var cssBackgroundColor;
	console.log('initial array: ' + colors);
	$('.ui-slider-handle').each(function(i, val){
		console.log(i);
		var cssBackgroundColor = $(this).css('backgroundColor');
		console.log('this handle: ' + cssBackgroundColor);
		colors.push(cssBackgroundColor);
		console.log('after push: ' + colors);
	});
	
	createGradient(colors);
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
		// console.log(i);
		// console.log('colors: ' + colors);
		// console.log('colorstop values: ' + currentColorStopValues);
		myGradient.addColorStop((currentColorStopValues[i] / gradientSize), colors[i]);
	}
	gradContext.fillStyle = myGradient;
	gradContext.fillRect(0, 0, gradientSize, gradientSize);
}

function saveCanvas(){
	$('.save-button').click(function(){
		var canvas = document.getElementById('gradient');
		var img = canvas.toDataURL('image/png');
		$('.modal-save .modal-body .img').replaceWith('<div class="img"></div><img src="'+img+'"/></div>');
		$('.modal-save').modal();

		//save to form
		// gradientForm = document.getElementById('form-gradient');
		// gradientForm.value = img;
	});
}

function startGradient(){
	$('.start-gradient').click(function(){
		$(this).hide();
		$('.sunset-maker').show();
	});
}

function questionBox(){
	$('.question').click(function(){
		$('.question-box').slideToggle();
	});
	$('.question-box-close').click(function(){
		$('.question-box').slideToggle();
	});
}


function intialHandleLoad(){
	// create initial handles
	createColorStopHandle(0);
	createColorStopHandle(gradientSize);

	//color them
	$('.ui-slider-handle').each(function(i, val){
		$(this).css('background', '#' + colors[i]);
	});
}


//Load methods on document ready
$(document).ready(function(){

	// click to add new handle
	addColorStopHandle();

	//load initial gradient
	createGradient(colors);

	//load and color intial handles
	intialHandleLoad();

	//call picker 
	callPicker();

	modalColorOk();

	// print canvas to jpg
	saveCanvas();

	//unhide gradient maker
	startGradient();

	questionBox();

});