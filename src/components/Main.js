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

class AppComponent extends React.Component {
  render() {
    return (
    	<section className="stage">
    		<section className="img-sec">
    			Garry
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
