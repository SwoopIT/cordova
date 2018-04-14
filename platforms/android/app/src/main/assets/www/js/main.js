// Globals
var instance, elem, deviceId;
var storeNames = {
	mcd: 'McDonald\'s',
	fdl: 'Foodland',
	kta: 'KTA',
	lnl: 'L&L Barbecue',
	bk: 'Burger King',
	longs: 'Longs Drugs'
};
// Cache
var storesDB, itemsDB, categoriesDB;

$(document).ready(function () {
	elem = document.querySelector('.sidenav');
	instance = M.Sidenav.init(elem, {draggable: true});
	$('.cont-store').click(function (data) {
		console.log(data.currentTarget.id);
		stores(data.currentTarget.id)
	});
	$('#navbar').hide();
	$(document.body).addClass('blue');
	$(document.body).removeClass('grey lighten-4');
	cache();
});

function sideClose() {
	instance.close();
}

function stores(id) {
	$('#navbar').show();
	$(document.body).removeClass('blue');
	$(document.body).addClass('grey lighten-4');
	if (!id) {
		$('#container').html(storesHTML);
		$('#header').html('SwoopIt').addClass('blue-text').removeClass('black-text');
		$('#button').remove()
		$('.cont-store').click(function (data) {
			console.log(data.currentTarget.id);
			stores(data.currentTarget.id)
		});

	} else {
		$('#header').html(storeNames[id]).addClass('black-text').removeClass('blue-text');
		category(id);
	}
	sideClose();
}


function category(id) {
	$('#container').html(categoryHTML);
	for (var i = 0; i < categoriesDB.length; i++) {
		if (categoriesDB[i].store === id) {
			$('#categories').append('<a onclick="loadItems(\'' + categoriesDB[i].id + '\', \'' + id + '\')" class="collection-item black-text">' + categoriesDB[i].name + '<i class="material-icons right">arrow_forward</i></a>');
		}
	}
}

function loadItems(categoryName, storeId) {
	$('#container').html(storePageHTML);
	var storeName = storeNames[storeId];
	for (var i = 0; i < itemsDB.length; i++) {
		if (itemsDB[i].category === categoryName) {
			$('#store-items').append('<a class="collection-item avatar black-text nohover" id="' + itemsDB[i].id + '">' +
				'               <img src="' + itemsDB[i].img + '" alt="' + itemsDB[i].name + '" style="margin-top:10px" class="circle">' +
				'                <span class="title black-text" style="font-weight: bold;">' + itemsDB[i].name + '</span>' +
				'            <p>' +
				'               <text>$' + itemsDB[i].price + '</text>' +
				'                   <text ><i style="margin-top: -10px; border-radius: 50%" class="material-icons right blue-text hover" id="remove-' + itemsDB[i].id + '" onclick="selectFood(this, false)">remove</i></text>' +
				'  <text ><i style="margin-top: -10px; border-radius: 50%" class="material-icons right blue-text hover" id="add-' + itemsDB[i].id + '" onclick="selectFood(this, true)">add</i></text>' +
				'                  <br>' +
				'                 <text style="font-weight: lighter;">' + storeName + '</text><text class="right blue-text" data-item-count="0" id="' + itemsDB[i].id + '-quantity" style="position: relative;transform: translateX(5px);">Quantity: 0</text>' +
				'              </p>' +
				'          </a>')
		}
	}
}

function cart() {
	$('#navbar').show();
	$(document.body).removeClass('blue');
	$(document.body).addClass('grey lighten-4');
	$('#container').html(cartHTML);
	$('#button').remove();
	$('#header').html('Cart').addClass('black-text').removeClass('blue-text');
	$('#nav').append('<ul class="right" id="button">\n' +
		'            <li>\n' +
		'                <a href="#" onclick="payment()"\n' +
		'                   class="blue-text"><i\n' +
		'                        class="material-icons">shopping_basket</i></a>\n' +
		'            </li>\n' +
		'        </ul>');
	$('#menu').html('<a href="#" data-target="slide-out"\n' +
		'                   class="sidenav-trigger blue-text"><i\n' +
		'                        class="material-icons">menu</i></a>');

	sideClose();
}


