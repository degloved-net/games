const vfs = {
    _cache: {},
    _cacheB64: {},
    _cacheBuf: {},

    fetchText(url) {
        if (this._cache[url] !== undefined) return this._cache[url];
        // For missing files (e.g. save data), check Emscripten FS + localStorage
        try {
            if (typeof FS !== 'undefined') {
                var tried = [];
                var emPath = url.startsWith('./') ? '/' + url.substring(2) : url;
                tried.push(emPath);
                // For save paths, also try alternative locations
                var filename = emPath.split('/').pop();
                if (emPath.indexOf('OneShotWME') >= 0 || emPath.indexOf('/Saves/') >= 0) {
                    tried.push('/OneShotWME/' + filename);
                    tried.push('/libsdl/OneShotWME/' + filename);
                    tried.push('/libsdl/Saves/OneShotWME/' + filename);
                }
                for (var p = 0; p < tried.length; p++) {
                    try {
                        if (FS.analyzePath(tried[p]).exists) {
                            var data = FS.readFile(tried[p], { encoding: 'utf8' });
                            this._cache[url] = data;
                            // Sync found save data to other locations and localStorage
                            if (filename.endsWith('.dat') || filename.endsWith('.conf')) {
                                localStorage.setItem('oneshot_save_' + filename, data);
                                for (var pp = 0; pp < tried.length; pp++) {
                                    try {
                                        if (!FS.analyzePath(tried[pp].substring(0, tried[pp].lastIndexOf('/'))).exists)
                                            FS.mkdirTree(tried[pp].substring(0, tried[pp].lastIndexOf('/')));
                                        FS.writeFile(tried[pp], data, { encoding: 'utf8' });
                                    } catch(e) {}
                                }
                            }
                            return data;
                        }
                    } catch(e) {}
                }
            }
        } catch(e) {}
        const req = new XMLHttpRequest();
        req.open("GET", url, false);
        req.send();
        if (req.status !== 200 && req.status !== 0)
            throw new Error(`VFS: ${req.status} for ${url}`);
        this._cache[url] = req.responseText;
        return req.responseText;
    },

    fetchBinary(url) {
        if (this._cache[url]) return this._cache[url];
        const req = new XMLHttpRequest();
        req.open("GET", url, false);
        req.overrideMimeType("text/plain; charset=x-user-defined");
        req.send();
        if (req.status !== 200 && req.status !== 0)
            throw new Error(`VFS: ${req.status} for ${url}`);
        this._cache[url] = req.responseText;
        return req.responseText;
    },

    fetchBinaryB64(url) {
        if (this._cacheB64[url]) return this._cacheB64[url];
        // Preloaded ArrayBuffer path (fast, no encoding issues)
        if (this._cacheBuf && this._cacheBuf[url]) {
            const bytes = new Uint8Array(this._cacheBuf[url]);
            let binary = '';
            const chunk = 8192;
            for (let i = 0; i < bytes.length; i += chunk) {
                const end = Math.min(i + chunk, bytes.length);
                const slice = bytes.subarray(i, end);
                binary += String.fromCharCode.apply(null, slice);
            }
            this._cacheB64[url] = btoa(binary);
            return this._cacheB64[url];
        }
        // Fallback: synchronous XHR with x-user-defined
        const req = new XMLHttpRequest();
        req.open("GET", url, false);
        req.overrideMimeType("text/plain; charset=x-user-defined");
        req.send();
        if (req.status !== 200 && req.status !== 0)
            throw new Error(`VFS: ${req.status} for ${url}`);
        const raw = req.responseText;
        const len = raw.length;
        let binary = '';
        for (let i = 0; i < len; i++) {
            let c = raw.charCodeAt(i);
            if (c >= 0xF780 && c <= 0xF7FF)
                c = c - 0xF780 + 0x80;
            binary += String.fromCharCode(c);
        }
        this._cacheB64[url] = btoa(binary);
        return this._cacheB64[url];
    },

    saveWrite(key, value) {
        try { localStorage.setItem(key, value); } catch(e) {
            console.warn("saveWrite failed:", key, e);
        }
    },

    saveRead(key) {
        try { return localStorage.getItem(key); } catch(e) {
            console.warn("saveRead failed:", key, e);
            return null;
        }
    },

    saveDelete(key) {
        try { localStorage.removeItem(key); } catch(e) {
            console.warn("saveDelete failed:", key, e);
        }
    },

    listSaves() {
        try {
            const keys = [];
            for (let i = 0; i < localStorage.length; i++) {
                const k = localStorage.key(i);
                if (k && k.startsWith("oneshot_save_")) keys.push(k);
            }
            return JSON.stringify(keys);
        } catch(e) {
            console.warn("listSaves failed:", e);
            return "[]";
        }
    }
};

const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

let audioUnlocked = false;

function unlockAudio() {
    if (audioUnlocked) return;
    audioUnlocked = true;
    if (audioCtx.state === 'suspended') audioCtx.resume();
    document.removeEventListener('click', unlockAudio, true);
    document.removeEventListener('keydown', unlockAudio, true);
    document.removeEventListener('touchstart', unlockAudio, true);
}

