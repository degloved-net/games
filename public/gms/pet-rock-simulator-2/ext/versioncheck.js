// Pet Rock Simulator – Version Check Extension
// Uses JSONP via dynamic <script> tag — works everywhere including file:// on Chrome
// No CORS issues because <script> tags bypass CORS entirely.
//
// On Neocities, create a file called "version.js" containing:
//   __petRockVersion({"latest":"1.4.0","url":"https://allpetrocksimulators.neocities.org"});

(function (Scratch) {
  "use strict";

  const VERSION_JS_URL = "ext/version.js";

  const _versionPromise = new Promise((resolve) => {
    // JSONP: inject a <script> tag — bypasses CORS even from file://
    window.__petRockVersion = function (data) {
      resolve(data);
    };

    const script = document.createElement("script");
    script.src = VERSION_JS_URL;
    script.onerror = () => {
      console.warn("[petrock-version] Could not load version.js");
      resolve(null);
    };
    document.head.appendChild(script);
  });

  function fetchVersionInfo() {
    return _versionPromise;
  }

  // Returns true if version string `a` is strictly older than `b`.
  function isOlderThan(a, b) {
    const parse = (v) =>
      String(v)
        .trim()
        .replace(/^v/i, "")
        .split(".")
        .map((n) => parseInt(n, 10) || 0);

    const av = parse(a);
    const bv = parse(b);
    const len = Math.max(av.length, bv.length);

    for (let i = 0; i < len; i++) {
      const an = av[i] ?? 0;
      const bn = bv[i] ?? 0;
      if (an < bn) return true;
      if (an > bn) return false;
    }
    return false;
  }

  class PetRockVersionExtension {
    getInfo() {
      return {
        id: "petRockVersion",
        name: "Pet Rock Version",
        color1: "#5C6BC0",
        color2: "#3949AB",
        blocks: [
          {
            opcode: "isOlderVersion",
            blockType: Scratch.BlockType.BOOLEAN,
            text: "is [VERSION] an older version?",
            arguments: {
              VERSION: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "1.0.0",
              },
            },
          },
          {
            opcode: "newestVersionLink",
            blockType: Scratch.BlockType.REPORTER,
            text: "newest version link",
          },
          {
            opcode: "latestVersionNumber",
            blockType: Scratch.BlockType.REPORTER,
            text: "latest version number",
          },
        ],
      };
    }

    async isOlderVersion({ VERSION }) {
      const info = await fetchVersionInfo();
      if (!info || !info.latest) return false;
      return isOlderThan(VERSION, info.latest);
    }

    async newestVersionLink() {
      const info = await fetchVersionInfo();
      return info?.url ?? "https://allpetrocksimulators.neocities.org";
    }

    async latestVersionNumber() {
      const info = await fetchVersionInfo();
      return info?.latest ?? "unknown";
    }
  }

  Scratch.extensions.register(new PetRockVersionExtension());
})(Scratch);