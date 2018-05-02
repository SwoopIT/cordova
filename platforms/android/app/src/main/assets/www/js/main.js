// Globals
var instance, elem, deviceId, shoppingCart = [], storesShoppingCart, order = [], local = 'http://localhost:3001',
	external = 'https://api.swoopit.xyz';
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
	bgk: 'Burger King',
	longs: 'Longs Drugs',
	csc: 'Costco'
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
	$('#nav').append('<ul class="right" id="button"></ul>');
	cache();
	if (new Date().getHours() >= 15 && new Date().getHours() <= 24) {
		M.toast({
			html: '<span class="red-text text-lighten-1" style="font-weight: bold">New orders after 3 PM will not be delivered until the next day.</span>',
			displayLength: 8000
		})
	}
});

function sideClose() {
	instance.close();
}

function sendNotification(all) {
	$.ajax({
		method: 'post',
		url: external + '/api/notify',
		dataType: 'json',
		contentType: "application/json",
		data: JSON.stringify({
			payload: {
				title: 'This is a Notification',
				body: 'WAKE UP!!!'
			}
		}),
		success: function (data) {
			if (data) {
				M.toast({html: 'Successfully Sent Notif.'});
			} else {
				console.log(data);
				M.toast({html: 'Something went wrong. Please try notifying again, or contact your local Swoopit developer.'});
			}
		}
	})
}

function submitOrder(paymentMethod, store) {
	var itemsArray = [];
	if (!shoppingCart[0]) return M.toast({html: 'LOL You have nothing in your cart! xD'});
	if (store) {
		console.log(storesShoppingCart[store]);
		for (var k = 0; k < storesShoppingCart[store].length; k++) {
			itemsArray.push(storesShoppingCart[store][k].id);
		}
	} else {
		for (var i = 0; i < shoppingCart.length; i++) {
			itemsArray.push(shoppingCart[i].id);
		}
	}
	$('#container').html('<div class="center"> <a class="btn-large blue payment-button">Submit Payment and Confirm</a></div>');
	$('#container').prepend('<div id="dropin-container"></div>');
	$.ajax({
		method: 'get',
		url: 'https://api.swoopit.xyz/api/client_token',
		success: function (data) {
			var button = document.querySelector('.payment-button');
			braintree.dropin.create({
				authorization: data,
				container: '#dropin-container'
			}, function (createErr, instance) {
				button.addEventListener('click', function () {
					instance.requestPaymentMethod(function (err, payload) {
						if (err) return console.log(err);
						console.log(payload);
						$.ajax({
							method: 'post',
							dataType: 'json',
							contentType: "application/json",
							data: JSON.stringify({
								items: itemsArray,
								paymentMethod: parseInt(paymentMethod),
								nonce: payload.nonce
							}),
							url: external + '/api/order',
							success: function (data) {
								if (data) {
									$('#button').hide();
									M.toast({html: '<span>Successfully submitted order! Check the status on the <a onclick="orders()" class="blue-text" style="font-weight: bold;" ">Orders Page</a>.</span>'});
									setTimeout(orders, 750);
								} else {
									M.toast({html: '<span>Order fail. Are you <a onclick="login()" class="blue-text" style="font-weight: bold;" ">signed in</a> with a hpa.edu account?</span>'});
									$('.disableitems').show();
								}
							}
						})
					});
				});
			});
		}
	});
	$('.disableitems').hide();

}

function searchStores() {
	var query = $('#store-search').val();
	$('.store-block').hide();
	for (var i = 0; i < $('.store-block').length; i++) {
		if ($('.store-block').children()[i].innerHTML.toLowerCase().indexOf(query.toLowerCase()) >= 0) {
			$($('.store-block')[i]).show();
		}
	}
}

function searchCategories() {
	var query = $('#category-search').val();
	$('.category').hide();
	for (var i = 0; i < $('.category').length; i++) {
		if ($($('.category')[i]).children()[0].innerHTML.toLowerCase().indexOf(query.toLowerCase()) >= 0) {
			$($('.category')[i]).show();
		}
	}
}

function searchStoreItems() {
	var query = $('#store-search').val();
	$('.store-items').parent().hide();
	for (var i = 0; i < $('.store-items').length; i++) {
		if ($('.store-items')[i].innerHTML.toLowerCase().indexOf(query.toLowerCase()) >= 0) {
			$($('.store-items')[i]).parent().show();
		}
	}
}

