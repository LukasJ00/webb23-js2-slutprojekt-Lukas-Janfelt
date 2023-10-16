const fs = require('fs');
const express = require('express');
const cors = require('cors'); 

const app = express();
app.use(express.json());
app.use(cors());

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// Läs in produktlistan vid start
let products = [];

try {
  const rawProduct = fs.readFileSync('./data/product.json');
  products = JSON.parse(rawProduct);
} catch (e) {
  console.error('Fel vid inläsning av produktlistan', e);
}

app.get('/product', (req, res) => {
  let body = [];

  try {
    if (req.query.name != undefined) {
      const queryName = req.query.name.toLowerCase();

      products.forEach(product => {
        const productName = product.name.toLowerCase();
        if (productName.includes(queryName)) {
          body.push(product);
        }
      });
    } else {
      body = products;
    }
  } catch (e) {
    body = { error: 'Something went wrong' };
  }

  res.send(body);
});

app.post('/checkout', (req, res) => {
  try {
    const { productId } = req.body;

    // Hämta produkten från din produktlista
    const product = products.find((p) => p.id === productId);

    if (!product) {
      return res.status(404).json({ error: 'Produkten hittades inte' });
    }

    if (product.stock <= 0) {
      return res.status(400).json({ error: 'Produkten är slut i lager' });
    }

    // Uppdatera lagersaldot
    product.stock -= 1;

    // Spara ändringarna till produktlistan (till exempel i en JSON-fil)
    fs.writeFileSync('./data/product.json', JSON.stringify(products, null, 2));

    // Skicka ett svar till klienten
    res.json({ message: 'Köpet genomfördes', product });
  } catch (error) {
    res.status(500).json({ error: 'Något gick fel' });
  }
});

app.listen(3000, () => {
  console.log("Listening on port 3000 ...");
});