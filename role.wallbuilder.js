/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.wallbuilder');
 * mod.thing == 'a thing'; // true
 */

var roleBuilder = require('role.builder');

module.exports = {
    run: function(creep){
        //console.log(creep.name + " : in harvester script - working = " + creep.memory.working);

        if (creep.memory.working == true && creep.carry.energy == 0) {
            creep.memory.working = false;
            creep.memory.target = undefined;

            if(creep.ticksToLive < 50){
                creep.suicide();
            }
        }
        else if (creep.memory.working == false && creep.carry.energy == creep.carryCapacity) {
            creep.memory.working = true;
        }

        if (creep.memory.working == true) {
            if (creep.memory.target == undefined) {
                var walls = creep.room.find(FIND_STRUCTURES, {
                    filter: (s) => s.structureType == STRUCTURE_WALL
                });

                var target = undefined;


                var minHits = 500000;

                for (let wall of walls) {
                    if (wall.hits < minHits) {
                        target = wall;
                        minHits = wall.hits;
                    }
                }

                creep.memory.target = target.id;
            }

            var wallToRepair = Game.getObjectById(creep.memory.target);


            if(wallToRepair != undefined){
                if(creep.repair(wallToRepair) == ERR_NOT_IN_RANGE){
                    creep.moveTo(wallToRepair);
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