function stores(id) {
	$('#cart-footer').hide();
	$('#navbar').show();
	$(document.body).removeClass('blue');
	$(document.body).addClass('grey lighten-4');
	if (!id) {
		$('#container').html(storesHTML);
		$('#header').html('SwoopIt').addClass('blue-text').removeClass('black-text');
		$('#button').hide();
		$('#menu').html('<a href="#" data-target="slide-out" class="sidenav-trigger blue-text"><i class="material-icons">menu</i></a>');
		$('.cont-store').click(function (data) {
			stores(data.currentTarget.id)
		});

	} else {
		$('#header').html(storeNames[id]).addClass('black-text').removeClass('blue-text');
		$('#button').show();
		$('#button').html('<li>\n' +
			'                <a href="#" onclick="loadCartFooter(); $(\'#cart-footer\').toggle();"\n' +
			'                   class="blue-text"><i\n' +
			'                        class="material-icons">shopping_basket</i></a>\n' +
			'            </li>\n');
		category(id);
	}
	sideClose();
}

function category(id) {

	$('#menu').html('<a onclick="stores();" \n' +
		'                   class="blue-text"><i\n' +
		'                        class="material-icons">arrow_back</i></a>');
	$('#container').html(categoryHTML);
	$('#button').html('<li>\n' +
		'                <a href="#" onclick="loadCartFooter(); $(\'#cart-footer\').toggle();"\n' +
		'                   class="blue-text"><i\n' +
		'                        class="material-icons">shopping_basket</i></a>\n' +
		'            </li>\n' +
		'        </ul>');
	for (var i = 0; i < categoriesDB.length; i++) {
		if (categoriesDB[i].store === id) {
			$('#categories').append('<a onclick="loadItems(\'' + categoriesDB[i].id + '\', \'' + id + '\')" class="collection-item black-text category "><span>' + categoriesDB[i].name + '</span><i class="material-icons right">arrow_forward</i></a>');
		}
	}
}

