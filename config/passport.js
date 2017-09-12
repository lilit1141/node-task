

// load all the things we need
var LocalStrategy   = require('passport-local').Strategy;

// load up the user model
var User  	= require('../app/models/user');

// expose this function to our app using module.exports
module.exports = function(passport) {

	
  
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });

 
    // LOCAL SIGNUP
   
   

    passport.use('local-signup', new LocalStrategy({
 
        usernameField : 'email',
        passwordField : 'password',
       
        passReqToCallback : true 
    },
    function(req, email, password, done) {

		
        User.findOne({ 'local.email' :  email }, function(err, user) {
           
            if (err)
                return done(err);

          
            if (user) {
                return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
            } else {

				
                var newUser  = new User();

             
                newUser.local.email    = email;
                newUser.local.password = newUser.generateHash(password); 
                newUser.local.name    = req.body.name;
                newUser.local.srname    = req.body.srname;
				// save the user
                newUser.save(function(err) {
                    if (err)
                        throw err;
                    return done(null, newUser);
                });
            }

        });

    }));

  
    // LOCAL LOGIN 
   
   

    passport.use('local-login', new LocalStrategy({
     
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true
    },
    function(req, email, password, done) { 

       
        User.findOne({ 'local.email' :  email }, function(err, user) {
     
            if (err)
                return done(err);

            if (!user)
                return done(null, false, req.flash('loginMessage', 'No user found.')); 

            if (!user.validPassword(password))
                return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.')); 

            return done(null, user);
        });

    }));

};
