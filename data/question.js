var Question = function (id, moduleId, intitule_question, intitule_reponse1, intitule_reponse2, intitule_reponse3, multiple){
    this.id = id;
    this.moduleId = moduleId;
    this.intitule_question = intitule_question;
    this.intitule_reponse1 = intitule_reponse1;
    this.intitule_reponse2 = intitule_reponse2;
    this.intitule_reponse3 = intitule_reponse3;
    this.multiple = multiple;
}

exports.Question = Question;
