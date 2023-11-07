const axios = require('axios');
const cheerio = require('cheerio');
const express = require('express');
const fs = require('fs');

const PORT = 8000;

const app = express();

const url =
  "https://www.panmacmillan.com/blogs/general/must-read-books-of-all-time";

axios(url)
    .then(response => {
        const html = response.data
        const $ = cheerio.load(html)
        const books = [];
        $(
          "#primary-content figure[data-component='book-spotlight']",
          html
        ).each(function () {
          const id = $(this).find("div a").attr("data-isbn");
          const title = $(this).find("figcaption h3 a").text(); 
          const author = $(this).find("figcaption h4 a span").text(); 
          const about = $(this).find("div.rte--default div p").text(); 
          const imgUrl = $(this).find("div a img").attr("src"); 

          books.push({
            id,
            title,
            author,
            about,
            imgUrl
          });
        });

        console.log(books);

        fs.writeFile('books.json', JSON.stringify(books), (err) => {
            if(err) throw err;
            console.log('book.js is now saved!')
        })
    }).catch(err => console.log(err));


app.listen(PORT, ()=> console.log(`server running on PORT ${PORT}`));