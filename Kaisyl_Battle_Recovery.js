/*:
 *@author Kaisyl/Synrec
 *@plugindesc (v2) Control HP, MP and TP effects.
 *@help Recover HP after battle by enabling this plugin.
 *PLUGIN CHANGES:
 *v2: 
 *- Added TP initialize control.
 *- Fixed a few stuff for future edits if necessary
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
 *@param MP Recovery
 *@desc Control % of how much MP is recovered.
 *@default 100
 *@type number
 *@max 100
 *@min 0
 *
 *@param TP Recovery
 *@desc Control how much TP is recovered.
 *@default 100
 *@type number
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
var mpRecover = parseInt(params['MP Recovery'], 100);
var tpRecover = parseInt(params['TP Recovery'], 100);
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
