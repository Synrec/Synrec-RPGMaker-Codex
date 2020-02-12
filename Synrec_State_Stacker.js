/*:
 *@author Kaisyl/Synrec
 *@plugindesc (v4) Allows State stacking
 *@help Use the tag <stateStackable:x> to allow a state to stack.
 *Use <stackBurst:x> to remove all state stacks and add a new state
 *when max stack conditions are met.
 *Use <stackOverFlow:x> to indicate an overflow state, the state
 *that is added after burst conditions are met. Overflow states
 *are added only once.
 *
 *Where x = state ID; eg: Knockout is generally state ID '1' so x = 1.
 *DO NOT RESELL THIS SCRIPT AS IS.
 *FREE TO USE IN FREE OR COMMERCIAL PROJECTS.
 *DO NOT MODIFY AND THEN ASK FOR MY HELP.
 *THIS SCRIPT WILL BE OPTIMIZED IN THE FUTURE!
 *
 *Changelog:
 *v1: Released publically.
 *v2: Fixed errors causing the secondary burst effect to not occur.
 *Fixed the problem of burst effect not stacking.
 *v3: Removed secondary burst effect for optimization reasons.
 *State overflow instead allows for an alternative state post burst.
 *v4: Fixed a bug where the game would crash when burst state is 
 *undefined.
 *
 *@param State Overflow
 *@default false
 *@type boolean
 *@desc Allow states to overflow after burst effect.
 */
 
var params = PluginManager.parameters('Synrec_State_Stacker');
var overFlow = params['State Overflow'].toLowerCase();
var stateCount = 0;
var stateStackable = 0;
var stackBurst = 0;

synrecAddState = Game_Battler.prototype.addState;
Game_Battler.prototype.addState = function(stateId) {
	stateCount = 0;
	stateStackable = parseInt($dataStates[stateId].meta.stateStackable);
	stackBurst = parseInt($dataStates[stateId].meta.stackBurst);
	for (i = 0; i < this._states.length; i++){
		if (this._states[i] == stateId){
			stateCount++;
		}
	}
	if ((isNaN(stateStackable) == false  ||(isNaN(stateStackable) == false && isNaN(stackBurst) == false)) && !this.isStateAffected(stackBurst)){
		if (stateStackable !== 0){
			if (stateCount <= stateStackable && !this.isStateAffected(stackBurst)){
				this.addNewState(stateId); //addState.
				stateCount++;
				this.refresh;
			}	
		}
		if (stateCount >= stateStackable && !this.isStateAffected(stackBurst) && isNaN(stackBurst) == false){
			console.log('trig');
			for (i = 0; i < stateCount; i++){
				this.removeState(stateId);
			}
			this.addNewState(stackBurst);
			this.refresh();
		}
		if (overFlow == 'true' && this.isStateAffected(stackBurst)){
			var overFlowState = parseInt($dataStates[stateId].meta.stackOverFlow)
			if (isNaN(overFlowState) == false){
				this.addNewState(overFlowState);
				this.refresh;
			}
		}
	}
	if (isNaN(stateStackable) == true || (isNaN(stackBurst) == true && isNaN(stateStackable) == true){
		synrecAddState.call(this, stateId);
	}
};
