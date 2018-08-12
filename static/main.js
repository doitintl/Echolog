'use strict';

// Shortcuts to DOM Elements.
var signInButton = document.getElementById('sign-in-button');
var signOutButton = document.getElementById('sign-out-button');
var splashPage = document.getElementById('page-splash');
var payloadsection = document.getElementById('payloads-section');
var listeningFirebaseRefs = [];

/**
* Cleanups the UI and removes all Firebase listeners.
*/
function cleanupUi() {
	payloadsection.getElementsByClassName('json-value')[0].innerHTML = '';
	// Stop all currently listening Firebase listeners.
	listeningFirebaseRefs.forEach(function(ref) {
		ref.off();
	});
	listeningFirebaseRefs = [];
}

/**
* The ID of the currently signed-in User. We keep track of this to detect Auth state change events that are just
* programmatic token refresh but not a User status change.
*/
var currentUID;

/**
* Triggers every time there is a change in the Firebase auth state (i.e. user signed-in or user signed out).
*/
function onAuthStateChanged(user) {
	// We ignore token refresh events.
	if (user && currentUID === user.uid) {
		return;
	}

	cleanupUi();
	if (user) {
		currentUID = user.uid;
		splashPage.style.display = 'none';
		user.photoURL
		startDatabaseQueries();
	} else {
		// Set currentUID to null.
		currentUID = null;
		// Display the splash page where you can sign-in.
		splashPage.style.display = '';
	}
}

/**
 * Starts listening for new payloads and populates payloads lists.
 */
function startDatabaseQueries() {
	// [START recent_payloads_query]
	var recentPayloadsRef = firebase.database().ref();
	// [END recent_payloads_query]

	var fetchPayloads = function(payloadsRef, sectionElement) {
		payloadsRef.on('value', function(data) {
			document.getElementById("json-value").innerHTML = JSON.stringify(data.val(), undefined, 2);

		});
	};

	// Fetching and displaying all payloads of each sections.
	fetchPayloads(recentPayloadsRef, payloadsection);

	// Keep track of all Firebase refs we are listening to.
	listeningFirebaseRefs.push(recentPayloadsRef);
}

/**
* Displays the given section element and changes styling of the given button.
*/
function showSection(sectionElement) {
	payloadsection.style.display = 'none';

	if (sectionElement) {
		sectionElement.style.display = 'block';
	}
}

// Bindings on load.
window.addEventListener('load', function() {
	// Bind Sign in button.
	signInButton.addEventListener('click', function() {
		var provider = new firebase.auth.GoogleAuthProvider();
		firebase.auth().signInWithPopup(provider);
	});

	// Bind Sign out button.
	signOutButton.addEventListener('click', function() {
		firebase.auth().signOut();
	});

	// Listen for auth state changes
	firebase.auth().onAuthStateChanged(onAuthStateChanged);

	showSection(payloadsection);
}, false);
