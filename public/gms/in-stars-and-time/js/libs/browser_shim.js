(function () {
    if (typeof window.process === 'undefined') {
        window.process = {
            versions: {
                'node-webkit': '0.0.0'
            },
            platform: 'browser',
            mainModule: {
                filename: location.pathname
            }
        };
    }

    if (typeof window.require === 'undefined') {
        window.require = function (module) {
            console.warn('Browser shim: require(' + module + ') called but not supported in browser.');
            if (module === 'nw.gui') {
                return {
                    Window: {
                        get: function () {
                            return {
                                on: function () { },
                                removeAllListeners: function () { },
                                showDevTools: function () { },
                                setAlwaysOnTop: function () { },
                                restore: function () { },
                                minimize: function () { },
                                setShowInTaskbar: function () { },
                                close: function () { },
                                moveTo: function () { },
                                focus: function () { },
                                title: '',
                                window: window
                            };
                        },
                        open: function (url, options, callback) {
                            console.warn('Browser shim: Window.open called. URL: ' + url);
                            if (callback) {
                                // Simulate async window opening for callback-based calls
                                setTimeout(function () {
                                    callback({
                                        on: function () { },
                                        close: function () { },
                                        setShowInTaskbar: function () { },
                                        moveTo: function () { },
                                        focus: function () { },
                                        window: { document: {} }
                                    });
                                }, 100);
                            }
                            return {
                                on: function () { },
                                close: function () { },
                                setShowInTaskbar: function () { },
                                moveTo: function () { },
                                focus: function () { },
                                window: { document: {} }
                            };
                        }
                    },
                    App: {
                        argv: []
                    },
                    Menu: function () {
                        return {
                            createMacBuiltin: function () { }
                        };
                    }
                };
            }
            if (module === 'fs') {
                return {
                    existsSync: function () { return false; },
                    writeFileSync: function () { },
                    readFileSync: function () { return ''; },
                    mkdirSync: function () { }
                };
            }
            if (module === 'path') {
                return {
                    join: function () { return Array.prototype.slice.call(arguments).join('/'); },
                    dirname: function (p) {
                        var parts = p.split('/');
                        parts.pop();
                        return parts.join('/');
                    }
                };
            }
            return {};
        };
    }
})();
