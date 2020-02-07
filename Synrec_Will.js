/*:
 *@author Kaisyl/Synrec
 *@plugindesc (v1) Willpower script, survive with 1 HP until MP runs out.
 *@help Plug and play type script.
 *Activate Indominable will feature and set the state which allows
 *the indominable will function.
 *
 *You are able to set states which occur at 1 HP, 0 MP and Max TP
 *for radical game design.
 *
 *Credit goes to Kaisyl/Synrec
 *This script is available for free on github or itch.io ONLY.
 *Do not sell this script as is.
 *Free to use in commercial or free games/applications.
 *Free to modify.
 *
 *@param Indominable Will
 *@type boolean
 *@default true
 *@desc After 1 HP, attacks deal MP damage.
 *
 *@param Indominable State
 *@type state
 *@default 12
 *@desc State which enables indominable will.
 *
 *@param No HP State
 *@type state
 *@default 2
 *@desc State that is added when HP is 1.
 *
 *@param No MP State
 *@type state
 *@default 3
 *@desc State that is added when MP is 0.
 *
 *@param Max TP State
 *@type state
 *@default 4
 *@desc State that is added at Max TP.
 */
 
 var params = PluginManager.parameters('Synrec_Will');
 var indominableWill = params['Indominable Will'].toLowerCase();
 var willState = parseInt(params['Indominable State']);
 var nullHpState = parseInt(params['No HP State']);
 var nullMpState = parseInt(params['No MP State']);
 var maxTpState = parseInt(params['Max TP State']);
 var willPower = false;
 
synrecRefresh = Game_Battler.prototype.refresh;
Game_Battler.prototype.refresh = function() {
	if (indominableWill == 'true'){
		if (this._states.contains(willState)){
			Game_BattlerBase.prototype.refresh.call(this);
			if (this.hp === 0 && this.mp ===0) {
				this.removeState(nullHpState);
				this.removeState(nullMpState);
				this.addState(this.deathStateId());
			}
			if (this.hp === 1){
				this.addState(nullHpState);
			}
			if (this.mp === 0){
				this.addState(nullMpState);
			}
			if (this.tp === Game_BattlerBase.prototype.maxTp){
				this.addState(maxTpState);
			}
		}
	}
	if (indominableWill == 'false' || !this.isStateAffected(willState)){
		synrecRefresh.call(this);
	}
};

synrecExecHpDmg = Game_Action.prototype.executeHpDamage;
Game_Action.prototype.executeHpDamage = function(target, value) {
	willPower = target._states.contains(willState);
	if (indominableWill == 'true' && value > target._hp && target._mp > 0 && willPower == true){
		target._hp = 1;
		if (!this.isMpRecover()) {
			value = Math.min(target.mp, value);
		}
		if (value !== 0) {
			this.makeSuccess(target);
		}
		target.gainMp(-value);
		this.gainDrainedMp(value);
	} else {
		synrecExecHpDmg.call(this, target, value);
	}
};

synrecDeath = Game_BattlerBase.prototype.die;
Game_BattlerBase.prototype.die = function() {
    this._hp = 0;
	this._mp = 0;
	this._tp = 0;
	synrecDeath.call(this);
};
