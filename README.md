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
1.在html页面引入ddplayer.min.js--弹幕播放器<br>
playr.js和playr.css--视频播放器，也可以使用其他的<br>
2.在页面载入的时候，初始化DDplayer。<br>
<pre>
var v = document.querySelector("video");
var player = new DD.Player("dd", v);
var url = "http://getDanmus";
player.init("canvas", url);
</pre>
3.发送弹幕时，调用<br>
<pre>
player.sendDanmus("弹幕提交的地址","videoID","userID","弹幕内容","Scroll","Red");
</pre>
4.显示/隐藏弹幕，调用<br>
<pre>
player.toggleDanmu();
</pre>



注意：<br>
1.video标签尽量指定宽和高，像这样：<br>
<pre>
&lt;video id="dd" class="playr_video" width="600" height="280"&gt;
	&lt;source src="http://bcs.duapp.com/ddplayer/video%2Ftest.mp4" type="video/mp4" /&gt;
&lt;/video&gt;
</pre>
2.尽量使用chrome浏览器，其他浏览器不保证兼容性。<br>
3.DDPlayer支持WebSocket，使用时要这样：<br>
<pre>
//支持ws版
player.init("canvas", url, wsUrl);//在初始化时给出WebSocket的地址
player.sendDanmus(wsUrl,"vid","uid","DDtext中文","Scroll");//并且发送弹幕的地址必须是初始化时的wsUrl
</pre>




演示Demo
========
地址：http://1.ddplayer.duapp.com/  <br>

视频播放器使用的是Playr：https://github.com/delphiki/Playr <br>
颜色拾取面板是colorpicker：http://www.eyecon.ro/colorpicker/ <br>



特别感谢
========
delphiki的Playr项目，mrdoob的three.js项目，以及福娃同学的mukioplayer项目。


