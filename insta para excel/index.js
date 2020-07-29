// lib para ler pagina do instagram
const puppeter = require('puppeteer');

// lib para converter um array para csv 
const {
  convertArrayToCSV
} = require('convert-array-to-csv');
const convertCsvToXlsx = require('@aternus/csv-to-xlsx');

// lib para gerar arquivo csv
const path = require('path');
const fs = require('fs');
const write = require('write');


async function start() {

  async function loadMore(page, selector) {
    const moreButton = await page.$(selector);
    if (moreButton) {
      console.log('pesquisando mais');
      await moreButton.click();

      await page.waitFor(selector, {
        timeout: 3000
      }).catch(() => {
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

  const browser = await puppeter.launch();
  const page = await browser.newPage();
  
  // nome do link do instagram
  await page.goto('https://www.instagram.com/p/CCt2BrMgSsC/');

  // class="dCJp8 afkep"
  await loadMore(page, '.dCJp8');

  const comments = await getComments(page, '.C4VMK span a');

  await browser.close();

  console.log("\ncomentarios: \n", comments);

  const sorted = sort(counter(comments));

  console.log("\n\n ordenado: \n\n", sorted);

  convertToCSVfile(sorted, 'comments');

  convertToExcel('comments');

}

function convertToCSVfile(sorted, filename) {
  console.log("\n\n converte para csv.. \n\n");
  const header = ['arroba', 'contagem'];
  const csvFromArrayOfArrays = convertArrayToCSV(sorted, {
    header,
    separator: ';'
  });

  write.sync(filename + '.csv', csvFromArrayOfArrays, {
    newline: true
  });
}

// contar arrobas repetidas
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

function convertToExcel(filename) {
  let source = path.join(__dirname, filename + '.csv');
  let destination = path.join(__dirname, filename + '.xlsx');

  try {
    convertCsvToXlsx(source, destination);
  } catch (e) {
    console.error(e.toString());
  }
}

start();