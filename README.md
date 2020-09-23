# file-drop

A simple library to enable client-side file uploads via drag-and-drop or click

Include file-drop.css and file-drop.js

```html
<div id="fileDropContainer">
	<input type="file" accept=".json" multiple />
</div>
```

```js
var fileDrop = new FileDrop(document.getElementById("fileDropContainer"));
fileDrop.addEventListener(FileDrop.EVENT_FILE, function(evt) {
	console.log(evt.detail); //evt.detail is the FileList
	console.log("Use a FileReader on the files");
});
```

## IE11 Support

Add this polyfill for CustomEvent in IE11

```html
<!-- CustomEvent polyfill for IE11 -->
<script>
	(function() {
		if (typeof window.CustomEvent === "function") return false; //If not IE

		function CustomEvent(event, params) {
			params = params || {bubbles: false, cancelable: false, detail: undefined};
			var evt = document.createEvent("CustomEvent");
			evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
			return evt;
		}

		CustomEvent.prototype = window.Event.prototype;

		window.CustomEvent = CustomEvent;
	})();
</script>
```
