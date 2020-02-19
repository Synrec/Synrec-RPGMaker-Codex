/*:
 *@author Kaisyl/Synrec
 *@plugindesc (v6) Allows State stacking
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
 *v5: Fixed a bug where a state can be added +1 to the designers defined
 *maximum.
 *v6: Removed state icon duplication, added a number which indicates stack
 *amount.
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
var stateCounter = [];

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
			if (stateCount < stateStackable && !this.isStateAffected(stackBurst)){
				this.addNewState(stateId); //addState.
				stateCount++;
				this.refresh;
			}	
		}
		if (stateCount >= stateStackable && !this.isStateAffected(stackBurst) && isNaN(stackBurst) == false){
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
	if (isNaN(stateStackable) == true || (isNaN(stackBurst) == true && isNaN(stateStackable) == true)){
		synrecAddState.call(this, stateId);
	}
};

function arrayDuplioChkr(Arr1, Arr2){
	var lastItem = [0];
	var lastIndex = [0];
	var y = 0;
	console.log(lastIndex + ' ' + Arr2);
	for (i = 0; i < Arr1.length; i++){
		if (i == 0 && Arr2[y] == Arr1[i]){
			if (lastIndex[y] == undefined){
				lastIndex[y] = 0;
			}
			if (stateCounter[y] = undefined){
				stateCounter[y] = 0;
			}
			lastIndex[y]++;
			stateCounter.push(lastIndex[y]);
			y = i;
		}
		if (Arr2[y] == Arr1[i] && i !== 0){
			if (lastIndex[y] == undefined){
				lastIndex[y] = 0;
			}
			if (stateCounter[y] = undefined){
				stateCounter[y] = 0;
			}
			lastIndex[y]++;
		}
		if (Arr2[y] !== Arr1[i]){
			y++;
			if (lastIndex[y] == undefined){
				lastIndex[y] = 0;
			}
			if (stateCounter[y] = undefined && Arr1[i] !== undefined){
				stateCounter[y] = 0;
			}
			if (Arr2[y] == Arr1[i]){
				lastIndex[y]++
			}
		}
	}
	stateCounter = lastIndex;
}

synrecDrawActorIcons = Window_Base.prototype.drawActorIcons;
Window_Base.prototype.drawActorIcons = function(actor, x, y, width) {
	var iconCounts = actor.allIcons();
	actorIcons = Array.from(new Set(actor.allIcons()));
	var icons = actorIcons.slice(0, Math.floor(width / Window_Base._iconWidth));
	stateCounter = [];
	arrayDuplioChkr(iconCounts,icons);
	for (var i = 0; i < icons.length; i++) {
		this.drawIcon(icons[i], x + Window_Base._iconWidth * i, y + 2);
		this.drawText(stateCounter[i], x + Window_Base._iconWidth * i + 8, y + 2);
    }
	
	if (icons.length == 0){
		synrecDrawActorIcons.call(this, actor, x, y, width);
	}
};
