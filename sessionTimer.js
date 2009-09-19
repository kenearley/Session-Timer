sessionTimer = function() {
				
		var sessionDuration,	// duration before session locks on the server side			
			warningDuration,	// duration the warning should be displayed to user
			warningTimeout,		// duration of time to wait before checking on activity
			activityTimeout,	// duration of time for measuring no activity by user
			noUserActivity,		// boolean representing if there has been any activity by user
			activityTimer,		// setTimeout object that tracks when to update user activity variable
			warningTimer,		// setTimeout object that tracks next time to display warning
			endSessionTimer;	// setTimeout object that tracks the duration of the warning before it finally ends session
		
		
		/**
		 *	Calculate timer settings and initialize timers
		 */
		function init(lockTime, warnTime) {
			sessionDuration = lockTime;
			warningDuration = warnTime;
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
		 *	If user chooses to end, session is unlocked
		 *	If no user input, then same as above as soon as timer runs out
		 */
		function warnUser() {
			$("div").append('<div class="warning"><h2 class="continue">Continue</h2><h2 class="done">Done</h2></div>');
			endSessionTimer = setTimeout(endSession, warningDuration);
			
			$("h2.continue").click(function() {
				resetActivityTimer();
				resetWarningTimer();
				clearTimeout(endSessionTimer);
				$("div.warning").remove();
			});
			
			$("h2.done").click(function() {
				$("div.warning").remove();
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
			$("div.warning").remove();
			// !Testing: console log
			console.log("unlocking session");
		};
		
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
	sessionTimer.startTimer(20000, 10000);
});