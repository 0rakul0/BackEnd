//instalar o puppeteer
const puppeteer = require('puppeteer')
//para ler pagina do instagram

async function iniciar(){
    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    
    //poem o link da pagina que quer contar os comentarios
    //usei de exemplo o intagram da maria fernanda
    await page.goto('https://www.instagram.com/p/CCt2BrMgSsC/')
    // a logica do robor de comentarios é que quando houver o botão de ler mais comentarios
    // ele apertar automaticamente para que o contador de arrobas possa importar e contar.
    // precisa pegar o nome da classe do css desse botão
    async function loadMore(page, selector) {
        const moreButton = await page.$(selector);
        if (moreButton) {
          console.log('apertou para ver mais');
          await moreButton.click();
    
          await page.waitFor(selector, { timeout: 3000 }).catch(() => {
            console.log("deu timeout!");
          });
    
          await loadMore(page, selector);
        }
      }

    async function getComments(page, selector) {
    // este eval pega todos os elementos do seletor e executa um outra funcao
    const comments = await page.$$eval(selector, links => links.map(link => link.innerText));
    return comments;
  }
    
  //class principal do butao mais
  await loadMore(page, '.dCJp8');
  // classe designada para pegar a quantidade
  const comments = await getComments(page, '.C4VMK span a');

  await browser.close();

  console.log("\n comentarios: \n", comments);

  console.log("\n ***ordenando.. \n");
  const sorted = sort(counter(comments));

  console.log("\n ordenado: \n", sorted);
}
// pegar os comentarios
// estratégia é pegar tudo que for link dentro do css a

//contar sem repetir
function counter(arrobas) {
    let count = {};
    arrobas.forEach(arroba => {
      count[arroba] = (count[arroba] || 0) + 1;
    });
    return count;
  }
  
  // ordenar arrobas
  function sort(counted) {
    const entries = Object.entries(counted);
    const sorted = entries.sort((a, b) => b[1] - a[1]);
    return sorted;
  }

iniciar()