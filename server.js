const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = 8080;
const filepath = path.join(__dirname, "/public");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

app.get("/notes", function (__request, response) {
    response.sendFile(path.join(filepath, "notes.html"));

});

app.get("/api/notes", function (__request, response) {
    response.sendFile(path.join(__dirname, "/db/db.json"));
});

app.get("/api/notes/:id", function (__request, response) {
    let noteSave = JSON.parse(fs.readFileSync("./db/db.json", "utf-8"));
    response.json(noteSave);
});

app.get("*", function (__request, response) {
    response.sendFile(path.join(filepath, "index.html"));
});


app.post("/api/notes", function (request, response) {
    let noteSave = JSON.parse(fs.readFileSync("./db/db.json", "utf-8"));
    let newNote = request.body;
    let ID = (noteSave.length).toString();
    newNote.id = ID;
    noteSave.push(newNote);

    fs.writeFileSync("./db/db.json", JSON.stringify(noteSave));
    console.log("note saved on JSON content", newNote);
    response.json(noteSave);
});

app.delete("/api/notes/:id", function (request, response) {
    var noteSave = JSON.parse(fs.readFileSync("./db/db.json", "utf-8"));
    var noteID = request.params.id;
    var newID = 0;
    console.log(`deleting a note ${noteID}`);
    noteSave = noteSave.filter(currentNote => {
        return currentNote.id != noteID;
    })
    
    for (currentNote of noteSave) {
        currentNote.id = newID.toString();
        newID++;
    }

    fs.writeFileSync("./db/db.json", JSON.stringify(noteSave));
    response.json(noteSave);
});

app.listen(PORT, function () { 
    console.log(`Enjoy note taker service on server port ${PORT}`);
})

