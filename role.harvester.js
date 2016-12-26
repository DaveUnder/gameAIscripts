/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.harvester');
 * mod.thing == 'a thing'; // true
 */

var roleUpgrader = require('role.upgrader');

module.exports = {
    run: function(creep) {
        //console.log(creep.name + " : in harvester script - working = " + creep.memory.working);

        if (creep.memory.working == true && creep.carry.energy == 0) {
            creep.memory.working = false;

            if(creep.ticksToLive < 50){
                creep.suicide();
            }
        }
        else if (creep.memory.working == false && creep.carry.energy == creep.carryCapacity) {
            creep.memory.working = true;
        }

        if (creep.memory.working == true) {


            var structure = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
                filter: (s) => ( s.structureType == STRUCTURE_SPAWN
                || s.structureType == STRUCTURE_EXTENSION || s.structureType == STRUCTURE_TOWER)
                && s.energy < s.energyCapacity
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
            var source = creep.pos.findClosestByPath(FIND_SOURCES);
            if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
                creep.moveTo(source);
            }
        }
    }
};