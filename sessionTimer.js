/**
 * Session Timer is a singleton that warns the user that his/her session is about to end.
 * It uses asynchronous calls to reset the server side session timer.
 */

sessionTimer = function() {
				
		var sessionDuration,	// duration before session locks on the server side			
			warningDuration,	// duration the warning should be displayed to user
			warningTimeout,		// duration of time to wait before checking on activity
			activityTimeout,	// duration of time for measuring no activity by user
			noUserActivity,		// boolean representing if there has been any activity by user
			activityTimer,		// setTimeout object that tracks when to update user activity variable
			warningTimer,		// setTimeout object that tracks next time to display warning
			endSessionTimer;	// setTimeout object that tracks the duration of the warning before it finally ends session

/* PRIVATE METHODS */
		
		/**
		 *	Calculate timer settings and initialize timers
		 */
		function init(lockTimeMinutes, warnTimeMinutes) {
			sessionDuration = lockTimeMinutes*1000*60; // converting to miliseconds
			warningDuration = warnTimeMinutes*1000*60; // converting to miliseconds
			noUserActivity = false;
			warningTimeout = sessionDuration - warningDuration;
			activityTimeout = warningTimeout - 10;
			
			activityTimer = setTimeout(userActivityTimeout, activityTimeout);
			warningTimer = setTimeout(checkUserActivity, warningTimeout);
			// !Testing: console log
			console.log("Timer started");
		};
		
		/**
		 *	Reset the user activity timer
		 */			
		function resetActivityTimer() {
			clearTimeout(activityTimer);
			activityTimer = setTimeout(userActivityTimeout, activityTimeout);
			// !Testing: console log
			console.log("User activity");
		};
		
		function userActivityTimeout() {
			noUserActivity = true;
		};
						
		function checkUserActivity() {
			if (noUserActivity === true) {
				warnUser();				
			} else {
				resetWarningTimer();
			}
		};
		
		/**
		 *	Resets the warning timer and resets the session on server
		 */
		function resetWarningTimer() {
			clearTimeout(warningTimer);
			warningTimer = setTimeout(checkUserActivity, warningTimeout);
			resetSession();
		};
		
		/**
		 *	Display warning to user that the session is about to end
		 *	Gives option to continue or end session
		 *	If user chooses to continue then timers are reset
		 *	If user chooses to end, session is ended
		 */
		function warnUser() {
			var warnWidth = 300;
			var warnPosition = (jQuery(window).width()/2) - (warnWidth/2);
			jQuery("body:first").append('<div class="warning"><div class="warningHeader">User input required</div><div class="content"><p>Your session is about to end. Would you like to continue?</p><div class="buttons"><input type="button" class="continue" value="Continue Session"/><input type="button" class="close" value="End Session"/></div></div></div>');
			jQuery("div.warning").css({display:"block", border:"1px solid #000", width:warnWidth+"px", position:"absolute", top:"100px", left:warnPosition+"px", background:"#fff"});
			jQuery("div.warning .warningHeader").css({color:"#fff", "font-weight":"bold", background:"#990000", margin:"0", padding:"4px 10px", "border-bottom":"1px solid #000"});
			jQuery("div.warning .content").css({margin:"5px 10px 10px 10px"});
			jQuery("div.warning .buttons input").css({"font-size":"11px", margin:"0 10px 0 0"});
			endSessionTimer = setTimeout(endSession, warningDuration);
			
			jQuery(".continue").click(function() {
				resetActivityTimer();
				resetWarningTimer();
				clearTimeout(endSessionTimer);
				jQuery("div.warning").remove();
			});
			
			jQuery(".close").click(function() {
				jQuery("div.warning").remove();
				endSession();
				clearTimeout(endSessionTimer);
			});
		};
		
		/**
		 *	Asychronous call to reset session on server
		 */
		function resetSession(contactId) {
			// !Testing: console log
			console.log("reseting session");
		};
		
		/**
		 *	Asychronous call to end session on server
		 */
		function endSession(sessionId) {
			// !Testing: console log
			console.log("ending session");
		};
		
/* PUBLIC METHODS */
		
		return {
			startTimer: function(sessionDuration, warningDuration) {
				init(sessionDuration, warningDuration);
			},
			userActivityDetected: function() {
				resetActivityTimer();
			}
		};	
}();

$(document).ready(function() {
	$("h1").click(function() {
		sessionTimer.userActivityDetected();
	});
	sessionTimer.startTimer(.5, .25);
});