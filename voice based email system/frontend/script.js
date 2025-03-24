// Function to speak text and execute a callback after speaking
function speak(text, callback = null) {
    let speech = new SpeechSynthesisUtterance(text);
    speech.lang = 'en-US';
    speech.rate = 1;
    speech.pitch = 1;
    window.speechSynthesis.speak(speech);

    // Execute callback after speech ends, if provided
    if (callback) {
        speech.onend = callback;
    }
}

// Function to start the initial greeting and then request input
function startVoicePrompt() {
    speak("Welcome to The Talking Mailbox. Let Your Voice Be Heard, Let Your Mail Be Seen.", function() {
        // Immediately request input after greeting
        speak("Please say 'Sign Up' if you are a new user, or 'Sign In' if you have an existing account.", listenForChoice);
    });
}

// Function to listen for user input (Sign Up or Sign In)
function listenForChoice() {
    let recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = 'en-US';
    recognition.start();

    recognition.onresult = function(event) {
        let userChoice = event.results[0][0].transcript.toLowerCase();

        if (userChoice.includes("sign up")) {
            verifyChoice("Sign Up");
        } else if (userChoice.includes("sign in")) {
            verifyChoice("Sign In");
        } else {
            speak("I didn't understand. Please say 'Sign Up' or 'Sign In'.", listenForChoice);
        }
    };

    recognition.onerror = function() {
        speak("There was an error understanding you. Please try again.", listenForChoice);
    };
}

// Function to verify the user's choice
function verifyChoice(choice) {
    speak(`You have chosen to ${choice}. Is this correct? Please say 'Yes' or 'No'.`, function() {
        let recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
        recognition.lang = 'en-US';
        recognition.start();

        recognition.onresult = function(event) {
            let confirmation = event.results[0][0].transcript.toLowerCase();
            if (confirmation.includes("yes")) {
                speak(`Redirecting to ${choice} page.`, function() {
                    window.location.href = choice === "Sign Up" ? 'signup.html' : 'login.html';
                });
            } else if (confirmation.includes("no")) {
                speak("Please choose again. Say 'Sign Up' or 'Sign In'.", listenForChoice);
            } else {
                speak("I didn't understand. Please say 'Yes' or 'No'.", function() {
                    verifyChoice(choice);
                });
            }
        };

        recognition.onerror = function() {
            speak("I couldn't hear you. Please try again.", function() {
                verifyChoice(choice);
            });
        };
    });
}

// Automatically start voice prompt when the page loads
window.onload = startVoicePrompt;
