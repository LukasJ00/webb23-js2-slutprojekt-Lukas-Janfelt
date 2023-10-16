const fs = require('fs'); // File system
const express = require('express');
const app = express();
app.use(express.json());

// Allow cross-origin requests (CORS)
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/product', (req, res) => {
  let body = [];

  try {
    const rawProduct = fs.readFileSync('./data/product.json');
    const products = JSON.parse(rawProduct);

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

app.post('/purchase', (req, res) => {
  try {
    const rawProduct = fs.readFileSync('./data/product.json');
    const products = JSON.parse(rawProduct);
    const { productId } = req.body;
    const product = products.find((p) => p.id === productId);

    if (!product) {
      return res.status(404).json({ error: 'Produkten hittades inte' });
    }

    if (product.stock <= 0) {
      return res.status(400).json({ error: 'Produkten är slut i lager' });
    }

    product.stock -= 1;
    fs.writeFileSync('./data/product.json', JSON.stringify(products, null, 2));
    res.json({ message: 'Köpet genomfördes', product });
  } catch (e) {
    res.status(500).json({ error: 'Något gick fel' });
  }
});

app.listen(3000, () => {
  console.log("Listening on port 3000 ...");
});