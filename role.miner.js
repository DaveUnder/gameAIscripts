/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.miner');
 * mod.thing == 'a thing'; // true
 */

require('prototype.spawn')();

var roleHarvester = require('role.harvester');

module.exports = {
    run: function(creep) {
        if (!creep.spawning) {

            if (creep.ticksToLive < 3) {
                if (creep.carry.energy > 0) {
                    creep.memory.working = true;
                }
                else {
                    console.log("DEATH of: " + creep + "; TOTAL WORK: " + creep.memory.workDone + "; miner");
                    creep.suicide();
                }
            }
            else if (creep.memory.working == true && creep.carry.energy == 0) {
                creep.memory.working = false;

                if (creep.ticksToLive < 60) {

                    var numberOfMiners = _.sum(Game.creeps, (c) => c.memory.role == 'miner' && c.memory.targetSource == creep.memory.targetSource);
                    if (numberOfMiners < 2) {
                        console.log("DEBUG: respawning a miner");
                        var name = Game.spawns.Baas1.createWorkerCreep(800, 'miner', creep.memory.targetSource);
                        console.log("DEBUG: respawned " + name);
                    }
                }

            }
            else if (creep.memory.working == false && creep.carry.energy == creep.carryCapacity) {
                creep.memory.working = true;
            }

            if (creep.memory.working == true) {

                var structure = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                    filter: (s) => s.structureType == STRUCTURE_CONTAINER && s.store[RESOURCE_ENERGY] < s.storeCapacity
                });

                if (structure != undefined) {
                    if (creep.transfer(structure, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(structure);
                    }
                    else {
                        if (creep.memory.workDone == undefined) {
                            creep.memory.workDone = 0;
                        }
                        creep.memory.workDone += creep.carry.energy;
                        // console.log(creep + " WorkDone: " + creep.memory.workDone);
                    }
                }
                else {
                    //roleHarvester.run(creep);
                }
            }
            else {
                if (creep.memory.targetSource == undefined) {
                    //console.log("Debug:" + creep + " does not have source");
                    var source = creep.pos.findClosestByPath(FIND_SOURCES);
                    creep.memory.targetSource = source.id;
                }

                source = Game.getObjectById(creep.memory.targetSource);

                if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(source);
                }
            }
        }
    }
};