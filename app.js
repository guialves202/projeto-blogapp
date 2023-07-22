// Carregando módulos
    import express from "express";
    import handlebars from 'express-handlebars';
    import bodyParser from "body-parser";
    import admin from "./routes/admin.js";
    import path from 'path';
    import { fileURLToPath } from "url";
    import mongoose from "mongoose";
    import session from "express-session";
    import flash from 'connect-flash';
    import Postagem from "./models/Postagem.js";
    import Categoria from "./models/Categoria.js";
    import usuarios from './routes/usuario.js';
    import passport from "passport";
    import auth from "./config/auth.js";

    const app = express();
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

// Configurações
    // Sessão
        app.use(session({
            secret: 'cursodenode',
            resave: true,
            saveUninitialized: true
        }))
        app.use(passport.initialize());
        app.use(passport.session());
        app.use(flash());
    // Middleware
        app.use((req, res, next) => {
            res.locals.success_msg = req.flash('success_msg');
            res.locals.error_msg = req.flash('error_msg');
            res.locals.error = req.flash('error');
            res.locals.user = req.user || null;
            next();
        })
    // Body Parser
        app.use(bodyParser.urlencoded({extended: true}));
        app.use(bodyParser.json());
    // Handlebars
        app.engine('handlebars', handlebars.engine({
            defaultLayout: 'main',
            runtimeOptions: {
                allowProtoPropertiesByDefault: true,
                allowProtoMethodsByDefault: true
            }
        }));
        app.set('view engine', 'handlebars');
    // Mongoose
        mongoose.Promise = global.Promise;
        mongoose.connect('mongodb://127.0.0.1:27017/blogapp', {
            useNewUrlParser: true
        })
        .then(() => {
            console.log('Conectado ao mongodb com sucesso')
        })
        .catch((err) => {
            console.log('Erro ao se conectar ao mongodb: ' + err);
        })
    // Public
        app.use(express.static(path.join(__dirname, 'public')));
// Rotas
    app.use('/admin', admin);
    app.use('/usuarios', usuarios);

    app.get('/', (req, res) => {
        Postagem.find().lean().populate({path:'categoria', strictPopulate: false}).sort({data:'desc'}).then((postagem) => {
            res.render('index', {postagem})
        }).catch((err) => {
            req.flash('error_msg', 'Houve um erro interno');
            res.redirect('/404');
        })
        
    })

    app.get('/postagem/:slug', (req, res) => {
        Postagem.findOne({slug: req.params.slug}).then((postagem) => {
            if(postagem) {
                res.render('postagem/index', {postagem})
            } else {
                req.flash('error_msg', 'Essa postagem não existe');
                res.redirect('/')
            }
        }).catch((err) => {
            req.flash('error_msg', 'Houve um erro interno');
            res.redirect('/');
        })
    })

    app.get('/categorias', (req, res) => {
        Categoria.find().then((categoria) => {
            res.render('categorias/index', {categoria})
        }).catch((err) => {
            req.flash('error_msg', 'Houve um erro interno ao listar as categorias');
            res.redirect('/')
        })
    })

    app.get('/categorias/:slug', (req, res) => {
        Categoria.findOne({slug: req.params.slug}).then((categoria) => {
            if(categoria) {
                Postagem.find({categoria: categoria._id}).then((postagem) => {
                    res.render('categorias/postagens', {postagem, categoria});
                }).catch((err) => {
                    req.flash('error_msg', 'Houve um erro ao listar os posts');
                    res.redirect('/');
                })
            } else {
                req.flash('error_msg', 'Esta categoria não existe');
                res.redirect('/')
            }
        }).catch((err) => {
            req.flash('error_msg', 'Houve um erro interno ao carregar a página desta categoria');
            res.redirect('/')
        })
    })

    app.get('/404', (req, res) => {
        res.send('Erro 404!')
    })

// Outros
const PORT = 3000;
app.listen(PORT, (err) => {
    if(err) {
        console.log('Erro ao iniciar o servidor: ', err)
    } else {
        console.log(`Servidor rodando no endereço http://localhost:${PORT}`);
    }
})