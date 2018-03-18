"use strict";
/**
* Each nested connections has to be tracked
* since there is many stops it is a good idea to wrap them in a class
* since they all share properties and methods
*/

class StopInCity {
    constructor (next, distance, path, prev){
        this.next = next;
        this.distance = distance;
        this.path = path;
        this.prev = prev;
    }

    getCurrentPath (){
        return this.path;
    }

    getCurrentDistance (){
        return this.distance;
    }
}

module.exports.StopInCity = StopInCity;
