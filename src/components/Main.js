require('normalize.css/normalize.css');
require('styles/App.scss');

import React from 'react';
import ReactDOM from 'react-dom';

// 图片的json数据
let imageDatas = require('../data/imageDatas.json');

/**
 * 获取区间的随机值
 * @param  {[type]} low    [description]
 * @param  {[type]} height [description]
 * @return {[type]}        [description]
 */
var getRangeRandom = (low, high) => Math.floor(Math.random() * (high - low) + low);
var get30DegRandom = () => {
	let deg = '';
	deg = (Math.random() > 0.5 ? '+':'-')+Math.ceil(Math.random()*30);
	return deg;
}

// 全部图片路径信息，获得图片路径信息
imageDatas = (function genImageURL(imageDatasArr) {
	for(var i = 0,j = imageDatasArr.length;i < j;i++){
		var singleImageData = imageDatasArr[i];

		singleImageData.imageURL = require('../images/'+ singleImageData.fileName);
		imageDatasArr[i] = singleImageData;
	}
	return imageDatasArr;
})(imageDatas);
console.log(imageDatas);

// 控制组件
class ControllerUnit extends React.Component {
	constructor(props) {
		super(props);
		this.handleClick = this.handleClick.bind(this);
	}

	/*
   	*imgsFigue的点击处理函数
   	*/
	handleClick(e) {
		if(this.props.arrange.isCenter){
			this.props.inverse();
		}else{
			this.props.center();
		}
		
		e.stopPropagation();
		e.preventDefault();
	}

	render() {
		let controllerUnitClassName = 'controller-unit';
		//如果对应的是居中的图片，显示控制按钮的居中态
		if (this.props.arrange.isCenter) {
			controllerUnitClassName += ' is-center ';
			//如果翻转显示翻转状态
			if (this.props.arrange.isInverse) {
				controllerUnitClassName += 'is-inverse'
			}
		}
		return (
		  	<span className={ controllerUnitClassName } onClick={this.handleClick}></span>
		)
	}
}

// 单幅图片的组件
class ImgFigure extends React.Component {
	constructor(props) {
		super(props);
		this.handleClick = this.handleClick.bind(this);
	}

	handleClick(e) {
		if(this.props.arrange.isCenter){
			this.props.inverse();
		}else{
			this.props.center();
		}
		
		e.stopPropagation();
		e.preventDefault();
	}

	render(){
		var styleObj = {};

		if(this.props.arrange.pos){
			styleObj = this.props.arrange.pos;
		}

		if(this.props.arrange.rotate){
			(['Moz', 'Ms', 'Webkit', '']).forEach((value) => {
		        styleObj[value + 'Transform'] = 'rotate(' + this.props.arrange.rotate + 'deg)';
		    })
		};

		if (this.props.arrange.isCenter) {
			styleObj.zIndex = 11;
	    }

		var imgFigureClassName = "img-figure";
			imgFigureClassName += this.props.arrange.isInverse ? ' is-inverse' : '';

		return (
			<figure className={imgFigureClassName} style={styleObj} onClick={this.handleClick}>
				<img src={this.props.data.imageURL}
					 alt={this.props.data.title}
				/>
				<figcaption>
					<h2 className="img-title">{this.props.data.title}</h2>
					<div className="img-back" onClick={this.handleClick}>
						<p>
							{this.props.data.desc}
						</p>
					</div>
				</figcaption>
			</figure>
		);
	}
}
// 单幅图件的组件 end

class AppComponent extends React.Component {
	constructor(props) {
		super(props)
		this.Constant = {
			centerPos: { // 中心图片的位置点
				left:0,
				right:0
			},
			// 图片在舞台中的（x,y）取范围
			hPosRange: { // 水平方向的取值范围
				leftSecX: [0,0], // 左分区的取值，从0到0（初始化全为0）
				rightSecX: [0,0], // 右分区的取值范围
				y: [0,0] // y轴上的左分区和右分区是一样的范围∂
			},
			vPosRange: { // 垂直方向的取值范围 
				x: [0,0],
				topY: [0,0]
			}
		}; // Constant end

		this.state = { // state 变化重新渲染
			imgsArrangeArr: [
				// {
				// 	pos: {
				// 		left: 0,
				// 		top: 0
				// 	},
				// 	rotate: 0,
				//	isInverse: false, // 图片的正反面状，false为正面
				//	isCenter: false // 图片是否是居中的
				// }
			]
		} // state end
	}

	// 翻转图片
	inverse(index) {
		return function(){
			var imgsArrangeArr = this.state.imgsArrangeArr;
			imgsArrangeArr[index].isInverse = !imgsArrangeArr[index].isInverse;
			console.log(1);
			this.setState({
				imgsArrangeArr: imgsArrangeArr
			});
		}.bind(this);
	}

	// 让index的图片居中
	center(index) {
		return function(){
			this.rearrange(index);
		}.bind(this);
	}

