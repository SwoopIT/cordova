// Globals
var instance, elem, deviceId, shoppingCart = [];
$.ajaxSetup({
	beforeSend: function (xhr) {
		xhr.setRequestHeader("authentication", 0);
	}
});
var userSettings = [];
var storeNames = {
	mcd: 'McDonald\'s',
	fdl: 'Foodland',
	kta: 'KTA',
	lnl: 'L&L Barbecue',
	bk: 'Burger King',
	longs: 'Longs Drugs'
};
// Cache
var storesDB, itemsDB, categoriesDB, confirmModal, modal;

$(document).ready(function () {
	elem = document.querySelector('.sidenav');
	instance = M.Sidenav.init(elem, {draggable: true});
	modal = document.querySelector('.modal');
	confirmModal = M.Modal.init(modal, {});
	$('.cont-store').click(function (data) {
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

function submitOrder(paymentMethod) {
	var itemsArray = [];
	if (!shoppingCart[0]) return M.toast({html: 'LOL You have nothing in your cart! xD'});
	for (var i = 0; i < shoppingCart.length; i++) {
		itemsArray.push(shoppingCart[i].id);
	}
	$.ajax({
		method: 'post',
		dataType: 'json',
		contentType: "application/json",
		data: JSON.stringify({
			items: itemsArray,
			paymentMethod: parseInt(paymentMethod)
		}),
		url: 'https://swoop-it.herokuapp.com/api/order',
		success: function (data) {
			if (data) {
				M.toast({html: 'Successfully submitted order! Check the status on the <a onclick="orders()" class="toast-action">Orders Page</a>.'})
			} else {
				M.toast({html: 'Order failed. Are you <a onclick="login()" class="toast-action">logged in</a>?'})
			}
		}
	})
}

function stores(id) {
	$('#cart-footer').hide();
	$('#navbar').show();
	$(document.body).removeClass('blue');
	$(document.body).addClass('grey lighten-4');
	if (!id) {
		$('#container').html(storesHTML);
		$('#header').html('SwoopIt').addClass('blue-text').removeClass('black-text');
		$('#button').remove();
		$('#menu').html('<a href="#" data-target="slide-out" class="sidenav-trigger blue-text"><i class="material-icons">menu</i></a>');
		$('.cont-store').click(function (data) {
			stores(data.currentTarget.id)
		});

	} else {
		$('#header').html(storeNames[id]).addClass('black-text').removeClass('blue-text');
		category(id);
	}
	sideClose();
}


function category(id) {

	$('#menu').html('<a onclick="stores();" \n' +
		'                   class="blue-text"><i\n' +
		'                        class="material-icons">arrow_back</i></a>');
	$('#container').html(categoryHTML);
	for (var i = 0; i < categoriesDB.length; i++) {
		if (categoriesDB[i].store === id) {
			$('#categories').append('<a onclick="loadItems(\'' + categoriesDB[i].id + '\', \'' + id + '\')" class="collection-item black-text">' + categoriesDB[i].name + '<i class="material-icons right">arrow_forward</i></a>');
		}
	}
}

function loadItems(categoryName, storeId) {
	$('#container').html(storePageHTML);
	$('#menu').html('<a onclick="stores(\'' + storeId + '\');" \n' +
		'                   class="blue-text"><i\n' +
		'                        class="material-icons">arrow_back</i></a>');
	var storeName = storeNames[storeId];
	for (var i = 0; i < itemsDB.length; i++) {
		if (itemsDB[i].category === categoryName) {
			$('#store-items').append('<a class="collection-item avatar black-text nohover" id="' + itemsDB[i].id + '">' +
				'               <img src="' + itemsDB[i].img + '" alt="' + itemsDB[i].name + '" style="margin-top:10px" class="circle">' +
				'                <span class="title black-text" style="font-weight: bold;">' + itemsDB[i].name + '</span>' +
				'            <p id="' + itemsDB[i].id + '-data">' +
				'               <text>$' + itemsDB[i].price + '</text>' +
				'                  <br>' +
				'                 <text style="font-weight: lighter;">' + 'Put something here' + '</text>' +
				'				  <text class="right blue-text" data-item-count="0" id="' + itemsDB[i].id + '-quantity" style="position: relative;transform: translateX(5px); margin-top: 3px" onclick="addItem(this, true)">Add to Cart</text>' +
				'              </p>' +
				'          </a>');
			var cartItems = shoppingCart.filter(function (x) {
				return itemsDB[i].id == x.id
			}).length;
			if (cartItems > 0) {
				addItem($('#' + itemsDB[i].id + '-quantity'), false);
				$('#' + itemsDB[i].id + '-quantity').attr('data-item-count', cartItems);
				$('#input-' + itemsDB[i].id).val(cartItems)
			}
		}
	}
}

function getCategory(id) {
	for (var i = 0; i < categoriesDB.length; i++)
		if (categoriesDB[i].id == id)
			return categoriesDB[i];
	return null;
}

function cart() {
	$('#cart-footer').hide();
	$('#navbar').show();
	$('#button').remove();
	$(document.body).removeClass('blue');
	$(document.body).addClass('grey lighten-4');
	$('#container').html(cartHTML);
	var shoppingElement = $('#shopping-cart');
	if (shoppingCart[0]) {
		var subtotal = 0;

		var stores = {};
		for (var i = 0; i < shoppingCart.length; i++) {
			var store = getCategory(shoppingCart[i].category).store;
			if (!stores[store]) {
				stores[store] = [];
			}

			stores[store].push(shoppingCart[i]);
		}

		/*

		var stores = {
			mcd: [
				0: {
				 //item object
				},
				1: {
				 //item object
				},
				2: {
				 //item object
				}
			]
		};

		 */

		for(store in stores) {
			console.log(store); // mcd
			console.log(stores[store]) /*
			[0: {
				 //item object
				},
				1: {
				 //item object
				},
				2: {
				 //item object
				}
				]*/
			console.log(stores[store][0]);



			shoppingElement.append('<div id="' + storeNames[store] + '" style="margin-bottom: 20px"> ' +
				'<h6 style="font-weight: 300; margin-bottom: 15px;">' + storeNames[store] + '<span class="right blue-text" onclick="payment()">Checkout</span> </h6>\ ' +
				'<div class="collection black-text" id="shopping-cart-' + storeNames[store] + '" style="margin-top: -5px; border: none; overflow: scroll; max-height: 250px;">');

			var localCart = stores[store];
			for (i = 0; i < localCart.length; i++) {
				shoppingElement.append('<a class="collection-item black-text avatar nohover" style="min-height: 65px;"><img src="' + localCart[i].img + '" alt="' + localCart[i].name + '" class="circle">' + localCart[i].name + '<i class="material-icons right" onclick="openModal(' + i + ')">delete</i> <p style="font-weight: lighter; font-size: 12px; margin-top: 3px">$' + localCart[i].price + '</p></a>');
				subtotal += localCart[i].price;
			}
		}

		$('#nav').append('<ul class="right" id="button">\n' +
			'            <li>\n' +
			'                <a href="#" onclick="payment()"\n' +
			'                   class="blue-text"><i\n' +
			'                        class="material-icons">shopping_basket</i></a>\n' +
			'            </li>\n' +
			'        </ul>');

		$('.container').append('<a onclick="payment()" style="font-weight: bold; font-size: large" class="right right-align blue-text">Checkout</a>');
		$('#subtotal').show();
		$('#subtotal').html('Subtotal: $' + subtotal);
	} else {
		$('#subtotal').hide();
		shoppingElement.html('<div class="center"><h6 style="font-weight: 300">You have nothing in your Cart.</h6></div>')
		$('#nav').append('<ul class="right" id="button">\n' +
			'            <li>\n' +
			'                <a href="#"\n' +
			'                   class="grey-text"><i\n' +
			'                        class="material-icons">shopping_basket</i></a>\n' +
			'            </li>\n' +
			'        </ul>');
		$('#container').append('<br><div class="center"><a style="font-weight: bold; font-size: large" class="center center-align grey-text">Checkout</a></div>');
	}
	$('#header').html('Cart').addClass('black-text').removeClass('blue-text');
	$('#menu').html('<a href="#" data-target="slide-out"\n' +
		'                   class="sidenav-trigger blue-text"><i\n' +
		'                        class="material-icons">menu</i></a>');
	sideClose();
}

function loadCartFooter() {
	var currentItems = [], subtotal = 0;
	$('#cart-footer-items').html('');
	for (var i = 0; i < shoppingCart.length; i++) {
		subtotal += shoppingCart[i].price;
		console.log(subtotal);
		if (currentItems.indexOf(shoppingCart[i].id) == -1) {
			currentItems.push(shoppingCart[i].id);

			var matching = shoppingCart.filter(function (x) {
				return shoppingCart[i].id == x.id
			}).length;
			$('#cart-footer-items').append('<a class="collection-item black-text nohover">' + shoppingCart[i].name +
				' <span>(' + matching + ')</span> ' +
				'<span class="right">' + (shoppingCart[i].price * matching).toFixed(2) + '</span> ' +
				'</a>')
		}
	}
	$('#footer-subtotal').html('Subtotal: $' + subtotal.toFixed(2));
}

function orders() {
	$('#cart-footer').hide();
	$('#button').remove();
	$('#navbar').show();
	$(document.body).removeClass('blue');
	$(document.body).addClass('grey lighten-4');
	$('#container').html(ordersHTML);
	$.ajax({
		method: 'get',
		url: 'https://swoop-it.herokuapp.com/api/myorders',
		success: function (data) {
			data = data.reverse();
			for (var i = 0; i < data.length; i++) {
				$('#orders-list').append('<li>\n ' +
					'     <div class="collapsible-header"><i class="material-icons">arrow_drop_down</i>' + calcDateString(data[i].date) + '</div>\n' +
					'     <div class="collapsible-body">\n' +
					'         <span style="font-weight: bold">' + data[i].progress.statusName + '</span>\n' +
					'         <br>\n' +
					'         <div class="progress grey lighten-2">\n' +
					'             <div class="determinate blue" style="width: ' + data[i].progress.status + '%"></div>\n' +
					'         </div>\n' +
					'     <br>\n' +
					'     <a onclick="cancelOrder(' + data[i].id + ')" class="btn red waves-effect waves-ripple waves-light" style="font-weight: bold;">Cancel <i style="margin-bottom: 3px" class="material-icons left">delete</i> </a>\n' +
					'     </div>\n' +
					'</li>');
			}
		}
	});
	var elemy = document.querySelector('.collapsible');
	var collapse = new M.Collapsible(elemy, {});
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
	$('#cart-footer').hide();
	$('#button').remove();
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
		'                <a href="#" onclick="confirmOrder(getInputVal(\'pay-group\'))"\n' +
		'                   class="blue-text"><i\n' +
		'                        class="material-icons">arrow_forward</i></a>\n' +
		'            </li>\n' +
		'        </ul>');
	$('#menu').html('<a href="#" onclick="cart()" \n' +
		'                   class="blue-text"><i\n' +
		'                        class="material-icons">arrow_backwards</i></a>');
	sideClose();
}

function confirmOrder(paymentMethod) {
	$('#container').html(confirmHTML);
	$('#button').remove();
	$('#header').html('Confirm').addClass('black-text').removeClass('blue-text');
	$('#nav').append('<ul class="right" id="button">\n' +
		'            <li>\n' +
		'                <a href="#" onclick="submitOrder(paymentMethod)"\n' +
		'                   class="blue-text"><i\n' +
		'                        class="material-icons">check</i></a>\n' +
		'            </li>\n' +
		'        </ul>');
	$('#menu').html('<a href="#" onclick="payment()" \n' +
		'                   class="blue-text"><i\n' +
		'                        class="material-icons">arrow_backwards</i></a>');
	var subtotal = 0, delivery, tax, total, deliveryPercent = .20;
	for (var i = 0; i < shoppingCart.length; i++) {
		$('#confirm-items').append('<a class="collection-item black-text">' + shoppingCart[i].name + '<i onclick="openModal(' + i + ', ' + paymentMethod + ')" class="material-icons right">delete</i> </a>');
		subtotal += shoppingCart[i].price;
	}
	if (!subtotal) subtotal = 0;
	if (paymentMethod == 2) deliveryPercent = .23;
	$('#subtotal').html('$' + subtotal.toFixed(2));
	delivery = 10 + subtotal * deliveryPercent;
	$('#delivery').html('$' + delivery.toFixed(2));
	tax = subtotal * .04;
	$('#tax').html('$' + tax.toFixed(2));
	total = delivery + tax + subtotal;
	$('#total').html('$' + total.toFixed(2))

}

function openModal(id, payment) {
	confirmModal.open();
	$('#modal-footer').html('<a class="modal-action modal-close waves-effect waves-light btn-flat">No</a><a onclick="removeFromCart(' + id + ', ' + payment + ')" class="modal-action modal-close waves-effect waves-light red white-text btn-flat">Remove</a>')
}

function removeFromCart(id, payment) {
	shoppingCart.splice(id, 1);
	if (shoppingCart.length > 0) {
		if (payment) confirmOrder(payment);
		else cart();
	} else {
		if (payment) stores();
		else cart();
	}
}

function search() {
	$('#cart-footer').hide();
	$('#navbar').show();
	$('#button').remove();
	$(document.body).removeClass('blue');
	$(document.body).addClass('grey lighten-4');
	$('#container').html(searchHTML);
	$('#header').html('Search').addClass('black-text').removeClass('blue-text');
	var auto = document.querySelector('.autocomplete');
	searchItems('');
	var data = {};
	for (var i = 0; i < itemsDB.length; i++) {
		data[itemsDB[i].name] = itemsDB[i].img;
	}
	var complete = M.Autocomplete.init(auto, {
		data: data,
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
				'            <p id="' + itemsDB[i].id + '-data">' +
				'               <text>$' + itemsDB[i].price + '</text>' +
				'                  <br>' +
				'                 <text style="font-weight: lighter;">' + 'Put something here' + '</text>' +
				'				  <text class="right blue-text" data-item-count="0" id="' + itemsDB[i].id + '-quantity" style="position: relative;transform: translateX(5px); margin-top: 3px" onclick="addItem(this, true)">Add to Cart</text>' +
				'              </p>' +
				'          </a>')
			var cartItems = shoppingCart.filter(function (x) {
				return itemsDB[i].id == x.id
			}).length;
			if (cartItems > 0) {
				addItem($('#' + itemsDB[i].id + '-quantity'), false);
				$('#' + itemsDB[i].id + '-quantity').attr('data-item-count', cartItems);
				$('#input-' + itemsDB[i].id).val(cartItems)
			}
		}
	}
}

function addItem(element, focus) {
	var parent = $(element).closest("a");
	var parentId = parent.prop('id');
	var quantityElement = $('#' + parentId + '-quantity');
	var quantity = parseInt(quantityElement.attr('data-item-count'));
	loadCartFooter();
	$('#cart-footer').show();
	quantityElement.remove();
	$('#' + parentId + '-data').append('<text class="right blue-text" data-item-count="0" id="' + parentId + '-quantity" style="position: relative;transform: translateX(-3px); margin-top: 3px" onclick="removeItem(this)">Remove</text>');
	$('#' + parent.prop('id') + '-data').prepend('<input min="1" max="20" id="input-' + parentId + '" onclick="showItemSelector(' + parentId + ')" oninput="addItemToCart(' + parentId + ', $(this).val()); $(\'#' + parentId + '-quantity\').attr(\'data-item-count\', $(this).val());" class="browser-default input right" style= "width: 55px;" type="number">');
	quantityElement.attr('data-item-count', quantity);
	if (focus === true) {
		$('#input-' + parentId).focus();
	}
}

function showItemSelector(id) {
	$('#cart-footer').show();
	loadCartFooter();
	$('#' + id + '-quantity').val($('#' + id + '-quantity').attr('data-item-count'));
}

function addItemToCart(id, amount) {
	shoppingCart = shoppingCart.filter(function (x) {
		return x.id !== id
	});
	$('#' + id + '-quantity').attr('data-item-count', amount);
	for (var i = 0; i < itemsDB.length; i++) {
		if (itemsDB[i].id === id) {
			for (var k = 0; k < amount; k++) {
				shoppingCart.push(itemsDB[i])
			}
		}
	}
	loadCartFooter();
	$('#cart-footer').show();
}

function getInputVal(name) {
	return $('input:radio[name="' + name + '"]:checked').val()
}

function removeItem(element) {
	var parent = $(element).closest("a");
	var parentId = parent.prop('id');
	var quantityElement = $('#' + parentId + '-quantity');
	$('#cart-footer').hide();
	quantityElement.remove();
	$('#input-' + parentId).remove();
	$('#' + parent.prop('id') + '-data').append('<text class="right blue-text" data-item-count="0" id="' + parentId + '-quantity" style="position: relative;transform: translateX(5px); margin-top: 3px" onclick="addItem(this)">Add to Cart</text>');
	quantityElement.attr('data-item-count', 0);
	shoppingCart = shoppingCart.filter(function (x) {
		return x.id != parentId
	});
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
	'            <div class="collection black-text" id="confirm-items" style="margin-top: -5px; overflow: scroll; max-height: 319px">\n' +
	'            </div>\n' +
	'        </div>\n' +
	'        <div class="row center">\n' +
	'            <div class="container">\n' +
	'            <div class="container">\n' +
	'                <b class="left">Subtotal:</b>\n' +
	'                <span id="subtotal" class="right"></span>\n' +
	'                <br>\n' +
	'                <b class="left">Delivery:</b>\n' +
	'                <span id="delivery" class="right"></span>\n' +
	'                <br>\n' +
	'                <b class="left">Tax:</b>\n' +
	'                <span id="tax" class="right"></span>\n' +
	'                <br>\n' +
	'                <hr>\n' +
	'                <h5 class="left" style="font-weight: bold">Total:</h5>\n' +
	'                <h5 class="right" id="total" style="font-weight: bold;"></h5>\n' +
	'            </div>\n' +
	'            </div>\n' +
	'        </div>\n' +
	'    </div>';

var paymentHTML = '<div class="container">' +
	'  <label>Payment Method</label>\n' +
	'<div class="center">' +
	'  <p>\n' +
	'      <label>\n' +
	'        <input value="0" name="pay-group" type="radio" checked />\n' +
	'        <span>PayPal/Credit Card (20% fee)</span>\n' +
	'      </label>\n' +
	'    </p>\n' +
	'    <p>\n' +
	'      <label>\n' +
	'        <input value="1" name="pay-group" class="disabled" disabled type="radio" />\n' +
	'        <span>SwoopIt Cred</span>\n' +
	'      </label>\n' +
	'    </p>' +
	'    <p>\n' +
	'      <label>\n' +
	'        <input value="2" name="pay-group" type="radio" />\n' +
	'        <span>Cash on Pickup (23% fee)</span>\n' +
	'      </label>\n' +
	'    </p>' +
	'<a onclick="confirmOrder(getInputVal(\'pay-group\'))" class="btn blue waves-effect waves-ripple waves-light">Continue</a>' +
	'</div>' +
	'</div>' +
	'            ';

var ordersHTML = ' <ul class="collapsible" id="orders-list" style="margin-top: -5px">\n' +
	'</ul>';

var settingsHTML = '<div class="collection black-text" style="margin-top: -5px">\n' +
	'        <a href="#" onclick="logout()" class="collection-item black-text">Logout</a>\n' +
	'       <a href="#" onclick="cache()" class="collection-item black-text">Refresh Cache</a>\n' +
	'    </div>';


var cartHTML = '<div class="container" style="border: none">' +
	'<br>' +
	'<div class="collection black-text" id="shopping-cart" style="margin-top: -5px; border: none; overflow: scroll; max-height: 250px;">' +
	'</div>' +
	'<h6 style="font-weight: bold; display: inline" id="subtotal">Subtotal: $0</h6>' +
	'</div> ';

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
	'            <h4 class="" style="z-index: 2; opacity: 1; font-weight: 300">McDonald\'s</h4>\n' +
	'        </div>\n' +
	'        <div class="center cont-store store-block" id="bk" style="background: linear-gradient(rgba(20,20,20, .3),rgba(20,20,20, .3)), url(img/burger.jpg)">\n' +
	'            <h4 class="" style="z-index: 2; opacity: 1; font-weight: 300">Burger King</h4>\n' +
	'        </div>\n' +
	'        <div class="center cont-store store-block" id="fdl" style="background: linear-gradient(rgba(20,20,20, .3),rgba(20,20,20, .3)), url(img/food.jpg)">\n' +
	'            <h4 class="" style="z-index: 2; opacity: 1; font-weight: 300">Foodland</h4>\n' +
	'        </div>\n' +
	'        <div class="center cont-store store-block" id="lnl" style="background: linear-gradient(rgba(20,20,20, .3),rgba(20,20,20, .3)), url(img/lnl.jpg)">\n' +
	'            <h4 class="" style="z-index: 2; opacity: 1; font-weight: 300">L&L Barbecue</h4>\n' +
	'        </div>\n' +
	'        <div class="center cont-store store-block" id="dom" style="background: linear-gradient(rgba(20,20,20, .3),rgba(20,20,20, .3)), url(img/dom.jpg)">\n' +
	'            <h4 class="" style="z-index: 2; opacity: 1; font-weight: 300">Dominoes</h4>\n' +
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
					xhr.setRequestHeader("authentication", user.idToken);
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
			login();
		},
		function (err) {
			alert('There was an error disconnecting your account - Please check your internet connection or update your device. Code: ' + err)
		}
	);
	$('#container').html('<div class="center" style="display: inline-block; vertical-align: middle;">\n' +
		'        <img style="width: 100%;display: inline-block; vertical-align: middle; position: relative;" src="img/swoop_trans.png">\n' +
		'        <a onclick="stores();" class="white-text" style="font-weight: bold; font-family: \'Futura-Bold\', sans-serif; font-size: 4.4rem">SwoopIt</a>\n' +
		'    </div>')
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

function calcDateString(milliseconds) {
	var seconds = 1000;
	var minutes = 1000 * 60;
	var hours = minutes * 60;
	var days = hours * 24;
	//var years = days * 365;
	var secondsSince = Math.floor(new Date().getTime() / seconds) - Math.floor(milliseconds / seconds);
	var minutesSince = Math.floor(new Date().getTime() / minutes) - Math.floor(milliseconds / minutes);
	var hoursSince = Math.floor(new Date().getTime() / hours) - Math.floor(milliseconds / hours);
	var daysSince = Math.floor(new Date().getTime() / days) - Math.floor(milliseconds / days);
	if (daysSince >= 1) return daysSince + ' Days Ago';
	if (hoursSince >= 1) return hoursSince + ' Hours Ago';
	if (minutesSince >= 1) return minutesSince + ' Minutes Ago';
	if (secondsSince >= 1) return minutesSince + ' Seconds Ago';
	return 'Are You a Time Traveler????'
}