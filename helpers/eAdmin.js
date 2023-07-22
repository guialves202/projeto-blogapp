export default function eAdmin(req, res, next) {
        if(req.isAuthenticated() && req.user.admin == 1) {
            return next();
        }

        req.flash('error_msg', 'É necessário ser um administrador para acessar esse conteúdo');
        res.redirect('/')
    }