	// 重新布局图片
	rearrange(centerIndex){
		var imgsArrangeArr = this.state.imgsArrangeArr,
			Constant = this.Constant,
			centerPos = Constant.centerPos,
			hPosRange = Constant.hPosRange,
			vPosRange = Constant.vPosRange,
			hPosRangeLeftSecX = hPosRange.leftSecX,
			hPosRangeRightSecX = hPosRange.rightSecX,
			hPosRangeY = hPosRange.y,
			vPosRangeX = vPosRange.x,
			vPosRangeTopY = vPosRange.topY,

			imgsArrangeTopArr = [], // 上部图片的状态信息
			topImgNum = Math.ceil(Math.random()*2), // 上部图片放多少张
			topImgSpliceIndex = 0, // 上部图片图片的index值为0
			imgsArrangeCenterArr = imgsArrangeArr.splice(centerIndex,1); // 中心图片

			console.log(centerPos)
			// 居中centerIndex的图片
			imgsArrangeCenterArr[0] = {
				pos: centerPos,
				rotate: 0,
				isCenter: true
			};

			// 取出上侧图片的状态信息
			topImgSpliceIndex = Math.ceil(Math.random() * (imgsArrangeArr.length - topImgNum)); // 随机选择上部选图片
			imgsArrangeTopArr = imgsArrangeArr.splice(topImgSpliceIndex,topImgNum);

			// 布局上侧图片
			imgsArrangeTopArr.forEach(function(value,index){
				imgsArrangeTopArr[index] = {
					pos: {
						left: getRangeRandom(vPosRangeX[0],vPosRangeX[1]),
					    top: getRangeRandom(vPosRangeTopY[0],vPosRangeTopY[1])
					},
					rotate: get30DegRandom(),
					isCenter: false
				}
			});

			// 布局左右两侧的图片
			for(var i = 0,j = imgsArrangeArr.length,k=j/2; i <j;i++){
				var hPosRangeLORX = null;

				// 左侧
				if(i < k){
					hPosRangeLORX = hPosRangeLeftSecX;
				}else{
					hPosRangeLORX = hPosRangeRightSecX;
				}

				imgsArrangeArr[i] = {
					pos: {
						left: getRangeRandom(hPosRangeLORX[0],hPosRangeLORX[1]),
						top: getRangeRandom(hPosRangeY[0],hPosRangeY[1])
					},
					rotate: get30DegRandom(),
					isCenter: false
				}
			}

			if(imgsArrangeTopArr && imgsArrangeTopArr[0]){
				imgsArrangeArr.splice(topImgSpliceIndex,0,imgsArrangeTopArr[0]);
			}

			imgsArrangeArr.splice(centerIndex,0,imgsArrangeCenterArr[0]);

			this.setState({
				imgsArrangeArr: imgsArrangeArr
			});
	}

	componentDidMount() { // 组件初始化成功回调
		// 舞台的大小
		var stageDom = ReactDOM.findDOMNode(this.refs.stage); // 拿到真实DOM的节点
		var stageW = stageDom.scrollWidth,
			stageH = stageDom.scrollHeight,
			halfStageW = Math.ceil(stageW / 2),
			halfStageH = Math.ceil(stageH / 2);

		// 一个imageFigure的大小
		var imgFiguresDom = ReactDOM.findDOMNode(this.refs.imgFigure0);
		var imgW = imgFiguresDom.scrollWidth,
			imgH = imgFiguresDom.scrollHeight,
			halfImgW = Math.ceil(imgW / 2),
			halfImgH = Math.ceil(imgH / 2);

		// 中心图片的坐标点
		this.Constant.centerPos = {
			left: halfStageW - halfImgW,
			top: halfStageH - halfImgW
		}

		// 左侧坐标点X的范围
		this.Constant.hPosRange.leftSecX[0] = -halfImgW; // X从这个起
		this.Constant.hPosRange.leftSecX[1] = halfStageW - halfImgW*3 // 到这个
		// 右侧坐标点X的范围
		this.Constant.hPosRange.rightSecX[0] = halfStageW + halfImgW;
		this.Constant.hPosRange.rightSecX[1] = stageW - halfImgW;

		// Y的取值范围
		this.Constant.hPosRange.y[0] = -halfImgH;
		this.Constant.hPosRange.y[1] =  stageH - halfImgH;


		// 上部的取值范围
		this.Constant.vPosRange.x[0] = halfStageW - imgW;
		this.Constant.vPosRange.x[1] = halfStageW;
		this.Constant.vPosRange.topY[0] = -halfImgH;
		this.Constant.vPosRange.topY[1] = halfStageH - halfImgH * 3;

		let num = Math.floor(Math.random() * 10);
    	this.rearrange(num);
	}

	render() {
		var controllerUnits = [],
		imgFigures = [];

		imageDatas.forEach(function(value,index){

			if(!this.state.imgsArrangeArr[index]){ // 如果没有一个图片的位置信息，则创建一个
				this.state.imgsArrangeArr[index] = {
					pos: {
						left: 0,
						top: 0
					},
					rotate: 0,
					isInverse: false,
					isCenter: false
				}
			}

			imgFigures.push(
				<ImgFigure data={value} 
							key={index} 
							ref={'imgFigure' + index} 
							arrange={this.state.imgsArrangeArr[index]} 
							inverse = {this.inverse(index)}
							center = {this.center(index)}
				/>);
			controllerUnits.push(<ControllerUnit key={index} arrange={this.state.imgsArrangeArr[index]}
                                           inverse={this.inverse(index)}
                                           center={this.center(index)}/>)
		}.bind(this));

		return (
			<section className="stage" ref="stage">
				<section className="img-sec">
					{imgFigures}
				</section>
				<nav className="controller-nav">
					{controllerUnits}
				</nav>
			</section>
		);
	}
}

AppComponent.defaultProps = {
};

export default AppComponent;
