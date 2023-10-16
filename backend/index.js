const fs = require('fs'); //File system ;
const express = require('express');
const app = express();
app.use( express.json() );


// Allow cross origin requests (cors)
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});




app.get('/product', (req, res)=>{
  let body = [];


  try{
    const rawProduct = fs.readFileSync('./data/product.json');
    const products = JSON.parse(rawProduct);


    if(req.query.name != undefined){
      //loopa igenom alla objekt i movies
      // kolla om movie-objektet.name innehåller req.query.title
      const queryName = req.query.name.toLowerCase();
     
      products.forEach(product => {
        const productName = product.name.toLowerCase();
        if(productName.includes(queryName)){
          body.push(product);
        }


      });


    }
    else{
      body = products;
    }
   
  }
  catch(e){
    body = {error: 'something went wrong'};
  }


  res.send(body);
})




app.listen(3000, () => {
    console.log("Listening on port 3000 ...");
  });
