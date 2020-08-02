const banco = require("../banco");

function execute(user, msg) {
  banco.db[user].stage = 6;
  return [
    "obrigado pela preferência",
    "Aguarde, seu pedido chegará em breve",
    "Mais informações ligue para 21 98297 4428",
  ];
}

exports.execute = execute;
