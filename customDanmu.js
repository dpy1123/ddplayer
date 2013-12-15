
CustomComment = function(param){
	DD.Comment.call(this, param);
};

CustomComment.prototype = Object.create(DD.Comment.prototype);

CustomComment.prototype.draw = function(ctx) {
	ctx.save();
	ctx.translate(75,75);

	for (var i=1;i<6;i++){ // Loop through rings (from inside to out)
		ctx.save();
		ctx.fillStyle = 'rgb('+(51*i)+','+(255-51*i)+',255)';
		for (var j=0;j<i*6;j++){ // draw individual dots
		  ctx.rotate(Math.PI*2/(i*6));
		  ctx.beginPath();
		  ctx.arc(0,i*12.5,5,0,Math.PI*2,true);
		  ctx.fill();
		}

		ctx.restore();
	}
	ctx.restore();
};




//=================================

/**
 * �Զ��嵯Ļ�࣬������Ҫ�Ķ�.
 * [object]param ��ʼ������,������x, y, width, height, speed, text, lifeTime, color, font������������Ҫ�Ĳ���,����lifeTime(��λ��֡)�Ǳ���Ҫָ����.
 */
CustomComment = function(param){
	DD.Comment.call(this, param);
};

CustomComment.prototype = Object.create(DD.Comment.prototype);
/**
 * @Override ��ʵ���Զ���Ļ�ͼ
 */
CustomComment.prototype.draw = function(ctx) {
	ctx.save();

	ctx.fillStyle = this.color;
	ctx.rotate(Math.PI/6);
	ctx.fillText("Love", this.x, 0)
	
	ctx.restore();
};
/**
 * @Override 
 * �÷���ÿ֡����һ��,ͨ���ı�״̬,��ʵ�ֶ���Ч��.
 */
CustomComment.prototype.move = function() {
	this.x++;
};