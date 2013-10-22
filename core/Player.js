 /**
 * Player���󣬵�Ļ�������ؼ���
 * @constructor
 * @param {Integer} v_id A video id
 * @param {DOMElement} v_el The video node
 */
DD.Player = function(v_id, v_el){
	this.video_id = v_id;
	this.video = v_el;
	this.isFullscreen = false;
	this.isTrueFullscreen = false;
	//����canvas��ص����
	this.canvas = null;
	this.frame = null;
	//��Ž����õĵ�Ļ����
	this.danmus = [];
	//���ӵ�ʵʱ��Ļ��������websocket	
	this.ws = null;
};

DD.Player.prototype = {
	constructor: DD.Player,
	/**
	 *@param url ����load��Ļ��url[ajax]
	 */
	init: function(canvas_id, url, wsUrl){
		//��ʼ������canvas��ص����
		var w = this.videoOriginWidth = this.video.offsetWidth;//�ؼ��Ŀ�
		var h = this.videoOriginHeight = this.video.offsetHeight;//�ؼ��ĸ�
		this.canvas = this.addCanvasElement(canvas_id, w, h);
		//��canvas���뵽videoԪ��ǰ
		this.video.parentNode.insertBefore(this.canvas, this.video);

		var canvasContext = this.canvas.getContext("2d");
		this.frame = new DD.CommentFrame(w, h, canvasContext);
		//�ӷ�������õ�Ļ����
		this.loadDanmus(url);
			/*var danmuInfo = {//test
					'start':this.tc2sec("00:00:04"),
					'end':this.tc2sec("00:00:08"),
					'style':"Static", 
					'text':"���Ĳ���",
					'color':"rgb(255,255,255)",
					//'font':danmu.font
				};
			this.danmus.push(danmuInfo);this.danmus.push(danmuInfo);//<==test*/

		var that = this;
		//��timeupdate�¼��У�������frame�����Ҫ��Ⱦ�ĵ�Ļ���¼�
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
				that.frame.clearDanmu();//��մ����Ƶ�Ļ
				that.frame.render();//���Canvas
		}, false);
		this.video.addEventListener('seeked', function(){
				that.frame.clearDanmu();//��մ����Ƶ�Ļ
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

		//���������wsUrl�����������֧�֣�����ws����
		if(wsUrl != null && wsUrl.toLowerCase().indexOf("ws://") == 0){
			//����websocket
			if(this.ws == null)
				this.setWsConnection(wsUrl);
		}
	},
	/**
	 * ����canvasԪ��
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
	 * ��ʼ����ʱ�򣬴ӷ�������õ�Ļ���ݡ�
	 * �����ʽhttp://dd.tv/getDanmus?id=xxx
	 */
	loadDanmus: function(url){
		var loader = new DD.Loader(false);
		loader.load(url, this.parseDanmus, this);
	},
	/**
	 * ���ӷ�����ȡ�����е�Ļ�����ݣ����н���������this.danmus
	 */
	parseDanmus: function(jsonResp, scope){
		for ( var i = 0; i < jsonResp.length; i++) {
			var danmu = jsonResp[i];
			var danmuInfo = {
					'start':scope.tc2sec(danmu.start),
					'end':scope.tc2sec(danmu.end),
					'style':danmu.style, 
					'text':danmu.text,
					'color':danmu.color,
					'font':danmu.font
				};
			scope.danmus.push(danmuInfo);
		}
	},
	/**
	 * ��timeupdateʱ���ã���this.danmus���ҳ���ǰʱ��(video.currentTime)Ҫ���ŵĵ�Ļ���ݣ�������Ⱦ�ĵ�Ļframe.
	 * ע��timeupdate������1����ֻ����4�Σ�Ҳ����˵250ms����һ��.
	 */
	addDanmu : function(){
		for(var i=0; i<this.danmus.length; i++){
			if(this.danmus[i].start >= this.video.currentTime && this.danmus[i].start <= (this.video.currentTime + 0.25)){
				var info = this.danmus[i];
				this.frame.addSprite(info.text,info.style,info.color,info.font);
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
	 * ��ʾ/���ص�Ļ�Ĵ�����
	 */
	toggleDanmu : function(){
		if(this.frame.visible){//��Ļ�ɼ�
			this.frame.clearDanmu();//�����ǰ���д���Ⱦ��Ļ
			this.frame.render();//�ػ�һ֡�յ���Ļ
			this.frame.stop();//ֹͣFrame
			this.frame.visible = false;//���õ�Ļ���Ϊ���ɼ�
		}else{//��Ļ����
			this.frame.begin();
			this.frame.visible = true;
		}
	},
	/**
	 * Toggle fullscreen, ע����������֧����ȫ������ȫ����ʱ��resize���ڲ��ᴥ��window��resize�¼���
	 * @return false to prevent default
	 */
	fullscreen : function(){
		if(!this.isFullscreen){//��Ϊȫ��				
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

			if(this.isTrueFullscreen){//��������֧��ȫ��
				console.log('True fullscreen');
				this.video.style.width = '100%';
				this.video.style.height = (screen.height - 30)+'px';
				document.body.style.overflow = 'hidden';
				
				//����canvas�ߴ�
				this.canvas.width = screen.width;
				this.canvas.height = (screen.height - 30);
			}else{//αȫ��
				console.log('Fake fullscreen');
				this.video.style.width = window.innerWidth+'px';
				this.video.style.height = (window.innerHeight - 30)+'px';
				document.body.style.overflow = 'hidden';
				
				//����canvas�ߴ�
				this.canvas.width = window.innerWidth;
				this.canvas.height = window.innerHeight;
			}
			this.isFullscreen = true;
			
			//���Ļ��Ƶ�Ļ��Frame�ĳߴ�
			this.frame.resize(this.canvas.width, this.canvas.height);
		}else{//�˳�ȫ��
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
					
			
			//��ԭcanvas�ߴ�
			this.canvas.width = this.videoOriginWidth;
			this.canvas.height = this.videoOriginHeight;
			//��ԭ���Ƶ�Ļ��Frame�ĳߴ�
			this.frame.resize(this.canvas.width, this.canvas.height);
			this.frame.clearDanmu();//���һ��ȫ��ʱ���ŵĵ�Ļ
		}
		
		return false;
	},
		
	/**
	 * If fullscreen, auto-resize the player when the widow is resized
	 * αȫ��״̬ʱ����������ڳߴ�仯�Ĵ�����
	 */
	updateFullscreen : function(){
		this.video.style.width = window.innerWidth+'px';
		this.video.style.height = (window.innerHeight - 30)+'px';
		
		//����canvas�ߴ�
		this.canvas.width = window.innerWidth;
		this.canvas.height = window.innerHeight-30;
		//���Ļ��Ƶ�Ļ��Frame�ĳߴ�
		this.frame.width = this.canvas.width;
		this.frame.height = this.canvas.height-30;
	},

	setWsConnection: function(url){
		//��ʵʱ��Ļ����������WebSocket
		if ('WebSocket' in window)  
			this.ws = new WebSocket(url);  
		else if ('MozWebSocket' in window)  
			this.ws = new MozWebSocket(url);  
		else  
			console.warn("WebSocket not support");
		//��ʼ��websocket�еķ�������������֧��websocket
		if(this.ws != null){
			//�����Ӵ�ʱ���¼�
			this.ws.onopen = function(evt) {
				console.log("Openened connection to websocket");
			};
			//����������Ϣʱ���¼�
			this.ws.onmessage = function(msg) {
				//���������뵯Ļ׼������
				this.parseDanmus(msg.data);
			};
		}
	},

	/**
	 * ���͵�Ļ
	 * @param url �����ws://sendDanmu,����ws�����ѽ���,��ͨ��ws����;
	 *			  �����http://sendDanmu,��ͨ��ajax����.
	 */
	sendDanmus: function(url,vid,uid,text,style,color,font){
		if(text == null || text.trim() == "") return;//�յ�Ļ����

		var start = this.video.currentTime;//���͵�Ļ��ʱ�䣬x.xxxx��
		//�����͵�����
		var content = {	'start':this.sec2tc(start),
						'end':this.sec2tc(start+4),
						'style':style,
						'color':color,
						'font':font,
						'text':encodeURI(text),//��Ļ�������ı���һ��
						'level':"0",
						'sendTime':new Date().toUTCString(),
						'videoId':vid,
						'userId':uid
					};
		
		if(url.toLowerCase().indexOf("ws://") == 0){
			//����websocket
			if(this.ws == null)
				this.setWsConnection(url);
			//��javascript����ת����json�ַ�����������
			if(this.ws != null && this.ws.readyState == WebSocket.OPEN)
				this.ws.send(JSON.stringify(content));
			
		}else{//��ajax��ʽ
			var sender = new XMLHttpRequest();
			sender.open('POST', url);
			sender.setRequestHeader("CONTENT-TYPE","application/json");//POST�����������ݸ�ʽ��json������������ᱨ415����
			sender.onreadystatechange = function(){
				if(sender.readyState == 4 && (sender.status == 200 || sender.status == 0)){
					console.log("Comment ["+text+"] send succeed");
				}
			};
			sender.send(JSON.stringify(content));//��������
		}
		
		//���ö�����벥�ŵ�Ļ�б�
		var danmuInfo = {
					'start':this.tc2sec(content.start),
					'end':this.tc2sec(content.end),
					'style':content.style, 
					'text':decodeURI(content.text),
					'color':content.color,
					'font':content.font
				};
		this.danmus.push(danmuInfo);
	},
	/** 
	 * Convert HH:MM:SS into seconds
	 * @param {String} timecode A string with the format: HH:MM:SS
	 * @return A number of seconds
	 */
	tc2sec: function(timecode){
		var tab = timecode.split(':');
		return tab[0]*60*60 + tab[1]*60 + parseFloat(tab[2].replace(',','.'));
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