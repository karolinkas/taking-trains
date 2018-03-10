"use strict";

class TripPlanner {
    constructor (connections) {
        this.connectionsStrings = connections;

        this.parseConnectionStrings();
    }

    /**
    * Take strings of city codes and distances and create and array of objects for all connections 
    */
    parseConnectionStrings () {
        this.connectionList = this.connectionsStrings.map(string => {
            const startCity = string[0];
            const stopCity = string[1];
            const distance = string.slice(2, string.length);
            return {
                from: startCity,
                to: stopCity,
                distance: Number(distance)
            };
        });
    }

    /**
    * Create pairs of letters that stand for cities for each connection 
    * @param {array} Array of all possible connections
    * @return {array} Array of pairs of actual connections
    */
    findConnectionPairs (connections){
        const pairs = [];
        for (let i = 0 ; i < connections.length ; i++) {
            if (connections[i+1] !== undefined) {
                pairs.push([connections[i], connections[i + 1]]);
            }
        }
        return pairs;
    }

    /**
    * Calculating distance of trips 
    * @param {string} String of city letters
    * @return {number} Total distance covered
    */
    getDistance (route){
        const cityPair = this.findConnectionPairs(route);

        let totalDistance = 0;
        cityPair.forEach(pair => {
            //find distance in list of all connections
            this.connectionList.find(departure => {
                if (departure.from === pair[0] && departure.to === pair[1]){
                    totalDistance += departure.distance;
                }
            });
        });


        return totalDistance;
    }

    getTripCount (route, condition) {

    }

    findShortestTrip (route){
        //const cache = new TripCache();
        /**
        * Since we don't know what the stops in between are we just 
        * have an start and an end city
        */
        const start = route[0];
        const end = route[1];

        const departingCities = [];
        const arrivingCities = [];
        this.connectionList.forEach(connection => {
            if (connection.from === start){
                departingCities.push(connection);
            } else if (connection.to === end){
                arrivingCities.push(connection);
            }
        });

        const distances = [];
        departingCities.forEach((city, i) => {
            arrivingCities.forEach(arrivalCity => {
                if (city.to === arrivalCity.from){
                    distances.push(city.distance + arrivalCity.distance);
                }
            });
        });
        
        return Math.min(...distances);

    }

    findConnections (route){

    }
}

class TripCache {
    constructor (){
        this.table = [{city: "A", distance: 0, visited: false}];

    }

    
}

/* const trainConnections = ["AB5", "BC4", "CD8", "DC8", "DE6", "AD5", "CE2", "EB3", "AE7"];
new TripPlanner(trainConnections); */

module.exports.TripPlanner = TripPlanner;
