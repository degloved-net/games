class SaveFileSystem {
  constructor() {
    this.saveList = [];
    this.fileHandle = null;
    this.loaded = false;
  }

  getInfo() {
    return {
      id: 'savefilesystem',
      name: 'Save File System',
      blocks: [
        {
          opcode: 'resetList',
          blockType: Scratch.BlockType.COMMAND,
          text: 'reset save list'
        },
        {
          opcode: 'addLine',
          blockType: Scratch.BlockType.COMMAND,
          text: 'add line [TEXT]',
          arguments: {
            TEXT: { type: Scratch.ArgumentType.STRING }
          }
        },
        {
          opcode: 'setLine',
          blockType: Scratch.BlockType.COMMAND,
          text: 'set line [INDEX] to [TEXT]',
          arguments: {
            INDEX: { type: Scratch.ArgumentType.NUMBER },
            TEXT: { type: Scratch.ArgumentType.STRING }
          }
        },
        {
          opcode: 'getLine',
          blockType: Scratch.BlockType.REPORTER,
          text: 'get line [INDEX]',
          arguments: {
            INDEX: { type: Scratch.ArgumentType.NUMBER }
          }
        },
        {
          opcode: 'lineCount',
          blockType: Scratch.BlockType.REPORTER,
          text: 'number of lines'
        },
        {
          opcode: 'getRawData',
          blockType: Scratch.BlockType.REPORTER,
          text: 'get raw save data'
        },
        {
          opcode: 'downloadSave',
          blockType: Scratch.BlockType.COMMAND,
          text: 'download save as [NAME] with format [FORMAT]',
          arguments: {
            NAME: { type: Scratch.ArgumentType.STRING },
            FORMAT: { type: Scratch.ArgumentType.STRING }
          }
        },
        {
          opcode: 'openPersistentFile',
          blockType: Scratch.BlockType.COMMAND,
          text: 'open save file (persistent)'
        },
        {
          opcode: 'overwriteFile',
          blockType: Scratch.BlockType.COMMAND,
          text: 'overwrite opened save file'
        },
        {
          opcode: 'isFileOpened',
          blockType: Scratch.BlockType.BOOLEAN,
          text: 'is file opened?'
        },
        {
          opcode: 'isLoaded',
          blockType: Scratch.BlockType.BOOLEAN,
          text: 'file loaded?'
        }
      ]
    };
  }

  resetList() {
    this.saveList = [];
  }

  addLine(args) {
    this.saveList.push(String(args.TEXT));
  }

  setLine(args) {
    const index = Math.floor(args.INDEX) - 1;
    if (index >= 0 && index < this.saveList.length) {
      this.saveList[index] = String(args.TEXT);
    }
  }

  getLine(args) {
    const index = Math.floor(args.INDEX) - 1;
    return this.saveList[index] || '';
  }

  lineCount() {
    return this.saveList.length;
  }

  getRawData() {
    return this.saveList.join('\n');
  }

  downloadSave(args) {
    const name = args.NAME || "save";
    const format = args.FORMAT ? args.FORMAT.replace(/^\./, '') : "prssave";
    const filename = `${name}.${format}`;

    const data = this.saveList.join('\n');
    const blob = new Blob([data], { type: "text/plain" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  async openPersistentFile() {
    this.loaded = false;

    if (window.showOpenFilePicker) {
      try {
        const handles = await window.showOpenFilePicker({ multiple: false });
        this.fileHandle = handles[0];
        const file = await this.fileHandle.getFile();
        const text = await file.text();
        this.saveList = text.trim() ? text.split(/\r?\n/) : [];
        this.loaded = true;
      } catch (err) {
        console.error("File open cancelled or failed", err);
      }
    } else {
      await new Promise((resolve) => {
        const input = document.createElement('input');
        input.type = 'file';
        input.style.display = 'none';
        document.body.appendChild(input);
        input.click();
        input.addEventListener('cancel', () => {
          document.body.removeChild(input);
          resolve();
        });
        input.onchange = async () => {
          const file = input.files?.[0];
          document.body.removeChild(input);
          if (!file) { resolve(); return; }
          const text = await file.text();
          this.saveList = text.trim() ? text.split(/\r?\n/) : [];
          this.loaded = true;
          resolve();
        };
      });
    }
  }

  async overwriteFile() {
    if (!this.fileHandle) {
      const blob = new Blob([this.saveList.join('\n')], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "save.prssave";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      return;
    }
    try {
      const writable = await this.fileHandle.createWritable();
      await writable.write(this.saveList.join('\n'));
      await writable.close();
    } catch (err) {
      console.error("Overwrite failed", err);
    }
  }

  isFileOpened() {
    return this.fileHandle !== null;
  }

  isLoaded() {
    return this.loaded;
  }
}

Scratch.extensions.register(new SaveFileSystem());