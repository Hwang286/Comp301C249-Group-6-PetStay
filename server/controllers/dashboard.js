

//*Display About Page*/
 module.exports.displayDashBoardPage = (req, res, next) => {
    res.render('dashboard', { title: 'Dashboard', displayName: req.user ? req.user.displayName : '' });
}

