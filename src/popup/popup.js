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
            tr = document.createElement("tr"),
            tdStreamer = document.createElement("td"),
            tdMinutes = document.createElement("td");
    
        document.getElementById("tbody").append(tr);
        tr.append(tdStreamer);
        tr.append(tdMinutes);

        tdStreamer.textContent = `${data[i]['streamer']}`;
        tdMinutes.textContent = `${data[i]["minutes"]}`
    }
};
