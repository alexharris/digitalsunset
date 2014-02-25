'use strict';
/*jshint undef:false */
/*jshint unused:false */
/*jshint latedef:false */

var gradientSize = 200; //size of gradient square
var handleArray = []; //array of handles for slider
var colors = ['fbb85d','ed257b']; //create array for building gradient
var currentColorStopValues = [gradientSize, 0]; //initial values for handle position

function testSomeShit(){
	console.log('Gradient Size: ' + gradientSize);
	console.log('Handle Array: ' + handleArray);
	console.log('Colors: ' + colors);
	console.log('Current colorstop values: ' + currentColorStopValues);
}


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
function addHandle(){
	$('.add-new').click(function(){
		createColorStopHandle(gradientSize/2);
		colors.push('000000');
		addSliderSwatch();
		colorHandles();
		updateAfterArrayChanges();
	});
}

function addSliderSwatch(){
	$('.ui-slider-handle').each(function(i, val){
		if($(this).children().length === 0){
			$(this).append('<div class="inner-handle icon-double-arrow"></div><div class="ui-slider-swatch"></div>');
		}
	});
	addNewColor();
}

//create new handle
function createColorStopHandle(handlePosition){
	var newHandle = handlePosition/2;
	handleArray.push(newHandle);
	initSlider(); //reinit to include new handle
}

function updateAfterArrayChanges(){
	currentColorStopValues = [];
	updateColorStopArray();
	createGradient(colors);
}

//load slider with current handles
function initSlider(){
	$('.slider').slider({
		orientation: 'vertical',
		range: [0, gradientSize],
		values: handleArray,
		start: function( event, ui) {
			appTooltips('hide-handle');
		},
		stop: function( event, ui ) {
			updateAfterArrayChanges();
	    }
	});
}

function addNewColor(){
	$('.ui-slider-swatch').click(function(){
		$('.ui-slider-swatch').removeClass('current-swatch');
		$('.modal-picker').modal();
		$(this).addClass('current-swatch');
		var currentSwatchColor = $(this).css('background-color');
		
		if($('.ui-slider-handle').length <= 2) {
			$('.remove-color').hide();
		} else {
			$('.remove-color').show();
		}
		callPicker(currentSwatchColor);

		appTooltips('hide-swatch');
	});
}

function removeColor(){
	$('.remove-color').click(function(){
		$('.ui-slider-handle').each(function(i, val){
			if($(this).children('.current-swatch').length === 1){
				handleArray.splice(i,1);
				colors.splice(i,1);
				$(this).remove();
			}
		});
		initSlider();
		updateAfterArrayChanges();
	});
	
}

function updateColorStopArray() {
	$('.ui-slider-handle').each(function(){
		var offset = $(this).position();
		var offsetTop = offset.top;
		offsetTop = offsetTop + $(this).height();

		//sometimes the handle slides too far and this value gets negative. clean it up.
		if (offsetTop < 0) {
			offsetTop = 0;
		}
		currentColorStopValues.push(offsetTop);
	});
}

// calls minicolors inside modal
function callPicker(currentSwatchColor){

	var modalSwatch = $('.modal-swatch');

	$('.minicolors-input').minicolors({
		theme: 'digitalSunset',
		defaultValue: '',
		inline: true,
		change: function(hex, opacity) {
			modalSwatch.css('background-color', hex);
		}
	});
	//set the picker value to match current slider swatch
	$('.minicolors-input').minicolors('value',[currentSwatchColor]);
}

function modalColorOk(){
	$('.modal-color-ok').click(function(){
		var swatchColor = $('.modal-swatch').css('background-color');
		$('.ui-slider-swatch.current-swatch').css('background-color', swatchColor);
		$('.ui-slider-swatch.current-swatch').removeClass('current-swatch');
		updateColorArray();
	});
}

// build array of colors from swatch backgrounds
function updateColorArray(){
	colors = [];
	var cssBackgroundColor;
	$('.ui-slider-swatch').each(function(i, val){
		var cssBackgroundColor = $(this).css('backgroundColor');
		colors.push(cssBackgroundColor);
	});
	createGradient(colors);
}

function createGradient(colors){
	var gradient = document.getElementById('gradient');
	if(gradient){
		var gradContext = gradient.getContext('2d');
		var myGradient = gradContext.createLinearGradient(0, 0, 0, gradientSize);
		if(colors.length <= 1){
			return;
		} else {
			var modifiedColorLength = colors.length - 1;
		}
		var i;
		for (i = 0; i < colors.length; ++i) {
			myGradient.addColorStop((currentColorStopValues[i] / gradientSize), colors[i]);
		}
		gradContext.fillStyle = myGradient;
		gradContext.fillRect(0, 0, gradientSize, gradientSize);
	}
}

