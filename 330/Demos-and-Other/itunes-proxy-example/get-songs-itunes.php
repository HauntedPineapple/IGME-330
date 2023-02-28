<?php
	$term = "rush"; // the default
	// if there is ?term=bandname, grab the value
  if(array_key_exists('term', $_GET) && strlen($term)){
    $term = $_GET['term'];
    // encode spaces in the parameters as +
    $term = str_replace(' ', '+', $term);
  }
	$URL = "https://itunes.apple.com/search?media=music&entity=song&term=$term";
	header('content-type:application/json');      // tell the requestor that this is JSON
	header("Access-Control-Allow-Origin: *");     // turn on CORS
	echo file_get_contents($URL);
?>