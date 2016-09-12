var baseURL = "https://api.foursquare.com/v2/venues/search";
var clientID ="?client_id=HCTUKRIVEDV3VH5BKEOK0LI0HMF23YQOQ4AY5HX0Y2RMW4DJ";
var clientSecret = "&client_secret=OWNAX2PFLETLPXL0OQJHVONRAL3SIJNCOWNL1V40OXADLJQU";
var version = "&v=20150223";

var map = new google.maps.Map(document.getElementById('map'), {
      zoom: 12,
      center: {lat: 40.783661, lng: -73.965883}
    });

$('#form').submit(function(event) {
	event.preventDefault();

	var $city = $("#user-city");
  var $state = $("#user-state");
  var $food = $("#user-restaurant");
  var locale = "&near=" + $city.val() + "," + $state.val() ;
 	var cuisine = "&query=" + $food.val();

 	var query = clientID + clientSecret + version + locale + cuisine;

 	getResults(query);
});



function getResults(query) {
	$.ajax({
		url: baseURL + query,
		dataType: 'json',
		success: function(data) {
			let r = new resultParser();
			r.loopObjects(data);
		}
		// fail(function(xhr, status, errorThrown ) {
	})
}


class Venue {
	constructor(args){
		this.name = args.name;
		this.phone = args.phone;
		this.address = args.address;
		this.twitter = args.twitter != null ?  'https://twitter.com/' +  args.twitter : null;
		this.formattedAddress = args.formattedAddress;
		this.seamless = args.seamless;
		this.menu = args.menu;
		this.url = this.url;
		this.latLng = args.latLng;


		this.venueList = [];
		this.links = [this.seamless, this.menu, this.url, this.twitter];

		this.$el = $('<div class="list-group-item">');
		this.createVenueListItem()
		this.addVenueToMap(this.name, this.latLng)

	}

	createVenueListItem() {
		this.links = this.links.filter(this.filterLinks)
		// console.log(links)
		this.addVenueToList()
	}

	filterLinks(link) {
		if (link != null ) {
			return true;
		}
		else {
			return false;
		} 
	}

	addVenueToList() {
		let li = this.compileVenueListItem();
		this.$el.prepend(li)
		let venueItem = new venueShow()
		venueItem.add(this.$el)
	}

	addVenueToMap(name, latLng) {
		let mapData = [];

			mapData.push({
				latLng: latLng,
				name: name

			})

   mapData.forEach(function(data, index) {
   	 let name = data['name']
   	 let latLng =  data['latLng']
   	 let venue = {
   	 	name: name,
   	 	latLng: latLng
   	 }
   	 var map = new GoogleMap(venue);
   })
		
	}

	compileVenueListItem() {
		let linksArr = [];
		let links = '';

		this.links.forEach(function(link, index) {
			if (link.indexOf('seamless') > -1) {
	
				 linksArr.push({
						title: 'seamless',
						href: link
					});
			}
			else if (link.indexOf('twitter') > -1) {
	
				 linksArr.push({
						title: 'twitter',
						href: link
					});
			}
			else if (link.indexOf('foursquare') > -1) {
	
				 linksArr.push({
						title: 'menu',
						href: link
					});
			}
			else {
			  linksArr.push({
					title: 'website',
					href: link
				});
			}

		})

	for (let link of linksArr) {
		console.log(link)
		links += `<a href="${link['href']}" target="_blank" class="btn btn-default">${link['title']}</a>`
	}

	return `
			<h4 class="list-group-item-heading">${this.name}</h4>
			<p class="list-group-item-text">
				<span class="glyphicon glyphicon-earphone" aria-hidden="true"></span> ${this.phone}
			</p>
			<p class="list-group-item-text">
				<span class="glyphicon glyphicon-home" aria-hidden="true"></span> ${this.formattedAddress}
			</p>
			${links}
	`
	}

}

class venueShow {
	constructor(){
		this.$list = $('#search-results')
	}

	add(venue){
		this.$list.prepend(venue)
	}
}

class resultParser {
	constructor() {
		this.parsedVenues = [];

	}

