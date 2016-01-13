# FileDrop
A simple library to enable client-side file uploads via drag-and-drop or click

Include CSS and FileDrop.js
```html
<div id="fileDropContainer">
	<input type="file" accept=".json"/>
</div>
```

```js
var fileDrop = new FileDrop(document.getElementById("fileDropContainer"));
fileDrop.addEventListener(FileDrop.EVENT_FILE, function(evt){
	console.log(evt._data); //evt._data is the file
});
```