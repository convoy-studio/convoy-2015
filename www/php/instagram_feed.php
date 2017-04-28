<?php
header('Content-Type: application/json');
$instagramEndPoint = 'https://api.instagram.com/v1/users/198824158/media/recent?access_token=198824158.924626f.8f5dfc88199244b0be526ac40e8e091d';
$str = file_get_contents($instagramEndPoint);
echo ($str);
?>