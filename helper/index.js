var fs = require('fs');
var xml2js = require('xml2js')
var phantom = require('phantom');
var getMeta = require("lets-get-meta")
var data = require('../www/data/data.json')

const localUrl = 'http://cvy-site-local.dev/#!'
const prodUrl = 'http://convoy.me/'

let urls = []
let pageTitle;

var parser = new xml2js.Parser();
fs.readFile('../www/sitemap.xml', (err, data) => {
    parser.parseString(data, (err, result) => {
        var locations = result['urlset']['url']
        for (var i = 0; i < locations.length; i++) {
            var location = locations[i]
            var pageUrl = location.loc[0].split(prodUrl)[1]
            var id = pageUrl.split('works/')[1]
            var hashurl = prodUrl + '#!/' + pageUrl
            urls.push({
                url: pageUrl,
                hashurl: hashurl,
                id: id
            })
        };
        grabIndex()
    });
});

let grabIndex = () => {

    phantom.create((ph) => {
        ph.createPage((page) => {
            page.open(localUrl, (status) => {

                page.evaluate(
                    (selector) => {
                        var text = document.getElementsByTagName(selector)[0].innerHTML
                        return text
                    }
                    , (result) => {

                        let m = getMeta(result)
                        let allMetas = []
                        for (let key in m) {
                            let content = m[key];
                            allMetas.push(`<meta name="${key}" content="${content}">`)
                        }

                        let headerHtml = data.works.map((item) => {
                            return `
                                <li><a title="${item.client.toUpperCase() + ' / ' + item.header}" href="${prodUrl + 'works/' + item.id}">${item.client.toUpperCase()}</a></li>
                            `
                        })

                        let projectsLinks = data.works.map((item) => {
                            return `
                                <li>
                                    <a title="${item.client.toUpperCase() + ' / ' + item.header}" href="${prodUrl + 'works/' + item.id}">
                                        <h6>${item.client.toUpperCase()}</h6>
                                        <h7>${item.header}</h7>
                                        <p>${item.subtitle}</p>
                                    </a>
                                </li>
                            `
                        })

                        let socialHtml = `
                            <ul>
                                <li><a title="twitter @convoystudio" href="https://twitter.com/convoystudio">Twitter @convoystudio</a></li>
                                <li><a title="instagram @convoystudio" href="https://www.instagram.com/convoystudio/">Instagram @convoystudio</a></li>
                            </ul>
                        `

                        const aboutContent = data.content.about

                        let aboutHtml = `
                            <div className="info-box">
                                <div className="title">${aboutContent.title}</div>
                                <div className="paragraph">${aboutContent.subtitle}</div>
                            </div>
                            <div className="services-and-contact">
                                <div className="services">
                                    <div className="title">${aboutContent['services_title']}</div>
                                    <div className="paragraph">${aboutContent['services_p']}</div>
                                </div>
                                <div className="contact">
                                    <div className="title">${aboutContent['contact_title']}</div>
                                    <div className="paragraph">
                                        <br/>
                                        <a target='_blank' href="${aboutContent['contact_map_url']}">${aboutContent['contact_map_text']}</a>
                                        ${aboutContent['contact_tel']}<br/>
                                        <a href="${'mailto:' + aboutContent['contact_email']}">${aboutContent['contact_email']}</a>
                                    </div>
                                </div>
                            </div>
                        `

                        pageTitle = result.substring(result.lastIndexOf("</title>"),result.lastIndexOf("<title>")+7);

                        for (let url of urls) {
                            if(url.id) {
                                let html = renderWorkHtml(allMetas, getWorkById(url.id), headerHtml, socialHtml, aboutHtml)
                                saveFile('../www/partials/works/'+url.id+'.html', html)
                            }else{
                                let html = renderRootHtml(allMetas, headerHtml, socialHtml, aboutHtml, projectsLinks)
                                let id = url.url
                                if(id.length < 2) id = 'index'
                                saveFile('../www/partials/'+id+'.html', html)
                            }
                        }

                    }
                    , "html"
                )

            })
        })
        
    });
    
}

let getWorkById = (id) => {
    for (let work of data.works) {
        if(work.id === id) return work
    }
}

let saveFile = (filepath, content) => {
    fs.writeFile(filepath, content, function(err) {
        if(err) {
            return console.log(err);
        }
        console.log(`The file ${filepath} was saved!`);
    }); 
}


