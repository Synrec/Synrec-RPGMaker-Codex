/*:
 *@author Kaisyl/Synrec
 *@plugindesc (v3) Control HP, MP and TP effects.
 *@help Recover HP after battle by enabling this plugin.
 *PLUGIN CHANGES:
 *v2: 
 *- Added TP initialize control.
 *- Fixed a few stuff for future edits if necessary
 *v3:
 *- Added parameter to modify HP, MP and TP bar colors.
 *
 *@param Enable Auto Recovery
 *@desc Enable or Disable recovery after every battle
 *@default false
 *@type Boolean
 *
 *@param HP Recovery
 *@desc Control % of how much HP is recovered.
 *@default 100
 *@type number
 *@max 100
 *@min 0
 *
 *@param HP Bar Color 1
 *@desc The color '1' of the HP bar. Default = 20.
 *@default 20
 *@type number
 *@max 31
 *@min 0
 *
 *@param HP Bar Color 2
 *@desc The color '2' of the HP bar. Default = 21.
 *@default 21
 *@type number
 *@max 31
 *@min 0
 *
 *@param MP Recovery
 *@desc Control % of how much MP is recovered.
 *@default 100
 *@type number
 *@max 100
 *@min 0
 *
 *@param MP Bar Color 1
 *@desc The color '1' of the MP bar. Default = 22.
 *@default 22
 *@type number
 *@max 31
 *@min 0
 *
 *@param MP Bar Color 2
 *@desc The color '2' of the MP bar. Default = 23
 *@default 23
 *@type number
 *@max 31
 *@min 0
 *
 *@param TP Recovery
 *@desc Control how much TP is recovered.
 *@default 100
 *@type number
 *
 *@param TP Bar Color 1
 *@desc The color '1' of the MP bar. Default = 22.
 *@default 28
 *@type number
 *@max 31
 *@min 0
 *
 *@param TP Bar Color 2
 *@desc The color '2' of the MP bar. Default = 23
 *@default 29
 *@type number
 *@max 31
 *@min 0
 *
 *@param Clear All States
 *@desc Remove all states?
 *@default false
 *@type boolean
 *
 *@param Max TP
 *@desc Maximum Value for TP in game.
 *@type number
 *@default 100
 *
 *@param Initial TP
 *@desc Set the starting TP, will not be more than max.
 *@type number
 *@default 100
 */
var params = PluginManager.parameters('Kaisyl_Battle_Recovery');
var synrecRecover = params['Enable Auto Recovery'].toLowerCase();
var hpRecover = parseInt(params['HP Recovery'], 100);
var hpBarColor1 = parseInt(params['HP Bar Color 1'], 20);
var hpBarColor2 = parseInt(params['HP Bar Color 2'], 21);
var hpBarLowColor1 = parseInt(params['Low HP Bar Color 1'], 20);
var hpBarLowColor2 = parseInt(params['Low HP Bar Color 2'], 21);
var mpRecover = parseInt(params['MP Recovery'], 100);
var mpBarColor1 = parseInt(params['MP Bar Color 1'], 22);
var mpBarColor2 = parseInt(params['MP Bar Color 2'], 23);
var mpBarLowColor1 = parseInt(params['Low MP Bar Color 1'], 22);
var mpBarLowColor2 = parseInt(params['Low MP Bar Color 2'], 23);
var tpRecover = parseInt(params['TP Recovery'], 100);
var tpBarColor1 = parseInt(params['TP Bar Color 1'], 28);
var tpBarColor2 = parseInt(params['TP Bar Color 2'], 29);
var clearStates = params['Clear All States'].toLowerCase();
var tpMax = parseInt(params['Max TP']);
var initialTpMax = parseInt(params['Initial TP']);

kaisylEndOfWar = BattleManager.endBattle;
BattleManager.endBattle = function(result) {
    kaisylEndOfWar.call(this, result);
    if (synrecRecover == "true") {
        var party = $gameParty.battleMembers();
        for (var mem = 0; mem < party.length; mem++) {
           var member = party[mem];
           member.gainHp(Math.ceil(member.mhp * hpRecover/100));
           member.gainMp(Math.ceil(member.mmp * mpRecover/100));
           member.gainTp(tpRecover);
           if (clearStates == "true") {
              member.clearStates();
           }
        }
    }
};

synrecInitTp = Game_Battler.prototype.initTp;
Game_Battler.prototype.initTp = function() {
	synrecInitTp.call(this);
    this.setTp(initialTpMax);
};

synrecMaxTp = Game_BattlerBase.prototype.maxTp;
Game_BattlerBase.prototype.maxTp = function() {
	synrecMaxTp.call(this);
	return tpMax;
};

synrecHpGuageColor1 = Window_Base.prototype.hpGaugeColor1;
Window_Base.prototype.hpGaugeColor1 = function() {
	console.log(this);
	synrecHpGuageColor1.call(this);
	return this.textColor(hpBarColor1);
};

synrecHpGuageColor2 = Window_Base.prototype.hpGaugeColor2;
Window_Base.prototype.hpGaugeColor2 = function() {
	synrecHpGuageColor2.call(this);
    return this.textColor(hpBarColor2);
};

synrecMpGaugeColor1 = Window_Base.prototype.mpGaugeColor1;
Window_Base.prototype.mpGaugeColor1 = function() {
	synrecMpGaugeColor1.call(this);
    return this.textColor(mpBarColor1);
};

synrecMpGaugeColor2 = Window_Base.prototype.mpGaugeColor2;
Window_Base.prototype.mpGaugeColor2 = function() {
	synrecMpGaugeColor2.call(this);
    return this.textColor(mpBarColor2);
};

synrecTpGaugeColor1 = Window_Base.prototype.tpGaugeColor1;
Window_Base.prototype.tpGaugeColor1 = function() {
	synrecTpGaugeColor1.call(this);
    return this.textColor(tpBarColor1);
};

synrecTpGaugeColor2 = Window_Base.prototype.tpGaugeColor2;
Window_Base.prototype.tpGaugeColor2 = function() {
	synrecTpGaugeColor2.call(this);
    return this.textColor(tpBarColor2);
};