document.addEventListener('click', unlockAudio, true);
document.addEventListener('keydown', unlockAudio, true);
document.addEventListener('touchstart', unlockAudio, true);

const audioBridge = {
    musicAudio: null,
    preloaded: {},
    _preloadedMusicUrls: {},

    playMusic(path, volume, loop) {
        if (this.musicAudio) { this.musicAudio.pause(); this.musicAudio = null; }
        const src = this._preloadedMusicUrls[path] || path;
        this.musicAudio = new Audio(src);
        this.musicAudio.loop = loop;
        this.musicAudio.volume = volume || 0.5;
        const playPromise = this.musicAudio.play();
        if (playPromise) playPromise.catch(e => {
            if (e.name === 'NotAllowedError') {
                const tryPlay = () => {
                    this.musicAudio.play().catch(() => {});
                    document.removeEventListener('click', tryPlay, true);
                    document.removeEventListener('keydown', tryPlay, true);
                };
                document.addEventListener('click', tryPlay, true);
                document.addEventListener('keydown', tryPlay, true);
            }
        });
    },

    stopMusic() {
        if (this.musicAudio) { this.musicAudio.pause(); this.musicAudio = null; }
    },

    pauseMusic() { if (this.musicAudio) this.musicAudio.pause(); },

    resumeMusic() {
        if (this.musicAudio) {
            const playPromise = this.musicAudio.play();
            if (playPromise) playPromise.catch(() => {});
        }
    },

    setMusicVolume(vol) { if (this.musicAudio) this.musicAudio.volume = Math.max(0, Math.min(1, vol)); },

    setMusicPitch(pitch) {
        if (this.musicAudio) {
            try { this.musicAudio.playbackRate = Math.max(0.25, Math.min(4, pitch)); } catch(e) {}
        }
    },

    preloadSound(name, path) {
        if (this.preloaded[name]) return;
        fetch(path)
            .then(r => r.arrayBuffer())
            .then(buf => audioCtx.decodeAudioData(buf))
            .then(audioBuf => { this.preloaded[name] = audioBuf; })
            .catch(e => console.warn('Failed to preload sound:', name, e));
    },

    playSound(name, volume, pitch) {
        const buf = this.preloaded[name];
        if (!buf) return;
        try {
            if (audioCtx.state === 'suspended') audioCtx.resume();
            const source = audioCtx.createBufferSource();
            source.buffer = buf;
            source.playbackRate.value = Math.max(0.25, Math.min(4, pitch || 1));
            const gain = audioCtx.createGain();
            gain.gain.value = Math.max(0, Math.min(1, volume || 1));
            source.connect(gain);
            gain.connect(audioCtx.destination);
            source.start();
        } catch(e) { console.warn('Sound play failed:', e); }
    }
};

const browser = {
    openUrl(url) {
        window.open(url, '_blank');
    }
};

const steamJS = {
    getPersonaName() { return "Player"; },
    getLanguage() {
        const map = {
            "zh-CN": "schinese", "zh-TW": "tchinese", "pt-BR": "brazilian",
            "es-ES": "spanish", "fr": "french", "it": "italian",
            "ja": "japanese", "ko": "korean", "ru": "russian"
        };
        return map[navigator.language] || map[navigator.language?.split("-")[0]] || "english";
    },
    getAchievement(name) { return false; },
    setAchievement(name) {}
};

let dotnet, exports, canvas;

function setLoadingText(msg) {
    const el = document.getElementById("loading-text");
    if (el) el.textContent = msg;
}

async function preloadFiles(baseUrl, onProgress) {
    const manifestUrl = new URL("gamedata/manifest.txt", baseUrl).href;
    let lines;
    try {
        const resp = await fetch(manifestUrl);
        lines = (await resp.text()).trim().split('\n').filter(f => f);
    } catch(e) {
        console.warn("Preload: manifest unavailable, skipping");
        return;
    }
    const total = lines.length;
    let completed = 0;
    const audioExts = new Set(['.ogg', '.wav']);
    const CONCURRENCY = 32;
    async function fetchOne(line) {
        const url = new URL(line, baseUrl).href;
        try {
            const resp = await fetch(url);
            const buf = await resp.arrayBuffer();
            const ext = line.substring(line.lastIndexOf('.')).toLowerCase();
            // Store ArrayBuffer for binary XNBs; convert to base64 on demand
            vfs._cacheBuf[url] = buf;
            if (audioExts.has(ext)) {
                const mime = ext === '.ogg' ? 'audio/ogg' : 'audio/wav';
                const blob = new Blob([buf], { type: mime });
                audioBridge._preloadedMusicUrls[url] = URL.createObjectURL(blob);
            }
        } catch(e) {
            console.warn("Preload failed: " + url);
        }
    }
    for (let i = 0; i < total; i += CONCURRENCY) {
        const batch = lines.slice(i, i + CONCURRENCY);
        await Promise.all(batch.map(fetchOne));
        completed += batch.length;
        onProgress(Math.round(completed / total * 100));
    }
}

