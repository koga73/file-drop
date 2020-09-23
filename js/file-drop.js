/*
 * file-drop v1.0.0 Copyright (c) 2020 AJ Savino
 * https://github.com/koga73/file-drop
 * MIT License
 */
window["FileDrop"] = function(container, options) {
	options = options || {};
	options["DRAG_LEAVE_TIMEOUT"] = options["DRAG_LEAVE_TIMEOUT"] || 2500;
	options["CLASS_DRAG_BEGIN"] = options["CLASS_DRAG_BEGIN"] || "drag-begin";
	options["CLASS_DRAG_OVER"] = options["CLASS_DRAG_OVER"] || "drag-over";

	var _private = {
		fileInput: null,
		dragLeaveTimeout: null,

		handler_window_dragEnter: function(evt) {
			container.classList.add(options.CLASS_DRAG_BEGIN);
		},

		handler_window_dragLeave: function(evt) {
			if (_private.dragLeaveTimeout) {
				clearTimeout(_private.dragLeaveTimeout);
				_private.dragLeaveTimeout = 0;
			}
			_private.dragLeaveTimeout = setTimeout(function() {
				clearTimeout(_private.dragLeaveTimeout);
				_private.dragLeaveTimeout = 0;

				container.classList.remove(options.CLASS_DRAG_BEGIN);
				container.classList.remove(options.CLASS_DRAG_OVER);
			}, options.DRAG_LEAVE_TIMEOUT);
		},

		handler_fileInput_dragEnter: function() {
			container.classList.add(options.CLASS_DRAG_OVER);
		},

		handler_fileInput_dragLeave: function() {
			container.classList.remove(options.CLASS_DRAG_OVER);
		},

		handler_fileInput_drop: function(evt) {
			evt.preventDefault();

			container.classList.remove(options.CLASS_DRAG_BEGIN);
			container.classList.remove(options.CLASS_DRAG_OVER);

			_private.gotFiles(evt.dataTransfer.files);

			return false;
		},

		handler_fileInput_change: function(evt) {
			_private.gotFiles(evt.target.files);
		},

		gotFiles: function(files) {
			_public.dispatchEvent(
				new CustomEvent(window["FileDrop"]["EVENT_FILE"], {
					detail: files
				})
			);
		}
	};

	var _public = {
		init: function() {
			if (!container) {
				throw new Error("Container does not exist");
			}
			_private.fileInput = container.querySelector("input[type='file']");
			if (!_private.fileInput) {
				throw new Error("input[type='file'] not found in container");
			}
			_private.fileInput.addEventListener("dragenter", _private.handler_fileInput_dragEnter);
			_private.fileInput.addEventListener("dragleave", _private.handler_fileInput_dragLeave);
			_private.fileInput.addEventListener("drop", _private.handler_fileInput_drop);
			_private.fileInput.addEventListener("change", _private.handler_fileInput_change);

			window.addEventListener("dragenter", _private.handler_window_dragEnter);
			window.addEventListener("dragleave", _private.handler_window_dragLeave);
		},

		destroy: function() {
			if (_private.dragLeaveTimeout) {
				clearTimeout(_private.dragLeaveTimeout);
				_private.dragLeaveTimeout = 0;
			}

			if (_private.fileInput) {
				_private.fileInput.removeEventListener("dragenter", _private.handler_fileInput_dragEnter);
				_private.fileInput.removeEventListener("dragleave", _private.handler_fileInput_dragLeave);
				_private.fileInput.removeEventListener("drop", _private.handler_fileInput_drop);
				_private.fileInput.removeEventListener("change", _private.handler_fileInput_change);
				_private.fileInput = null;
			}

			window.removeEventListener("dragenter", _private.handler_window_dragEnter);
			window.removeEventListener("dragleave", _private.handler_window_dragLeave);

			if (container) {
				container.classList.remove(options.CLASS_DRAG_BEGIN);
				container.classList.remove(options.CLASS_DRAG_OVER);
			}
		},

		//Proxy events to fileInput
		addEventListener: function() {
			_private.fileInput.addEventListener.apply(_private.fileInput, arguments);
		},
		removeEventListener: function() {
			_private.fileInput.removeEventListener.apply(_private.fileInput, arguments);
		},
		dispatchEvent: function() {
			_private.fileInput.dispatchEvent.apply(_private.fileInput, arguments);
		}
	};
	_public.init();
	return _public;
};
window["FileDrop"]["EVENT_FILE"] = "file-drop:file";
