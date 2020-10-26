const express = require("express");
const fs = require("fs");
const path = require("path");
const app = express();
const PORT = 8083;

app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(express.json());

var notes = [];


app.get("/", function(req, res){
    res.header("Content-Type", "text/html");
    res.sendFile(path.join(__dirname, "/public/index.html"));
});

app.get("/notes", function(req, res){
    res.header("Content-Type", "text/html");
    res.sendFile(path.join(__dirname, "/public/notes.html"));
});

app.get("/api/notes", function(req, res){
    fs.readFile("db/db.json", "utf8", function(err){
        console.log('im here');
        if (err) throw err;
        res.json(notes);
    });
});

app.post("/api/notes", function(req, res){
    
    let note = {"id": notes.length + 1, "title": req.body.title, "text": req.body.text};
    console.log(note);
    if(notes[0] == null) {
       notes[0] = note;
    }else {
        notes.push(note);
    }
    console.log('notes after push', notes);

    fs.writeFile("db/db.json", JSON.stringify(notes), function (err)  { 
        
        if(err) {
          console.log(err)
          res.status(500,"error");
        }else{
          res.json(notes);
        }
    
    });

    console.log("wrote the notes to the db file");

});

app.delete("/api/notes/:id", function(req, res){
    
    for( let i =0; i < notes.length; i++){
        
        if(parseInt(notes[i].id) === parseInt(req.params.id)){
            notes.splice(i, 1);
            console.log(notes);

            fs.writeFile("db/db.json", JSON.stringify(notes), function (err)  { 
                if(err) {
                  console.log(err)
                  res.status(500,"error");
                }else{
                  res.json(notes);
                }
            });  
        }

    }
})



app.listen(PORT,() => console.log("Listening on port " + PORT));