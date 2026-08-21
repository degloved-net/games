(function (Scratch) {
  "use strict";

  class UppercaseExtension {
    getInfo() {
      return {
        id: "uppercasetools",
        name: "Uppercase Tools",
        color1: "#9B59B6",
        color2: "#7D3C98",
        blocks: [
          {
            opcode: "hasUppercase",
            blockType: Scratch.BlockType.BOOLEAN,
            text: "[TEXT] has uppercase letters?",
            arguments: {
              TEXT: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "Hello World",
              },
            },
          },
          {
            opcode: "toLowercase",
            blockType: Scratch.BlockType.REPORTER,
            text: "turn uppercase in [TEXT] to lowercase",
            arguments: {
              TEXT: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "Hello WÖRLD",
              },
            },
          },
        ],
      };
    }

    hasUppercase(args) {
      const text = String(args.TEXT);
      return /[A-ZÖÄÜÀÁÂÃÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕØÙÚÛÜÝÞ]/.test(text);
    }

    toLowercase(args) {
      const text = String(args.TEXT);
      return text.toLowerCase();
    }
  }

  Scratch.extensions.register(new UppercaseExtension());
})(Scratch);