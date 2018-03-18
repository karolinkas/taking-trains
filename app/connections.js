"use strict";

/**
* The connection graph is being reused for different subtasks, therefore it makes sense to
* create a seperate module
*/
class ConnectionGraph {
    /**
    * @param {array} Array of Strings which stand for cities and their distances e.g. "AB5"
    **/
    constructor (connections) {
        this.connectionsStrings = connections;
        this.uniqueCities = new Set();
        this.parseConnectionStrings();
    }


    getAllCityCodes (code){
        //to make sure the city codes are unique we use the JS Set Object
        this.uniqueCities.add(code);
    }

    /**
    * Take strings of city codes and distances and create
    * and array of objects for all connections that represents the directed graph
    * and store it on the instance since it will be needed in many different methods
    */
    parseConnectionStrings () {
        this.connectionGraph = this.connectionsStrings.map(string => {
            const startCity = string[0];
            const stopCity = string[1];

            this.getAllCityCodes(startCity);
            this.getAllCityCodes(stopCity);

            const distance = string.slice(2, string.length);
            return {
                from: startCity,
                to: stopCity,
                distance: Number(distance)
            };
        });

        this.cities = Array.from(this.uniqueCities).sort();
    }

}

module.exports.ConnectionGraph = ConnectionGraph;
