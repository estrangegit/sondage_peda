var ent = require('ent'),
    fs = require('fs'),
    mysql = require('mysql');

var userModule = require('./data/user.js');
var questionModule = require('./data/question.js');
var reponsesModule = require('./data/reponses.js');
var SalonModule = require('./data/salon.js');
var moduleModule = require('./data/module.js');
var niveauModule = require('./data/niveau.js');
var bonneReponsesModule = require('./data/bonneReponses.js');
var requetes = require('./requetes.js');

var listSalons = {};
var listNiveaux = {};

var connection = mysql.createConnection({
    host: '127.0.0.1',
    user: 'sondage',
    password: 'sondage',
    database: 'sondage'
});

var dir_eleve = "views/eleve/";
var page_question_eleve_simple = fs.readFileSync(dir_eleve + 'question_eleve_simple.html', 'utf8');
var page_question_eleve_multiple = fs.readFileSync(dir_eleve + 'question_eleve_multiple.html', 'utf8');
var page_connexion_eleve = fs.readFileSync(dir_eleve + 'connexion_eleve.html', 'utf8');
var page_patienter_eleve = fs.readFileSync(dir_eleve + 'patienter_eleve.html', 'utf8');

var dir_enseignant = "views/enseignant/";
var page_question_enseignant = fs.readFileSync(dir_enseignant + 'question_enseignant.html', 'utf8');
var page_lancement_enseignant = fs.readFileSync(dir_enseignant + 'lancement_enseignant.html', 'utf8');
var page_connexion_enseignant = fs.readFileSync(dir_enseignant + 'connexion_enseignant.html', 'utf8');


connection.connect(function (err) {
    if (err) {
        console.log("Connexion à la base impossible.");
    } else {
        console.log("Connexion à la base réussie.");
    }
});

connection.query(requetes.getAllNiveaux(), function (err, rows) {
    if (err) {
        console.log(err);
    } else {
        var niveau;
        for (var i = 0; i < rows.length; i++) {
            niveau = new niveauModule.Niveau(rows[i].id, rows[i].intitule_niveau);
            listNiveaux[niveau.id] = niveau.intitule_niveau;
        }
    }
});

function emit_choix_niveau(socket) {
    socket.emit('choix_niveau', listNiveaux);
}

function choix_niveau(socket, niveauId) {
    var listModules = {};
    var requete = requetes.getModulesByNiveauId(niveauId);

    connection.query(requete, function (err, rows) {
        if (err) {
            console.log(err);
        } else {
            var module;
            for (var i = 0; i < rows.length; i++) {
                module = new moduleModule.Module(rows[i].id, rows[i].intitule_module);
                listModules[module.id] = module.intitule_module;
            }
            socket.emit('choix_module', listModules);
        }
    });
}
function ouverture_salon(socket, data) {
    if (!salonExiste(data.nom_salon)) {
        var currentIndex = -1;
        var show_stats = false;
        var show_bonnes_reponses = false;
        var reponses = new reponsesModule.Reponses(0, 0, 0);
        var reponses_bis = new reponsesModule.Reponses(0, 0, 0);
        var listUsers = {};
        var listQuestions = [];
        var listBonneReponses = [];

        //création du salon et initialisation des variables qui le composant
        var salon = new SalonModule.Salon(data.nom_salon,
                                            data.choix_module,
                                                currentIndex,
                                                    show_stats,
                                                        show_bonnes_reponses,
                                                            reponses,
                                                                reponses_bis,
                                                                    listUsers,
                                                                        listQuestions,
                                                                            listBonneReponses);

        var requeteQBM = requetes.getQuestionsByModuleId(data.choix_module);
        connection.query(requeteQBM, function (err, rows) {
            if (err) {
                console.log(err);
            } else {
                var question;
                for (var QBM_rowIndex = 0; QBM_rowIndex < rows.length; QBM_rowIndex++) {
                    question = new questionModule.Question(rows[QBM_rowIndex].id,
                        rows[QBM_rowIndex].moduleId,
                        rows[QBM_rowIndex].intitule_question,
                        rows[QBM_rowIndex].intitule_reponse1,
                        rows[QBM_rowIndex].intitule_reponse2,
                        rows[QBM_rowIndex].intitule_reponse3,
                        rows[QBM_rowIndex].multiple);
                    salon.listQuestions.push(question);
                }

                for (var questionIndex = 0; questionIndex < salon.listQuestions.length; questionIndex++) {
                    var requeteRBQ = requetes.getReponseByQuestionId(salon.listQuestions[questionIndex].id);
                    connection.query(requeteRBQ, function (err, rows) {
                        if (err) {
                            console.log(err);
                        } else {
                            var reponses;
                            for (var RBQ_rowIndex = 0; RBQ_rowIndex < rows.length; RBQ_rowIndex++) {
                                reponses = new bonneReponsesModule.BonneReponses(
                                    rows[RBQ_rowIndex].bonneReponse1,
                                    rows[RBQ_rowIndex].bonneReponse2,
                                    rows[RBQ_rowIndex].bonneReponse3
                                );
                                salon.listBonnesReponses.push(reponses);
                            }
                        }
                    });
                }

                listSalons[data.nom_salon] = salon;

                //Transmission de la vue suivante: page d'attente pour la connexion des élèves
                socket.emit('salon_ouvert', {page: page_lancement_enseignant});
            }
        });
    } else {
        socket.emit('salon_existant');
    }
}

