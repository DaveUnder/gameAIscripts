/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('prototype.spawn');
 * mod.thing == 'a thing'; // true
 */

module.exports = function(){

    StructureSpawn.prototype.createCustomCreep = function(energy, roleName){
        var numberOfParts  = Math.floor(energy/200);
        var body = [];

        if( numberOfParts > 4){
            numberOfParts = 4;
        }
        for(let i = 0; i < numberOfParts; i++){
            body.push(WORK);
        }
        for(let i = 0; i < numberOfParts; i++){
            body.push(CARRY);
        }
        for(let i = 0; i < numberOfParts; i++){
            body.push(MOVE);
        }

        return this.createCreep(body, undefined, {role: roleName, working: false });
    };

    StructureSpawn.prototype.createWorkerCreep = function(energy, roleName, target){
        var numberOfParts  = Math.floor((energy-150)/100);
        var body = [];

        if(roleName =='miner' && numberOfParts > 6){
            numberOfParts = 6;
        }

        for(let i = 0; i < numberOfParts; i++){
            body.push(WORK);
        }

        body.push(CARRY);
        body.push(CARRY);
        body.push(MOVE);

        return this.createCreep(body, undefined, {
            role: roleName,
            working: false ,
            targetSource: target});
    };

    StructureSpawn.prototype.createWorkerFastCreep = function(energy, roleName, target){
        var numberOfParts  = Math.floor(energy/250);
        var body = [];

        if(roleName =='miner' && numberOfParts > 3){
            numberOfParts = 3;
        }


        for(let i = 0; i < numberOfParts; i++){
            body.push(MOVE);
            body.push(MOVE);
            body.push(CARRY);
            body.push(WORK);
        }

        return this.createCreep(body, undefined, {
            role: roleName,
            working: false,
            targetSource: target });
    };

    StructureSpawn.prototype.createLongDistanceHarvesterCreep = function(energy, roleName, homeRoom, targetRoom, targetRoomSource){
        var numberOfParts  = Math.floor(energy/350);
        var body = [];

        if( numberOfParts > 4){
            numberOfParts = 4;
        }

        for(let i = 0; i < numberOfParts; i++){
            body.push(MOVE);
            body.push(MOVE);
            body.push(MOVE);
            body.push(CARRY);
            body.push(CARRY);
            body.push(WORK);
        }

        return this.createCreep(body, undefined, {
            role: roleName,
            working: false,
            homeRoom: homeRoom,
            targetRoom: targetRoom,
            targetRoomSource: targetRoomSource,
            workDone: 0});
    };

    StructureSpawn.prototype.createUpgraderCreep = function(energy, roleName, workSource, workTarget){
        var numberOfParts  = Math.floor(energy/350);
        var body = [];

        if(roleName =='miner' && numberOfParts > 3){
            numberOfParts = 3;
        }

        body.push(WORK);
        body.push(CARRY);
        body.push(MOVE);

        for(let i = 0; i < numberOfParts; i++){
            body.push(WORK);
            body.push(WORK);
            body.push(CARRY);
            body.push(CARRY);
            body.push(MOVE);

        }

        return this.createCreep(body, undefined, {
            role: roleName,
            working: false,
            workSource: workSource,
            workTarget: workTarget });
    };
};