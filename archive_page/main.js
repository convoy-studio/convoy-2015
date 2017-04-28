var express = require('express')
var vhost = require('vhost')

var isProd = process.env.NODE_ENV === 'production'
var port = isProd ? 8080 : 3232

if(isProd) {
	express()
		.use(vhost('convoy.me', require('./dist/index').app))
		.listen(port)
}else{
	var app = require('./lib/index').app
	var server = app.listen(port, function() {
        console.log('Server running at http://localhost:' + port)
    })
}