function fermer_salon(socket, nom_salon) {
    var listUsers = listSalons[nom_salon].listUsers;

    for (var id in listUsers) {
        socket.broadcast.emit('eject_user', {
            pseudo: listUsers[id].pseudo,
            page: page_connexion_eleve,
            nom_salon: nom_salon
        });
    }

    socket.broadcast.emit('fermer_salon', {nom_salon: nom_salon, page: page_connexion_enseignant});
    socket.emit('fermer_salon', {nom_salon: nom_salon, page: page_connexion_enseignant});
    socket.emit('choix_niveau', listNiveaux);

    delete listSalons[nom_salon];
}

function new_user(socket, data) {
    //vérification de l'existence du salon
    if (salonExiste(data.nom_salon)) {
        var user = new userModule.User();
        //pseudo = ent.encode(pseudo);

        if (!userExist(data.nom_salon, data.pseudo)) {
            user.pseudo = data.pseudo;
            //création d'un nouvel utilisateur pour le salon
            listSalons[data.nom_salon].listUsers[socket.id] = user;

            socket.broadcast.emit('list_users', listSalons[data.nom_salon]);
            socket.emit('page_patienter', page_patienter_eleve);
        } else {
            socket.emit('choose_new_pseudo');
        }
    } else {
        socket.emit('salon_inexistant');
    }
}

function eject_user(socket, data) {
    var id_to_eject;

    var listUsers = listSalons[data.nom_salon].listUsers;

    for (var id in listUsers) {
        if (listUsers[id].pseudo == data.pseudo) {
            id_to_eject = id;
        }
    }

    delete listSalons[data.nom_salon].listUsers[id_to_eject];

    socket.emit('list_users', listSalons[data.nom_salon]);
    socket.broadcast.emit('eject_user', {pseudo: data.pseudo, page: page_connexion_eleve, nom_salon: data.nom_salon});
}

function newQuestion_data(socket, data) {
    var new_question = {
        moduleId: data.choix_module,
        intitule_question: data.question,
        intitule_reponse1: data.reponse1,
        intitule_reponse2: data.reponse2,
        intitule_reponse3: data.reponse3,
        multiple: data.multiple
    };

    connection.query('INSERT INTO question SET ?', new_question, function (err) {
        if (err) {
            throw err;
        } else {
            var message = 'Nouvelle question ajoutée';
            socket.emit('messSuccess', message);
        }
    });
}

function new_rep(socket, data) {

    var currentIndex = listSalons[data.nom_salon].currentIndex;
    var listQuestions = listSalons[data.nom_salon].listQuestions;
    var listBonnesReponses = listSalons[data.nom_salon].listBonnesReponses;

    for (var i = 0; i < data.rep.length; i++) {

        if (data.rep[i] == 'reponse_1') {
            if (data.premiereFois)
                listSalons[data.nom_salon].reponses.reponse_1++;
            else
                listSalons[data.nom_salon].reponses_bis.reponse_1++;
        } else if (data.rep[i] == 'reponse_2') {
            if (data.premiereFois)
                listSalons[data.nom_salon].reponses.reponse_2++;
            else
                listSalons[data.nom_salon].reponses_bis.reponse_2++;
        } else if (data.rep[i] == 'reponse_3') {
            if (data.premiereFois)
                listSalons[data.nom_salon].reponses.reponse_3++;
            else
                listSalons[data.nom_salon].reponses_bis.reponse_3++;
        }
    }

    socket.broadcast.emit('new_rep', {
        question: listQuestions[currentIndex],
        reponses: listSalons[data.nom_salon].reponses,
        reponses_bis: listSalons[data.nom_salon].reponses_bis,
        premiereFois: data.premiereFois,
        nom_salon: data.nom_salon
    });

    var data_projecteur = {
        question: listQuestions[currentIndex],
        reponses: listSalons[data.nom_salon].reponses,
        reponses_bis: listSalons[data.nom_salon].reponses_bis,
        premiereFois: data.premiereFois,
        show_stats: listSalons[data.nom_salon].show_stats,
        show_bonnes_reponses: listSalons[data.nom_salon].show_bonnes_reponses,
        nom_salon: data.nom_salon,
        bonnes_reponses: listBonnesReponses[currentIndex]
    };

    socket.broadcast.emit('maj_stats', data_projecteur);
}

