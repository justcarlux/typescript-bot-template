export default {

    // Developers of the bot (array of strings).
    // Users with the specified Discord IDs here are going to have all of the available permissions
    "developers": [],

    // Available prefixes (array of strings)
    "prefixes": [],

    // Developer mode is a configuration entry that's useful when you're only testing the bot
    // Basically it restricts the use of commands (and everything) on certain channels when turning on the bot if developer mode is activated
    "developerMode": {
    
        // Set if the mode is activated
        "activated": false,

        // List of channel IDs in where the bot is going to work when trying to execute commands and developer mode is activated (array of strings)
        "channels": [],

    }

}