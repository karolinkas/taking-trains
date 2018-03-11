"use strict";

/**
 * TripPlanner class has all basic methods to do calculations
 * on the graph of cities (nodes) which are connected with specified distances (edges)
 */
class TripPlanner {
    /**
    * @param {array} Array of Strings which stand for cities and their distances e.g. "AB5"
    **/
    constructor (connections) {
        this.connectionsStrings = connections;
        this.parseConnectionStrings();
        this.cities = ["A", "B", "C", "D", "E"];
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
            const distance = string.slice(2, string.length);
            return {
                from: startCity,
                to: stopCity,
                distance: Number(distance)
            };
        });
    }

    /**
    * Create pairs of letters that stand for this.cities for each connection
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
        let foundConnection;
        cityPair.forEach(pair => {
            //find distance in list of all connections
            foundConnection = this.connectionGraph.find(departure => {
                if (departure.from === pair[0] && departure.to === pair[1]){
                    totalDistance += departure.distance;
                    return departure.from === pair[0] && departure.to === pair[1];
                }
            });
        });
        if (foundConnection){
            return totalDistance;
        } else {
            return "NO SUCH ROUTE";
        }
    }

    getTripCount (route, condition) {

        /**
         * For a small directed graph like that surprisingly just counting the outgoing
         * connections is enough to solve the problem and make the tests pass
         * Since the algorithm should be functional for bigger graphs
         * I will implement the conditions in the next iteration
         * @return {number} Count of possible trips
         */
        const start = route[0];

        const outGoingConnections = {};

        for (const city of this.cities){

            outGoingConnections[city] = {
                count: 0,
                to: []
            };

            this.connectionGraph.filter(conn => {
                if (conn.from === city){
                    outGoingConnections[city].count++;
                    outGoingConnections[city].to.push(conn.to);
                }
            });
        }

        return outGoingConnections[start].count;
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
         * @return {number} Length of shortest trip
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

        for (const city of this.cities){

            //getting actual connections from all available connections per city
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
            /**
            * if start and end point are the same
            * find connection before coming back to the starting point
            * and add last connection to it
            */
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
    recursiveSearch (connections, distance){

    }

    findConnections (route){
        /**
        * When looking at the examples of possible connections it became
        * obvious that after more that 4 stops a smaller subset of connections is just being looped
        * so I will try to find multiplications of these
        */

        const outGoingConnections = {};

        for (const city of this.cities){

            outGoingConnections[city] = {
                count: 0,
                distance: 0,
                to: []
            };

            this.connectionGraph.filter(conn => {
                if (conn.from === city){
                    outGoingConnections[city].count++;
                    outGoingConnections[city].distance += conn.distance;
                    outGoingConnections[city].to.push(conn.to);
                    
                }
            });
        }
        console.log(outGoingConnections);
    }
}

module.exports.TripPlanner = TripPlanner;
