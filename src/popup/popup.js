/**
 *  When the DOM is loaded, send a message to the content to get all the data needed
 **/

window.addEventListener('DOMContentLoaded', () => {
    browser.tabs.query({ active: true, currentWindow: true },
        tabs => {
            browser.tabs.sendMessage(
                tabs[0].id,
                { from: 'popup', subject: 'sendData' },
                fulfillTable
            );
        });
});

/**
 *  Fulfill table with data
 **/

function fulfillTable(data) {
    // Check for data availlability
    if (!data) {
        let savedData = localStorage.getItem("twitch-tracker");
        if (!savedData) savedData = localStorage.setItem("twitch-tracker", "");
        data = JSON.parse(savedData);
    }
    else localStorage.setItem("twitch-tracker", JSON.stringify(data));

    // Display only a message if there is no data
    if (data.length === 0 || data === "" || data === "undefined") document.getElementById("message").textContent = "No data yet.";

    // Display and fulfill table if there is enough data
    else {
        document.getElementById("message").remove();
        document.getElementById("table").style.display = "block";

        // Display data
        for (let i = 0; i < data.length; i++) {
            const
                streamer = data[i]['streamer'],
                tr = document.createElement("tr"),
                tdStreamer = document.createElement("td"),
                tdWatchtime = document.createElement("td");

            // Create a new line in the table
            document.getElementById("tbody").append(tr);
            tr.append(tdStreamer);
            tr.append(tdWatchtime);

            // Determine time in minutes and hours
            let
                hours = 0,
                minutes = data[i]["minutes"];

            // Count hours for each streamer
            if (minutes > 60) {
                hours = Math.floor(minutes / 60);
                minutes = minutes % 60;
            }

            // Fulfill the new line with data
            tdStreamer.textContent = streamer
            tdWatchtime.textContent = `${hours}h ${minutes}m`;
        }
    }
}