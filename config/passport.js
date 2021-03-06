const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

//LOAD USER MODEL
const user = require('../models/User');

module.exports = function(passport) {
    passport.use(
        new LocalStrategy({ usernameField : 'email'}, (email, password, done) => {
            //MATCH USER
            user.findOne({ email : email})
            .then(user => {
                if(!user){
                    return done(null, false, { message : 'This email is not registered'});
                }

                //MATCH PASSWORDS
                bcrypt.compare(password, user.password, (err, isMatch) => {
                   if(isMatch){
                       return done(null, user);
                   }
                   else {
                       return done(null, false, {message : 'Password incorrect'});
                   } 
                });

            })
            .catch(err => console.log(err));
        })
    );

    passport.serializeUser(function(user, done) {
        done(null, user.id);
      });
    
    passport.deserializeUser(function(id, done) {
        user.findById(id, function(err, user) {
          done(err, user);
        });
    });    
}