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
 *  Fulfill table with data of streamers
 **/

const displayData = data => {
    for (let i = 0; i < data.length; i++) {
        const 
            tr = document.createElement("tr"),
            td1 = document.createElement("td"),
            td2 = document.createElement("td");
    
        document.getElementById("tbody").append(tr);
        tr.append(td1);
        tr.append(td2);

        td1.innerHTML = `${data[i]['streamer']}`;
        td2.innerHTML = `${data[i]["minutes"]}`
    }
};
