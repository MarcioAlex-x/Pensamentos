const express = require('express')
const exphbs = require('express-handlebars')
const session = require('express-session')
const Filestore = require('session-file-store')(session)
const flash = require('express-flash')

// inicialização do app
const app = express()

// inicialização do banco de dados
const conn = require('./db/conn')

//Controller
const PensamentoController = require('./controllers/PensamentoController')

// Models
const Pensamento = require('./models/Pensamento')
const User = require('./db/conn')

// rotas
const pensamentosRoutes = require('./routes/pensamentosRoutes')
const authRoutes = require('./routes/authRoutes')

app.get('/', PensamentoController.showPensamentos)//retira a obrigação de passar pela pasta pensamentos

// configurações da engine
app.engine('handlebars',exphbs.engine())
app.set('view engine','handlebars')

// midllewares
app.use(
    express.urlencoded({
        extended:true
    })//permite a ação de envio de dados
)
app.use(express.json())//permite que os dados sejam enviados em json
app.use(
    session({
        name:'session',
        secret:'nsecret',
        resave:false,
        saveUninitialized:false,
        store: new Filestore({
            logFn:()=>{},
            path:require('path').join(require('os').tmpdir(), 'sessions')
        }),
        cookie:{
            secure:false,
            maxAge:36000,
            expires: new Date(Date.now()+36000),
            httpOnly: true
        }
    })
)//escreve as seções em arquivo
app.use(flash())//permite o uso de mensagens flash
app.use(express.static('public'))//permite o uso de arquivos estáticos
app.use((req, res, next)=>{
    if(req.session.userid){
        res.locals.session = req.session
    }
    next()
})//obriga que a aplicação acesse as sessions e verifique se o usuário está logado
app.use('/pensamentos', pensamentosRoutes)//permite o acesso pela pasta pensamentos
app.use('/', authRoutes)

// conexaão da aplicação
conn
    // .sync({force:true})
    .sync()
        .then(()=>{
            app.listen(3000)
        })
        .catch((error)=>{
            console.log('Aconteceu um erro inesperável',error)
        })//conecta o banco a aplicação ao db e iniia o servidor