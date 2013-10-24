var colorStopHandleArray = []; //array of handles for slider
var colors = ['ff4800','00ffa2']; //create array for building gradient
var currentColorStopValues = [300, 0]; //initial values for handle position



createColorStopHandle = function(handlePosition){
	newHandle = handlePosition;
	colorStopHandleArray.push(newHandle);
	initSlider(); //reinit to include new handle
	addNewColor(); // create pickacolor for new handle
}

addColorStopHandle = function(){
	$('.add-new').click(function(){
		createColorStopHandle(100);
		colors.push('000000');
	});
}

initSlider = function(){
	$('.slider').slider({
		orientation: 'vertical',
		range: [0, 300],
		values: colorStopHandleArray,
		stop: function( event, ui ) {
			currentColorStopValues = [];
			updateColorStopArray();
        	createGradient(colors);
	    }
	});
}

updateColorStopArray = function(){
	$('.ui-slider-handle').each(function(){
		offset = $(this).offset();
		offsetTop = offset.top;
		currentColorStopValues.push(offsetTop);
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
	var my_gradient = grad_context.createLinearGradient(0, 0, 0, 320);
	if(colors.length <= 1){
		return;
	} else {
		modifiedColorLength = colors.length - 1;
	}
	for (i = 0; i < colors.length; ++i) {
		console.log('colors: ' + colors);
		console.log('colorstop values: ' + currentColorStopValues);
		my_gradient.addColorStop((currentColorStopValues[i] / 380), colors[i]);
	}
	grad_context.fillStyle = my_gradient;
	grad_context.fillRect(0, 0, 320, 320);
}

saveCanvas = function(){
	$('.save-button').click(function(){
		var canvas = document.getElementById("gradient");
		var img    = canvas.toDataURL("image/png");
		$('.modal-body .img').replaceWith('<div class="img"></div><img src="'+img+'"/></div>');
		$('.modal').modal();
	});
}

cleanUpColorPicker = function(){
	// tabs
	$('.basicColors-tab').removeClass('tab-active');
	$('.basicColors-tab').hide();
	$('.advanced-tab').addClass('tab-active');
	// content
	$('.basicColors-content').remove();
	$('.basicColors-content').hide();
	$('.advanced-content').removeClass('inactive-content');
	$('.advanced-content').addClass('active-content');
	$('.color-menu-tabs').hide();

}


//Load methods on document ready
$(document).ready(function(){


	
	// create initial handles
	createColorStopHandle(0);
	createColorStopHandle(300);

	// click to add new handle
	addColorStopHandle();

	//load initial gradient
	createGradient(colors);

	// print canvas to jpg
	saveCanvas();

	cleanUpColorPicker();

});










