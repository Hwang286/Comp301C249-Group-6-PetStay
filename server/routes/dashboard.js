let express = require('express');
let router = express.Router();
let DBController = require("../controllers/dashboard")

/* GET about page. */
router.get('/dashboard', DBController.displayDashBoardPage);

module.exports = router;