function orders() {
	$('#navbar').show();
	$(document.body).removeClass('blue');
	$(document.body).addClass('grey lighten-4');
	$('#container').html(ordersHTML);
	$('#button').remove();
	$('#header').html('Orders').addClass('black-text').removeClass('blue-text');
	$('#nav').append('<ul class="right" id="button">\n' +
		'            <li>\n' +
		'                <a href="#" onclick="editOrders()"\n' +
		'                   class="blue-text"><i\n' +
		'                        class="material-icons">edit</i></a>\n' +
		'            </li>\n' +
		'        </ul>');
	sideClose();
}

function settings() {
	$('#navbar').show();
	$(document.body).removeClass('blue');
	$(document.body).addClass('grey lighten-4');
	$('#container').html(settingsHTML);
	$('#header').html('Settings').addClass('black-text').removeClass('blue-text');
	sideClose();
}

function payment() {
	$('#container').html(paymentHTML);
	$('#button').remove();
	$('#header').html('Payment').addClass('black-text').removeClass('blue-text');
	$('#nav').append('<ul class="right" id="button">\n' +
		'            <li>\n' +
		'                <a href="#" onclick="confirmOrder()"\n' +
		'                   class="blue-text"><i\n' +
		'                        class="material-icons">arrow_forward</i></a>\n' +
		'            </li>\n' +
		'        </ul>');
	$('#menu').html('<a href="#" onclick="cart()" \n' +
		'                   class="blue-text"><i\n' +
		'                        class="material-icons">arrow_backwards</i></a>');
	sideClose();
}

function confirmOrder() {
	$('#container').html(confirmHTML);
	$('#button').remove();
	$('#header').html('Confirm').addClass('black-text').removeClass('blue-text');
	$('#nav').append('<ul class="right" id="button">\n' +
		'            <li>\n' +
		'                <a href="#" onclick="submitOrder()"\n' +
		'                   class="blue-text"><i\n' +
		'                        class="material-icons">check</i></a>\n' +
		'            </li>\n' +
		'        </ul>');
	$('#menu').html('<a href="#" onclick="payment()" \n' +
		'                   class="blue-text"><i\n' +
		'                        class="material-icons">arrow_backwards</i></a>');
}

function search() {
	$('#navbar').show();
	$(document.body).removeClass('blue');
	$(document.body).addClass('grey lighten-4');
	$('#container').html(searchHTML);
	$('#header').html('Search').addClass('black-text').removeClass('blue-text');
	var auto = document.querySelector('.autocomplete');
	var complete = M.Autocomplete.init(auto, {
		data: {
			"Arizona": "https://www.mcdonalds.com/is/image/content/dam/usa/nutrition/items/regular/desktop/t-mcdonalds-Fries-Small-Medium.png",
			"Big Mac": "https://www.mcdonalds.com/is/image/content/dam/usa/nutrition/items/regular/desktop/t-mcdonalds-Fries-Small-Medium.png",
			"Fries": "https://www.mcdonalds.com/is/image/content/dam/usa/nutrition/items/regular/desktop/t-mcdonalds-Fries-Small-Medium.png"
		},
		onAutocomplete: function () {
			$('#search-form').submit();
		}
	});
	sideClose()
}

