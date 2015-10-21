AnimationController = (function(){
	'use strict';

	var animations = [];
	var TARGET_FRAMERATE = 60; //fps
	var frameTime = 1000 / TARGET_FRAMERATE;
	var lastTime = 0;

	// deltaTime is how long it's been since the last frame
	// *in frames* as defined by the TARGET_FRAMERATE "constant"
	//
	// For example in a perfect world where you're getting a 
	// consistent 60fps, deltaTime should always be 1, or very close
	// but if performance drops to 30fps then deltaTime will increase
	// to 2 (since each frame is 2 "ideal frames" long)
	//
	// deltaTime is always passed into the animation functions
	var deltaTime;

	var requestAnimFrame = (function(){
		return  window.requestAnimationFrame       ||
		        window.webkitRequestAnimationFrame ||
		        window.mozRequestAnimationFrame    ||
		        function( callback ){
		          window.setTimeout(callback, 1000 / 60);
		        };
	})();

	function onDocumentReady(){
		runAnimations();
	}

	function registerAnimation(animation){
		var wasEmpty = animations.length === 0;
		animations.push(animation);
		console.log('Registered animation: %o', animation);
		if(wasEmpty){
			runAnimations();
		}
	}

	function cancelAnimation(animation){
		var i = animations.indexOf(animation);
		if(i>=0){
			animations.splice(i, 1);
			console.log('Cancelled animation: %o', animation);
		}
		else{
			throw new Error('Can not cancel an animation that hasn\'t been registered!');
		}
	}

	function runAnimations(timestamp){
		if(animations.length === 0){
			return false;
		}
		else{
			requestAnimFrame(runAnimations);
			var timeElapsed;

			if(timestamp === undefined){
				timestamp = 0;
			}

			timeElapsed = timestamp - lastTime;
			deltaTime = timeElapsed / frameTime;
			lastTime = timestamp;

			for(var i=0; i<animations.length; i++){
				var animation = animations[i];
				animation(deltaTime);
			}
		}
	}

	document.addEventListener('DOMContentLoaded', onDocumentReady);

	return {
		registerAnimation: registerAnimation,
		cancelAnimation: cancelAnimation
	};
})();