	createVenue() {
		this.parsedVenues.forEach(function(venueItem, index) {
			let venue = new Venue(venueItem);
		});
	}

	loopObjects(data) {
		let objects = data['response']['venues'];
	
		objects.forEach(function(venueItem, index) {
				this.parsedVenues.push(this.parseVenue(venueItem))
		}.bind(this))

		this.createVenue()
	}

	parseVenue(venue) {
		let seamless = venue['delivery'] ? venue['delivery']['url'] : null;
		// console.log(venue)
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
		}
	}

}

class GoogleMap {
	constructor(data) {
		this.centerOfMap = {lat: 40.731, lng: -73.997}
		this.venueData = [];
		this.venueData.push(data)

		this.markers = [];
		this.marker;
    this.highlightedIcon = this.makeMarkerIcon('FFFF24');
    this.defaultIcon = this.makeMarkerIcon('0091ff');
    this.largeInfowindow = new google.maps.InfoWindow();
		this.createElement()
	}

	createElement(){
   
		for (var i = 0; i < this.venueData.length; i++) {
			let [lat, long] = this.venueData[i]['latLng'].split(' ');
			let myLatLng = new window.google.maps.LatLng(lat, long);
			let title = this.venueData[i]['name']

			this.marker = new window.google.maps.Marker({
				position: myLatLng,
				title: title,
				animation: google.maps.Animation.DROP,
				id: i,
				map: map
			})

			this.markers.push(this.marker);

			// Create an onclick event to open the large infowindow at each marker.
	    this.marker.addListener('click', function() {
	      this.populateInfoWindow(this.marker, this.largeInfowindow);
	    }.bind(this));
	    // Two event listeners - one for mouseover, one for mouseout,
	    // to change the colors back and forth.
	    this.marker.addListener('mouseover', function() {
	      this.setIcon(this.highlightedIcon);
	    });

	    this.marker.addListener('mouseout', function() {
	      this.setIcon(this.defaultIcon);
	    });

	   }

    this.showListings()
			
	};

   // This function populates the infowindow when the marker is clicked. Only allow
  // one infowindow which will open at the marker that is clicked, and populate based
  // on that markers position.
  populateInfoWindow(marker, infowindow) {
    // Check to make sure the infowindow is not already opened on this marker.
    if (infowindow.marker != marker) {
	      infowindow.marker = marker;
	      infowindow.setContent('<div>' + marker.title + '</div>');
	      infowindow.open(map, marker);
	      // Make sure the marker property is cleared if the infowindow is closed.
	      infowindow.addListener('closeclick', function() {
        	infowindow.marker = null;
      });
    }
  }
  // This function will loop through the markers array and display them all.
  showListings() {
    var bounds = new google.maps.LatLngBounds();
    // Extend the boundaries of the map for each marker and display the marker
    for (var i = 0; i < this.markers.length; i++) {
      this.markers[i].setMap(map);
      
      bounds.extend(this.markers[i].position);
    }
    map.setCenter(bounds.getCenter());
  }
  // This function will loop through the listings and hide them all.
  hideListings() {
    for (var i = 0; i < this.markers.length; i++) {
      this.markers[i].setMap(null);
    }
  }
  // This function takes in a COLOR, and then creates a new marker
  // icon of that color. The icon will be 21 px wide by 34 high, have an origin
  // of 0, 0 and be anchored at 10, 34).
  makeMarkerIcon(markerColor) {
    var markerImage = new google.maps.MarkerImage(
      'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|'+ markerColor +
      '|40|_|%E2%80%A2',
      new google.maps.Size(21, 34),
      new google.maps.Point(0, 0),
      new google.maps.Point(10, 34),
      new google.maps.Size(21,34));
    return markerImage;
  }

}	






//TODO
// create ui class for social links that returns links such as twitter seamless if available as well as component to add to favorites list. When on favorite list you then have ability to remove res object from list.
// add fail function if api doesnt return results
// Nice to have: add class for fave venue list where user can add or delete restaurants
// style
//DONE



