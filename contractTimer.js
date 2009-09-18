contractTimer = function() {
				
		var lockDuration,		// duration before contract locks on the server side			
			warningDuration,	// duration the warning should be displayed to user
			warningTimeout,		// duration of time to wait before checking on activity
			activityTimeout,	// duration of time for measuring no activity by user
			noUserActivity,		// boolean representing if there has been any activity by user
			activityTimer,		// setTimeout object that tracks when to update user activity variable
			warningTimer,		// setTimeout object that tracks next time to display warning
			unlockTimer;		// setTimeout object that tracks the duration of the warning before it finally unlocks contract
		
		
		/**
		 *	Calculate timer settings and initialize timers
		 */
		function init(lockTime, warnTime) {
			lockDuration = lockTime;
			warningDuration = warnTime;
			noUserActivity = false;
			warningTimeout = lockDuration - warningDuration;
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
		 *	Resets the warning timer and reset the contract lock on server
		 */
		function resetWarningTimer() {
			clearTimeout(warningTimer);
			warningTimer = setTimeout(checkUserActivity, warningTimeout);
			resetContract();
		};
		
		/**
		 *	Display warning to user that the contract is about to unlock
		 *	Gives option to continue or end session
		 *	If user chooses to continue then timers are reset
		 *	If user chooses to end session contract is unlocked
		 *	If no user input, then same as about as soon as timer runs out
		 */
		function warnUser() {
			$("div").append('<div class="warning"><h2 class="continue">Continue</h2><h2 class="done">Done</h2></div>');
			unlockTimer = setTimeout(unlockContract, warningDuration);
			
			$("h2.continue").click(function() {
				resetActivityTimer();
				resetWarningTimer();
				clearTimeout(unlockTimer);
				$("div.warning").remove();
			});
			
			$("h2.done").click(function() {
				$("div.warning").remove();
				unlockContract();
				clearTimeout(unlockTimer);
			});
		};
		
		/**
		 *	Asychronous call to reset contract lock on server
		 */
		function resetContract(contactId) {
			// !Testing: console log
			console.log("reseting contract");
		};
		
		/**
		 *	Asychronous call to unlock contract on server
		 */
		function unlockContract(contractId) {
			$("div.warning").remove();
			// !Testing: console log
			console.log("unlocking contract");
		};
		
		return {
			startTimer: function(lockDuration, warningDuration) {
				init(lockDuration, warningDuration);
			},
			userActivityDetected: function() {
				resetActivityTimer();
			}
		};	
}();

$(document).ready(function() {
	$("h1").click(function() {
		contractTimer.userActivityDetected();
	});
	contractTimer.startTimer(20000, 10000);
});