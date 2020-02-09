/*:
 *@author Kaisyl/Synrec
 *@plugindesc (v1) Allows State stacking
 *@help Use the tag <stateStackable:x> to allow a state to stack.
 *Use <stackBurst:x> to remove all state stacks and add a new state
 *when max stack conditions are met.
 *
 *Where x = state ID; eg: Knockout is generally state ID '1' so x = 1.
 *DO NOT RESELL THIS SCRIPT AS IS.
 *FREE TO USE IN FREE OR COMMERCIAL PROJECTS.
 *DO NOT MODIFY AND THEN ASK FOR MY HELP.
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
	if (isNaN(stateStackable) == false  ||(isNaN(stateStackable) == false && isNaN(stackBurst) == false)){
		stackBurstActive = true;
		if (stateStackable !== 0){
			if (stateCount <= stateStackable){
				this.addNewState(stateId);
				stateCount++;
				this.refresh;
			}
			if (stackBurstActive == true && stateCount >= stateStackable){
				if (this.isStateAddable(stackBurst)) {
					if (!this.isStateAffected(stackBurst)) {
						for (i = 0; i < stateCount; i++){
							this.removeState(stateId);
							this.refresh;
						}
						stateCount = 0;
						this.addNewState(stackBurst);
						this.refresh();
					}
					if ($dataStates[stackBurst].meta.stateStackable !== 0){
						stateBurstStack = parseInt($dataStates[stackBurst].meta.stateStackable);
						stackBurst2 = parseInt($dataStates[stackBurst].meta.stackBurst)
						stateCount = 0;
						for (i = 0; i < stateBurstStack; i++){
							if (this._states[i] == stackBurst){
							stateCount++;
							}
						}
				if (stateCount >= stateBurstStack){
					for (i = 0; i < stateCount; i++){
						this.removeState(stackBurst);
					}
					this.addNewState(stackBurst2);
					this.refresh();
				}
			}
			this.resetStateCounts(stackBurst);
			this._result.pushAddedState(stackBurst);
		}
    }
			if (stateCount >= stateStackable && stackBurst !== 0){
				if (overFlow == 'true'){
					overFlowStateCount = stateCount;
					for (i = 0; i < overFlowStateCount; i++){
						this.addNewState(stateId);
						stateCount--;
					}
				}
				
			}
		}
	}
	if (stateStackable !== false){
		synrecAddState.call(this, stateId);
	}
	stackBurstActive = false;
};
