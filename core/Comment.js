/**
 * ��Ļ���󣬼̳���Sprite����
 * @param param = {x, y, width, height, speed, text, lifeTime, color, font} 
 */
DD.Comment = function(param){

	DD.Sprite.call(this, param.x, param.y, param.width, param.height, param.speed);

	this.text = param.text || "";//��������
	this.lifeTime = param.lifeTime || 0;
	this.color = param.color || "rgb(255,255,255)";
	this.font = param.font || "normal bold 22px ����ϸ��";
	this.alive = true;//����״̬
};

DD.Comment.prototype = Object.create(DD.Sprite.prototype);
/**
 * ��Ļ�Ļ��Ʒ���
 */
DD.Comment.prototype.draw = function(canvasContext) {
//	canvasContext.save();//������ʽ��ÿ�ֵ�Ļ�����Լ�����ʽ��Ϊ������ܣ�ע�͵�ctx״̬�ı���ͻָ���
	canvasContext.fillStyle = this.color;
	//������Ӱ
//	canvasContext.shadowColor = "#808080";
//	canvasContext.shadowOffsetX = 1;
//	canvasContext.shadowOffsetY = 1;
//	canvasContext.shadowBlur = 1;
	canvasContext.font = this.font;
	canvasContext.fillText(this.text, this.x, this.y + this.height);//fillText(x,y)��λ��ê������Ļ�����½�
//	canvasContext.restore();//��ԭԭ����ʽ
};

/**
 * ���µ�Ļ������״̬
 */
DD.Comment.prototype.updateLifeTime = function() {
	this.lifeTime--;//ÿˢ��һ֡�����ʱ��-1
	this.alive = (this.lifeTime >= 0);
};