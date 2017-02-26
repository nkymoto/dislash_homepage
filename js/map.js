var initialize = function() {

	// 表示させる座標指定
	var tokyoLatlng2016 = new google.maps.LatLng(35.676787,139.704644);

	// マップの色設定
	var styles = [
		{ "stylers": [
			{ "hue": "#ff0000" },
			{ "saturation": -100 },
			{ "gamma": 1.26 }
		] }
	]

	// 各マップのオプション
	var tokyoOptions2016 = {
		center: tokyoLatlng2016,
		zoom: 15,
		styles: styles,
		mapTypeId: google.maps.MapTypeId.ROADMAP
	};

	// マーカーを画像に
	var map_icon = new google.maps.MarkerImage('/images/ico_pin.png');
	map_icon.scaledSize = new google.maps.Size(30, 45);

	if($('#map-tokyo-2016').length){
		var tokyo2016 = new google.maps.Map(document.getElementById("map-tokyo-2016"),tokyoOptions2016);
		// マーカーのオプション
		var marker = new google.maps.Marker({
			position: tokyoLatlng2016,
			map: tokyo2016,
			icon: map_icon,
			animation: google.maps.Animation.DROP,
			title:"株式会社 DI DLASH 東京オフィス"
		});
	}
}
