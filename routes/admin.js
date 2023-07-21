import { Router } from "express";
const router = Router();
import Categoria from "../models/Categoria.js";
import Postagem from '../models/Postagem.js';

router.get('/', (req, res) => {
    res.render('admin/index')
})

router.get('/posts', (req, res) => {
    res.send('Página de posts')
})

router.get('/categorias/add', (req, res) => {
    res.render('admin/addcategoria')
})

router.post('/categorias/nova', (req, res) => {
    
    var erros = [];

    if(!req.body.nome && req.body.nome == undefined || req.body.nome == null || req.body.nome.length < 2) {
        erros.push({text: 'Nome inválido'})
    }

    if(!req.body.slug && req.body.slug == undefined || req.body.slug == null || req.body.slug.length < 2) {
        erros.push({text: 'Slug inválido'})
    }

    if(erros.length > 0) {
        res.render('admin/addcategoria', {erros: erros})
    } else{ 
        const novaCategoria = {
            nome: req.body.nome,
            slug: req.body.slug
        }
    
        new Categoria(novaCategoria).save().then(() => {
            req.flash('success_msg', 'Categoria criada com sucesso');
            res.redirect('/admin/categorias');
        }).catch((err) => {
            req.flash('error_msg', 'Houve um erro ao salvar a categoria, tente novamente');
            res.redirect('/admin/categorias')
        })
    }

    
})

router.get('/categorias', (req, res) => {
    Categoria.find().sort({date: 'desc'}).then((categorias) => {
        res.render('admin/categorias', {categorias})
    }).catch((err) => {
        req.flash('error_msg', 'Houve um erro ao listar as categorias');
        res.redirect('/admin');
    })
})

router.get('/categorias/edit/:id', (req, res) => {
    Categoria.findOne({_id: req.params.id}).then((categoria) => {
        res.render('admin/editcategorias', {categoria})
    }).catch((err) => {
        req.flash('error_msg', 'Esta categoria não existe');
        res.redirect('/admin/categorias');
    })
})

router.post('/categorias/edit', (req, res) => {
    var erros = [];

    if(!req.body.nome && req.body.nome == undefined || req.body.nome == null || req.body.nome.length < 2) {
        erros.push({text: 'Nome inválido'})
    }

    if(!req.body.slug && req.body.slug == undefined || req.body.slug == null || req.body.slug.length < 2) {
        erros.push({text: 'Slug inválido'})
    }

    if(erros.length > 0) {
        res.render('admin/editcategorias', {erros: erros})
    } else{ 
        Categoria.findOne({_id: req.body.id}).then((categoria) => {
            categoria.nome = req.body.nome;
            categoria.slug = req.body.slug;
            categoria.save().then(() => {
                req.flash('success_msg', 'Categoria editada com sucesso');
                res.redirect('/admin/categorias');
            }).catch((err) => {
                req.flash('error_msg', 'Houve um erro interno ao salvar a edição da categoria');
                res.redirect('/admin/categorias');
            })
        }).catch((err) => {
            req.flash('error_msg', 'Houve um erro ao editar a categoria');
            res.redirect('/admin/categorias');
        })
    }
})

router.post('/categorias/deletar', (req, res) => {
    Categoria.deleteOne({_id: req.body.id}).then(() => {
        req.flash('success_msg', 'Categoria deletada com sucesso');
        res.redirect('/admin/categorias');
    }).catch((err) => {
        req.flash('error_msg', 'Houve um erro ao deletar a categoria');
        res.redirect('/admin/categorias');
    })
})

router.get('/postagens', (req, res) => {
    Postagem.find().sort({date: 'desc'}).then((postagem) => {
        res.render('admin/postagens', {postagem})
    }).catch((err) => {
        req.flash('error_msg', 'Houve um erro ao listar as postagens');
        res.redirect('/admin');
    })
})

router.get('/postagens/add', (req, res) => {
    Categoria.find().then((categoria) => {
        res.render('admin/addpostagem', {categoria})
    }).catch((err) => {
        req.flash('error_msg', 'Houve um erro ao carregar o formulário');
        res.redirect('/admin')
    })
})

router.post('/postagens/nova', (req, res) => {
    var erros = [];

    if(!req.body.titulo && req.body.titulo == undefined || req.body.titulo == null || req.body.titulo.length < 2) {
        erros.push({text: 'Título inválido'})
    }

    if(!req.body.slug && req.body.slug == undefined || req.body.slug == null || req.body.slug.length < 2) {
        erros.push({text: 'Slug inválido'})
    }

    if(!req.body.descricao && req.body.descricao == undefined || req.body.descricao == null || req.body.descricao.length < 2) {
        erros.push({text: 'Descrição inválida'})
    }

    if(!req.body.conteudo && req.body.conteudo == undefined || req.body.conteudo == null || req.body.conteudo.length < 2) {
        erros.push({text: 'Conteúdo inválido'})
    }

    if(req.body.categoria == '0') {
        erros.push({text: 'Categoria inválida, registre uma categoria'})
    }

    if(erros.length > 0) {
        res.render('admin/addpostagem', {erros: erros})
    } else{ 
        const novaPostagem = {
            titulo: req.body.titulo,
            slug: req.body.slug,
            descricao: req.body.descricao,
            conteudo: req.body.conteudo,
            categoria: req.body.categoria
        }
    
        new Postagem(novaPostagem).save().then(() => {
            req.flash('success_msg', 'Postagem criada com sucesso');
            res.redirect('/admin/postagens');
        }).catch((err) => {
            req.flash('error_msg', 'Houve um erro ao salvar a postagem, tente novamente');
            res.redirect('/admin/postagens')
        })
    }
})

export default router;
