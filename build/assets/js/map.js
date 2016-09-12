// var Map = function(centerOfMap, name, latLng) {
// 		this.centerOfMap = centerOfMap;
// 		this.name = name;
// 		this.latLng = latLng;

// 		console.log(name, latLng)
// 	}

// 	Map.prototype.createElement = function(centerOfMap, name, latLng){

// 		console.log(centerOfMap, name, latLng)

// 		setTimeout(() => {
// 			var map = new google.maps.Map(document.getElementById('map'), {
//           zoom: 13,
//           center: this.centerOfMap
//         });

// 			this.data.forEach(function (venue) {
// 				//es6 destructuring
// 				let [lat, lng] = venue.latLng.split(' ');
// 				let myLatLng = new window.google.maps.LatLng(lat, long);

// 				var marker = new window.google.maps.Marker({
// 					position: myLatLng,
// 					map: map
// 				})

// 				marker.setMap(map)
// 			})

// 		}, 0);

// 	};

// 	Map.prototype.createMapElement = function() {
// 			return `
// 			  <div id="map" style="height:400px; width: 800px;"></div>
// 			`;
// 		}

// export class GoogleMap {
// 	constructor(centerOfMap, name, latLng) {
// 		this.centerOfMap = centerOfMap;
// 		this.name = name;
// 		this.latLng = latLng;

// 		console.log(name, latLng)
// 	}

// 	createElement(){

// 		setTimeout(() => {
// 			var map = new google.maps.Map(document.getElementById('map'), {
//           zoom: 13,
//           center: this.centerOfMap
//         });

// 			for (let vehicle of this.data) {
// 				//es6 destructuring
// 				let [lat, long] = vehicle.latLong.split(' ');
// 				let myLatLng = new window.google.maps.LatLng(lat, long);

// 				var marker = new window.google.maps.Marker({
// 					position: myLatLng,
// 					map: map
// 				})

// 				marker.setMap(map)
// 			}
// 		}, 0);

// 	};

// 	getElementString() {
// 		return `
// 		  <div id="map" style="height:400px; width: 800px;"></div>
// 		`;
// 	}

// }		
"use strict";