function searchItems(query) {
	$('#search-coll').html('');
	for (var i = 0; i < itemsDB.length; i++) {
		if (itemsDB[i].name.toLowerCase().indexOf(query.toLowerCase()) >= 0) {
			$('#search-coll').append('<a class="collection-item avatar black-text nohover" id="' + itemsDB[i].id + '">' +
				'               <img src="' + itemsDB[i].img + '" alt="' + itemsDB[i].name + '" style="margin-top:10px" class="circle">' +
				'                <span class="title black-text" style="font-weight: bold;">' + itemsDB[i].name + '</span>' +
				'            <p>' +
				'               <text>$' + itemsDB[i].price + '</text>' +
				'                   <text ><i style="margin-top: -10px; border-radius: 50%" class="material-icons right blue-text hover" id="remove-' + itemsDB[i].id + '" onclick="selectFood(this, false)">remove</i></text>' +
				'  <text ><i style="margin-top: -10px; border-radius: 50%" class="material-icons right blue-text hover" id="add-' + itemsDB[i].id + '" onclick="selectFood(this, true)">add</i></text>' +
				'                  <br>' +
				'                 <text style="font-weight: lighter;">' + 'Put something here' + '</text><text class="right blue-text" data-item-count="0" id="' + itemsDB[i].id + '-quantity" style="position: relative;transform: translateX(5px);">Quantity: 0</text>' +
				'              </p>' +
				'          </a>')
		}
	}
}

function selectFood(element) {
	var parent = $(element).closest("a");
	var iconPlus = $('#add-' + parent.prop('id'));
	var iconRemove = $('#remove-' + parent.prop('id'));
	var quantityElement = $('#' + parent.prop('id') + '-quantity');
	var quantity = parseInt(quantityElement.attr('data-item-count'));
	if ($(element).prop('id') === 'add-' + parent.prop('id'))
		quantity++;
	else
		quantity--;
	if (quantity <= 0) {
		quantity = 0;
		iconRemove.css('color', '#b8b8b8')
	} else {
		iconRemove.css('color', '#1cafef')
	}
	quantityElement.attr('data-item-count', quantity);
	quantityElement.html("Quantity: " + quantityElement.attr('data-item-count'))
}


var storePageHTML = '<div class="row">\n' +
	'        <form onsubmit="searchStoreItems(); return false" class="col s12" style="height: 76px;">\n' +
	'            <div class="row">\n' +
	'                <div class="input-field col s12">\n' +
	'                    <i class="material-icons prefix blue-text">search</i>\n' +
	'                    <input id="store-search" type="text" class="validate">\n' +
	'                    <label for="store-search">Search</label>\n' +
	'                </div>\n' +
	'            </div>\n' +
	'        </form>\n' +
	'    </div>' +
	'<div class="collection black-text" id="store-items"></div> ';

var confirmHTML = '<div class="container">\n' +
	'        <div class="container"><br>\n' +
	'            <div class="collection black-text" style="margin-top: -5px">\n' +
	'                <a href="#" class="collection-item black-text">Mac Big</a>\n' +
	'                <a href="#" class="collection-item black-text">Fireworks - Blue Fire</a>\n' +
	'                <a href="#" class="collection-item black-text">Mint Oreo\'s</a>\n' +
	'                <a href="#" class="collection-item black-text">Gordon Ramsey\'s Rat Poison</a>\n' +
	'            </div>\n' +
	'        </div>\n' +
	'        <div class="row center">\n' +
	'            <div class="container">\n' +
	'            <div class="container">\n' +
	'                <b class="left">Subtotal:</b>\n' +
	'                <unicorn class="right">$50.00</unicorn>\n' +
	'                <br>\n' +
	'                <b class="left">Delivery:</b>\n' +
	'                <unicorn class="right">$8.50</unicorn>\n' +
	'                <br>\n' +
	'                <b class="left">Tax:</b>\n' +
	'                <unicorn class="right">$4.50</unicorn>\n' +
	'                <br>\n' +
	'                <hr>\n' +
	'                <h5 class="left" style="font-weight: bold">Total:</h5>\n' +
	'                <h5 class="right" style="font-weight: bold;">$63.00</h5>\n' +
	'            </div>\n' +
	'            </div>\n' +
	'        </div>\n' +
	'    </div>';

