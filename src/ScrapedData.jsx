// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from "react";
import axios from "axios";


const ScrapedData = () => {
  const [scrapedData, setScrapedData] = useState([]);

  
  const googleApiKey = import.meta.env.VITE_GOOGLE_API_KEY;
  
  const cx = import.meta.env.VITE_CUSTOM_SEARCH_ENGINE_ID;
  const googleApiUrl = `https://www.googleapis.com/customsearch/v1?key=${googleApiKey}&cx=${cx}`;

  
  const scrappingBeeApiKey = import.meta.env.VITE_SCRAPING_BEE_API_KEY;
  const scrappingBeeApiUrl = "https://api.scrappingbee.com";

  useEffect(() => {
    fetchTop5UrlsFromGoogleSearch();
  }, []);

  // Fetch top 5 URLs from Google Custom Search API
  const fetchTop5UrlsFromGoogleSearch = () => {
    axios
      .get(googleApiUrl)
      .then((response) => {
        const searchResults = response.data.items;
        const top5Urls = searchResults.slice(0, 5).map((result) => result.link);
        scrapeDataFromUrls(top5Urls);
      })
      .catch((error) => {
        console.error("Error fetching data from Google Search:", error);
      });
  };

  // Scrape data from the URLs using ScrapingBee API
  const scrapeDataFromUrls = (urls) => {
    axios
      .post(`${scrappingBeeApiUrl}/scrape`, {
        api_key: scrappingBeeApiKey,
        url: urls,
        render_js: false,
      })
      .then((response) => {
        const scrapedData = response.data;
        setScrapedData(scrapedData);
      })
      .catch((error) => {
        console.error("Error scraping data from URLs:", error);
      });
  };

  return (
        <div>
          <h1>Scraped Data</h1>
          <div>
            {scrapedData.length > 0 ? (
              scrapedData.map((item) => (
                <div key={item.title}>
                  <h2>{item.title}</h2>
                  <p>{item.body}</p>
                </div>
              ))
            ) : (
              <p>Loading...</p>
            )}
          </div>
        </div>
      );
      
};

export default ScrapedData;
