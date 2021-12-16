const cookieParser = require('cookie-parser');
const { cookie } = require('express/lib/response');
const async = require('hbs/lib/async');
var session = require('express-session');

let http = require('http'),
    path = require('path'),
    express = require('express'),
    app = express(),
    Post = require('./model/Posts'),
    multer = require('multer'),
    uploadImg = multer({ dest: 'public/uploads' }),
    uploadMp4 = multer({ dest: 'public/uploads' }),
    images = [],
    videos = [];

// Mecanismo de template
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'view'));
// Configuração dos arquivos estaticos
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());
app.use(session({
    secret: 'logado32146987455',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

// Principal
app.get('/', (req, res) => {
    res.render('index.hbs', {videos:videos, images: images});
});

app.post('/login', async (req, res) => {
    const login = req.body;
    const user = await Post.login(login);
    if (user[0]){
        const admin = user[1][0]['admin'];
        res.cookie(user[1][0]['email'],user[1][0]['password'] );
        req.session.login = user[1][0]['username'];
        return res.status(200).send({ 
            error: 'Login realizado com sucesso!',
            admin: admin,
            username: user[1][0]['username']
        });
    }   
    else 
    return res.status(201).send({
        error: 'Email ou senha inválidos!'
    });
});

app.post('/new_user', async (req, res) => {
    const new_user = req.body;
    switch (await Post.create(new_user)) {
        case 10:
            return res.status(201).send({
                error: 'Operação Realizada com sucesso!'
            });
        case 1:
            return res.status(401).send({
                error: 'Email já em uso!'
            });
        case 2:
            return res.status(402).send({
                error: 'Username já em uso!'
            });
        case 3:
            return res.status(403).send({
                error: 'Email e username já em uso!'
            });
    };

});

app.post('/upload-image', uploadImg.single('arquivo'), (req, res) => {
    images.push(req.file.filename);
    res.redirect('/');
});

app.post('/upload-video', uploadMp4.single('arquivo'), (req, res) => {
    videos.push(req.file.filename);
    res.redirect('/');
});

app.get('/search', async (req, res) => {
    const user = req.query.search,
        users = await Post.search(user);
    let objUsers = [];
    users.forEach(function(user, i){
        objUsers[i] = {name: user.name, username: user.username, email: user.email}
    });
    res.render('index.hbs', {videos:videos, images: images, objUsers});
});


app.listen(3000);