let renderWorkHtml = (metas, data, header, social, about) => {

    let paragraphs = []
    let titleParagraphs = []
    let links = []

    let components = data.components
    for (let key in components) {
        let c = components[key]
        if(c.type === 'paragraph') {
            paragraphs.push(c.text)
        }
        if(c.type === 'title-paragraph') {
            titleParagraphs.push(`
                <h4>${c.title}</h4>
                <p>${c.text}</p>
            `)
        }
        if(c.type === 'link') {
            links.push(`<a title="${c.vars.title}" href="${c.vars.url}">${c.vars.title}</a>`)
        }
    }

    let html = `
        <!DOCTYPE html>
        <html class="no-js">
            <head>
                <title>${pageTitle} / ${data.client.toUpperCase()} / ${data.header}</title>
                ${metas.join('')}

                <link rel="apple-touch-icon" sizes="57x57" href="http://convoy.me/image/icons/apple-touch-icon-57x57.png">
                <link rel="apple-touch-icon" sizes="114x114" href="http://convoy.me/image/icons/apple-touch-icon-114x114.png">
                <link rel="apple-touch-icon" sizes="72x72" href="http://convoy.me/image/icons/apple-touch-icon-72x72.png">
                <link rel="apple-touch-icon" sizes="144x144" href="http://convoy.me/image/icons/apple-touch-icon-144x144.png">
                <link rel="apple-touch-icon" sizes="60x60" href="http://convoy.me/image/icons/apple-touch-icon-60x60.png">
                <link rel="apple-touch-icon" sizes="120x120" href="http://convoy.me/image/icons/apple-touch-icon-120x120.png">
                <link rel="apple-touch-icon" sizes="76x76" href="http://convoy.me/image/icons/apple-touch-icon-76x76.png">
                <link rel="apple-touch-icon" sizes="152x152" href="http://convoy.me/image/icons/apple-touch-icon-152x152.png">
                <link rel="apple-touch-icon" sizes="180x180" href="http://convoy.me/image/icons/apple-touch-icon-180x180.png">
                <meta name="msapplication-TileColor" content="#ffffff">
                <meta name="msapplication-TileImage" content="http://convoy.me/image/icons/mstile-144x144.png">

                <link rel="canonical" href="http://convoy.me/" />
                <link rel="image_src" href="http://convoy.me/image/share.jpg" / >
            </head>
            <body>
                
                <header>
                    
                    <img src="http://convoy.me/image/logo-Convoy-social.jpg"></img>

                    <nav>
                        <ul>
                            ${header.join('')}
                        </ul>
                    </nav>
                </header>

                <section>
                    <h1>${data.client.toUpperCase()}</h1>
                    <h2>${data.header}</h2>
                    <h3>${data.subtitle}</h3>
                    <p>${paragraphs.join('')}</p>
                    <div>
                        ${titleParagraphs.join('')}
                        ${links.join('')}
                        ${social}
                    </div>
                </section>

                <footer>
                    ${about}
                </footer>
            </body>
        </html>
    `

    return html

}

let renderRootHtml = (metas, header, social, about, projectLinks) => {

    let html = `
        <!DOCTYPE html>
        <html class="no-js">
            <head>
                <title>${pageTitle}</title>
                ${metas.join('')}

                <link rel="apple-touch-icon" sizes="57x57" href="http://convoy.me/image/icons/apple-touch-icon-57x57.png">
                <link rel="apple-touch-icon" sizes="114x114" href="http://convoy.me/image/icons/apple-touch-icon-114x114.png">
                <link rel="apple-touch-icon" sizes="72x72" href="http://convoy.me/image/icons/apple-touch-icon-72x72.png">
                <link rel="apple-touch-icon" sizes="144x144" href="http://convoy.me/image/icons/apple-touch-icon-144x144.png">
                <link rel="apple-touch-icon" sizes="60x60" href="http://convoy.me/image/icons/apple-touch-icon-60x60.png">
                <link rel="apple-touch-icon" sizes="120x120" href="http://convoy.me/image/icons/apple-touch-icon-120x120.png">
                <link rel="apple-touch-icon" sizes="76x76" href="http://convoy.me/image/icons/apple-touch-icon-76x76.png">
                <link rel="apple-touch-icon" sizes="152x152" href="http://convoy.me/image/icons/apple-touch-icon-152x152.png">
                <link rel="apple-touch-icon" sizes="180x180" href="http://convoy.me/image/icons/apple-touch-icon-180x180.png">
                <meta name="msapplication-TileColor" content="#ffffff">
                <meta name="msapplication-TileImage" content="http://convoy.me/image/icons/mstile-144x144.png">

                <link rel="canonical" href="http://convoy.me/" />
                <link rel="image_src" href="http://convoy.me/image/share.jpg" / >
            </head>
            <body>
                
                <header>
                    
                    <img src="http://convoy.me/image/logo-Convoy-social.jpg"></img>

                    <nav>
                        <ul>
                            ${header.join('')}
                        </ul>
                    </nav>
                </header>

                <section>
                    <ul>
                        ${projectLinks.join('')}
                    </ul>
                    <div>
                        ${social}
                    </div>
                </section>

                <footer>
                    ${about}
                </footer>
            </body>
        </html>
    `

    return html

}



