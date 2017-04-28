import express from 'express'
import fs from 'fs'
import path from 'path'
import exphbs from 'express-handlebars'
import bodyParser from 'body-parser'
import jsonfile from 'jsonfile'
import Q from 'q'
import passport from 'passport'
import { Strategy } from 'passport-local'
const app = express()
const dataFilepath = './data/data.json'

let sites = undefined
let users = [
    {
        id: 'admin',
        username: 'admin',
        password: 'pass'
    }
]

passport.use(new Strategy(
    (username, password, cb) => {
        let userFound = false
        users.forEach((user) => {
            if(user.username === username) {
                userFound = true
                if (user.password != password) {
                    return cb(null, false); 
                }else{
                     return cb(null, user);
                }      
            }
        })
        if(!userFound) return cb(null, false)
    }
));

passport.serializeUser((user, cb) => {
    cb(null, user.id);
});

passport.deserializeUser((id, cb) => {
    let userFound = false
    users.forEach((user) => {
        if(user.id === id) {
            userFound = true
            return cb(null, user);        
        }
    })
    if(userFound == false) return cb(null, false)
});

app.use(express.static(path.join(__dirname, '../public')));

var hbs = exphbs.create({
    defaultLayout: 'main',
    partialsDir: [
        'views/archive/'
    ]
});

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.use(require('cookie-parser')());
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: true
})); 
app.use(require('express-session')({ secret: 'keyboard cat', resave: false, saveUninitialized: false }));

let getData = () => {
    var deferred = Q.defer();
    jsonfile.readFile(dataFilepath, (err, data) => {
        if (err) {
            deferred.reject(new Error(err));
        } else {
            sites = data
            deferred.resolve(data);
        }
    })
    return deferred.promise
}

let writeJsonFile = (filepath, data) => {
    var deferred = Q.defer();
    jsonfile.writeFile(filepath, data, (err, out) => {
        if(err) {
            deferred.reject(new Error(err));
        } else {
            deferred.resolve(out);
        }
    }); 
    return deferred.promise
}

let getSiteById = (id) => {
    return Object.assign({}, sites[parseInt(id)])
}

let renderPage = (res, req, page, obj) => {
    obj = obj || {}
    if(obj.showMenu == undefined) obj.showMenu = true
    res.render(page, obj);
}

getData()

app.use(passport.initialize());
app.use(passport.session());

app.get('/login', (req, res) => {
    renderPage(res, req, 'login', {
        showMenu: false
    })
})

app.post('/login', 
    passport.authenticate('local', { failureRedirect: '/login' }),
    (req, res) => {
        res.redirect('/');
});

app.get('/logout', (req, res) =>{
    req.logout();
    res.redirect('/login');
});

app.use((req, res, next) => {
    if(!req.user) {
        res.redirect('/login');
    }else{
        next()
    }
})

app.get('/', (req, res) => {
    getData().then((data) => {
        renderPage(res, req, 'home', {})
    })
})

app.get('/archive', (req, res) => {
    getData().then((data) => {
        renderPage(res, req, 'archive/home', {
            sites: data    
        })
    })
})

app.get('/archive/admin', (req, res) => {
    getData().then((data) => {
        renderPage(res, req, 'archive/admin', {
            sites: data    
        })
    })
})

app.delete('/archive/admin', (req, res) => {
    var id = parseInt(req.body.id)
    sites.splice(id, 1);
    writeJsonFile(dataFilepath, sites).then(() => res.end())
})

app.get('/archive/admin/edit/:id', (req, res) => {
    let id = parseInt(req.params.id)
    let site = sites[id]
    renderPage(res, req, 'archive/edit', {
        id: id,
        site: site    
    })
})

app.put('/archive/admin/edit/:id', function (req, res) {
    let id = parseInt(req.params.id)
    sites[id] = req.body
    writeJsonFile(dataFilepath, sites).then(() => res.end())
})

app.get('/archive/admin/create', (req, res) => {
    renderPage(res, req, 'archive/create', {})
})

app.put('/archive/admin/create', (req, res) => {
    sites.push(req.body)
    writeJsonFile(dataFilepath, sites).then(() => res.end())
})

exports.app = app
