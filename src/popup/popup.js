/**
 *  When the DOM is loaded, send a message to the content to get all the data needed
 **/

window.addEventListener('DOMContentLoaded', () => {
    browser.tabs.query({ active: true, currentWindow: true },
        tabs => {
            browser.tabs.sendMessage(tabs[0].id, { from: 'popup', subject: 'sendData' }, displayData);
        });
});

/**
 *  Fulfill table with data
 **/

const displayData = data => {
    for (let i = 0; i < data.length; i++) {
        const
            streamer = data[i]['streamer'],
            tr = document.createElement("tr"),
            tdStreamer = document.createElement("td"),
            tdMinutes = document.createElement("td");
    
        document.getElementById("tbody").append(tr);
        tr.append(tdStreamer);
        tr.append(tdMinutes);

        let 
            hours = 0, 
            minutes = data[i]["minutes"];

        if (minutes > 60) {
            hours = Math.floor(minutes / 60);
            minutes = minutes % 60;
        }

        tdStreamer.textContent = streamer
        tdMinutes.textContent = `${hours}h ${minutes}m`;
    }
};
