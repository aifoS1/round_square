"use strict";

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var baseURL = "https://api.foursquare.com/v2/venues/search";
var clientID = "?client_id=HCTUKRIVEDV3VH5BKEOK0LI0HMF23YQOQ4AY5HX0Y2RMW4DJ";
var clientSecret = "&client_secret=OWNAX2PFLETLPXL0OQJHVONRAL3SIJNCOWNL1V40OXADLJQU";
var version = "&v=20150223";

var map = new google.maps.Map(document.getElementById('map'), {
	zoom: 12,
	center: { lat: 40.783661, lng: -73.965883 }
});

$('#form').submit(function (event) {
	event.preventDefault();

	var $city = $("#user-city");
	var $state = $("#user-state");
	var $food = $("#user-restaurant");
	var locale = "&near=" + $city.val() + "," + $state.val();
	var cuisine = "&query=" + $food.val();

	var query = clientID + clientSecret + version + locale + cuisine;

	getResults(query);
});

function getResults(query) {
	$.ajax({
		url: baseURL + query,
		dataType: 'json',
		success: function success(data) {
			var r = new resultParser();
			r.loopObjects(data);
		}
		// fail(function(xhr, status, errorThrown ) {
	});
}

var resultParser = function () {
	function resultParser() {
		_classCallCheck(this, resultParser);

		this.parsedVenues = [];
	}

	_createClass(resultParser, [{
		key: "createVenue",
		value: function createVenue() {
			this.parsedVenues.forEach(function (venueItem, index) {
				var venue = new Venue(venueItem);
			});
		}
	}, {
		key: "loopObjects",
		value: function loopObjects(data) {
			var objects = data['response']['venues'];

			objects.forEach(function (venueItem, index) {
				this.parsedVenues.push(this.parseVenue(venueItem));
			}.bind(this));

			this.createVenue();
		}
	}, {
		key: "parseVenue",
		value: function parseVenue(venue) {
			var seamless = venue['delivery'] ? venue['delivery']['url'] : null;

			return {
				name: venue['name'],
				phone: venue['contact']['phone'] || null,
				address: venue['location']['address'] || null,
				formattedAddress: venue['location']['address'] + ', ' + venue['location']['formattedAddress'][1] || null,
				twitter: venue['contact']['twitter'] || null,
				menu: venue['hasMenu'] ? venue['menu']['url'] : null,
				seamless: seamless,
				url: venue['url'] || null,
				latLng: venue['location']['lat'] + ' ' + venue['location']['lng']
			};
		}
	}]);

	return resultParser;
}();

var Venue = function () {
	function Venue(args) {
		_classCallCheck(this, Venue);

		this.name = args.name;
		this.phone = args.phone;
		this.address = args.address;
		this.twitter = args.twitter != null ? 'https://twitter.com/' + args.twitter : null;
		this.formattedAddress = args.formattedAddress;
		this.seamless = args.seamless;
		this.menu = args.menu;
		this.url = this.url;
		this.latLng = args.latLng;

		this.venueList = [];
		this.links = [this.seamless, this.menu, this.url, this.twitter];

		this.$el = $('<div class="list-group-item">');
		this.createVenueListItem();
		this.addVenueToMap(this.name, this.latLng);
	}

	_createClass(Venue, [{
		key: "createVenueListItem",
		value: function createVenueListItem() {
			this.links = this.links.filter(this.filterLinks);
			this.addVenueToList();
		}
	}, {
		key: "filterLinks",
		value: function filterLinks(link) {
			if (link != null) {
				return true;
			} else {
				return false;
			}
		}
	}, {
		key: "addVenueToList",
		value: function addVenueToList() {
			var li = this.compileVenueListItem();
			this.$el.prepend(li);
			var venueItem = new venueShow();
			venueItem.add(this.$el);
		}
	}, {
		key: "addVenueToMap",
		value: function addVenueToMap(name, latLng) {
			var mapData = [];

			mapData.push({
				latLng: latLng,
				name: name

			});

			mapData.forEach(function (data, index) {
				var name = data['name'];
				var latLng = data['latLng'];
				var venue = {
					name: name,
					latLng: latLng
				};
				var map = new GoogleMap(venue);
			});
		}
	}, {
		key: "compileVenueListItem",
		value: function compileVenueListItem() {
			var linksArr = [];
			var links = '';

			this.links.forEach(function (link, index) {
				if (link.indexOf('seamless') > -1) {

					linksArr.push({
						title: 'seamless',
						href: link
					});
				} else if (link.indexOf('twitter') > -1) {

					linksArr.push({
						title: 'twitter',
						href: link
					});
				} else if (link.indexOf('foursquare') > -1) {

					linksArr.push({
						title: 'menu',
						href: link
					});
				} else {
					linksArr.push({
						title: 'website',
						href: link
					});
				}
			});

			var _iteratorNormalCompletion = true;
			var _didIteratorError = false;
			var _iteratorError = undefined;

			try {
				for (var _iterator = linksArr[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
					var link = _step.value;


					links += "<a href=\"" + link['href'] + "\" target=\"_blank\" class=\"btn btn-default\">" + link['title'] + "</a>";
				}
			} catch (err) {
				_didIteratorError = true;
				_iteratorError = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion && _iterator.return) {
						_iterator.return();
					}
				} finally {
					if (_didIteratorError) {
						throw _iteratorError;
					}
				}
			}

			return "\n\t\t\t<h4 class=\"list-group-item-heading\">" + this.name + "</h4>\n\t\t\t<p class=\"list-group-item-text\">\n\t\t\t\t<span class=\"glyphicon glyphicon-earphone\" aria-hidden=\"true\"></span> " + this.phone + "\n\t\t\t</p>\n\t\t\t<p class=\"list-group-item-text\">\n\t\t\t\t<span class=\"glyphicon glyphicon-home\" aria-hidden=\"true\"></span> " + this.formattedAddress + "\n\t\t\t</p>\n\t\t\t" + links + "\n\t";
		}
	}]);

	return Venue;
}();

