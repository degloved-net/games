(function(Scratch) {
"use strict";

class RockCrypto {

getInfo() {
return {
id: "rockcrypto",
name: "Rock Encryption",
color1: "#5b6eff",
blocks: [

{
opcode: "encrypt",
blockType: Scratch.BlockType.REPORTER,
text: "encrypt [TEXT] with key [KEY]",
arguments: {
TEXT: { type: Scratch.ArgumentType.STRING, defaultValue: "hello" },
KEY: { type: Scratch.ArgumentType.STRING, defaultValue: "bob" }
}
},

{
opcode: "decrypt",
blockType: Scratch.BlockType.REPORTER,
text: "decrypt [TEXT] with key [KEY]",
arguments: {
TEXT: { type: Scratch.ArgumentType.STRING, defaultValue: "" },
KEY: { type: Scratch.ArgumentType.STRING, defaultValue: "bob" }
}
}

]
};
}

xor(text, key) {
text = String(text);
key = String(key);

let result = "";

for (let i = 0; i < text.length; i++) {
let t = text.charCodeAt(i);
let k = key.charCodeAt(i % key.length);
result += String.fromCharCode(t ^ k);
}

return result;
}

encode(str) {
return btoa(unescape(encodeURIComponent(str)));
}

decode(str) {
return decodeURIComponent(escape(atob(str)));
}

encrypt(args) {

let text = String(args.TEXT);
let key = String(args.KEY);

let data = text;

for (let i = 0; i < 6; i++) {
data = this.xor(data, key);
data = this.encode(data);
}

return data;

}

decrypt(args) {

let text = String(args.TEXT);
let key = String(args.KEY);

let data = text;

try {
for (let i = 0; i < 6; i++) {
data = this.decode(data);
data = this.xor(data, key);
}
} catch(e) {
return "wrong key";
}

return data;

}

}

Scratch.extensions.register(new RockCrypto());

})(Scratch);