/*:
 *@author Kaisyl/Synrec
 *@plugindesc (v1)Recover HP after battle.
 *@help Recover HP after battle by enabling this plugin.
 *Credit given to Silva for assistance in creating this script.
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
 *@param TP Max
 *@desc Control what is the maximum value for TP in game.
 *@default 100
 *@type number
 *
 *@param Clear All States
 *@desc Remove all states?
 *@default false
 *@type boolean
 */
 
function toNumber(str, def) {
    return isNaN(str) ? def : +(str || def);
}

var params = PluginManager.parameters('Kaisyl_Battle_Recovery');
var synrecRecover = params['Enable Auto Recovery'].toLowerCase();
var hpRecover = toNumber(params['HP Recovery'], 100);
var mpRecover = toNumber(params['MP Recovery'], 100);
var tpRecover = toNumber(params['TP Recovery'], 100);
var tpMax = toNumber(params['TP Max'], 100);
var clearStates = params['Clear All States'].toLowerCase();


kaisylEndOfWar = BattleManager.endBattle;
BattleManager.endBattle = function(result) {
    kaisylEndOfWar.call(this, result);
    if (synrecRecover == "true") {
        var party = $gameParty.battleMembers();
        for (var mem = 0; mem < party.length; mem++) {
           var member = party[mem];
		   console.log(party);
           member.gainHp(Math.ceil(member.mhp * hpRecover/100));
           member.gainMp(Math.ceil(member.mmp * mpRecover/100));
           member.gainTp(tpRecover);
           if (clearStates == "true") {
              member.clearStates();
           }
        }
    }
};

synrecMaxTp = Game_BattlerBase.prototype.maxTp;
Game_BattlerBase.prototype.maxTp = function() {
	synrecMaxTp.call(this);
    return tpMax;
};
