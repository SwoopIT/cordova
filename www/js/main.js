var instance;
var elem;
$(document).ready(function () {
	elem = document.querySelector('.sidenav');
	instance = M.Sidenav.init(elem, {draggable: true});
	$('.cont-shop').click(function (data) {
		console.log(data.currentTarget.id);
		shops(data.currentTarget.id)
	});
});

function sideClose() {
	instance.close();
}

function shops(name) {
	if (!name) {
		$('#container').html(shopsHTML);
		$('#header').html('SwoopIt').addClass('blue-text').removeClass('black-text');
		$('#button').remove()
	} else {
		$('#header').html(name).addClass('black-text').removeClass('blue-text');
		$('#container').html(name);
	}
	$('.cont-shop').click(function (data) {
		console.log(data.currentTarget.id);
		shops(data.currentTarget.id)
	});
	sideClose();
}

function category() {
	$('#container').html(categoryHTML);
	$('#header').html('Categories').addClass('black-text').removeClass('blue-text');
	$('#button').remove();
	sideClose();
}

function cart() {
	$('#container').html(cartHTML);
	$('#button').remove();
	$('#header').html('Cart').addClass('black-text').removeClass('blue-text');
	$('#nav').append('<ul class="right" id="button">\n' +
		'            <li>\n' +
		'                <a href="#" onclick="checkout()"\n' +
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
	$('#container').html(settingsHTML);
	$('#header').html('Settings').addClass('black-text').removeClass('blue-text');
	sideClose();
}

function checkout() {
	$('#container').html(checkoutHTML);
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
	$('#menu').html('<a href="#" onclick="checkout()" \n' +
		'                   class="blue-text"><i\n' +
		'                        class="material-icons">arrow_backwards</i></a>');
}


var loginHTML = ''

var confirmHTML = '    <div class="container">\n' +
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

var checkoutHTML = '<div class="container">' +
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
	'    </div>';


var cartHTML = '<div class="collection black-text" style="margin-top: -5px">\n' +
	'        <a href="#" class="collection-item black-text">Mac Big<i class="material-icons right">arrow_drop_down</i></a>\n' +
	'        <a href="#" class="collection-item black-text">Fireworks - Blue Fire<i class="material-icons right">arrow_drop_down</i></a>\n' +
	'        <a href="#" class="collection-item black-text">Mint Oreo\'s<i class="material-icons right">arrow_drop_down</i></a>\n' +
	'        <a href="#" class="collection-item black-text">Gordon Ramsey\'s Rat Poison<i class="material-icons right">arrow_drop_down</i></a>\n' +
	'    </div>';

var categoryHTML = '<div class="row">\n' +
	'        <form style="height: 85px;" onsubmit="searchShops()" class="col s12">\n' +
	'            <div class="row">\n' +
	'                <div class="input-field col s12">\n' +
	'                    <i class="material-icons prefix blue-text">search</i>\n' +
	'                    <input id="shop-search" type="text" class="validate">\n' +
	'                    <label for="shop-search">Search</label>\n' +
	'                </div>\n' +
	'            </div>\n' +
	'        </form>\n' +
	'    </div>\n' +
	'    <div class="collection black-text" style="margin: -20px 0 0 0;">\n' +
	'        <a href="#" class="collection-item black-text">Burgers<i class="material-icons right">arrow_forward</i></a>\n' +
	'        <a href="#" class="collection-item black-text">Indoor Food Supplies<i\n' +
	'                class="material-icons right">arrow_forward</i></a>\n' +
	'        <a href="#" class="collection-item black-text">Nerf Launch Codes<i\n' +
	'                class="material-icons right">arrow_forward</i></a>\n' +
	'        <a href="#" class="collection-item black-text">Rat Poison<i class="material-icons right">arrow_forward</i></a>\n' +
	'    </div>';


var shopsHTML = ' <div class="row">\n' +
	'        <form onsubmit="searchShops()" class="col s12" style="height: 76px;">\n' +
	'            <div class="row">\n' +
	'                <div class="input-field col s12">\n' +
	'                    <i class="material-icons prefix blue-text">search</i>\n' +
	'                    <input id="shop-search" type="text" class="validate">\n' +
	'                    <label for="shop-search">Search</label>\n' +
	'                </div>\n' +
	'            </div>\n' +
	'        </form>\n' +
	'    </div>\n' +
	'    <div class="shop-container white white-text">\n' +
	'        <div class="center cont-shop shop-block" id="mcd" style="background: linear-gradient(rgba(20,20,20, .3),rgba(20,20,20, .3)), url(img/mcd.jpg)">\n' +
	'            <h4 class="" style="z-index: 2; opacity: 1">McDonald\'s</h4>\n' +
	'        </div>\n' +
	'        <div class="center cont-shop shop-block" id="kta" style="background: linear-gradient(rgba(20,20,20, .3),rgba(20,20,20, .3)), url(img/kta.jpg)">\n' +
	'            <h4 class="" style="z-index: 2; opacity: 1">KTA</h4>\n' +
	'        </div>\n' +
	'        <div class="center cont-shop shop-block" id="bk" style="background: linear-gradient(rgba(20,20,20, .3),rgba(20,20,20, .3)), url(img/burger.jpg)">\n' +
	'            <h4 class="" style="z-index: 2; opacity: 1">Burger King</h4>\n' +
	'        </div>\n' +
	'        <div class="center cont-shop shop-block" id="food" style="background: linear-gradient(rgba(20,20,20, .3),rgba(20,20,20, .3)), url(img/food.jpg)">\n' +
	'            <h4 class="" style="z-index: 2; opacity: 1">Foodland</h4>\n' +
	'        </div>\n' +
	'        <div class="center cont-shop shop-block" id="longs" style="background: linear-gradient(rgba(20,20,20, .3),rgba(20,20,20, .3)), url(img/longs.jpg)">\n' +
	'            <h4 class="" style="z-index: 2; opacity: 1">Longs Drugs</h4>\n' +
	'        </div>\n' +
	'    </div>';


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
		{}, function (user) {
			//todo: login stuff
			M.toast({html: 'User ' + user.displayName + ' has logged in.'});
			$('#account').html('<i class="material-icons">person</i>' + user.displayName);
			shops();
			console.log(user);
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

window.onerror = function (what, line, file) {
	alert(what + '; ' + line + '; ' + file);
};
