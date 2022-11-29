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
    // At first, hide message and display table
    document.getElementById("message").style.display = "none"; 
    document.getElementById("table").style.display = "block"; 

    // If no data available, get the old saved data
    if (!data) {
        let savedData = localStorage.getItem("twitch-tracker");
        if (!savedData) savedData = localStorage.setItem("twitch-tracker", "");
        data = JSON.parse(savedData);
    }

    // If there is data, save it
    else localStorage.setItem("twitch-tracker", JSON.stringify(data));

    // Display data
    for (let i = 0; i < data.length; i++) {
        const
            streamer = data[i]['streamer'],
            tr = document.createElement("tr"),
            tdStreamer = document.createElement("td"),
            tdWatchtime = document.createElement("td");

        document.getElementById("tbody").append(tr);
        tr.append(tdStreamer);
        tr.append(tdWatchtime);

        let
            hours = 0,
            minutes = data[i]["minutes"];

        if (minutes > 60) {
            hours = Math.floor(minutes / 60);
            minutes = minutes % 60;
        }

        tdStreamer.textContent = streamer
        tdWatchtime.textContent = `${hours}h ${minutes}m`;
    }
}