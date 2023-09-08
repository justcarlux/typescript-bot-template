export default {

    // Developers of the bot (array of strings).
    // Users with the specified Discord IDs here are going to have all of the available permissions
    "developers": [],

    // Available prefixes (array of strings)
    "prefixes": [],

    // Developer mode is a configuration entry that's useful when you're only testing the bot
    // Basically it restricts the use of commands (and everything) on certain channels while the bot is on (as long as this is activated)
    // Useful when having the bot turned on in your development and in production environment at the same time (so it doesn't respond twice to commands, etc)
    "developerMode": {
    
        // Set if the mode is activated
        "activated": false,

        // List of channel IDs in where the bot is going to work when trying to execute commands and developer mode is activated (array of strings)
        "channels": [],

    }

}