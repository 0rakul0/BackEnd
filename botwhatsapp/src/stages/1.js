const cardapio = require("../cardapio");
const banco = require("../banco");

function execute(user, msg) {
  if (msg === "*") {
    banco.db[user].stage = 6;
    return ["Pedido cancelado com sucesso"];
  }

  if (msg === "#") {
      banco.db[user].stage = 2;
      return ["Estamos fechando seu pedido, ok?"];
  }

  if (!cardapio.menu[msg]) {
    return [
      "Código inválido, digite corretamente",
      "```Digite * para finalizar ou cancelar```",
    ];
  }

  banco.db[user].itens.push(cardapio.menu[msg]);

  return [
    `Item(${cardapio.menu[msg].descricao}) adiconado com sucesso, caso deseje add outros pedidos só basta idicar o seu código`,
    "``Digite # para continuar ou * para cancelar``",
  ];
}

exports.execute = execute;
