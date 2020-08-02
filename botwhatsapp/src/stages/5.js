const banco = require("../banco");
let estagioInterno = 0;

function execute(user, msg) {

  if (estagioInterno === 1) {
    banco.db[user].stage = 4;

    return stages.step[4].obj.execute(user, "");
  }
  if (msg === "*") {
    banco.db[user].stage = 6;
    return ["Pedido cancelado com sucesso"];
  }
  if (msg === "1") {
    estagioInterno++;
    return ["Digite o valor em dinheiro para levarmos o troco: ",
            console.log("troco para: ",` Total R$ ${banco.total}`)];
  }
  if(msg === "2"){
    estagioInterno++;
    return ["Já já, estaremos ai :)\n","Digite # para continuar", 
      console.log(msg)]
  }
  return ["Escolha a forma de pagamento:\n1️⃣-Dinheiro\n2️⃣-Cartão"];
}

exports.execute = execute;
