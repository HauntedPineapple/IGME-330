export function loadTextXHR(url, callback) {
    const xhr = new XMLHttpRequest();

    xhr.onload = (e) => {
        console.log(`In onload - HTTP Status Code - ${e.target.status}`);
        callback(e);
    };

    xhr.onerror = e => console.log(`In onerror - HTTP Status Code = ${e.target.status}`);
    xhr.open("GET", url);
    xhr.send();
}