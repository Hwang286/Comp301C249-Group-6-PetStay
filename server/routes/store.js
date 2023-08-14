let express = require('express');
let router = express.Router();
let mongoose = require("mongoose");
//Create a reference to the Store model
let Store = require('../models/store');
// helper function for guard purposes
function requireAuth(req, res, next)
{
    // check if the user is logged in
    if(!req.isAuthenticated())
    {
        return res.redirect('/login');
    }
    next();
}
let storeController = require('../controllers/store');
/* GET Route for the Store List page - READ Operation */
router.get('/', storeController.displayListStore);

/* GET Route for the Store Detail Page */
router.get('/detail/:id',storeController.displayStoreDetail);
/* POST Route for the Store Detail Page */
router.post('/detail/:id',requireAuth,storeController.processStoreDetail);
/* GET Route for the specific Owner's Store Page*/
router.get('/owner-store/:id',storeController.displayOwnerStore);
/* GET Route for displaying the Add store - CREATE Operation */
router.get('/add', requireAuth, storeController.displayAddStore);

/* POST Route for processing the Add store - CREATE Operation */
router.post('/add', requireAuth, storeController.processAddStore);

/* GET Route for displaying the Edit store - UPDATE Operation */
router.get('/edit/:id', requireAuth, storeController.displayEditStore);

/* POST Route for processing the Edit store - UPDATE Operation */
router.post('/edit/:id', requireAuth, storeController.processEditStore);

/* GET to perform  Deletion - DELETE Operation */
router.get('/delete/:id', requireAuth, storeController.performDelete);

module.exports = router;