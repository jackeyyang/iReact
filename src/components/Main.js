require('normalize.css/normalize.css');
require('styles/App.scss');

import React from 'react';

// 图片的json数据
let imageDatas = require('../data/imageDatas.json');

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

// 单幅图片的组件
class ImgFigure extends React.Component {
	render(){
		return (
			<figure>
				<img src={this.props.data.imageURL} 
					 alt={this.props.data.title}
				/>
				<figcaption>
					<h2>{this.props.data.title}</h2>
				</figcaption>
			</figure>
		);
	}
}
// 单幅图件的组件 end

class AppComponent extends React.Component {

	render() {
		var controllerUnits = [],
		imgFigures = [];

		imageDatas.forEach(function(value,index){
			imgFigures.push(<ImgFigure data={value} key={index} />);
		});

		return (
			<section className="stage">
				<section className="img-sec">
					{imgFigures}
				</section>
				<nav className="controller-nav">
				</nav>
			</section>
		);
	}
}

AppComponent.defaultProps = {
};

export default AppComponent;
