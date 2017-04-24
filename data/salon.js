var Salon = function (nom_salon, moduleId, currentIndex, show_stats, show_bonnes_reponses, reponses, reponses_bis, listUsers, listQuestions, listBonnesReponses){
    this.nom_salon = nom_salon;
    this.moduleId = moduleId;
    this.currentIndex = currentIndex;
    this.show_stats = show_stats;
    this.show_bonnes_reponses = show_bonnes_reponses;
    this.reponses = reponses;
    this.reponses_bis = reponses_bis;
    this.listUsers = listUsers;
    this.listQuestions = listQuestions;
    this.listBonnesReponses = listBonnesReponses;
}

exports.Salon = Salon;