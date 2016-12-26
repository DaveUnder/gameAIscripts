/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.transporter');
 * mod.thing == 'a thing'; // true
 */

var roleUpgrader = require('role.upgrader');

module.exports = {
    run: function(creep) {

        if (creep.memory.working == true && creep.carry.energy == 0) {
            creep.memory.working = false;

        }
        else if (creep.memory.working == false && creep.carry.energy == creep.carryCapacity) {
            creep.memory.working = true;
        }
        else if (creep.ticksToLive < 15) {
            creep.memory.working = true;
        }



        if (creep.memory.working == true) {

            var structure = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
                filter: (s) => ((( s.structureType == STRUCTURE_SPAWN || s.structureType == STRUCTURE_EXTENSION)
                    && s.energy < s.energyCapacity)
                || (s.structureType == STRUCTURE_TOWER
                    && s.room.energyAvailable == s.room.energyCapacityAvailable && s.energy < s.energyCapacity-200)
                || (s.structureType == STRUCTURE_STORAGE))

            });

            if (structure != undefined) {
                if (creep.transfer(structure, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(structure);
                }
            }
            else {
                roleUpgrader.run(creep);
            }
        }
        else {
            var structure = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                filter: (s) => s.structureType == STRUCTURE_CONTAINER && s.pos.x > 25 && s.store[RESOURCE_ENERGY] > 200 });

            if (structure == undefined && creep.carry.energy !=0){
                creep.memory.working = true;
            }

            if (creep.withdraw(structure,RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(structure);
            }
        }
    }
};