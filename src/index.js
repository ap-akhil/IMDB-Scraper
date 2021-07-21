const fs = require("fs");
const rp = require("request-promise");
const _fluture = require("fluture");
const cheerio = require("cheerio");
const url = "https://www.imdb.com/?ref_=nv_home";

//encasing a promise returining function to fluture
const flutureRequestPromise = _fluture.encaseP(rp);

//Extract data from raw html through Cheerio
const getValuesFromCheerio = (html) => {
  let $ = cheerio.load(html);
  let imdb = [];
  let collection = "";
  let movieTitle = "";
  $(
    'a[class="TopBoxOfficeTitle__BoxOfficeTitlePageLink-dujkoe-0 dDNrEz boxOfficeTitleLink"]'
  ).each(function (index, element) {
    movieTitle = element.children[0].children[0].data;
    collection = element.children[1].children[0].data;
    imdb.push({ movieTitle, collection });
  });
  const imdbTopMovies = JSON.stringify(imdb);
  writeFileContent(imdbTopMovies);
};

//Write content to the file
const writeFileContent = (content) => {
  fs.writeFile("./output/output.json", content, (err) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log("Output JSON generated");
  });
};

//Forking of fluture
flutureRequestPromise(url).pipe(
  _fluture.fork((rej) => console.log("reject", rej))((html) =>
    getValuesFromCheerio(html)
  )
);