var venueShow = function () {
	function venueShow() {
		_classCallCheck(this, venueShow);

		this.$list = $('#search-results');
	}

	_createClass(venueShow, [{
		key: "add",
		value: function add(venue) {
			this.$list.prepend(venue);
		}
	}]);

	return venueShow;
}();

var GoogleMap = function () {
	function GoogleMap(data) {
		_classCallCheck(this, GoogleMap);

		this.centerOfMap = { lat: 40.731, lng: -73.997 };
		this.venueData = [];
		this.venueData.push(data);

		this.markers = [];
		this.marker;
		this.largeInfowindow = new google.maps.InfoWindow();

		this.createElement();
	}

	_createClass(GoogleMap, [{
		key: "createElement",
		value: function createElement() {

			for (var i = 0; i < this.venueData.length; i++) {
				var _venueData$i$latLng$s = this.venueData[i]['latLng'].split(' ');

				var _venueData$i$latLng$s2 = _slicedToArray(_venueData$i$latLng$s, 2);

				var lat = _venueData$i$latLng$s2[0];
				var long = _venueData$i$latLng$s2[1];

				var myLatLng = new window.google.maps.LatLng(lat, long);
				var title = this.venueData[i]['name'];

				this.marker = new window.google.maps.Marker({
					position: myLatLng,
					title: title,
					animation: google.maps.Animation.DROP,
					id: i,
					map: map
				});

				this.markers.push(this.marker);

				// Create an onclick event to open the large infowindow at each marker.
				this.marker.addListener('click', function () {
					this.populateInfoWindow(this.marker, this.largeInfowindow);
				}.bind(this));
			}

			this.showListings();
		}
	}, {
		key: "populateInfoWindow",


		// This function populates the infowindow when the marker is clicked. Only allow
		// one infowindow which will open at the marker that is clicked, and populate based
		// on that markers position.
		value: function populateInfoWindow(marker, infowindow) {
			// Check to make sure the infowindow is not already opened on this marker.
			if (infowindow.marker != marker) {
				infowindow.marker = marker;
				infowindow.setContent('<div>' + marker.title + '</div>');
				infowindow.open(map, marker);
				// Make sure the marker property is cleared if the infowindow is closed.
				infowindow.addListener('closeclick', function () {
					infowindow.marker = null;
				});
			}
		}
		// This function will loop through the markers array and display them all.

	}, {
		key: "showListings",
		value: function showListings() {
			var bounds = new google.maps.LatLngBounds();
			// Extend the boundaries of the map for each marker and display the marker
			for (var i = 0; i < this.markers.length; i++) {
				this.markers[i].setMap(map);

				bounds.extend(this.markers[i].position);
			}
			map.setCenter(bounds.getCenter());
		}
	}]);

	return GoogleMap;
}();

//TODO
// create ui class for social links that returns links such as twitter seamless if available as well as component to add to favorites list. When on favorite list you then have ability to remove res object from list.
// add fail function if api doesnt return results
// Nice to have: add class for fave venue list where user can add or delete restaurants
// style