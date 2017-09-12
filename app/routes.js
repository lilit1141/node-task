// app/routes.js
var User = require('./models/user');
module.exports = function(app, passport) {

	
	// HOME PAGE (with login links) 
	
	app.get('/', function(req, res) {
		res.render('index.ejs');
	});

	
	// LOGIN 
	
	app.get('/login', function(req, res) {

		res.render('login.ejs', { message: req.flash('loginMessage') });
	});

	app.post('/login', passport.authenticate('local-login', {
		successRedirect : '/profile', 
		failureRedirect : '/login',
		failureFlash : true 
	}));


	// SIGNUP
	
	
	app.get('/signup', function(req, res) {

		res.render('signup.ejs', { message: req.flash('signupMessage') });
	});

	app.post('/signup', passport.authenticate('local-signup', {
		successRedirect : '/profile', 
		failureRedirect : '/signup', 
		failureFlash : true 
	}));

	
	// PROFILE SECTION

	app.get('/profile', isLoggedIn, function(req, res) {
		res.render('profile.ejs', {
			user : req.user
		});
	});

	//EDIT PROFILE

	
	app.get('/edit',isLoggedIn, function(req, res) {

		res.render('edit_profile.ejs', {
			user : req.user
		});
	
	});


	app.post('/edit', function(req, res) {
		console.log(req.user.id);
        if (req.user.id) {
            User.findByIdAndUpdate(req.user.id, { "local.name": req.body.name, "local.srname": req.body.srname,"local.email": req.body.email }, function(err, todo) {
                if (err) throw err;
                
                res.redirect('/profile');
               
            });
        }
        
        else {
           
         //Fail
         res.send('Fail');
            
        }
        
    });
	
	// LOGOUT
	
	app.get('/logout', function(req, res) {
		req.logout();
		res.redirect('/');
	});
};

//check
function isLoggedIn(req, res, next) {

	if (req.isAuthenticated())
		return next();

	res.redirect('/');
}
