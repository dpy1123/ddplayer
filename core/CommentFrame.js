/**
 * ��Ļframe���󣬼̳���Frame����
 * @param width
 * @param height
 * @param canvasContext
 * @returns
 */
DD.CommentFrame = function(width, height, canvasContext){
	DD.Frame.call(this, width, height, canvasContext);

	/**
	 * ��־��֡�����Ƶĵ�Ļ�ǿɼ���������
	 */
	this.visible = true;	
	/**
	 * ������Ҫ���ƵĶ�㵯Ļ
	 */
	this.layers = [];
	/**
	 * �������廭��
	 */
	this.bufCanvas = document.createElement("canvas");
	this.bufCanvas.width = width;
	this.bufCanvas.height = height;
};
DD.CommentFrame.prototype = Object.create(DD.Frame.prototype);

/**
 * �����ñ�frame�Ŀ�͸ߣ�ͬʱbufCanvas�ߴ�Ҳ��֮�޸�
 * @param width
 * @param height
 */
DD.CommentFrame.prototype.resize = function(width, height) {
	this.width = width;
	this.height = height;
	
	this.bufCanvas.width = width;
	this.bufCanvas.height = height;
};

/**
 * @Override
 * ��Frame����ӵ�Ļ����.
 * �ڱ�Frame�и������ɵ�ĻSprite.����������������seek��ʱ�����¸��ݵ�Ļ��Ϣ����new��Sprite�����xλ���ǶԵģ�
 * �����Playr��new���ˣ��ٸ���ʱ��add������������������seek��ʱ�򣬼ӽ��������Ѵ��ڵĶ�����ʱ�����x�������Ѿ�������ʾ��Χ�ĸ����ˣ����ᱻ�ٴ���ʾ�� 
 */
DD.CommentFrame.prototype.addSprite = function(text, style, color, font) {
	var that = this;
	
	style = style || "Scroll";
	color = color || "rgb(255,255,255)";
	font = font || "normal bold 22px  ����,Microsoft Yahei , ΢���ź� , Tahoma , Arial , Helvetica , STHeiti";

	//���ֵĿ�ȡ�ע�⣬ctx.measureText(text).width�õ����ֿ���ǻ���ctx��ǰ��font�ģ����ȡ��width��ı���ctx.font�ܿ���width��ʵ�����ֿ�Ȳ�ƥ�䡿
	this.bufCanvas.getContext("2d").font = font;
	var width = this.bufCanvas.getContext("2d").measureText(text).width;
	var height = 22;
	var result = generateY(style, height, 0);//���㵯Ļλ�ã��ӵ�0�㵯Ļ��ʼ
	var y = result.y;
	var index = result.index;

	var x = generateX(style, width);
	var lifeTime = 4*60;

	this.layers[index].push(new DD.Comment({
		x: x,
		y: y,
		width: width,
		height: height,
		speed: generateSpeed(style, x, y, lifeTime),
		text: text,
		lifeTime: lifeTime,
		color: color,
		font: font
	}));

	/**
	 * ȷ����Ļ���ٶ�
	 * @param style ��Ļ����
	 * @returns speed{}
	 */
	function generateSpeed(style, x, y, lifeTime){
		if(style == "Scroll"){
			return speed = {
				x : -(x + width)/lifeTime, //-(�ƶ�����+�ı����)/(�ƶ�ʱ��*֡��)
				y : 0
			};
		}else if(style == "Static"){
			return speed = {
				x : 0,
				y : 0
			};
		}
	}

	/**
	 * ȷ����Ļ��X����
	 * @param style ��Ļ����
	 * @param textWidth �õ�Ļ���������ݿ��
	 * @returns x
	 */
	function generateX(style, textWidth){
		if(style == "Scroll"){
			return that.width;
		}else if(style == "Static"){
			return (that.width - textWidth)/2;
		}
	};

	/**
	 * ����Ƿ��뵱ǰFrame��������Ļ�ص�
	 * @param y ����Ļy����
	 * @param size ����Ļ�߶�
	 * @param index ��ǰ�������ڵĵ�Ļ��
	 * @returns {Boolean} true��ʾ���ص�
	 */
	 function checkDanmu(y, size, index){
		var currentLayerDanmus = that.layers[index];//ȡ�õ�ǰ��Ļ�������danmus
		for ( var i = 0; i < currentLayerDanmus.length; i++) {
			var danmu = currentLayerDanmus[i];
			if( y+size > danmu.y && y < danmu.y+danmu.height ){//������ص�
				return true;
			}				
		}
		return false;//û���ص�
	};
	/**
	 * ȷ����Ļ��y����
	 * @param style ��Ļ����
	 * @param size �õ�Ļ�ĸ�(�ֺ�)
	 * @param index ��ǰ�������ڵĵ�Ļ��
	 * @returns {} {'y����':y,'���ڵ�Ļ���index':index}
	 */
	 function generateY(style, size, index){
		if(index > 20) return {'y':0,'index':index-1};//����20��Ͳ���ʾ��

		while(typeof that.layers[index] == "undefined"){//�����ǰ��Ļ�㻹������
			//���ӵ�Ļ��
			that.layers.push(new Array());
		}

		if(style == "Scroll"){//������Ļ�����򶥲��ۼ�,�����ص�
			var y = 0;
			while(y < that.height - size){
				if(checkDanmu(y, size, index)){
					y++;
				}else{//�ҵ�����λ��
					return {'y':y,'index':index};
				}
			}
		}else if(style == "Static"){//�ײ���Ļ������ײ��ۼ�,�����ص�
			var  y = that.height - height - 8;//�ӵײ�-���ָ߶�-�ײ��߾��λ�ÿ�ʼ�����ţ�Ĭ�ϵײ��߾���8.
			while(y > 0){
				if(checkDanmu(y, size, index)){
					y--;
				}else{//�ҵ�����λ��
					return {'y':y,'index':index};
				}
			}
		}
		//û�к���λ�ã��ٴε��ñ�����
		return generateY(style, size, index+1 );
	};
};