function saveCanvas(){
	$('.save-button').click(function(){
		var canvas = document.getElementById('gradient');
		var img = canvas.toDataURL('image/png');
		$('.modal-save .modal-body .img').replaceWith('<img class="img" src="'+img+'"/></div>');
		$('.modal-save').modal();

		//save to form
		var gradientForm = $('#form-gradient')[0];
		gradientForm.value = img;
	});
}

function startGradient(){
	$('.start-gradient').click(function(){
		$(this).hide();

		$('.sunset-maker').show();
		appTooltips('show');
		$('body').delay('200').animate({ scrollTop: '0px' }, 'slow');
		// createGradient(colors);
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
}

function colorHandles(){
	//color them from color array
	$('.ui-slider-swatch').each(function(i, val){
		$(this).css('background', '#' + colors[i]);
	});
}

// POPOVER QUESTION SHTUFF
var mainQuestionArray = [
	'Gradient appreciation or gradientappropriation?',
	'What is worth looking at? What is worth looking at on the internet?',
	'Can you hold the magic of the sky in a tiny computer?',
	'If a sunset is fleeting, what is a png?',
	'Pollution or atmosphere?',
	'How long can you look at the sunset?',
	'If photographs are experience captured, then what is a picture of the sunset on your Instagram?',
	'Something exists, it must. The crimson-gold, the violet-fuchsia, it is real.',
	'Is this a souvenir or a note? A reflection or a snapshot?',
	'Gotta catch \'em all.',
	'Is this a photograph?',
	'Is it worth looking at your phone instead of the sunset?',
	'How chronic is your voyeurism?',
	'If a photograph freezes a moment, what does a digital gradient do?',
	'If you look at the sunset, will it hurt your corneas? Will it hurt your psyche?'
];

var $desktopQuestionPopover = $('.desktop-question');
var question;

function randomQuestion(){
	return mainQuestionArray[Math.floor(Math.random()*mainQuestionArray.length)];
}

function initDesktopQuestionPopover(question){
	$('.desktop-question').popover({
		placement: 'top auto',
		trigger: 'manual',
		container: 'body',
		content: question
	});
}

function desktopQuestionPopover(){
	$desktopQuestionPopover.on('click', function(e) {
		if($('.popover').is(':visible')){
			
		} else {
			e.stopPropagation();

			initDesktopQuestionPopover(randomQuestion());

			$desktopQuestionPopover.popover('show');

			$(document).one('click.initializedPopover', function() {
				$desktopQuestionPopover.popover('hide');
			});

			$desktopQuestionPopover.one('hidden.bs.popover', function() {
				$desktopQuestionPopover.popover('destroy');
				initDesktopQuestionPopover(randomQuestion());
			});
		}
	});
}

function infoModal(){
	$('.info-button').click(function(){
		$('.modal-info').modal();
	});
}

function appTooltips(state){
	$('.ui-slider-handle:last-of-type').tooltip({
		placement: 'bottom',
		title: 'Drag these sliders to make your colors big or small',
		trigger: 'manual'
	});
	$('.ui-slider-swatch').tooltip({
		placement: 'left',
		title: 'Choose your colors here',
		trigger: 'manual'
	});

	switch(state){
		case 'show':
			$('.ui-slider-handle:last-of-type').tooltip('show');
			$('.ui-slider-handle:first-of-type .ui-slider-swatch').tooltip('show');
			break;
		case 'hide-handle':
			$('.ui-slider-handle').tooltip('hide');
			break;
		case 'hide-swatch':
			$('.ui-slider-handle .ui-slider-swatch').tooltip('hide');
			break;
		default:
			console.log('default');
			break;
	}

}

var scrollTop, elementOffset, distance;

function back2Top(){
	$(document).scroll(function(){
		scrollTop     = $(window).scrollTop();
        elementOffset = $('.container').offset().top;
        distance      = (elementOffset - scrollTop);

        if(distance < -300){
			$('.back-to-top').fadeIn();
        } else {
			$('.back-to-top').fadeOut('fast');
        }
	});

	$('.back-to-top').click(function(){
		$(window).scrollTop(0);
	});
}


//Load methods on document ready
$(document).ready(function(){

	// click to add new handle
	addHandle();
	
	//load initial gradient
	createGradient(colors);

	//load and color intial handles
	intialHandleLoad();

	// add swatches
	addSliderSwatch();

	addNewColor();

	// color swatches
	colorHandles();

	modalColorOk();

	// print canvas to jpg
	saveCanvas();

	removeColor();

	//unhide gradient maker
	startGradient();

	// randomNumber();

	desktopQuestionPopover();

	// questionBox();

	infoModal();

	back2Top();


});