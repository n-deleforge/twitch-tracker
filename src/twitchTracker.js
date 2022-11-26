// =================
// ======= VARIABLES

const
    APP_VERSION = "0.3",
    APP_NAME = "Twitch Tracker",
    GITHUB_LINK = "https://github.com/n-deleforge/twitch-tracker/";

let tracker, currentStreamer, allData, streamerData, seconds, minutes;

// =================
// ======== == EVENTS

console.log(`${APP_NAME} - v.${APP_VERSION}`);
twitchTracker();
sendDataToPopup();

// =================
// ======== DATABASE

/**
 *  Return all saved data from localstorage
 * @return {array} Array of JSON data
 **/

function getAllData() {
    const twitchTracker = localStorage.getItem("twitchTracker");

    // If there is no saved data, an empty array is created
    if (!twitchTracker) {
        localStorage.setItem('twitchTracker', "");
        return new Array();
    }

    else return JSON.parse(localStorage.getItem("twitchTracker"));
}

/**
 *  Return saved data of the current streamer
 * @return {string} Number of minutes
 **/

function getStreamerData() {
    if (allData.length == 0) {
        console.log("Info : database empty")
        InsertToDatabase();
    }
    else {
        console.log("Info : searching streamer")

        for (let i = 0; i < allData.length; i++) {
            const element = allData[i];

            // Verify streamer name in uppercase to avoid problems
            if (element["streamer"].toUpperCase() == currentStreamer.toUpperCase()) {
                console.log("Info : streamer found")
                return element["minutes"];
            }
        }

        console.log("Info : streamer not found")
        InsertToDatabase();
    }
}

/**
 *  Create new data for the current streamer and insert it into the database (localstorage)
 * @return {void}
 **/

function InsertToDatabase() {
    console.log("Info : creating new data");
    const newData = { streamer: currentStreamer, minutes: 0 };
    allData = allData.concat(newData);

    streamerData = getStreamerData();
    localStorage.setItem("twitchTracker", JSON.stringify(allData));
}

/**
 *  Update the database (localsotrage) with new data
 * @return {void}
 **/

function updateDatabase() {
    for (let i = 0; i < allData.length; i++) {
        const selectionnedStreamer = allData[i];

        // Verify streamer name in uppercase to avoid problems
        if (selectionnedStreamer["streamer"].toUpperCase() == currentStreamer.toUpperCase()) {
            selectionnedStreamer["minutes"] = minutes;
            localStorage.setItem("twitchTracker", JSON.stringify(allData));
            return true;
        }
    }
}

// =================
// ======== TRACKER

/**
 *  Main function which verify state and get all the data needed before to start the tracker
 * @return {void}
 **/

function twitchTracker() {
    const url = window.location.href.split("/")[3];
    const name = document.getElementsByTagName("h1")[0].innerText;
    const video = document.getElementsByTagName("video")[0];

    if (url && name && video) {
        currentStreamer = name;
        allData = getAllData();
        streamerData = getStreamerData();
        seconds = 0;
        minutes = (streamerData) ? streamerData : 0;
        tracker = setInterval(startTracker, 1000);

        console.log(`Info : current streamer is ${currentStreamer}`);
    }
    else {
        console.log("Info : not watching a live stream, new try in a few seconds")
        setTimeout(twitchTracker, 10000);
    }
}

/**
 *  Tracker function : count time and check stream changes
 * @return {void}
 **/

function startTracker() {
    seconds++;

    // Every 10 seconds, check if the live stream is still going on
    if (seconds % 10 == 1) {
        const video = document.getElementsByTagName("video")[0];

        if (video) {
            const videoPaused = video.paused;
            const checkStreamer = document.getElementsByTagName("h1")[0].innerText.toUpperCase();
    
            if (videoPaused || checkStreamer != currentStreamer.toUpperCase()) {
                console.log("Info : stream is loading, is paused or has changed, reload in a few seconds");
                clearInterval(tracker);
                setTimeout(twitchTracker, 5000);
            }
        }
        else {
            console.log("Info : not watching a live stream, new try in a few seconds");
                clearInterval(tracker);
                setTimeout(twitchTracker, 5000);
        }
    }

    // Save and update the tracker
    if (seconds == 60) {
        minutes++;
        seconds = 0;
        updateDatabase();
    }
}

/**
 *  Initialize messages (and wait for event) between content and popup
 * @return {void}
 **/

function sendDataToPopup() {
    browser.runtime.onMessage.addListener((msg, sender, response) => {
        if ((msg.from === 'popup') && (msg.subject === 'sendData')) {
            // Sort all the data
            // First, sort by minutes and then sort by name
            const stats = allData.sort(
                function (a, b) {
                    return b.minutes - a.minutes || a.streamer.localeCompare(b.streamer);
                });

            response(stats);
        }
    });
}