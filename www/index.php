<?php

require(__DIR__.'/../bootstrap.php');


use ElBiniou\LivingSource\Source;
use ElBiniou\LivingSource\SourceFileStorage;


$source = new Source();
$storage = new SourceFileStorage($source, __DIR__ . '/data/diff.versionned.json');
$storage->loadVersions();

$versions = $source->getVersions();


$metadata = $source->getMetadata();

?>
<!doctype html>
<html>
<head>

    <script src="./vendor/ace-builds/src-min/ace.js"></script>

    <script src="./vendor/acediff.js"></script>
    <link href="./vendor/acediff-dark.css" rel="stylesheet">

    <link rel="stylesheet" href="./resource/style.css"/>
    <script src="./source/LivingSource.js"></script>

</head>

<body>

<div id="version-container"></div>
<div id="history-bar"
     style="outline: solid 1px #F00; height: calc(100% - 80px); position: absolute ; top: 80px; left:0; width:100%">
    <div class="diff-component"></div>
</div>
<script>


    <?php
    echo 'let versions =' . json_encode($versions) . ';';
    echo 'let metadata =' . json_encode($metadata) . ';';
    ?>

    let reader = new LivingSource('.diff-component');
    reader.loadMetadata(metadata);
    reader.loadVersions(versions);
    reader.generateNavbar('#version-container');

    reader.render('.acediff');


</script>

</body>

</html>