function poser_question(socket, data) {

    if (data.init) {
        listSalons[data.nom_salon].currentIndex = -1
    }

    if (data.nouvelle_question) {
        listSalons[data.nom_salon].currentIndex++;
    }

    var lastQuestion = false;
    var premiereFois = data.nouvelle_question;

    var currentIndex = listSalons[data.nom_salon].currentIndex;
    var listQuestions = listSalons[data.nom_salon].listQuestions;
    var listBonnesReponses = listSalons[data.nom_salon].listBonnesReponses;

    if (currentIndex == listQuestions.length - 1) {
        lastQuestion = true;
    }

    if (data.nouvelle_question) {
        listSalons[data.nom_salon].reponses.reponse_1 = 0;
        listSalons[data.nom_salon].reponses.reponse_2 = 0;
        listSalons[data.nom_salon].reponses.reponse_3 = 0;

        listSalons[data.nom_salon].reponses_bis.reponse_1 = 0;
        listSalons[data.nom_salon].reponses_bis.reponse_2 = 0;
        listSalons[data.nom_salon].reponses_bis.reponse_3 = 0;
    }

    var data_eleve = {
        question: listQuestions[currentIndex],
        last: lastQuestion,
        premiereFois: premiereFois,
        nom_salon: data.nom_salon
    }

    if (listQuestions[currentIndex].multiple) {
        data_eleve.page = page_question_eleve_multiple;
    } else {
        data_eleve.page = page_question_eleve_simple;
    }

    var data_enseignant = {
        page: page_question_enseignant,
        question: listQuestions[currentIndex],
        last: lastQuestion,
        reponses: listSalons[data.nom_salon].reponses,
        reponses_bis: listSalons[data.nom_salon].reponses_bis,
        premiereFois: premiereFois,
        nom_salon: data.nom_salon,
        init: data.init
    };

    socket.broadcast.emit('start_question', data_eleve);
    socket.emit('start_question', data_enseignant);

    var data_stats = {
        question: listQuestions[currentIndex],
        reponses: listSalons[data.nom_salon].reponses,
        reponses_bis: listSalons[data.nom_salon].reponses_bis,
        premiereFois: premiereFois,
        show_stats: listSalons[data.nom_salon].show_stats,
        show_bonnes_reponses: listSalons[data.nom_salon].show_bonnes_reponses,
        nom_salon: data.nom_salon,
        bonnes_reponses: listBonnesReponses[currentIndex]
    };
    socket.broadcast.emit('maj_stats', data_stats);
}

function new_projecteur(socket, nom_salon) {
    //vérification de l'existence du salon
    if (salonExiste(nom_salon)) {
        socket.emit('entree_salon');
        socket.emit('list_users', listSalons[nom_salon]);
    } else {
        socket.emit('salon_inexistant');
    }
}

function maj_stats(socket, data) {

    if(data.show_stats)
        listSalons[data.nom_salon].show_stats = true;
    if(data.hide_stats)
        listSalons[data.nom_salon].show_stats = false;
    if(data.show_bonnes_reponses)
        listSalons[data.nom_salon].show_bonnes_reponses = true;
    if(data.hide_bonnes_reponses)
        listSalons[data.nom_salon].show_bonnes_reponses = false;

    var listQuestions = listSalons[data.nom_salon].listQuestions;
    var listBonnesReponses = listSalons[data.nom_salon].listBonnesReponses;
    var currentIndex = listSalons[data.nom_salon].currentIndex;

    var majData = {
        question: listQuestions[currentIndex],
        reponses: listSalons[data.nom_salon].reponses,
        reponses_bis: listSalons[data.nom_salon].reponses_bis,
        premiereFois: data.premiereFois,
        show_stats: listSalons[data.nom_salon].show_stats,
        show_bonnes_reponses: listSalons[data.nom_salon].show_bonnes_reponses,
        nom_salon: data.nom_salon,
        bonnes_reponses: listBonnesReponses[currentIndex]
    };
    socket.broadcast.emit('maj_stats', majData);
}


function end_session(socket, nom_salon) {
    if (typeof listSalons[nom_salon] != 'undefined') {
        delete listSalons[nom_salon].listUsers[socket.id];
        socket.broadcast.emit('list_users', listSalons[nom_salon]);
    }
}

function salonExiste(nom_salon) {
    for (var id in listSalons) {
        if (id == nom_salon) {
            return true;
        }
    }
    return false;
}

function userExist(nom_salon, pseudo) {
    var listUsers = listSalons[nom_salon].listUsers;
    for (var id in listUsers) {
        if (listUsers[id].pseudo == pseudo) {
            return true;
        }
    }
    return false;
}

exports.end_session = end_session;
exports.new_projecteur = new_projecteur;
exports.poser_question = poser_question;
exports.new_rep = new_rep;
exports.eject_user = eject_user;
exports.new_user = new_user;
exports.ouverture_salon = ouverture_salon;
exports.newQuestion_data = newQuestion_data;
exports.choix_niveau = choix_niveau;
exports.emit_choix_niveau = emit_choix_niveau;
exports.fermer_salon = fermer_salon;
exports.maj_stats = maj_stats;