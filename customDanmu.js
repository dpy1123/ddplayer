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
 * 自定义弹幕类，类名不要改动.
 * [object]param 初始化参数,可配置x, y, width, height, speed, text, lifeTime, color, font和其他任意需要的参数,其中lifeTime(单位是帧)是必须要指定的.
 */
CustomComment = function(param){
	DD.Comment.call(this, param);
};

CustomComment.prototype = Object.create(DD.Comment.prototype);
/**
 * @Override 以实现自定义的绘图
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
 * 该方法每帧调用一次,通过改变状态,来实现动画效果.
 */
CustomComment.prototype.move = function() {
	this.x++;
};