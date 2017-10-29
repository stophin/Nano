<?php
	session_start();
	
	$username = @$_SESSION["logged_user"];
	if (!$username)
	{
		$username = "guest";
	}
?>

<!DOCTYPE html PUBLIC "-//WAPFORUM//DTD XHTML Mobile 1.0//EN" "http://www.wapforum.org/DTD/xhtml-mobile10.dtd">
<html>
	<head>
		<meta charset="utf-8">
		<meta http-equiv="default-style" content="IE=edge,chrome=1">
		<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no, target-densitydpi=high-dpi" />
		<title>Game</title>
		
		<!-- <script type="text/javascript" src="./jquery-1.3.2.js"></script> -->
		<script type="text/javascript" src="./jquery-2.2.3.js"></script>
		
		<script src="js/client.js" charset="utf-8"></script>
		<script src="js/socket.io.js" charset="utf-8"></script>
		
		<script type="text/javascript" src="./world/Audio.js"></script>
		<script type="text/javascript" src="./world/RectF.js"></script>
		<script type="text/javascript" src="./world/PointF.js"></script>
		<script type="text/javascript" src="./world/QuadTree.js"></script>
		<script type="text/javascript" src="./world/BinTree.js"></script>
		<script type="text/javascript" src="./world/Constants.js"></script>
		<script type="text/javascript" src="./world/LinkList.js"></script>
		<script type="text/javascript" src="./world/MultiLinkList.js"></script>
		<script type="text/javascript" src="./world/Paths.js"></script>
		<script type="text/javascript" src="./world/Projection.js"></script>
		<script type="text/javascript" src="./world/Relation.js"></script>
		<script type="text/javascript" src="./world/Resources.js"></script>
		<script type="text/javascript" src="./world/ResourceManager.js"></script>
		<script type="text/javascript" src="./world/Objects.js"></script>
		<script type="text/javascript" src="./world/ObjectManager.js"></script>
		<script type="text/javascript" src="./world/Animations.js"></script>
		<script type="text/javascript" src="./world/AnimationManager.js"></script>
		<script type="text/javascript" src="./world/Roles.js"></script>
		<script type="text/javascript" src="./world/World.js"></script>
		<script type="text/javascript" src="./world/Drawable.js"></script>
		<script type="text/javascript" src="./world/External.js"></script>
		<script type="text/javascript" src="./world/Loading.js"></script>
		<script type="text/javascript" src="./gui/ScrollLink.js"></script>
		<script type="text/javascript" src="./gui/GUI.js"></script>
		
		<!--[if gte IE 6]> 
		<script type="text/javascript" src="./PNG.js"></script> 
		<script> 
			PNG.fix('*'); 
		</script> 
		<![endif]-->
		
		<script type="text/javascript">
			username = "<?php echo $username;?>";
			curfolder = username;
			worldinfo = username;
			mainfolder = "./folder/upload/" + curfolder;
			
			var audio = null;
			function body_load()
			{
				// worldID, roleID
				var uniqueID = Math.ceil(Math.random() * 100) + 2000;
				Initialize(1023, uniqueID);
				
				audioSoundEffect = new Audio("audioSoundEffect");
				audioSoundEffect.setAudio("audio/trunc.mp3");
				//audioSoundEffect.playOrPause();
				
				//setInterval(onTimer, 100);
				setInterval(onPaint, 100);
				
				/////////////////////////////////
				//Local server
				Client.connect("127.0.0.1",9005);
				/////////////////////////////////
				
				Client.user.uniqueID = world.focus.uniqueID;
				Client.user.worldID = world.uniqueID;
				Client.login(function(data)
				{
					//alert(data);
					if(data==1)
					{
						Client.doDisconnect();
					}
					else
					{
						Client.loggedin = true;
						
						var roleString = g_roles["player.txt"];
						if (!roleString)
						{
							roleString = "";
						}
						Client.emitEvent("connect", {
							"worldID":world.uniqueID,
							"role":{
								"uniqueID":world.focus.uniqueID,
								"roleString":roleString,
								"scale":world.focus.scale,
								"position":{
									"X":(world.focus.flatting.X - world.geometry.X),
									"Y":(world.focus.flatting.Y - world.geometry.Y)
								}
							}
						});
					}
				});
			}
			function onGUI() {
				gui.update();
			}
		</script>
		
		<style>
			html, body
			{
				margin:0px;
				height:100%;
				width:100%;
			}
			canvas
			{
				width: 100%;
				height: 100%;
				display: block;
			}
		</style>
	</head>
	<body scroll="no" onload="body_load();" onselectstart="return false;">
		<canvas id="myCanvas"></canvas>
		<audio src="" id="audioSoundEffect" controls="controls" style="display:none"></audio>
		<div style="word-wrap: break-word; z-Index: 99;border: 1px solid red;position: absolute;left: 100px; top: 10px; width: 100px; height: 100px" id="Log">Log</div>
	</body>
</html>
