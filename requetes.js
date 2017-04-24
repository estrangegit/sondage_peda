function getAllNiveaux() {
    return 'SELECT * FROM niveau';
}

function getModulesByNiveauId(niveauId) {
    return 'SELECT * FROM module WHERE id IN (SELECT moduleId FROM module_niveau WHERE niveauId = ' + niveauId + ')';
}

function getQuestionsByModuleId(moduleId) {
    return 'SELECT * FROM question WHERE moduleId = ' + moduleId;
}

function getReponseByQuestionId(questionId) {
    return 'SELECT * FROM reponse WHERE questionId = ' + questionId;

}

exports.getAllNiveaux = getAllNiveaux;
exports.getModulesByNiveauId = getModulesByNiveauId;
exports.getQuestionsByModuleId = getQuestionsByModuleId;
exports.getReponseByQuestionId = getReponseByQuestionId;