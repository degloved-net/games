/*:
 * @plugindesc Adds port credits to the Title Screen and Main Menu.
 * @author reeyuki
 *
 * @help
 * This plugin adds "port by reeyuki reeyuki.nekoweb.org" to the title screen 
 * and the main (pause) menu.
 */

(function () {
    // Title Screen
    var _Scene_Title_createForeground = Scene_Title.prototype.createForeground;
    Scene_Title.prototype.createForeground = function () {
        _Scene_Title_createForeground.call(this);
        this.createPortCreditREE();
    };

    Scene_Title.prototype.createPortCreditREE = function () {
        this._portCreditSpriteREE = new Sprite(new Bitmap(Graphics.width, Graphics.height));
        this.addChild(this._portCreditSpriteREE);
        this.drawPortCreditREE();
    };

    Scene_Title.prototype.drawPortCreditREE = function () {
        var x = 20;
        var y = Graphics.height - 30;
        var maxWidth = Graphics.width - x * 2;
        var text = "port by reeyuki reeyuki.nekoweb.org";
        this._portCreditSpriteREE.bitmap.outlineColor = 'black';
        this._portCreditSpriteREE.bitmap.outlineWidth = 4;
        this._portCreditSpriteREE.bitmap.fontSize = 14;
        this._portCreditSpriteREE.bitmap.drawText(text, x, y, maxWidth, 30, 'right');
    };

    // Main Menu (Pause Menu)
    var _Scene_Menu_create = Scene_Menu.prototype.create;
    Scene_Menu.prototype.create = function () {
        _Scene_Menu_create.call(this);
        this.createPortCreditREE();
    };

    Scene_Menu.prototype.createPortCreditREE = function () {
        this._portCreditSpriteREE = new Sprite(new Bitmap(Graphics.width, Graphics.height));
        this.addChild(this._portCreditSpriteREE);
        this.drawPortCreditREE();
    };

    Scene_Menu.prototype.drawPortCreditREE = function () {
        // In the pause menu, we might want it slightly higher or different position if windows overlap
        var x = 20;
        var y = Graphics.height - 30;
        var maxWidth = Graphics.width - x * 2;
        var text = "port by reeyuki reeyuki.nekoweb.org";
        this._portCreditSpriteREE.bitmap.outlineColor = 'black';
        this._portCreditSpriteREE.bitmap.outlineWidth = 4;
        this._portCreditSpriteREE.bitmap.fontSize = 14;
        this._portCreditSpriteREE.bitmap.drawText(text, x, y, maxWidth, 30, 'right');
    };
})();
