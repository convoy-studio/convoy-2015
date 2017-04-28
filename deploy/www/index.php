<?php
    
    include_once './plugins/autoload.php';
    use Jaybizzle\CrawlerDetect\CrawlerDetect;

    $CrawlerDetect = new CrawlerDetect;

    $options =  array('extension' => '.html');
    $m = new Mustache_Engine(array(
        'loader' => new Mustache_Loader_FilesystemLoader(dirname(__FILE__) . '/partials', $options),
    ));

    $json = file_get_contents('data/data.json');
    $obj = json_decode($json);
    $about = $obj->content->about;
    $works = $obj->works;
    $host = $_SERVER[HTTP_HOST];
    $uri = $_SERVER[REQUEST_URI];

    if($CrawlerDetect->isCrawler()) {

        $prod_url = 'http://convoy.me';
        $xml = simplexml_load_file("sitemap.xml");
        $locs = array();

        foreach($xml as $key => $value) {
            $loc = (string) $value->loc;
            $loc = str_replace($prod_url, "", $loc);
            if($_SERVER[REQUEST_URI] === $loc) {
                if($loc === '/') {
                    $loc = 'main';
                }
                echo $m->render($loc, array(
                    'prefix' => '', 
                    'deviceType' => 'computer', 
                    'about' => $about, 
                    'works' => $works,
                    'host' => $host,
                    'uri' => $uri
                ));
                return;
            }
        }
        return;
        
    }else{

        require_once "php/Mobile_Detect.php";
        $detect = new Mobile_Detect;
        $deviceType = ($detect->isMobile() ? ($detect->isTablet() ? "tablet" : "phone") : "computer");
        // $deviceType = "phone";
        if($deviceType == "phone") {
            $prefix = "_mobile";
        }else{
            $prefix = '';
        }

        echo $m->render('main', array(
            'prefix' => $prefix, 
            'deviceType' => $deviceType, 
            'about' => $about, 
            'works' => $works,
            'host' => $host,
            'uri' => $uri
        ));

    }

?>
