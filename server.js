const express = require("express");
const app = express();

const { quotes } = require("./data");
const { getRandomElement } = require("./utils");

const PORT = process.env.PORT || 4001;

app.use(express.static("public"));

app.get("/api/quotes/random", (req, res, next) => {
  const quote = getRandomElement(quotes);

  if (quote) {
    res.status(200).send({ quote: quote });
  } else {
    res.status(404).send();
  }
});

app.get("/api/quotes", (req, res, next) => {
  const queryParams = req.query;

  console.log(req.query);

  if (quotes && Object.entries(queryParams).length === 0) {
    // const onlyQuotes = quotes.map((quote) => quote.quote);
    res.status(200).send({ quotes });
  }

  if (quotes && req.query.person) {
    const quoteFilter = quotes.filter(
      (quote) => quote.person.toLowerCase() === req.query.person.toLowerCase()
    );
    // const personQuotes = quoteFilter.map((quote) => quote.quote);

    res.status(200).send({ quotes: quoteFilter });
  }

  if (
    !quotes ||
    (Object.entries(queryParams).length > 0 &&
      queryParams.hasOwnProperty("person") === false)
  ) {
    res.status(400).send();
  }
});

app.post("/api/quotes", (req, res, next) => {
  const quote = req.query;
  const valid = quote.hasOwnProperty("quote") && quote.hasOwnProperty("person");

  if (valid) {
    quotes.push(quote);
    const index = quotes.indexOf(quote);
    res.status(200).send({ quote: quotes[index] });
  } else {
    res.status(400).send("Invalid request");
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
