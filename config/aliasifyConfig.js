var recursiveReadSync = require('recursive-readdir-sync')

module.exports = {
	buildAliases: function(srcBasePath) {

		var allPathStr = "{"
		var jsRelPath = srcBasePath+'/js'
		var files = recursiveReadSync(jsRelPath);

		for (var i = 0; i < files.length; i++) {
			var file = files[i]
			if(file.indexOf('.js') > -1) {
				var path = file.replace(".js", "")
				var splitter = path.split('/')
				var filename = splitter[splitter.length-1]
				var fPath = "./" + path
				var str = '"' + filename + '": "' + fPath + '",'
				allPathStr += str
			}
		};
		allPathStr = allPathStr.slice(0, allPathStr.length-1)
		allPathStr += "}"
		var obj = JSON.parse(allPathStr)
		this.aliases = obj
		console.log('Aliases created.')
	},
	aliases: "",
    configDir: "",
    verbose: false
}