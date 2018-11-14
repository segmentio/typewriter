const express = require('express');
const router = express.Router();
const uuidv4 = require('uuid/v4');

const analytics = require('../analytics')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* POST submit a product order. */
router.post('/submitOrder', function(req, res, next) {
  analytics.orderCompleted({
    userId: req.body.user.id,
    properties: {
      order_id: uuidv4(),
      currency: 'USD',
      products: [
        {
          brand: 'Kicks App',
          name: req.body.name,
          price: 9.99
        }
      ],
      total: 9.99
    }
  })

  res.sendStatus(200)
})

module.exports = router
