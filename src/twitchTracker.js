// =================
// ======= VARIABLES

const
    APP_VERSION = "0.3.2",
    APP_NAME = "Twitch Tracker",
    GITHUB_LINK = "https://github.com/n-deleforge/twitch-tracker/",
    TIMEOUT_RETRY = 10000,
    RETRY_MESSAGE = "not watching a live stream or detection not working, new try in a few seconds";
    TIMETOUT_RELOAD = 5000,
    RELOAD_MESSAGE = "stream is loading, is paused or has changed, reload in a few seconds";
    INTERVAL_TRACKER = 1000;

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
    const dataExisting = localStorage.getItem("twitchTracker");

    if (!dataExisting) {
        localStorage.setItem("twitchTracker", "");
        return new Array();
    }
    else return JSON.parse(localStorage.getItem("twitchTracker"));
}

/**
 *  Return saved data of the current streamer
 * @return {string} Number of minutes
 **/

function getStreamerData() {
    const lengthDatabase = allData.length;
    const emptyDatabase = (allData.length == 0);

    if (emptyDatabase) {
        console.log("Info : empty database");
        InsertToDatabase();
    }
    else {
        for (let i = 0; i < lengthDatabase; i++) {
            const e = allData[i];

            if (e["streamer"].toUpperCase() == currentStreamer.toUpperCase()) {
                console.log("Info : streamer found");
                return e["minutes"];
            }
        }

        console.log("Info : streamer not found");
        InsertToDatabase();
    }
}

/**
 *  Create new data for the current streamer and insert it into the database (localstorage)
 * @return {void}
 **/

function InsertToDatabase() {
    const newData = { streamer: currentStreamer, minutes: 0 };

    console.log("Info : new data created");
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
        const e = allData[i];

        // Verify streamer name in uppercase to avoid problems
        if (e["streamer"].toUpperCase() == currentStreamer.toUpperCase()) {
            e["minutes"] = minutes;
            // console.log("Info : data updated");
            localStorage.setItem("twitchTracker", JSON.stringify(allData));
            return;
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
    try {
        const url = window.location.href.split("/")[3];
        const name = document.getElementsByTagName("h1")[0].innerText;
        const video = document.getElementsByTagName("video")[0];

        if (url && name && video) {
            currentStreamer = name;
            allData = getAllData();
            streamerData = getStreamerData();
            seconds = 0;
            minutes = (streamerData) ? streamerData : 0;
            tracker = setInterval(startTracker, INTERVAL_TRACKER);
            console.log(`Info : current streamer is ${currentStreamer}`);
        }
        else {
            console.log(`Info : ${RETRY_MESSAGE}`);
            setTimeout(twitchTracker, TIMEOUT_RETRY);
        }
    }
    catch {
        console.log(`Info : ${RETRY_MESSAGE}`);
        setTimeout(twitchTracker, TIMEOUT_RETRY);
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
                console.log(`Info : ${RELOAD_MESSAGE}`);
                clearInterval(tracker);
                setTimeout(twitchTracker, TIMETOUT_RELOAD);
            }
        }
        else {
            console.log(`Info : ${RELOAD_MESSAGE}`);
            clearInterval(tracker);
            setTimeout(twitchTracker, TIMETOUT_RELOAD);
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