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
        this.connectionGraph = this.connectionsStrings.map(string => {
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
            this.connectionGraph.find(departure => {
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
        /**
         * This is a JS implementation of the Bellman-Ford Algorithm
         * The idea is to find the shortest connections for each inner one 
         * that then gets summed up 
         * Belman Ford assumed you have one the starting point for each calculation
         * in my case though we start in different locations, so I need to adapt a little
         * Also it calculates the shortest distances to all the other points but not to itself,
         * so I add the last connection manually
         */

        const start = route[0];
        const stop = route[1];

        const memo = {
            A: Number.POSITIVE_INFINITY,
            B: Number.POSITIVE_INFINITY,
            C: Number.POSITIVE_INFINITY,
            D: Number.POSITIVE_INFINITY,
            E: Number.POSITIVE_INFINITY
        };
        memo[start] = 0;

        const cities = ["A", "B", "C", "D", "E"];

        for (const city of cities){
            //getting real connections from all available connections per city
            const realConn = this.connectionGraph.filter(conn => {
                return conn.from === city;
            });

            for (const conn of realConn){
                const potentialDistance = memo[conn.from] + conn.distance;

                if (potentialDistance < memo[conn.to]){

                    memo[conn.to] = potentialDistance;

                }
            }
        }
        if (start === stop){
            //find connection before coming back to starting point
            //and add last connection to it
            let cityToCity = 0;
            this.connectionGraph.forEach(conn => {
                if (conn.to === stop){
                    if (conn.from && isFinite(memo[conn.from])){
                        cityToCity = memo[conn.from] + conn.distance;
                    }
                }
            });
            return cityToCity;
        }
        return memo[stop];

    }

    findConnections (route){

    }
}

module.exports.TripPlanner = TripPlanner;
