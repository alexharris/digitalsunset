var colorStopHandleArray = []; //array of handles for slider
var colors = ['ff4800','00ffa2']; //create array for building gradient
var currentColorStopValues = [240, 0]; //initial values for handle position


addColorStopHandle = function(){
	$('.add-new').click(function(){
		createColorStopHandle(100);
		colors.push('000000');
	});
}

createColorStopHandle = function(handlePosition){
	newHandle = handlePosition;
	colorStopHandleArray.push(newHandle);
	initSlider(); //reinit to include new handle
	addNewColor(); // create pickacolor for new handle
}


initSlider = function(){
	$('.slider').slider({
		orientation: 'vertical',
		range: [0, 240],
		values: colorStopHandleArray,
		stop: function( event, ui ) {
			currentColorStopValues = [];
			updateColorStopArray();
        	createGradient(colors);
	    }
	});
}

addNewColor = function() {
	$('.ui-slider-handle').each(function(i){
		console.log('# of sliders: ' + i);
		if($(this).children('.pick-a-color-markup').length > 0){
			var offset = $(this).offset();
		} else {
			var input = document.createElement("input");
			input.type = "text";
			input.value= colors[i];
			input.className = "pick-a-color"; // set the CSS class
			$(this).append(input);
			callPicker(input);
			updateColorArray(input);
		}
	});
}

updateColorStopArray = function(){
	$('.ui-slider-handle').each(function(){
		offset = $(this).position();
		offsetTop = offset.top;
		//sometimes the handle slides too far and this value gets negative. clean it up.
		if (offsetTop < 0) {
			offsetTop = 0; 
		}
		console.log('offset top: ' + offsetTop);
		currentColorStopValues.push(offsetTop);
	});
}



//calls pick-a-color on an input
callPicker = function(input){
	$(input).pickAColor({
		showSavedColors: false,
		showSpectrum: false,
		showHexInput: false,
		// showAdvanced: false
	});
}

// build array of colors from pick-a-color inputs
updateColorArray = function(input){
	$(input).change(function() {
		colors = [];
		$('.pick-a-color').each(function(){
			colors.push(this.value);
		});
  		createGradient(colors);

	});
}

createGradient = function(colors){
	var gradient = document.getElementById("gradient");
	var grad_context = gradient.getContext("2d");
	var my_gradient = grad_context.createLinearGradient(0, 0, 0, 240);
	if(colors.length <= 1){
		return;
	} else {
		modifiedColorLength = colors.length - 1;
	}
	for (i = 0; i < colors.length; ++i) {
		console.log('colors: ' + colors);
		console.log('colorstop values: ' + currentColorStopValues);
		my_gradient.addColorStop((currentColorStopValues[i] / 240), colors[i]);
	}
	grad_context.fillStyle = my_gradient;
	grad_context.fillRect(0, 0, 240, 240);
}

saveCanvas = function(){
	$('.save-button').click(function(){
		var canvas = document.getElementById("gradient");
		var img    = canvas.toDataURL("image/png");
		$('.modal-save .modal-body .img').replaceWith('<div class="img"></div><img src="'+img+'"/></div>');
		$('.modal-save').modal();

		//save to form
		gradientForm = document.getElementById("form-gradient");
		gradientForm.value = img;
	});
}

cleanUpColorPicker = function(){
	// tabs
	$('.basicColors-tab').removeClass('tab-active');
	$('.basicColors-tab').hide();
	$('.advanced-tab').addClass('tab-active');
	// content
	$('.basicColors-content').hide();
	$('.advanced-content').removeClass('inactive-content');
	$('.advanced-content').addClass('active-content');
	$('.color-menu-tabs').hide();
}

// movePickerToModal = function(){

// 	$('.pick-a-color-markup .btn-group').click(function(){
// 		advancedContent = $(this).find('.advanced-content');


// 		advancedContent.hide();

// 	})
// }




//Load methods on document ready
$(document).ready(function(){

	document.documentElement.requestFullScreen();
	
	// create initial handles
	createColorStopHandle(0);
	createColorStopHandle(240);

	// click to add new handle
	addColorStopHandle();

	//load initial gradient
	createGradient(colors);

	// print canvas to jpg
	saveCanvas();

	//remove basic color tab, default to active tab...kinda crappy
	cleanUpColorPicker();


});










