 /**
 * Player对象，弹幕播放器控件。
 * @constructor
 * @param {Integer} v_id A video id
 * @param {DOMElement} v_el The video node
 */
DD.Player = function(v_id, v_el){
	this.video_id = v_id;
	this.video = v_el;
	this.isFullscreen = false;
	this.isTrueFullscreen = false;
	//绘制canvas相关的组件
	this.canvas = null;
	this.frame = null;
	//存放解析好的弹幕内容
	this.danmus = [];
	//连接到实时弹幕服务器的websocket	
	this.ws = null;
};

DD.Player.prototype = {
	constructor: DD.Player,
	/**
	 * 异步初始化方法，在video的元数据获取到后再初始化。
	 * 避免video的offsetWidth和offsetHeight在初始化时为空，导致canvas的长宽和video不匹配。
	 */
	init: function(canvas_id, url, wsUrl){
		var that = this;
		this.video.addEventListener('loadeddata', function(){
			that.setup(canvas_id, url, wsUrl);
		},false);
	},
	/**
	 * 初始化方法
	 * @param url 初次load弹幕的url[ajax]
	 * @param wsUrl 如果设置了wsUrl，并且浏览器支持，则建立ws链接，通过wsUrl获取实时弹幕。
	 */
	setup: function(canvas_id, url, wsUrl){
		//初始化绘制canvas相关的组件
		var w = this.videoOriginWidth = this.video.offsetWidth;//控件的宽
		var h = this.videoOriginHeight = this.video.offsetHeight;//控件的高
		this.canvas = this.addCanvasElement(canvas_id, w, h);
		//将canvas插入到video元素前
		this.video.parentNode.insertBefore(this.canvas, this.video);

		var canvasContext = this.canvas.getContext("2d");
		this.frame = new DD.CommentFrame(w, h, canvasContext);
		//从服务器获得弹幕内容
		this.loadDanmus(url);
			/*var danmuInfo = {//test
					'start':this.tc2sec("00:00:04"),
					'end':this.tc2sec("00:00:08"),
					'style':"Static", 
					'text':"中文测试",
					'color':"rgb(255,255,255)",
					//'font':danmu.font
				};
			this.danmus.push(danmuInfo);this.danmus.push(danmuInfo);//<==test*/

		var that = this;
		//在timeupdate事件中，增加往frame中添加要渲染的弹幕的事件
		this.video.addEventListener('timeupdate', function(){
				that.addDanmu();
		}, false);
		this.video.addEventListener('play', function(){
				that.playEvent();
		}, false);
		this.video.addEventListener('pause', function(){
				that.playEvent();
		}, false);
		this.video.addEventListener('ended', function(){
				that.frame.clearDanmu();//清空待绘制弹幕
				that.frame.render();//清空Canvas
		}, false);
		this.video.addEventListener('seeked', function(){
				that.frame.clearDanmu();//清空待绘制弹幕
		}, false);
		
		// true fullscreen
		document.addEventListener("mozfullscreenchange",function(){ 
			//if(!document.mozFullScreen){
				that.fullscreen();
			//}
		}, false);
		document.addEventListener("webkitfullscreenchange",function(){
				that.fullscreen();
		}, false);
		window.addEventListener('resize', function(e){ 
			if(that.isFullscreen && !that.isTrueFullscreen) 
				that.updateFullscreen(); 
		}, false);

		//如果设置了wsUrl，并且浏览器支持，则建立ws链接
		if(wsUrl != null && wsUrl.toLowerCase().indexOf("ws://") == 0){
			//建立websocket
			if(this.ws == null)
				this.setWsConnection(wsUrl);
		}
	},
	/**
	 * 创建canvas元素
	 */
	addCanvasElement: function (canvas_id, width, height) {
		var e = document.createElement("canvas");
		e.id = canvas_id;
		e.style.position = "absolute";
		e.style.zIndex = "10";
		//e.style.right = "0px";
		//e.style.top = "0px";
		e.width = width;
		e.height = height;
		return e;
	},
	/**
	 * 初始化的时候，从服务器获得弹幕内容。
	 * 请求格式http://dd.tv/getDanmus?id=xxx
	 */
	loadDanmus: function(url){
		var loader = new DD.Loader(false);
		loader.load(url, this.parseDanmus, this);
	},
	/**
	 * 将从服务器取得所有弹幕的内容，进行解析，放入this.danmus
	 */
	parseDanmus: function(jsonResp, scope){
		for ( var i = 0; i < jsonResp.length; i++) {
			var danmu = jsonResp[i];
			danmu.start = scope.tc2sec(danmu.start);
			danmu.end = scope.tc2sec(danmu.end);
			/*var danmuInfo = {
					'start':scope.tc2sec(danmu.start),
					'end':scope.tc2sec(danmu.end),
					'style':danmu.style, 
					'text':danmu.text,
					'color':danmu.color,
					'font':danmu.font
				};*/
			scope.danmus.push(danmu);
		}
	},
	/**
	 * 在timeupdate时调用，从this.danmus中找出当前时间(video.currentTime)要播放的弹幕内容，加入渲染的弹幕frame.
	 * 注意timeupdate方法，1秒种只触发4次，也就是说250ms触发一次.
	 */
	addDanmu : function(){
		for(var i=0; i<this.danmus.length; i++){
			if(this.danmus[i].start >= this.video.currentTime && this.danmus[i].start <= (this.video.currentTime + 0.25)){
				var info = this.danmus[i];
				if(info.style == "Custom"){
					this.frame.addCustomSprite(info.clazz, info.param);
				}else{
					this.frame.addSprite(info.text,info.style,info.color,info.font);
				}
			}
		}
	},
	/**
	 * Called when 'play' or 'pause' events are fired
	 */
	playEvent : function(){
		if(this.video.paused){			
			this.frame.stop();
		}else{			
			this.frame.begin();
		}
	},
	/**
	 * 显示/隐藏弹幕的处理函数
	 */
	toggleDanmu : function(){
		if(this.frame.visible){//弹幕可见
			this.frame.clearDanmu();//情况当前所有待渲染弹幕
			this.frame.render();//重绘一帧空的屏幕
			this.frame.stop();//停止Frame
			this.frame.visible = false;//设置弹幕标记为不可见
		}else{//弹幕隐藏
			this.frame.begin();
			this.frame.visible = true;
		}
	},
	/**
	 * Toggle fullscreen, 注意如果浏览器支持真全屏，在全屏的时候resize窗口不会触发window的resize事件。
	 * @return false to prevent default
	 */
	fullscreen : function(){
		if(!this.isFullscreen){//变为全屏				
			if(document.documentElement.requestFullscreen){
				this.isTrueFullscreen = true;
				document.documentElement.requestFullscreen();
			}else if(document.documentElement.mozRequestFullScreen){
				this.isTrueFullscreen = true;
				document.documentElement.mozRequestFullScreen();
			}else if(document.documentElement.webkitRequestFullScreen){
				this.isTrueFullscreen = true;
				document.documentElement.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);  
			}

			if(this.isTrueFullscreen){//如果浏览器支持全屏
				console.log('True fullscreen');
				this.video.style.width = '100%';
				this.video.style.height = (screen.height - 30)+'px';
				document.body.style.overflow = 'hidden';
				
				//更改canvas尺寸
				this.canvas.width = screen.width;
				this.canvas.height = (screen.height - 30);
			}else{//伪全屏
				console.log('Fake fullscreen');
				this.video.style.width = window.innerWidth+'px';
				this.video.style.height = (window.innerHeight - 30)+'px';
				document.body.style.overflow = 'hidden';
				
				//更改canvas尺寸
				this.canvas.width = window.innerWidth;
				this.canvas.height = window.innerHeight;
			}
			this.isFullscreen = true;
			
			//更改绘制弹幕的Frame的尺寸
			this.frame.resize(this.canvas.width, this.canvas.height);
		}else{//退出全屏
			if(document.cancelFullscreen){
				document.cancelFullscreen();  
			}else if(document.exitFullscreen){
				document.exitFullscreen();
			}else if(document.mozCancelFullScreen){
				document.mozCancelFullScreen();  
			}else if(document.webkitCancelFullScreen){
				document.webkitCancelFullScreen();
			}
			
			this.video.style.height = this.videoOriginHeight+'px';
			this.video.style.width = this.videoOriginWidth+'px';
			document.body.style.overflow = 'auto';

			this.isTrueFullscreen = false;
			this.isFullscreen = false;
					
			
			//还原canvas尺寸
			this.canvas.width = this.videoOriginWidth;
			this.canvas.height = this.videoOriginHeight;
			//还原绘制弹幕的Frame的尺寸
			this.frame.resize(this.canvas.width, this.canvas.height);
			this.frame.clearDanmu();//清空一下全屏时播放的弹幕
		}
		
		return false;
	},
		
	/**
	 * If fullscreen, auto-resize the player when the widow is resized
	 * 伪全屏状态时，浏览器窗口尺寸变化的处理函数
	 */
	updateFullscreen : function(){
		this.video.style.width = window.innerWidth+'px';
		this.video.style.height = (window.innerHeight - 30)+'px';
		
		//更改canvas尺寸
		this.canvas.width = window.innerWidth;
		this.canvas.height = window.innerHeight-30;
		//更改绘制弹幕的Frame的尺寸
		this.frame.width = this.canvas.width;
		this.frame.height = this.canvas.height-30;
	},

	setWsConnection: function(url){
		//与实时弹幕服务器建立WebSocket
		if ('WebSocket' in window)  
			this.ws = new WebSocket(url);  
		else if ('MozWebSocket' in window)  
			this.ws = new MozWebSocket(url);  
		else  
			console.warn("WebSocket not support");
		//初始化websocket中的方法，如果浏览器支持websocket
		if(this.ws != null){
			//当连接打开时的事件
			this.ws.onopen = function(evt) {
				console.log("Openened connection to websocket");
			};
			//当连接有信息时的事件
			this.ws.onmessage = function(msg) {
				//解析，加入弹幕准备队列
				this.parseDanmus(msg.data);
			};
		}
	},

	/**
	 * 发送弹幕
	 * @param url 如果是ws://sendDanmu,并且ws链接已建立,则通过ws发送;
	 *			  如果是http://sendDanmu,则通过ajax发送.
	 */
	sendDanmus: function(url,vid,uid,text,style,color,font){
		if(text == null || text.trim() == "") return;//空弹幕返回

		var start = this.video.currentTime;//发送弹幕的时间，x.xxxx秒
		//待发送的内容
		var content = {	'start':this.sec2tc(start),
						'end':this.sec2tc(start+4),
						'style':style,
						'color':color,
						'font':font,
						'text':encodeURIComponent(text),//弹幕内容中文编码一下,推荐使用这个转换最全面,使用encodeURI对'+'不转码,在Java后台URLDecoder.decode的时候'+'会被替换成空格.
						'level':"0",
						'sendTime':new Date().toUTCString(),
						'videoId':vid,
						'userId':uid
					};
		
		if(url.toLowerCase().indexOf("ws://") == 0){
			//建立websocket
			if(this.ws == null)
				this.setWsConnection(url);
			//将javascript对象转换成json字符串，并发送
			if(this.ws != null && this.ws.readyState == WebSocket.OPEN)
				this.ws.send(JSON.stringify(content));
			
		}else{//用ajax方式
			var sender = new XMLHttpRequest();
			sender.open('POST', url);
			sender.setRequestHeader("CONTENT-TYPE","application/json");//POST，且设置数据格式是json，否则服务器会报415错误
			sender.onreadystatechange = function(){
				if(sender.readyState == 4 && (sender.status == 200 || sender.status == 0)){
					console.log("Comment ["+text+"] send succeed");
				}
			};
			sender.send(JSON.stringify(content));//发送请求
		}
		
		//将该对象加入播放弹幕列表
		/*var danmuInfo = {
					'start':this.tc2sec(content.start),
					'end':this.tc2sec(content.end),
					'style':content.style, 
					'text':decodeURIComponent(content.text),
					'color':content.color,
					'font':content.font
				};*/
		content.start = this.tc2sec(content.start);
		content.end = this.tc2sec(content.end);
		content.text = decodeURIComponent(content.text);
		this.danmus.push(content);
		//并加入当前帧立刻进行绘制
		this.frame.addSprite(content.text,content.style,content.color,content.font);
	},

	sendCustomDanmus: function(url,vid,uid,clazz,param){
		var start = this.video.currentTime;//发送弹幕的时间，x.xxxx秒
		//待发送的内容
		var content = {	'start':this.sec2tc(start),
						'style':"Custom",
						'level':"10",
						'sendTime':new Date().toUTCString(),
						'videoId':vid,
						'userId':uid,
						'clazz':encodeURIComponent(clazz),
						'param':encodeURIComponent(param)
					};
		
		if(url.toLowerCase().indexOf("ws://") == 0){
			//建立websocket
			if(this.ws == null)
				this.setWsConnection(url);
			//将javascript对象转换成json字符串，并发送
			if(this.ws != null && this.ws.readyState == WebSocket.OPEN)
				this.ws.send(JSON.stringify(content));
			
		}else{//用ajax方式
			var sender = new XMLHttpRequest();
			sender.open('POST', url);
			sender.setRequestHeader("CONTENT-TYPE","application/json");//POST，且设置数据格式是json，否则服务器会报415错误
			sender.onreadystatechange = function(){
				if(sender.readyState == 4 && (sender.status == 200 || sender.status == 0)){
					console.log("Custom Comment send succeed");
				}
			};
			sender.send(JSON.stringify(content));//发送请求
		}
		
		//将该对象加入播放弹幕列表
		content.start = this.tc2sec(content.start);
		content.clazz = decodeURIComponent(content.clazz);
		content.param = decodeURIComponent(content.param);
		this.danmus.push(content);
		//并加入当前帧立刻进行绘制
		this.frame.addCustomSprite(content.clazz, content.param);
	},

	/** 
	 * Convert HH:MM:SS into seconds
	 * @param {String} timecode A string with the format: HH:MM:SS
	 * @return A number of seconds
	 */
	tc2sec: function(timecode){
		var tab = timecode.split(':');
		return tab[0]*60*60 + tab[1]*60 + (tab.length==3?parseFloat(tab[2].replace(',','.')):0);
	},
	/**
	 * Convert seconds to HH:MM:SS
	 * @param {Integer} nb_sec A number of seconds
	 * @return A time code string
	 */
	sec2tc: function(nb_sec){
		nb_sec = Math.floor(nb_sec);
		var nb_min = 0, nb_hou = 0;
		while(nb_sec - 60  > 0){
			nb_sec = nb_sec - 60;
			nb_min++;
		}
		while(nb_min - 60  > 0){
			nb_min = nb_min - 60;
			nb_hou++;
		}
		var sec = nb_sec.toString();
		if(sec.length==1){
			sec = '0'+sec;
		}
		var min = nb_min.toString();
		if(min.length==1){
			min = '0'+min;
		}
		var hou = nb_hou.toString();
		if(hou.length==1){
			hou = '0'+hou;
		}
		return hou+':'+min+':'+sec;
	}
};