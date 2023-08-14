let express = require('express');
let router = express.Router();


/* GET about page. */
router.get('/about', (req, res, next) => {
        res.render('views/search',);
     })
module.exports = router;
