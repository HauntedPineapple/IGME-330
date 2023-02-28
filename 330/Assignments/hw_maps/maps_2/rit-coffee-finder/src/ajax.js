function downloadFile(url, callbackRef) {
    const xhr = new XMLHttpRequest();

    // set 'onerror' handler
    xhr.onerror = (e) => console.log("ERROR");

    // set 'onload' handler
    xhr.onload = e => {
        const headers = e.target.getAllResponseHeaders();
        const jsonString = e.target.response;
        console.log(`headers = ${headers}`);
        console.log(`jsonString = ${jsonString}`);
        callbackRef(jsonString);
    }

    // open the connection using the HTTP GET method
    xhr.open("GET", url);

    // send the request
    xhr.send();
}

export { downloadFile };