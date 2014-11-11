var container = document.querySelector('#card');
var msnry;
imagesLoaded( container, function() {
	msnry = new Masonry(container, {
		itemSelector: '.item'
	});
});