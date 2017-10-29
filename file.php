<?php
header('Content-type: text/html; charset=utf-8');
$mode = @$_POST["mode"];
if (!$mode)
{
	$mode = "read";
}

$filename = @$_POST["filename"];
if (!$filename)
{
	$filename = "test.txt";
}

if ($mode == "read")
{
	$content = "";
	
	$file = fopen($filename, "r");
	
	while(!feof($file))
	{
		$content =  $content.fgets($file);
	}
	fclose($file);
	echo $content;
}
else
{
	$content = @$_POST["content"];
	if (!$content)
	{
		$content = "";
	}

	$append = @$_POST["append"];
	if (!$append)
	{
		$append = "false";
	}

	if ($append == "true")
	{
		$append = "a";
	}
	else
	{
		$append = "w";
	}

	$ff=fopen($filename, $append);
	fwrite($ff, $content);
	fclose($ff);
	echo "OK";
}
?>