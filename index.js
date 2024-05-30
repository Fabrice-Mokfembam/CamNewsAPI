import express from "express";
import axios from "axios";
import * as cheerio from "cheerio";
import { configDotenv } from "dotenv";

const app = express();
app.use(express.json());
configDotenv();

// const guardianPost = async (url) => {
//   try {
//     const { data } = await axios.get(url);
//     const $ = cheerio.load(data);

//     const scrapedData = [];

//     $("a.title").each((i, element) => {
//       const title = $(element).text().trim();
//       const href = $(element).attr("href");

//       scrapedData.push({ title, href });
//     });

//     console.log("Scraped data from Guardian Post:", scrapedData);
//     return scrapedData;
//   } catch (error) {
//     console.error("Error scraping Guardian Post:", error);
//     return [];
//   }
// };

const camNews = async (urls) => {
  try {
    const bothArray = urls.map(async (element) => {
      const { data } = await axios.get(element);
      const $ = cheerio.load(data);

      const scrapedData = [];

      $("h3 a").each((i, element) => {
        const title = $(element).text().trim();
        const href = $(element).attr("href");

        scrapedData.push({ title, href });
      });

      console.log( `Scraped data from ${element} News:`, scrapedData);
      return scrapedData;
    });
    

    return Promise.all(bothArray);
  } catch (error) {
    console.error("Error scraping Cam News:", error);
    return [];
  }
};

app.get("/", async (req, res) => {
  const url = "https://theguardianpostcameroon.com/";
  const urls = [
    "https://www.camfoot.com/category/actualites/",
    "https://thesunnewspaper.cm/",
  ];

  try {
    // const dataPost = await guardianPost(url);
    const dataCamNews = await camNews(urls);

    const allDataFromCamNews = [];
     dataCamNews.forEach(item => {
       item.forEach(element => {
         allDataFromCamNews.push(element);
      })
     })

    const combinedData = [ ...allDataFromCamNews];

    res.json(combinedData);
  } catch (error) {
    res.status(500).send("Error scraping webpage");
  }
});

app.listen(process.env.PORT || 8000, () => {
  console.log(`App listening on port 8000}`);
});
