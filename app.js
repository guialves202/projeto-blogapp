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
    // import mongoose from "mongoose";

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
        app.use(flash());
    // Middleware
        app.use((req, res, next) => {
            res.locals.success_msg = req.flash('success_msg');
            res.locals.error_msg = req.flash('error_msg');
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


// Outros
const PORT = 3000;
app.listen(PORT, (err) => {
    if(err) {
        console.log('Erro ao iniciar o servidor: ', err)
    } else {
        console.log(`Servidor rodando no endereço http://localhost:${PORT}`);
    }
})