/**
 * ��Frame������Զ��嵯Ļ����.Ĭ����Ⱦ�����в�����һ�㼴���ϲ�.
 * @param [string]clazz �Զ��嵯Ļ��
 * @param [string]param ��ʼ������,����Ҫ��lifeTime.eg: "{'lifeTime':4*60}"
 */
DD.CommentFrame.prototype.addCustomSprite = function(clazz, param){
	eval(clazz);
	param = eval('('+param+')');//eval(s),���s���ִ�н����һ��ֵ,�򷵻ش�ֵ,���򷵻�undefined.���������﷨��{}�������ܷ���һ��ֵ,��Ҫ����������������ת��Ϊ���ʽ�����ܷ�����ֵ��
	var customSprite = new CustomComment(param);

	while(typeof this.layers[this.layers.length-1] == "undefined"){//�����ǰ��Ļ�㻹������	
		this.layers.push(new Array());//���ӵ�Ļ��
	}
	this.layers[this.layers.length-1].push(customSprite);
};

/**
 * @Override
 * �Ա�֡���зֲ���Ⱦ
 */
DD.CommentFrame.prototype.render = function() {
	this.ctx.clearRect(0, 0, this.width, this.height);//��ս������
	var bufCanvasCtx = this.bufCanvas.getContext("2d");
	bufCanvasCtx.clearRect(0, 0, this.width, this.height);//���buffer����
	//��Ⱦ���㾫�鵽buffer������
	for ( var i = 0; i < this.layers.length; i++) {
		for (var j = 0; j < this.layers[i].length; j++) {
			this.layers[i][j].draw(bufCanvasCtx);
		}
	}
	//����ͼ���ϻ���bufferͼ��
	this.ctx.drawImage(this.bufCanvas, 0, 0);
};

/**
 * ���������seek�ˣ�������е�Ļ
 */
DD.CommentFrame.prototype.clearDanmu = function() {
	for (var i=0; i < this.layers.length; i++) {
		delete this.layers[i];//ɾ����Ӧ����
	}
	this.layers = [];//��յ�Ļ������
};
/**
 * @Override
 * ����CommentFrame�е�ĻSprite��״̬
 */
DD.CommentFrame.prototype.updateSprite = function() {
	for (var i=0; i < this.layers.length; i++) {			
		for(var j = 0;j < this.layers[i].length; j++){
			//����λ��
			this.layers[i][j].move();
			//��������״̬
			this.layers[i][j].updateLifeTime();		
		}
	}
};
/**
 * @Override
 * ����Ѿ�������Sprite
 */
DD.CommentFrame.prototype.clearSprite = function() {
	for (var i=0; i < this.layers.length; i++) {
		for(var j = 0;j < this.layers[i].length; j++){
			if(!this.layers[i][j].alive){ 
				delete this.layers[i][j];//ɾ����Ӧ����
				this.layers[i] = this.layers[i].slice(0, j).concat(this.layers[i].slice(j+1, this.layers[i].length));//��������и�λ��
			}
		}
	}
};







