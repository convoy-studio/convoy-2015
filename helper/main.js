var phantom = require('phantom');
var fs = require('fs');
var xml2js = require('xml2js')

var localUrl = 'http://cvy-site-local.dev/#!/'
var prodUrl = 'http://convoy.me/'

phantom.create(function (ph) {
    
        var parser = new xml2js.Parser();
        fs.readFile('../www/sitemap.xml', function(err, data) {
            parser.parseString(data, function (err, result) {
                // console.log(data, result)
                var locations = result['urlset']['url']
                console.log(locations.length)
                for (var i = 0; i < locations.length; i++) {
                    var location = locations[i]
                    var pageUrl = location.loc[0].split(prodUrl)[1]
                    var urlToOpen = localUrl + pageUrl
                    openPage(urlToOpen, pageUrl, ph, i);
                };
            });
        });

        setTimeout(function(){
            ph.exit()
        }, 96000)
    
});



function openPage(url, output, ph, index) {
    ph.createPage(function (page) {

        page.open(url, function (status) {

            setTimeout(function() {

                page.evaluate(
                    function(selector) {
                        var text = document.getElementsByTagName(selector)[0].innerHTML
                        return text
                    }
                    , function(result) {
                        var content = result
                        content = content.replace(/image\/projects\//g, '../image/projects/')
                        content = content.replace('<link rel="stylesheet" href="css/styles.css">', '')
                        content = content.replace(/test.*<\/div>/g, '</div>')
                        content = content.replace(/style=".*?"/g, '')
                        output = (output.length < 2) ? 'index' : output
                        var filepath = '../www/snapshots/'+output+'.html'
                        fs.writeFile(filepath, content, function(err) {
                            if(err) {
                                return console.log(err);
                            }
                            console.log("The file was saved!");
                        }); 
                        
                    }
                    , "html"
                )
                
            }, 8000 * index)


        });
    });
}