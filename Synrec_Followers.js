/*:
 *@author Synrec
 *@plugindesc (v1) Control the maximum number of followers on the map.
 *@help
 *Plug n play. Incompatible with Scripts which affect follower initialization.
 *
 *@param Max Followers
 *@desc Maximum number of followers
 *@default 1
 *@type number
 */
 
var param = PluginManager.parameters('Synrec_Followers');
var maxFollows = parseInt(param['Max Followers']);

Game_Followers.prototype.initialize = function() {
    this._visible = $dataSystem.optFollowers;
    this._gathering = false;
    this._data = [];
    for (var i = 1; i < $gameParty.maxBattleMembers(); i++) {
		if (i <= maxFollows){
			this._data.push(new Game_Follower(i));
		}
    }
};
