"use strict";
// This helper remembers the size and position of your windows, and restores
// them in that place after app relaunch.
// Can be used for more than one window, just construct many
// instances of it and give each different name.
Object.defineProperty(exports, "__esModule", { value: true });
var electron_1 = require("electron");
//import jetpack from "fs-jetpack";
var jetpack = require("fs-jetpack");
exports.default = (function (name, options) {
    var userDataDir = jetpack.cwd(electron_1.app.getPath("userData"));
    var stateStoreFile = "window-state-".concat(name, ".json");
    var defaultSize = {
        width: options.width,
        height: options.height
    };
    var state = {};
    var win;
    var restore = function () {
        var restoredState = {};
        try {
            restoredState = userDataDir.read(stateStoreFile, "json");
        }
        catch (err) {
            // For some reason json can't be read (might be corrupted).
            // No worries, we have defaults.
        }
        return Object.assign({}, defaultSize, restoredState);
    };
    var getCurrentPosition = function () {
        var position = win.getPosition();
        var size = win.getSize();
        return {
            x: position[0],
            y: position[1],
            width: size[0],
            height: size[1]
        };
    };
    var windowWithinBounds = function (windowState, bounds) {
        return (windowState.x >= bounds.x &&
            windowState.y >= bounds.y &&
            windowState.x + windowState.width <= bounds.x + bounds.width &&
            windowState.y + windowState.height <= bounds.y + bounds.height);
    };
    var resetToDefaults = function () {
        var bounds = electron_1.screen.getPrimaryDisplay().bounds;
        return Object.assign({}, defaultSize, {
            x: (bounds.width - defaultSize.width) / 2,
            y: (bounds.height - defaultSize.height) / 2
        });
    };
    var ensureVisibleOnSomeDisplay = function (windowState) {
        var visible = electron_1.screen.getAllDisplays().some(function (display) {
            return windowWithinBounds(windowState, display.bounds);
        });
        if (!visible) {
            // Window is partially or fully not visible now.
            // Reset it to safe defaults.
            return resetToDefaults();
        }
        return windowState;
    };
    var saveState = function () {
        if (!win.isMinimized() && !win.isMaximized()) {
            Object.assign(state, getCurrentPosition());
        }
        userDataDir.write(stateStoreFile, state, { atomic: true });
    };
    state = ensureVisibleOnSomeDisplay(restore());
    win = new electron_1.BrowserWindow(Object.assign({}, options, state));
    win.on("close", saveState);
    return win;
});
//# sourceMappingURL=window.js.map