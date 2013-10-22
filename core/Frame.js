/**
 * ֡����,ÿ��һ��ʱ���ػ��Լ�һ��,����flash�е�֡����
 * ԭ�����ÿ��һ��ʱ������canvas,Ȼ����õ�ǰ֡������еĶ���Ԫ�ص�draw()����,�����ж���Ԫ�ذ����µ������ػ�
 * �Ӷ����ɶ���,֮������������Ԫ�ص��ػ�,ֻ��Ҫ����Ԫ�����Լ���,���������Զ�����Ԫ�ص���Ⱦ
 */
DD.Frame = function(width, height, canvasContext){
	/**
	 * ֡�Ŀ�͸�
	 */
	this.width = width;
	this.height = height;
	/**
	 * ��¼����frame�Ķ�ʱ��id
	 */
	this.renderTimer = null;
	/**
	 * ��֡��Ҫ���Ƶľ���Ԫ��
	 */
	this.sprites = [];
	/**
	 * ���汾֡��ص�canvas��ǩ��context
	 */
	this.ctx = canvasContext;
};
DD.Frame.prototype = {
	constructor: DD.Frame,

	/**
	 * ��ʼ����
	 */	
	begin:function(){
		if(this.renderTimer != null) return;//��ֹ�ظ�����
		
		//ʹ��html5������requestAnimFrame API
		var that = this;
		( function animate (){
			that.updateSprite();//����Sprite
			that.clearSprite();//�����ЧSprite
			that.render();
			that.renderTimer = requestAnimationFrame(animate, that);
		} )();
	},
	
	/**
	 * ��Ⱦ��֡���ɸ�����Ҫ���Ӷ����и�д�˷�����
	 */
	render:function(){
		this.ctx.clearRect(0, 0, this.width, this.height);
		for (var i=0; i < this.sprites.length; i++) {
			this.sprites[i].draw(this.ctx);
		}
	},
	
	/**
	 * ֹͣ����
	 */
	stop:function(){
		if(this.renderTimer == null) return;
		self.cancelAnimationFrame(this.renderTimer);
		this.renderTimer = null;
	},
	
	/**
	 * ��Ӿ���Ԫ��
	 * @param sprite
	 */
	addSprite:function(sprite){
		this.sprites.push(sprite);
	},
	
	/**
	 * ���±�frame������Sprite��λ�á��ɸ�����Ҫ���Ӷ����и�д�˷�����
	 */
	updateSprite:function(){
		for (var i=0; i < this.sprites.length; i++) {
			this.sprites[i].move();
		}
	},
	
	/**
	 * ���������ʾ��Χ�ľ���Ԫ�ء��ɸ�����Ҫ���Ӷ����и�д�˷�����
	 */
	clearSprite:function(){
		for (var i=0; i < this.sprites.length; i++) {
			if(this.sprites[i].x > this.width || this.sprites[i].y > this.height ||
					this.sprites[i].x+this.sprites[i].width < 0 || 
					this.sprites[i].y+this.sprites[i].height < 0 ){ 
				delete this.sprites[i];//ɾ����Ӧ����
				this.sprites = this.sprites.slice(0, i).concat(this.sprites.slice(i+1, this.sprites.length));//��������и�λ��
			}
		}
	}
};