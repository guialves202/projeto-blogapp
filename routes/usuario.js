import { Router } from "express";
import Usuario from "../models/Usuario.js";
import bcrypt from 'bcrypt';
import passport from "passport";
const router = Router();

router.get('/registro', (req, res) => {
    res.render('usuarios/registro')
})

router.post('/registro', (req, res) => {
    var erros = [];

    if(!req.body.nome && req.body.nome == undefined || req.body.nome == null || req.body.nome.length < 2) {
        erros.push({text: 'Nome inválido'});
    }

    if(!req.body.email && req.body.email == undefined || req.body.email == null || req.body.email.length < 5) {
        erros.push({text: 'E-mail inválido'});
    }

    if(!req.body.senha && req.body.senha == undefined || req.body.senha == null) {
        erros.push({text: 'Senha inválida'});
    }

    const senha = req.body.senha;

    const letrasMaiusculas = /[A-Z]/;

    const letrasMinusculas = /[a-z]/;

    const numeros = /[0-9]/;

    const caracteresEspeciais = /[!|@|#|$|%|^|&|*|(|)|-|_]/;

    let temMaiuscula, temMinuscula, temNum, temEspecial = false;

    if(senha.length < 6) {
        erros.push({text: 'A senha precisa ter no mínimo 6 dígitos'});
    };

    for(let i = 0; i < senha.length; i++) {
        if(letrasMaiusculas.test(senha[i])) {
            temMaiuscula = true;
        } else if(letrasMinusculas.test(senha[i])) {
            temMinuscula = true;
        } else if(numeros.test(senha[i])) {
            temNum = true;
        } else if(caracteresEspeciais.test(senha[i])) {
            temEspecial = true;
        } else {
            erros.push({text: 'A senha possui um caractere inválido'})
        }
    }

    if(!temMaiuscula) {
        erros.push({text:'A senha precisa ter ao menos 1 letra maiúscula'})
    }
    if(!temMinuscula) {
        erros.push({text:'A senha precisa ter ao menos 1 letra minúscula'})
    }
    if(!temNum) {
        erros.push({text:'A senha precisa ter ao menos 1 número'})
    }
    if(!temEspecial) {
        erros.push({text:'A senha precisa ter ao menos 1 caractere especial'})
    }
    

    if(req.body.senha != req.body.senha2) {
        erros.push({text: 'As senhas são diferentes'});
    }

    if(erros.length > 0) {
        res.render('usuarios/registro', {erros});
    } else {
        Usuario.findOne({email:req.body.email}).then((usuario) => {
            if(usuario) {
                req.flash('error_msg', 'Já existe uma conta com esse e-mail');
                res.redirect('/usuarios/registro')
            } else {
                const salt = bcrypt.genSaltSync(10);
                const hashedPassword = bcrypt.hashSync(req.body.senha, salt);

                new Usuario({
                    nome: req.body.nome,
                    email: req.body.email,
                    senha: hashedPassword
                }).save().then(() => {
                    req.flash('success_msg', 'Usuário salvo com sucesso');
                    res.redirect('/')
                }).catch((err) => {
                    req.flash('error_msg', 'Houve um erro ao salvar o usuário');
                    res.redirect('/');
                })
            }
        }).catch((err) => {
            req.flash('error_msg', 'Houve um erro interno');
            res.redirect('/')
        })
    }
})

router.get('/login', (req, res) => {
    res.render('usuarios/login')
})

router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/usuarios/login',
        failureFlash: true
    })(req, res, next)
})

router.get('/logout', (req, res, next) => {
    req.logout((err) => {
        if(err) return next(err);
        req.flash('success_msg', 'Deslogado com sucesso');
        res.redirect('/')
    })
})

export default router;