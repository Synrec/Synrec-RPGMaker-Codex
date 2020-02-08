/*:
 *@author Kaisyl/Synrec
 *@plugindesc (vTEST) Allows State stacking
 *@help Use the tag <stateStackable:x> to allow a state to stack.
 *Use <stackBurst:x> to remove all state stacks and add a new state
 *when max stack conditions are met.
 *
 *Where x = state ID; eg: Knockout is generally state ID '1' so x = 1.
 *DO NOT RESELL THIS SCRIPT AS IS.
 *FREE TO USE IN FREE OR COMMERCIAL PROJECTS.
 *DO NOT MODIFY AND THEN ASK FOR MY HELP.
 *CURRENTLY BEING WORKED ON!!! THIS SCRIPT IS EXPERIMENTAL!!
 *
 *@param State Overflow
 *@default false
 *@type boolean
 *@desc Allow states to overflow after burst effect.
 */
 
var params = PluginManager.parameters('Synrec_State_Stacker');
var overFlow = params['State Overflow'].toLowerCase();
console.log(overFlow);

var maxStateStack = 0;
var stateCount = 0;
var stateStackable = 0;
var stackBurst = 0;
var stackBurstActive = false;

synrecAddState = Game_Battler.prototype.addState;
Game_Battler.prototype.addState = function(stateId) {
	stateCount = 0;
	for (i = 0; i < this._states.length; i++){
		if (this._states[i] == stateId){
			stateCount++;
		}
	}
	stateStackable = parseInt($dataStates[stateId].meta.stateStackable);
	stackBurst = parseInt($dataStates[stateId].meta.stackBurst);
	if (isNaN(stateStackable) == false  && isNaN(stackBurst) == false){
		if (stateStackable !== 0){
			if (stateStackable !== 0){
				maxStateStack = stateStackable;
			}
			if (stateCount <= maxStateStack){
				this.addNewState(stateId);
				stateCount++;
				this.refresh;
			}
			if (stateCount >= maxStateStack && stackBurst !== 0){
				for (i = 0; i < stateCount; i++){
					this.removeState(stateId);
					stateCount--;
					this.refresh;
					console.log(i + ' ' + stateId);
					console.log(this);
				}
				if (overFlow == 'true'){
					overFlowStateCount = stateCount;
					for (i = 0; i < overFlowStateCount; i++){
						this.addNewState(stateId);
						stateCount--;
					}
				}
				stackBurstActive = true;
			}
		}
	}
	if (stackBurstActive == true){
		if (this.isStateAddable(stackBurst)) {
			if (!this.isStateAffected(stackBurst)) {
				this.addNewState(stackBurst);
				this.refresh();
				console.log('burst');
			}
			this.resetStateCounts(stackBurst);
			this._result.pushAddedState(stackBurst);
		}
    }
	synrecAddState.call(this, stateId);
	stackBurstActive = false;
};