var paymentHTML = '<div class="container">' +
	'  <label>Payment Method</label>\n' +
	'  <select class="browser-default">\n' +
	'    <option value="0">Cash on Pickup (17% fee)</option>\n' +
	'    <option value="1">PayPal/Credit Card (15% fee)</option>\n' +
	'  </select>\n' +
	'</div>' +
	'            ';

var ordersHTML = '<div class="collection black-text" style="margin-top: -5px">\n' +
	'        <a href="#" onclick="dropdown(this)" class="collection-item black-text">Today<i class="material-icons right">arrow_drop_down</i></a>\n' +
	'        <a href="#" class="collection-item black-text">2 Hours Ago<i class="material-icons right">arrow_drop_down</i></a>\n' +
	'        <a href="#" class="collection-item black-text">11/11/11<i class="material-icons right">arrow_drop_down</i></a>\n' +
	'        <a href="#" class="collection-item black-text">01/33/07<i class="material-icons right">arrow_drop_down</i></a>\n' +
	'    </div>';

var settingsHTML = '<div class="collection black-text" style="margin-top: -5px">\n' +
	'        <a href="#" onclick="logout()" class="collection-item black-text">Logout</a>\n' +
	'       <a href="#" onclick="cache()" class="collection-item black-text">Refresh Cache</a>\n' +
	'    </div>';


var cartHTML = '<div class="collection black-text" style="margin-top: -5px">\n' +
'        <a href="#" onclick="dropdown(this)" class="collection-item black-text">Today<i class="material-icons right">arrow_drop_down</i></a>\n' +
'        <a href="#" class="collection-item black-text">2 Hours Ago<i class="material-icons right">arrow_drop_down</i></a>\n' +
'        <a href="#" class="collection-item black-text">11/11/11<i class="material-icons right">arrow_drop_down</i></a>\n' +
'        <a href="#" class="collection-item black-text">01/33/07<i class="material-icons right">arrow_drop_down</i></a>\n' +
'    </div>';

var categoryHTML = '<div class="row">\n' +
	'        <form style="height: 85px;" onsubmit="searchStoreItems(); return false" class="col s12">\n' +
	'            <div class="row">\n' +
	'                <div class="input-field col s12">\n' +
	'                    <i class="material-icons prefix blue-text">search</i>\n' +
	'                    <input id="store-search" type="text" class="validate">\n' +
	'                    <label for="store-search">Search</label>\n' +
	'                </div>\n' +
	'            </div>\n' +
	'        </form>\n' +
	'    </div>\n' +
	'    <div class="collection black-text" id="categories" style="margin: -20px 0 0 0;">\n' +
	'    </div>';


var storesHTML = ' <div class="row">\n' +
	'        <form onsubmit="searchStores(); return false" class="col s12" style="height: 76px;">\n' +
	'            <div class="row">\n' +
	'                <div class="input-field col s12">\n' +
	'                    <i class="material-icons prefix blue-text">search</i>\n' +
	'                    <input id="store-search" type="text" class="validate">\n' +
	'                    <label for="store-search">Search</label>\n' +
	'                </div>\n' +
	'            </div>\n' +
	'        </form>\n' +
	'    </div>\n' +
	'    <div class="store-container white white-text">\n' +
	'        <div class="center cont-store store-block" id="mcd" style="background: linear-gradient(rgba(20,20,20, .3),rgba(20,20,20, .3)), url(img/mcd.jpg)">\n' +
	'            <h4 class="" style="z-index: 2; opacity: 1">McDonald\'s</h4>\n' +
	'        </div>\n' +
	'        <div class="center cont-store store-block" id="bk" style="background: linear-gradient(rgba(20,20,20, .3),rgba(20,20,20, .3)), url(img/burger.jpg)">\n' +
	'            <h4 class="" style="z-index: 2; opacity: 1">Burger King</h4>\n' +
	'        </div>\n' +
	'        <div class="center cont-store store-block" id="fdl" style="background: linear-gradient(rgba(20,20,20, .3),rgba(20,20,20, .3)), url(img/food.jpg)">\n' +
	'            <h4 class="" style="z-index: 2; opacity: 1">Foodland</h4>\n' +
	'        </div>\n' +
	'        <div class="center cont-store store-block" id="lnl" style="background: linear-gradient(rgba(20,20,20, .3),rgba(20,20,20, .3)), url(img/lnl.jpg)">\n' +
	'            <h4 class="" style="z-index: 2; opacity: 1">L&L Barbecue</h4>\n' +
	'        </div>\n' +
	'        <div class="center cont-store store-block" id="dom" style="background: linear-gradient(rgba(20,20,20, .3),rgba(20,20,20, .3)), url(img/dom.jpg)">\n' +
	'            <h4 class="" style="z-index: 2; opacity: 1">Dominoes</h4>\n' +
	'        </div>\n' +
	'    </div>';

