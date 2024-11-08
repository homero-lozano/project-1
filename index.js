document.addEventListener("DOMContentLoaded", () => console.log())

function fetchData() {
    fetch('url')
    .then((resp) => resp.json())
    .then(() => console.log(data))
}