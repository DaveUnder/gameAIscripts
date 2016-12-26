/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.repairer');
 * mod.thing == 'a thing'; // true
 */

var roleBuilder = require('role.builder');

module.exports = {
    run: function(creep){

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
            var structure = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                    filter: (s) => s.hits < s.hitsMax && s.structureType != STRUCTURE_WALL
                });

            if(structure != undefined){
                if(creep.repair(structure) == ERR_NOT_IN_RANGE){
                    creep.moveTo(structure);
                }
            }
            else{
                roleBuilder.run(creep);
            }
        }
        else {
            var structure = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                filter: (s) => s.structureType == STRUCTURE_CONTAINER && s.store[RESOURCE_ENERGY] > 0 });
            if (structure == undefined){
                structure = creep.pos.findClosestByPath(FIND_SOURCES);
                if (creep.harvest(structure,RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(structure);
                }
            }
            else (creep.withdraw(structure,RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
            {
                creep.moveTo(structure);
            }
        }
    }

};