function loadItems(categoryName, storeId) {
	$('#container').html(storePageHTML);
	$('#button').html('<li>\n' +
		'                <a href="#" onclick="loadCartFooter(); $(\'#cart-footer\').toggle();"\n' +
		'                   class="blue-text"><i\n' +
		'                        class="material-icons">shopping_basket</i></a>\n' +
		'            </li>\n' +
		'        </ul>');
	$('#menu').html('<a onclick="stores(\'' + storeId + '\');" \n' +
		'                   class="blue-text"><i\n' +
		'                        class="material-icons">arrow_back</i></a>');
	var storeName = storeNames[storeId];
	for (var i = 0; i < itemsDB.length; i++) {
		if (itemsDB[i].category === categoryName) {
			var place = storeNames[getCategory(itemsDB[i].category).store];
			$('#store-items').append('<a class="collection-item avatar black-text nohover" id="' + itemsDB[i].id + '">' +
				'               <img src="' + itemsDB[i].img + '" alt="' + itemsDB[i].name + '" style="margin-top:10px" class="circle">' +
				'                <span class="title black-text store-items" style="font-weight: bold;">' + itemsDB[i].name + '</span>' +
				'            <p id="' + itemsDB[i].id + '-data">' +
				'               <text>$' + itemsDB[i].price + '</text>' +
				'                  <br>' +
				'                 <text style="font-weight: lighter;">' + place + '</text>' +
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
	$('#button').show();
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
		for (store in stores) {
			shoppingElement.prepend('<div id="' + store + '" style="margin-bottom: -5px;">' +
				'<h6 style="font-weight: 300; margin-bottom: 15px;">' + storeNames[store] + '<span class="right blue-text" onclick="payment(\'' + store + '\')">Checkout</span> </h6>' +
				'<div class="collection black-text" id="shopping-cart-' + store + '" style="margin-top: -5px; border: none; overflow: scroll; max-height: 200px;"></div>' +
				'<span onclick="removeAllFromCart(\'' + store + '\');" style="margin-top: -10px" class="right red-text">Remove All</span> ' +
				'<br>' +
				'</div>');
			var localCart = stores[store];
			for (i = 0; i < localCart.length; i++) {
				$("#shopping-cart-" + store).append('<a class="collection-item black-text avatar nohover" style="min-height: 65px;"><img src="' + localCart[i].img + '" alt="' + localCart[i].name + '" class="circle">' + localCart[i].name + '<i class="material-icons right" style="margin-top: 10px" onclick="openModal(null,' + i + ', getInputVal(\'pay-group\'))">delete</i> <p style="font-weight: lighter; font-size: 12px; margin-top: 3px">$' + localCart[i].price + '</p></a>');
				subtotal += localCart[i].price;
			}
		}
		storesShoppingCart = stores;

		$('#button').html('<li>\n' +
			'                <a href="#" onclick="payment()"\n' +
			'                   class="blue-text"><i\n' +
			'                        class="material-icons">payment</i></a>\n' +
			'            </li>\n' +
			'        </ul>');

		$('#subtotal').show();
		$('#subtotal').html('Subtotal: $' + subtotal.toFixed(2));

	} else {
		$('#subtotal').hide();
		shoppingElement.html('<div class="center"><h6 style="font-weight: 300">You have nothing in your Cart.</h6></div>')
		$('#button').html('<li>\n' +
			'                <a href="#"\n' +
			'                   class="grey-text"><i\n' +
			'                        class="material-icons">payment</i></a>\n' +
			'            </li>\n' +
			'        </ul>');
	}
	$('#header').html('Cart').addClass('black-text').removeClass('blue-text');
	$('#menu').html('<a href="#" data-target="slide-out"\n' +
		'                   class="sidenav-trigger blue-text"><i\n' +
		'                        class="material-icons">menu</i></a>');
	sideClose();
}

function removeAllFromCart(store) {
	if (store) {
		openModal('cart', null, null, store)
	} else {
		shoppingCart = []
	}
}

function removeStore(store) {
	shoppingCart = shoppingCart.filter(function (x) {
		return getCategory(x.category).store != store
	});
	cart();
}

function loadCartFooter() {
	var currentItems = [], subtotal = 0;
	$('#cart-footer-items').html('');
	for (var i = 0; i < shoppingCart.length; i++) {
		subtotal += shoppingCart[i].price;
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
	$('#button').hide();
	$('#menu').html('<a href="#" data-target="slide-out"\n' +
		'                   class="sidenav-trigger blue-text"><i\n' +
		'                        class="material-icons">menu</i></a>');
	$('#navbar').show();
	$(document.body).removeClass('blue');
	$(document.body).addClass('grey lighten-4');
	$('#container').html(ordersHTML);
	$.ajax({
		method: 'get',
		url: external + '/api/myorders',
		success: function (data) {
			console.log(data);
			if (data != 0) {
				data = data.reverse();
				for (var i = 0; i < data.length; i++) {
					$('#orders-list').append('<li>\n ' +
						'     <div class="collapsible-header"><i class="material-icons">arrow_drop_down</i>' + calcDateString(data[i].date) + '</div>\n' +
						'     <div class="collapsible-body">\n' +
						'         <span style="font-weight: bold">' + data[i].progress.statusName + '</span>\n' +
						'         <span style="font-weight: 300" class="right">Order #' + data[i].id + '</span>\n' +
						'         <br>\n' +
						'         <div class="progress grey lighten-2">\n' +
						'             <div class="determinate blue" style="width: ' + data[i].progress.status + '%"></div>\n' +
						'         </div>\n' +
						'         <span style="font-weight: bold;">' + getPayment(data[i].paymentMethod) + '</span>\n' +
						'     <br>\n' +
						'<br>' +
						'     <a onclick="openModal(\'order\', ' + data[i].id + ')" class="btn red waves-effect waves-ripple waves-light" id="cancel-' + data[i].id + '" style="font-weight: bold;">Cancel <i style="margin-bottom: 3px" class="material-icons left">delete</i> </a>\n' +
						'     <a onclick="orderFooter(' + i + ')" class="btn blue waves-effect waves-ripple waves-light right" id="order-items-' + data[i].id + '">Items</a>' +
						'     </div>\n' +
						'</li>');
					if (data[i].progress.status <= 0) {
						$('#cancel-' + data[i].id).addClass('disabled')
					}
					order.push(data[i]);
					$('#order-items-' + data[i].id).click(function () {

					});
				}
			} else {
				$('#container').html('<div class="center"><h6 style="font-weight: 300">You have nothing in your Cart.</h6></div>');
			}
		}
	});
	var elemy = document.querySelector('.collapsible');
	var collapse = new M.Collapsible(elemy, {});
	$('#button').hide();
	$('#header').html('Orders').addClass('black-text').removeClass('blue-text');
	/*$('#button').html('<li>\n' +
		'                <a href="#" onclick="editOrders()"\n' +
		'                   class="blue-text"><i\n' +
		'                        class="material-icons">edit</i></a>\n' +
		'            </li>\n');*/
	sideClose();
}

function orderFooter(id) {
	$('#order-footer').show();
	var length = 0;
	var item = [];
	var itemsStuff = [];
	var subItem = 0;
	$('#order-footer-items').html('');
	for (var k = 0; k < order[id].items.length; k++) {
		console.log(order[id].items[k], itemsStuff);
		if (itemsStuff.indexOf(order[id].items[k]) == -1) {
			itemsStuff.push(order[id].items[k]);
			length = order[id].items.filter(function (x) {
				return order[id].items[k] == x;
			}).length;
			item = itemsDB.filter(function (x) {
				return x.id == order[id].items[k]
			});
			subItem += (item[0].price * length);
			$('#order-footer-items').append('<a class="collection-item black-text nohover">' + item[0].name + '<span> (' + (item[0].price * length).toFixed(2) + ')</span> <span class="right">' + item[0].price + '</span> </a>')
		}
	}
	$('#orders-subtitle').html('Subtotal: $' + subItem.toFixed(2));
}


function getPayment(method) {
	if (method == 0) {
		return 'PayPal'
	} else if (method = 1) {
		return 'SwoopIt Cred'
	} else {
		return 'Cash'
	}
}

function cancelOrder(id) {
	$('#container').html('<div class="center"><h1 class="blue-text">...</h1></div>');
	$.ajax({
		method: 'delete',
		url: external + '/api/order',
		data: {
			id: id
		},
		success: function (data) {
			if (data) {
				M.toast({html: 'Successfully Canceled the Order.'});
				orders()
			} else {
				M.toast({html: 'Something went wrong. Please try canceling again, or contact your local Swoopit developer.'});
				orders()
			}
		}
	})
}

function settings() {
	$('#cart-footer').hide();
	$('#button').hide();
	$('#navbar').show();
	$(document.body).removeClass('blue');
	$(document.body).addClass('grey lighten-4');
	$('#container').html(settingsHTML);
	$('#header').html('Settings').addClass('black-text').removeClass('blue-text');
	sideClose();
}

function payment(store) {
	if (store) store = store.toString();
	$('#container').html(paymentHTML);
	if (store) {
		$('#center').append('<a onclick="confirmOrder(getInputVal(\'pay-group\'), \'' + store + '\')" class="btn blue waves-effect waves-ripple waves-light">Continue</a>');
	} else {
		$('#center').append('<a onclick="confirmOrder(getInputVal(\'pay-group\'))" class="btn blue waves-effect waves-ripple waves-light">Continue</a>');
	}
	$('#header').html('Payment').addClass('black-text').removeClass('blue-text');
	if (store) {
		$('#button').html('<li>\n' +
			'                <a href="#" onclick="confirmOrder(getInputVal(\'pay-group\'), \'' + store + '\')"\n' +
			'                   class="blue-text"><i\n' +
			'                        class="material-icons">arrow_forward</i></a>\n' +
			'            </li>\n');
	} else {
		$('#button').html('<li>\n' +
			'                <a href="#" onclick="confirmOrder(getInputVal(\'pay-group\'))"\n' +
			'                   class="blue-text"><i\n' +
			'                        class="material-icons">arrow_forward</i></a>\n' +
			'            </li>\n');
	}
	$('#button').show();
	$('#menu').html('<a href="#" onclick="cart()" \n' +
		'                   class="blue-text"><i\n' +
		'                        class="material-icons">arrow_backwards</i></a>');
	sideClose();
}

function confirmOrder(paymentMethod, store) {
	console.log(getInputVal('pay-group'));
	paymentMethod = getInputVal('pay-group');
	$('#container').html(confirmHTML);
	$('#button').show();
	$('#header').html('Confirm').addClass('black-text').removeClass('blue-text');
	if (store) {
		$('#button').html('<li>\n' +
			'                <a href="#" onclick="submitOrder(' + paymentMethod + ', \'' + store + '\')"\n' +
			'                   class="blue-text"><i\n' +
			'                        class="material-icons disableitems">check</i></a>\n' +
			'            </li>\n' +
			'        </ul>');
	} else {
		$('#button').html('<li>\n' +
			'                <a href="#" onclick="submitOrder(' + paymentMethod + ')"\n' +
			'                   class="blue-text"><i\n' +
			'                        class="material-icons disableitems">check</i></a>\n' +
			'            </li>\n' +
			'        </ul>');
	}
	$('#menu').html('<a href="#" onclick="payment(\'' + store + '\')" \n' +
		'                   class="blue-text"><i\n' +
		'                        class="material-icons">arrow_backwards</i></a>');
	var subtotal = 0, delivery, tax, total, deliveryPercent = .20;
	for (var i = 0; i < shoppingCart.length; i++) {
		if (store) {
			$('#confirm-items').append('<a class="collection-item black-text">' + shoppingCart[i].name + '<i onclick="openModal(null, ' + i + ', ' + paymentMethod + ', \'' + store + '\')" class="material-icons right">delete</i> </a>');
		} else {
			$('#confirm-items').append('<a class="collection-item black-text">' + shoppingCart[i].name + '<i onclick="openModal(null, ' + i + ', ' + paymentMethod + ')" class="material-icons right">delete</i> </a>');
		}
		subtotal += shoppingCart[i].price;
	}
	if (!subtotal) subtotal = 0;
	if (paymentMethod == 2) deliveryPercent = .22;
	$('#subtotal').html('$' + subtotal.toFixed(2));
	delivery = subtotal * deliveryPercent;
	$('#delivery').html('$' + delivery.toFixed(2));
	tax = subtotal * .04;
	$('#tax').html('$' + tax.toFixed(2));
	total = delivery + tax + subtotal;
	$('#total').html('$' + total.toFixed(2))

}

function openModal(type, id, payment, store) {
	confirmModal.open();
	if (type == 'order') {
		$('#modal-footer').html('<a class="modal-action modal-close waves-effect waves-light btn-flat">No</a><a onclick="cancelOrder(' + id + ')" class="modal-action modal-close waves-effect waves-light red white-text btn-flat">Cancel</a>')
	} else if (type == 'cart') {
		$('#modal-footer').html('<a class="modal-action modal-close waves-effect waves-light btn-flat">No</a><a onclick="removeStore(\'' + store + '\');" class="modal-action modal-close waves-effect waves-light red white-text btn-flat">Remove</a>')
	} else {
		$('#modal-footer').html('<a class="modal-action modal-close waves-effect waves-light btn-flat">No</a><a onclick="removeFromCart(' + id + ', ' + payment + ', ' + store + ')" class="modal-action modal-close waves-effect waves-light red white-text btn-flat">Remove</a>');
	}
}

function removeFromCart(id, payment, store) {
	shoppingCart.splice(id, 1);
	if (shoppingCart.length > 0) {
		if (payment) confirmOrder(payment, store);
		else cart();
	} else {
		if (payment) stores();
		else cart();
	}
}

function search() {
	$('#cart-footer').hide();
	$('#navbar').show();
	$('#button').show();
	$('#button').html('<li>\n' +
		'                <a href="#" onclick="loadCartFooter(); $(\'#cart-footer\').toggle();"\n' +
		'                   class="blue-text"><i\n' +
		'                        class="material-icons">shopping_basket</i></a>\n' +
		'            </li>\n');
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
			searchItems($('#item-search').val());
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
	quantityElement.remove();
	$('#' + parentId + '-data').append('<text class="right blue-text" data-item-count="0" id="' + parentId + '-quantity" style="position: relative;transform: translateX(-3px); margin-top: 3px" onclick="removeItem(this)">Remove</text>');
	$('#' + parent.prop('id') + '-data').prepend('<form class="form" onsubmit="Keyboard.hide(); return false;"><input min="1" max="30" id="input-' + parentId + '" onclick="showItemSelector(' + parentId + ')" oninput="addItemToCart(' + parentId + ', $(this).val()); $(\'#' + parentId + '-quantity\').attr(\'data-item-count\', $(this).val());" class="browser-default input right" style= "width: 55px;" type="number"></form>');
	quantityElement.attr('data-item-count', quantity);
	if (focus === true) {
		$('#input-' + parentId).focus();
	}
	$(".form").submit(function (e) {
		e.preventDefault();
	});
}

function showItemSelector(id) {
	$('#' + id + '-quantity').val($('#' + id + '-quantity').attr('data-item-count'));
}

function addItemToCart(id, amount) {
	if (amount > 1000) {
		$('#input-' + id).val(amount.toString().substr(0, amount.toString().length - 1));
		return;
	}
	console.log(amount);
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
	'        <div class="col s12" style="height: 76px;">\n' +
	'            <div class="row">\n' +
	'                <div class="input-field col s12">\n' +
	'                    <i class="material-icons prefix blue-text">search</i>\n' +
	'                    <input oninput="searchStoreItems()" id="store-search" type="text">\n' +
	'                    <label for="store-search">Search</label>\n' +
	'                </div>\n' +
	'            </div>\n' +
	'        </div>\n' +
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
	'<div class="center" id="center">' +
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
	'</div>' +
	'</div>' +
	'            ';

var ordersHTML = ' <ul class="collapsible" id="orders-list" style="margin-top: -5px">\n' +
	'</ul>';

var settingsHTML = '<div class="collection black-text" style="margin-top: -5px">\n' +
	'        <a href="#" onclick="logout()" class="collection-item black-text">Logout</a>\n' +
	'       <a href="#" onclick="cache(true)" class="collection-item black-text">Refresh Cache</a>\n' +
	'    </div>';


var cartHTML = '<div class="container" style="border: none">' +
	'<br>' +
	'<div class="black-text" id="shopping-cart" style="margin-top: -5px; border: none; overflow: none;">' +
	'</div>' +
	'<h6 style="font-weight: bold; display: inline; font-size: large; position: fixed; bottom: 0;" id="subtotal">Subtotal: $0</h6>' +
	'</div> ';

var categoryHTML = '<div class="row">\n' +
	'        <div style="height: 85px;" class="col s12">\n' +
	'            <div class="row">\n' +
	'                <div class="input-field col s12">\n' +
	'                    <i class="material-icons prefix blue-text">search</i>\n' +
	'                    <input id="category-search" oninput="searchCategories()" type="text">\n' +
	'                    <label for="category-search">Search</label>\n' +
	'                </div>\n' +
	'            </div>\n' +
	'        </div>\n' +
	'    </div>\n' +
	'    <div class="collection black-text" id="categories" style="margin: -20px 0 0 0;">\n' +
	'    </div>';


var storesHTML = ' <div class="row">\n' +
	'        <div class="col s12" style="height: 76px;">\n' +
	'            <div class="row">\n' +
	'                <div class="input-field col s12">\n' +
	'                    <i class="material-icons prefix blue-text">search</i>\n' +
	'                    <input oninput="searchStores();" id="store-search" type="text">\n' +
	'                    <label for="store-search">Search</label>\n' +
	'                </div>\n' +
	'            </div>\n' +
	'        </div>\n' +
	'    </div>\n' +
	'    <div class="store-container white white-text">\n' +
	'        <div class="center cont-store store-block" id="mcd" style="background: linear-gradient(rgba(20,20,20, .3),rgba(20,20,20, .3)), url(img/mcd.jpg)">\n' +
	'            <h4 class="" style="z-index: 2; opacity: 1; font-weight: 300">McDonald\'s</h4>\n' +
	'        </div>\n' +
	'        <div class="center cont-store store-block" id="bgk" style="background: linear-gradient(rgba(20,20,20, .3),rgba(20,20,20, .3)), url(img/burger.jpg)">\n' +
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
	'        <div class="center cont-store store-block" id="csc" style="background: linear-gradient(rgba(20,20,20, .3),rgba(20,20,20, .3)), url(img/csc.jpg)">\n' +
	'            <h4 class="" style="z-index: 2; opacity: 1; font-weight: 300">Costco</h4>\n' +
	'        </div>\n' +
	'    </div>';

var searchHTML = '<div class="row">\n' +
	'        <div id="search-form" class="col s12" style="height: 76px;">\n' +
	'            <div class="row">\n' +
	'                <div class="input-field col s12">\n' +
	'                    <i class="material-icons prefix blue-text">search</i>\n' +
	'                    <input oninput="searchItems($(\'#item-search\').val())" id="item-search" type="text" class="autocomplete">\n' +
	'                    <label for="item-search">Search</label>\n' +
	'                </div>\n' +
	'            </div>\n' +
	'        </div>\n' +
	'    </div>' +
	'	<div class="collection black-text" id="search-coll" style="margin: -20px 0 0 0;">' +
	'   </div>';


function isAvailable() {
	window.plugins.googleplus.isAvailable(function (avail) {
		if (!avail) {
			alert('There was an error connecting to Google - Please check your internet connection.')
		} else {
			silentLogin();
		}
	});
}

function silentLogin() {
	window.plugins.googleplus.trySilentLogin(
		{'webClientId': '396697495271-ol2niqtfo75sbd27mit9d13r74v63ffo.apps.googleusercontent.com\t'},
		function (user) {
			$.ajaxSetup({
				beforeSend: function (xhr) {
					xhr.setRequestHeader("authentication", user.idToken);
				}
			});
			$.ajax({
				method: 'post',
				url: external + '/api/auth',
				data: {
					googleAuthToken: user.idToken,
					androidId: deviceId,
					iosId: null
				},
				success: function (data) {
					console.log(data);
				}
			});
			//M.toast({html: 'User ' + user.displayName + ' has logged in.'});
			$('#account').html('<i class="material-icons">person</i>' + user.displayName);
			$('#navbar').show();
			$(document.body).removeClass('blue');
			$(document.body).addClass('grey lighten-4');
			stores();
		},
		function (err) {
			console.log('Silent Login Failed:', err);
			login();
		}
	);
}


function login() {
	window.plugins.googleplus.login(
		{'webClientId': '396697495271-ol2niqtfo75sbd27mit9d13r74v63ffo.apps.googleusercontent.com'}, function (user) {
			$.ajaxSetup({
				beforeSend: function (xhr) {
					xhr.setRequestHeader("authentication", user.idToken);
				}
			});
			$.ajax({
				method: 'post',
				url: external + '/api/auth',
				data: {
					googleAuthToken: user.idToken,
					androidId: deviceId,
					iosId: null
				},
				success: function (data) {
					console.log(data);
				}
			});
			//M.toast({html: 'User ' + user.displayName + ' has logged in.'});
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
		function () {
			M.toast({html: 'Successfully logged out.'});
			login();
		},
		function (err) {
			M.toast({html: 'There was an error disconnecting your account - Please check your internet connection or update your device. Code: ' + err})
		}
	);
	$('#navbar').hide();
	$(document.body).addClass('blue');
	$(document.body).removeClass('grey lighten-4');
	$('#container').html('<div class="center" style="display: inline-block; vertical-align: middle;">\n' +
		'        <img style="width: 100%;display: inline-block; vertical-align: middle; position: relative;" src="img/swoop_trans.png">\n' +
		'        <a onclick="stores();" class="white-text" style="font-weight: bold; font-family: \'Futura-Bold\', sans-serif; font-size: 4.4rem">SwoopIt</a>\n' +
		'    </div>')
}

function regDevice(registrationID, oldRegId) {
	$.ajax({
		method: 'post',
		url: external + '/api/reg-android',
		data: {
			id: registrationID,
			oldIdL: oldRegId
		},
		success: function (res) {
			console.log(res);
		}
	})
}

function cache(notif) {
	// Get Everything for cache
	$.ajax({
		method: 'get',
		url: external + '/api/everything',
		success: function (res) {
			storesDB = res.stores;
			itemsDB = res.items;
			categoriesDB = res.categories;
			if (notif) {
				M.toast({html: 'Successfully Refreshed Cache.'});
				settings();
			}
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
	var secondsSince = Math.floor(new Date().getTime() / seconds) - (milliseconds / seconds);
	var minutesSince = Math.floor(new Date().getTime() / minutes) - (milliseconds / minutes);
	var hoursSince = Math.floor(new Date().getTime() / hours) - (milliseconds / hours);
	var daysSince = Math.floor(new Date().getTime() / days) - (milliseconds / days);
	if (daysSince >= 1) return daysSince.toFixed(0) + ' Days Ago';
	if (hoursSince >= 1) return hoursSince.toFixed(0) + ' Hours Ago';
	if (minutesSince >= 1) return minutesSince.toFixed(0) + ' Minutes Ago';
	if (secondsSince >= 1) return secondsSince.toFixed(0) + ' Seconds Ago';
	return 'Are You a Time Traveler??? this order hasn\'t been placed yet. \n (Or been around for less than 0 seconds - its one of the two)'
}