export default class CanvasImg {
	load(src, cb) {
		var img = new Image()
		img.onload = ()=> {
			cb(img)
		}
		img.src = src
	}
}
