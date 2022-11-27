/**
 *  When the DOM is loaded, send a message to the content to get all the data needed
 **/

window.addEventListener('DOMContentLoaded', () => {
    browser.tabs.query({ active: true, currentWindow: true },
        tabs => {
            browser.tabs.sendMessage(
                tabs[0].id,
                { from: 'popup', subject: 'sendData' },
                displayData
            );
        });
});

/**
 *  Fulfill table with data
 **/

const displayData = data => {
    const
        content = document.getElementById("content"),
        table = document.createElement("table"),
        thead = document.createElement("thead"),
        thStreamer = document.createElement("th"),
        thWatchtime = document.createElement("th"),
        tbody = document.createElement("tbody");

    if (data) {
        document.getElementById("message").remove();

        content.append(table);
        table.append(thead);
        thead.append(thStreamer);
        thead.append(thWatchtime);
        table.append(tbody);

        thStreamer.textContent = "Streamer";
        thWatchtime.textContent = "Watchtime";

        // Create table data
        for (let i = 0; i < data.length; i++) {
            const
                streamer = data[i]['streamer'],
                tr = document.createElement("tr"),
                tdStreamer = document.createElement("td"),
                tdWatchtime = document.createElement("td");

            tbody.append(tr);
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
};