var searchHTML = '<div class="row">\n' +
	'        <form id="search-form" onsubmit="searchItems($(\'#item-search\').val()); return false" class="col s12" style="height: 76px;">\n' +
	'            <div class="row">\n' +
	'                <div class="input-field col s12">\n' +
	'                    <i class="material-icons prefix blue-text">search</i>\n' +
	'                    <input id="item-search" type="text" class="autocomplete">\n' +
	'                    <label for="item-search">Search</label>\n' +
	'                </div>\n' +
	'            </div>\n' +
	'        </form>\n' +
	'    </div>' +
	'	<div class="collection black-text" id="search-coll" style="margin: -20px 0 0 0;">' +
	'   </div>';


function isAvailable() {
	window.plugins.googleplus.isAvailable(function (avail) {
		if (!avail) {
			alert('There was an error connecting to Google - Please check your internet connection.')
		} else {
			login();
		}
	});
}


function login() {
	window.plugins.googleplus.login(
		{'webClientId': '396697495271-gg53ci7fv0ject8g8neka71c27bhvsql.apps.googleusercontent.com'}, function (user) {
			$.ajaxSetup({
				beforeSend: function (xhr) {
					xhr.setRequestHeader("authentication", user.accessToken);
				}
			});
			$.ajax({
				method: 'post',
				url: 'https://swoop-it.herokuapp.com/api/auth',
				data: {
					googleAuthToken: user.idToken,
					androidId: deviceId,
					iosId: null
				},
				success: function (data) {
					console.log(data);
				}
			});
			console.log(user);
			M.toast({html: 'User ' + user.displayName + ' has logged in.'});
			$('#account').html('<i class="material-icons">person</i>' + user.displayName);
			$('#navbar').show();
			$(document.body).removeClass('blue');
			$(document.body).addClass('grey lighten-4');
			stores();
		},
		function (err) {
			M.toast({html: "There was an error logging in. Code: " + err});
		}
	);
}

function logout() {
	window.plugins.googleplus.disconnect(
		function (msg) {
			alert(msg)
		},
		function (err) {
			alert('There was an error disconnecting your account - Please check your internet connection or update your device. Code: ' + err)
		}
	);
	//todo: go to loginHTML
}

function regDevice(registrationID, oldRegId) {
	$.ajax({
		method: 'post',
		url: 'http://swoop-it.herokuapp.com/api/reg-android',
		data: {
			id: registrationID,
			oldIdL: oldRegId
		},
		success: function (res) {
			console.log(res);
		}
	})
}

function cache() {
	// Get Everything for cache
	$.ajax({
		method: 'get',
		url: 'http://swoop-it.herokuapp.com/api/everything',
		success: function (res) {
			storesDB = res.stores;
			itemsDB = res.items;
			categoriesDB = res.categories;

		}
	})
}

function findObjectByKey(array, key, value) {
	for (var i = 0; i < array.length; i++) {
		if (array[i][key] === value) {
			return array[i];
		}
	}
	return null;
}