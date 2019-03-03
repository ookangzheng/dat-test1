const Dat = require("dat-js");
const db = require("random-access-idb")("dats");

let url = document.querySelector("#url");
const app = document.querySelector("#app");
let username = document.querySelector("#username");
let name = document.querySelector("#name");
// let projects = document.querySelector("#projects");
// let background = document.querySelector("#background");
// let interests = document.querySelector("#interests");
let twitter = document.querySelector("#twitter");
let github = document.querySelector("#github");
const load = document.querySelector("#load");
const btnSave = document.querySelector("#btn-save");
const clearStorage = document.querySelector("#clear-storage");

localStorage.clear();

const dat = new Dat({
  //wss://gateway.mauve.moe
  // "ws://gateway.mauve.moe:3000"
  gateway: "ws://ipfs.datt.ml:3002"
});

async function init(datUrl) {
  let repo = await dat.get(
    datUrl
    //"dat://60c525b5589a5099aa3610a8ee550dcd454c3e118f7ac93b7d41b6b850272330/"
  );

  var readStream = repo.archive.readFile(
    "profile.json",
    "utf-8",
    (err, data) => {
      if (err) {
        console.error(err);
        return (app.innerText = `data not found`);
      }
      let myJson = data;
      console.log(repo.archive.writable);
      if (localStorage.getItem("myDat") === null) {
        localStorage.setItem("myDat", myJson);
        console.log("localstorage is empty");
      }
      if (localStorage.getItem("myDat") !== null) {
        let rawData = localStorage.getItem("myDat");
        let dataStorage = JSON.parse(rawData);
        console.log("data storage has data");
        username.value = dataStorage.username;
        name.value = dataStorage.name;

        twitter.value = dataStorage.twitter;
        github.value = dataStorage.github;
        app.innerText = rawData;
        setupSaveButton(repo);
      }
    }
  );
}

load.addEventListener("click", () => {
  let datUrl = url.value;
  console.log("Button clicked", datUrl);
  init(datUrl);
});
clearStorage.addEventListener("click", () => {
  localStorage.clear();
});

function setupSaveButton(repo) {
  btnSave.addEventListener("click", () => {
    let dataStorage = {};
    dataStorage.username = username.value;
    dataStorage.name = name.value;
    dataStorage.twitter = twitter.value;
    dataStorage.github = github.value;
    localStorage.setItem("myDat", JSON.stringify(dataStorage));

    repo.archive.writeFile("/hello2.txt", "lol1234", () => {
      console.log("Saving data to hello2.txt", repo.url);
      localStorage.setItem("mywrite", repo.url);
    });
  });
}
