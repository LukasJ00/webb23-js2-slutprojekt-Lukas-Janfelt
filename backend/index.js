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
    const { productIds } = req.body;

    productIds.forEach((productId) => {
      const product = products.find((p) => p.id === productId);

      if (product && product.stock > 0) {
        product.stock -= 1;
      }
    });

    fs.writeFileSync('./data/product.json', JSON.stringify(products, null, 2));

    res.json({ message: 'Köpet genomfördes', productIds });
  } catch (error) {
    res.status(500).json({ error: 'Något gick fel' });
  }
});

app.listen(3000, () => {
  console.log("Listening on port 3000 ...");
});