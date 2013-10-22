/**
 * �������,����flash(ActionScript3.0)�еľ���.
 * ���еĶ���Ԫ�ض�����̳��Դ˶���,�̳�֮���Զ�ӵ��move�������ٶ�����.
 * ÿ������Ԫ�ض�����ӵ��һ���Լ��������draw()������ʵ��,���������������Ⱦÿһ֡��ʱ��ָ���Լ���γ�����canvas֡������
 * ע�������ν��"֡����"����ָԭ����canvasԪ��,����ָ���涨���һ��Frame����,�˶�����������һ��֡,���������Ҫ����һ֡�ϳ��ֵ�
 * ͼ�λ���canvas��,Ȼ��ÿһ֡��ʼ��ʱ�򶼻�����ϴλ���,����flash�е�֡����
 * @param x ��������뻭����λ��
 * @param y
 * @param width ����Ŀ�
 * @param height
 * @returns {Sprite}
 */
DD.Sprite = function(x, y, width, height, speed){
	this.x = x || 0;
	this.y = y || 0;
	this.width = width || 0;
	this.height = height || 0;
	/**
	 * �����ƶ��ٶ�
	 */
	this.speed = speed || {
		x : 0,
		y : 0
	};
};	
DD.Sprite.prototype = {
	constructor: DD.Sprite,

	/**
	 * ÿ�����鶼�������Լ���drawʵ��
	 */
	draw : function() {
		
	},

	/**
	 * ���赥��ʵ��,ͨ�õĶ�������
	 */
	move : function() {
		this.x += this.speed.x;
		this.y += this.speed.y;
		if (this.children != null) {
			for ( var i = 0; i < this.children.length; i++) {
				this.children[i].speed = this.speed;
				this.children[i].move();
			}
		}
	},

	/**
	 * ��˾������һ���Ӿ���
	 */
	appendChild : function(sprite) {
		if (this.children == null){
			this.children = [];
		}
		this.children.push(sprite);
	},

	/**
	 * ��Ⱦ�Ӿ���
	 */
	drawChildren : function() {
		if (this.children != null) {
			for ( var i = 0; i < this.children.length; i++) {
				this.children[i].draw();
			}
		}
	}
};