function setupSavePersistence(rt) {
    var fs = rt && rt.Module && rt.Module.FS;

    if (!fs || !fs.readFile || !fs.writeFile || !fs.analyzePath || !fs.mkdirTree) {
        var wait = setInterval(function() {
            fs = rt && rt.Module && rt.Module.FS;
            if (fs && fs.readFile && fs.writeFile && fs.analyzePath && fs.mkdirTree) {
                clearInterval(wait);
                initSavePersistence(fs);
            }
        }, 200);
        return;
    }
    initSavePersistence(fs);
}

function initSavePersistence(fs) {
    var saveDirs = ['/OneShotWME', '/libsdl/OneShotWME', '/libsdl/Saves/OneShotWME'];
    var knownFiles = ['save.dat', 'save.conf', 'settings.conf', 'config.dat', 'profiles.dat'];
    var lastContent = {};

    for (var d = 0; d < saveDirs.length; d++) {
        try { if (!fs.analyzePath(saveDirs[d]).exists) fs.mkdirTree(saveDirs[d]); } catch(e) {}
    }

    // Restore saves from localStorage into Emscripten FS
    var restored = 0;
    for (var i = 0; i < localStorage.length; i++) {
        var key = localStorage.key(i);
        if (key && key.startsWith('oneshot_save_')) {
            var filename = key.substring('oneshot_save_'.length);
            var data = localStorage.getItem(key);
            // Write to first dir that doesn't already have the file
            var wrote = false;
            for (var d = 0; d < saveDirs.length; d++) {
                try {
                    if (!fs.analyzePath(saveDirs[d] + '/' + filename).exists) {
                        fs.writeFile(saveDirs[d] + '/' + filename, data, { encoding: 'utf8' });
                        wrote = true;
                        break;
                    }
                } catch(e) {}
            }
            if (!wrote) {
                // All dirs already have the file — just write to first
                try { fs.writeFile(saveDirs[0] + '/' + filename, data, { encoding: 'utf8' }); } catch(e) {}
            }
            restored++;
        }
    }
    if (restored > 0) console.log('Restored ' + restored + ' save file(s) from localStorage');

    // Poll for save file changes every 3 seconds and sync to localStorage
    setInterval(function() {
        try {
            for (var d = 0; d < saveDirs.length; d++) {
                for (var k = 0; k < knownFiles.length; k++) {
                    var path = saveDirs[d] + '/' + knownFiles[k];
                    try {
                        if (fs.analyzePath(path).exists) {
                            var content = fs.readFile(path, { encoding: 'utf8' });
                            if (lastContent[knownFiles[k]] !== content) {
                                lastContent[knownFiles[k]] = content;
                                localStorage.setItem('oneshot_save_' + knownFiles[k], content);
                            }
                        }
                    } catch(e) {}
                }
            }
        } catch(e) {}
    }, 3000);
}

async function init() {
    const overlay = document.getElementById("loading-overlay");
    canvas = document.getElementById("canvas");

    try {
        setLoadingText("Caching game files...");
        const baseUrl = new URL("./", document.baseURI).href;
        if (!baseUrl.startsWith('file://')) {
            await preloadFiles(baseUrl, pct => {
                setLoadingText(`Caching game files... ${pct}%`);
            });
        }

        setLoadingText("Loading WASM runtime...");

        const url = new URL("./_framework/dotnet.js", baseUrl).href;
        const wasm = await import(url);
        dotnet = wasm.dotnet;

        const runtime = await dotnet
            .withConfig({})
            .withRuntimeOptions([
                "--jiterpreter-minimum-trace-hit-count=500",
                "--jiterpreter-trace-monitoring-period=100",
                "--jiterpreter-trace-monitoring-max-average-penalty=150",
                "--jiterpreter-wasm-bytes-limit=67108864",
                "--jiterpreter-table-size=32768",
                "--jiterpreter-stats-enabled",
            ])
            .create();

        const config = runtime.getConfig();
        exports = await runtime.getAssemblyExports(config.mainAssemblyName);

        runtime.setModuleImports("OneshotWeb", { audioBridge, steamJS, vfs, browser });

        setLoadingText("Loading game content...");

        await runtime.runMain();
        await exports.OneshotWeb.Program.PreInit(baseUrl);

        // Expose runtime for debugging and testing
        window.__runtime = runtime;
        // Hook Emscripten FS writes to persist saves to localStorage
        setupSavePersistence(runtime);

        canvas.width = 1280;
        canvas.height = 720;

        await exports.OneshotWeb.Program.Init();

        setLoadingText("Starting game...");

        // Run a few seamless init frames
        for (let i = 0; i < 10; i++) {
            const ok = await exports.OneshotWeb.Program.RunOneFrameJS();
            if (!ok) break;
        }

        overlay.classList.add("hidden");

        await exports.OneshotWeb.Program.MainLoop();
        await exports.OneshotWeb.Program.Cleanup();
    } catch (err) {
        console.error("Fatal error:", err);
        setLoadingText("Error: " + (err.message || err));
    }
}

init();
