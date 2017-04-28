'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _expressHandlebars = require('express-handlebars');

var _expressHandlebars2 = _interopRequireDefault(_expressHandlebars);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _jsonfile = require('jsonfile');

var _jsonfile2 = _interopRequireDefault(_jsonfile);

var _q = require('q');

var _q2 = _interopRequireDefault(_q);

var _vhost = require('vhost');

var _vhost2 = _interopRequireDefault(_vhost);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = (0, _express2.default)();
var dataFilepath = './data/data.json';

var sites = undefined;
var isProd = process.env.NODE_ENV === 'production';
var port = isProd ? 80 : 3232;

// app.use(express.static(path.join(__dirname, '../public')));

app.use('/css', _express2.default.static(_path2.default.join(__dirname, '../public/css')));
app.use('/font', _express2.default.static(_path2.default.join(__dirname, '../public/font')));

app.engine('handlebars', (0, _expressHandlebars2.default)({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');
app.use(_bodyParser2.default.json());
app.use(_bodyParser2.default.urlencoded({
    extended: true
}));

var getData = function getData() {
    var deferred = _q2.default.defer();
    _jsonfile2.default.readFile(dataFilepath, function (err, data) {
        if (err) {
            deferred.reject(new Error(err));
        } else {
            sites = data;
            deferred.resolve(data);
        }
    });
    return deferred.promise;
};

var writeJsonFile = function writeJsonFile(filepath, data) {
    var deferred = _q2.default.defer();
    _jsonfile2.default.writeFile(filepath, data, function (err, out) {
        if (err) {
            deferred.reject(new Error(err));
        } else {
            deferred.resolve(out);
        }
    });
    return deferred.promise;
};

var getSiteById = function getSiteById(id) {
    return Object.assign({}, sites[parseInt(id)]);
};

var renderPage = function renderPage(res, req, page, obj) {
    res.render(page, obj);
};

getData();

app.get('/', function (req, res) {
    getData().then(function (data) {
        renderPage(res, req, 'home', {
            sites: data
        });
    });
});

app.get('/admin', function (req, res) {
    getData().then(function (data) {
        renderPage(res, req, 'admin', {
            sites: data
        });
    });
});

app.delete('/admin', function (req, res) {
    var id = parseInt(req.body.id);
    sites.splice(id, 1);
    writeJsonFile(dataFilepath, sites).then(function () {
        return res.end();
    });
});

app.get('/edit/:id', function (req, res) {
    var id = parseInt(req.params.id);
    var site = sites[id];
    renderPage(res, req, 'edit', {
        id: id,
        site: site
    });
});

app.put('/edit/:id', function (req, res) {
    var id = parseInt(req.params.id);
    sites[id] = req.body;
    writeJsonFile(dataFilepath, sites).then(function () {
        return res.end();
    });
});

app.get('/create', function (req, res) {
    renderPage(res, req, 'create', {});
});

app.put('/create', function (req, res) {
    sites.push(req.body);
    writeJsonFile(dataFilepath, sites).then(function () {
        return res.end();
    });
});

if (isProd) {
    (0, _express2.default)().use((0, _vhost2.default)('convoy.me/archive', app)).listen(80);
} else {
    (function () {
        var server = app.listen(port, function () {
            console.log('Server running at http://localhost:' + server.address().port);
        });
    })();
}