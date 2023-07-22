import passportLocal from 'passport-local';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import Usuario from '../models/Usuario.js'
import passport from 'passport';

const localStrategy = passportLocal.Strategy;

function auth(passport) {
    passport.use(new localStrategy({usernameField: 'email', passwordField: 'senha'}, (email, senha, done) => {
        Usuario.findOne({email: email}).then((usuario) => {
            if(!usuario) {
                return done(null, false, {message: 'Esta conta não existe'})
            }

            bcrypt.compare(senha, usuario.senha, (erro, sucesso) => {
                if(sucesso) {
                    return done(null, usuario);
                } else {
                    return done(null, false, {message: 'Senha incorreta'})
                }
            })
        })
    }))

    passport.serializeUser((usuario, done) => {
        done(null, usuario.id);
    })

    passport.deserializeUser((id, done) => {
        Usuario.findById(id).then((usuario) => {
            done(null, usuario)
        }).catch((err) => {
            done(err)
        })
    })

}

export default auth(passport);