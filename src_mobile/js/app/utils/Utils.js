class Utils {
	static NormalizeMouseCoords(e, objWrapper) {
		var posx = 0;
		var posy = 0;
		if (!e) var e = window.event;
		if (e.pageX || e.pageY) 	{
			posx = e.pageX;
			posy = e.pageY;
		}
		else if (e.clientX || e.clientY) 	{
			posx = e.clientX + document.body.scrollLeft
				+ document.documentElement.scrollLeft;
			posy = e.clientY + document.body.scrollTop
				+ document.documentElement.scrollTop;
		}
		objWrapper.x = posx
		objWrapper.y = posy
		return objWrapper
	}
	static ResizePositionProportionally(windowW, windowH, contentW, contentH) {
		var aspectRatio = contentW / contentH
		var scale = ((windowW / windowH) < aspectRatio) ? (windowH / contentH) * 1 : (windowW / contentW) * 1
		var newW = contentW * scale
		var newH = contentH * scale
		var css = {
			width: newW,
			height: newH,
			left: (windowW >> 1) - (newW >> 1),
			top: (windowH >> 1) - (newH >> 1)
		}
		
		return css
	}
	static CapitalizeFirstLetter(string) {
	    return string.charAt(0).toUpperCase() + string.slice(1);
	}
	static Style(div, style) {
    	div.style.webkitTransform = style
		div.style.mozTransform    = style
		div.style.msTransform     = style
		div.style.oTransform      = style
		div.style.transform       = style
    }
    static Translate(div, x, y, z) {

    	if ('webkitTransform' in document.body.style || 'mozTransform' in document.body.style || 'oTransform' in document.body.style || 'transform' in document.body.style) {
    		Utils.Style(div, 'translate3d('+x+'px,'+y+'px,'+z+'px)')
		}else{
			$(div).css({
				top:y,
				left:x
			})
		}

    }
    static TranformArrayFromMiddleAndOut(array) {
        var newArray = []
        var i = Math.ceil(array.length/2)
        var j = i - 1
        while(j >= 0) {
        	newArray.push(array[j--])
            if(i < array.length) {
            	newArray.push(array[i++])
            }
        }
        return newArray
    }
    static Rand(min, max, decimals) {
        var randomNum = Math.random() * (max - min) + min
        if(decimals == undefined) {
        	return randomNum
        }else{
	        var d = Math.pow(10, decimals)
	        return ~~((d * randomNum) + 0.5) / d
        }
	}
}

export default Utils
