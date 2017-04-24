var express = require('express'),
    app = express(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server),
    functions = require('./fonction.js');

//Routing de l'application
app.get('/', function (req, res) {
    res.sendFile(__dirname + '/views/eleve/eleve.html');
});

app.get('/enseignant', function(req, res){
    res.sendFile(__dirname + '/views/enseignant/enseignant.html');
});

app.get('/projecteur', function(req, res){
    res.sendFile(__dirname + '/views/projecteur/projecteur.html');
});

app.get('/ajoutQuestion', function(req, res){
    res.sendFile(__dirname + '/views/enseignant/ajout_question.html');
});

//gestion des événements
io.sockets.on('connection', function (socket) {

    functions.emit_choix_niveau(socket);

    socket.on('choix_niveau', function(niveauId){
        functions.choix_niveau(socket,niveauId);
    });

    socket.on('ouverture_salon', function(data){
        functions.ouverture_salon(socket, data);
    });

    //Gestion de la fermeture du salon
    socket.on('fermer_salon', function(nom_salon){
        functions.fermer_salon(socket, nom_salon);
    });

    //Gestion des utilisateurs
    socket.on('new_user', function(data) {
        functions.new_user(socket, data);
    });

    socket.on('eject_user', function(data){
        functions.eject_user(socket, data);
    });

    //Création nouvelle question
    socket.on('newQuestion_data', function(data){
        functions.newQuestion_data(socket, data);
    });

    //Gestion des réponses et des questions
    socket.on('new_rep', function(data){
        functions.new_rep(socket, data);
    });

    socket.on('poser_question', function(data){
        functions.poser_question(socket, data);
    });

    //Gestion du projecteur
    socket.on('new_projecteur', function(nom_salon){
        functions.new_projecteur(socket, nom_salon);
    });

    socket.on('maj_stats', function(data){
        functions.maj_stats(socket, data);
    });

    socket.on('end_session', function(nom_salon){
        functions.end_session(socket, nom_salon);
    });
});

app.use("/images", express.static(__dirname + '/images'));
app.use("/css", express.static(__dirname + '/css'));
app.use("/js", express.static(__dirname + '/js'));

server.listen(8080);