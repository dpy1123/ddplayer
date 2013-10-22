ddplayer
========

这是个基于js和html5弹幕播放器。

本项目只提供弹幕播放功能，开放出API，可以和其他video播放器集成使用，详见示例。



目录结构
=========
core文件夹和DDplayer.js是项目的源文件。<br>
ddplayer.min.js是编译后的单一js文件。<br>
Playr-master文件夹是delphiki/Playr项目的源码，这是一个基于html5的video播放器，用来提供视频播放功能。<br>
stats.min.js是测试帧率时用的，提取自three.js项目。<br>
test.html是测试页面。<br>


如何使用
=========
1.在html页面引入ddplayer.min.js--弹幕播放器
playr.js和playr.css--视频播放器，也可以使用其他的
2.在页面载入的时候，初始化DDplayer。
<pre>
      var v = document.querySelector("video");
			var player = new DD.Player("dd", v);
			var url = "http://getDanmus";
			player.init("canvas", url);
</pre>
3.发送弹幕的时，调用
<pre>
      player.sendDanmus("弹幕提交的地址","videoID","userID","弹幕内容","Scroll","Red");
</pre>



Demo
========
http://1.ddplayer.duapp.com/  
