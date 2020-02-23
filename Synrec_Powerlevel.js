/*:
*@author Kaisyl/Synrec
*@plugindesc (v1) Changes how levels work in game.
*@help Changes the way level ups work by making level ups
*a factor of battle only. After battle, the actor's levels
*revert back to their default inital value. This script is
*mainly for developers who want to make their game independent
*of levels and EXP grinding.
*
*In the database, tag skills with the tag <exp:x> to determine
*how much exp that particular skill will grant (or remove) to your 
*actor.
*
*Tag skills with <level:x> to determine how much levels a skill
*will grant or remove from an actor.
*
*Tags with <level:x> Do not show level up changes in battle.
*Tags with <exp:x> Show incremental level up changes in battle.
*
*@param Use Power Level
*@default true
*@type boolean
*@desc Enable or disable the Power Level system.
*
*@param Heal HP On Level Up
*@default 1.00
*@type number
*@decimals 2
*@min 0
*@max 1.00
*@desc Total amount of HP healed on level up (num * mhp).
*
*@param Heal MP On Level Up
*@default 1.00
*@type number
*@decimals 2
*@min 0
*@max 1.00
*@desc Total amount of MP healed on level up (num * mmp).
*/

var params = PluginManager.parameters('Synrec_Powerlevel');
var powerLevel = params['Use Power Level'].toLowerCase();
var hpHealingFactor = parseFloat(params['Heal HP On Level Up']);
var mpHealingFactor = parseFloat(params['Heal MP On Level Up']);
console.log(mpHealingFactor);

synrecInitMembers = Game_BattlerBase.prototype.initMembers;
Game_BattlerBase.prototype.initMembers = function() {
	synrecInitMembers.call(this);
    this._level = 1;
};

synrecActorInitMembers = Game_Actor.prototype.initMembers;
Game_Actor.prototype.initMembers = function() {
    synrecActorInitMembers.call(this);
};

synrecDie = Game_BattlerBase.prototype.die;
Game_BattlerBase.prototype.die = function() {
	synrecDie.call(this);
	if (this.isActor() == true){
		this._level = 1;
		this._exp[this._classId] = 0;
		this.refresh();
	}
	
};

synrecRevive = Game_BattlerBase.prototype.revive;
Game_BattlerBase.prototype.revive = function() {
	synrecRevive.call(this);
    if (this._hp === 0) {
		this._level = 1;
		if (this.isActor() == true){
			this._exp[this._classId] = 0;
		}
		this.refresh();
    }
};

synrecEscape = Game_Battler.prototype.escape;
Game_Battler.prototype.escape = function() {
    synrecEscape.call(this);
	this._level = 1;
	if (this.isActor() == true){
		this._exp[this._classId] = 0;
	}
	this.refresh();
};

synrecOnBattleStart = Game_Battler.prototype.onBattleStart;
Game_Battler.prototype.onBattleStart = function() {
	synrecOnBattleStart.call(this);
	this._level = 1;
	if (this.isActor() == true){
		this._exp[this._classId] = 0;
	}
	this.refresh();
};

synrecOnBattleEnd = Game_Battler.prototype.onBattleEnd;
Game_Battler.prototype.onBattleEnd = function() {
	synrecOnBattleEnd.call(this);
	this._level = 1;
	if (this.isActor() == true){
		this._exp[this._classId] = 0;
	}
	this.refresh();
};

synrecLevelUp = Game_Actor.prototype.levelUp;
Game_Actor.prototype.levelUp = function() {
	synrecLevelUp.call(this);
	if (this.isActor() == true){
		var actorMHP = this.mhp;
		var actorMMP = this.mmp;
		var healHp = parseInt(hpHealingFactor * actorMHP);
		var healMp = parseInt(mpHealingFactor * actorMMP);
		this.gainHp(healHp);
		this.gainMp(healMp);
	}
};

synrecPerformAction = Game_Actor.prototype.performAction;
Game_Actor.prototype.performAction = function(action) {
	synrecPerformAction.call(this, action);
    if (this._actionState === 'acting' && this.isActor() === true){
		var actorId = action._subjectActorId;
		var skillId = action._item._itemId;
		if ($dataSkills[skillId].meta.exp !== undefined){
			this.gainExp(parseInt($dataSkills[skillId].meta.exp));
		}
		if ($dataSkills[skillId].meta.level !== undefined){
			var levelUps = $dataSkills[skillId].meta.level;
			for (i = 0; i < levelUps; i++){
				this.levelUp();
			}
		}
	}
};

synrecNoExpBattle = BattleManager.gainExp;
BattleManager.gainExp = function() {
    if(powerLevel !== 'true'){
		synrecNoExpBattle.call(this);
	}
};
