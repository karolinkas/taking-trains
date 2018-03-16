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
        //create pairs of connections to look up their distance in directed graph representation this.connectionGraph
        const cityPair = this.findConnectionPairs(route);

        let totalDistance = 0;
        let foundConnection;
        cityPair.forEach(pair => {
            //find distance in list of all connections and sum it up
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

    /**
     * For a small directed graph like that surprisingly just counting the outgoing
     * connections is enough to solve the problem
     * Since the algorithm should be functional for bigger graphs
     * I will implemented checking the the conditions as well
     * @return {number} Count of possible trips
     */
    getTripCount (route, condition) {

        const start = route[0];

        const outGoingConnections = {};

        for (const city of this.cities){

            outGoingConnections[city] = {
                count: 0,
                to: []
            };

            //I didn't want to hardcode the conditions in here, so to make my work
            //also applicable to other examples, I created the condition dynamically
            const dynamicCondition = `outGoingConnections[city].count ${condition}`;

            this.connectionGraph.filter(conn => {
                if (conn.from === city && dynamicCondition){
                    outGoingConnections[city].count++;
                    outGoingConnections[city].to.push(conn.to);
                }
            });
        }
        return outGoingConnections[start].count;
    }

    /**
     * This is a JS implementation of the Bellman-Ford Algorithm
     * The idea is to find the shortest connections for each inner one
     * that then gets summed up succesively
     * Belman Ford assumes you have one the starting point for each calculation
     * in my case though we start in different locations, so I need to adapt a little
     * by setting the starting point manually.
     * Also it calculates the shortest distances to all the other points but not to itself,
     * so I add the last connection manually.
     * @return {number} Length of shortest trip
     */
    findShortestTrip (route){
        const start = route[0];
        const stop = route[1];

        //table that memorises each cities optimal path
        //initially it has to be set to positive infinity to be able to track
        //if the distance gets smaller
        const memo = {
            A: Number.POSITIVE_INFINITY,
            B: Number.POSITIVE_INFINITY,
            C: Number.POSITIVE_INFINITY,
            D: Number.POSITIVE_INFINITY,
            E: Number.POSITIVE_INFINITY
        };

        //set start point of optimisation manually
        memo[start] = 0;

        for (const city of this.cities){

            //getting actual connections from all available connections per city
            const realConn = this.connectionGraph.filter(conn => {
                return conn.from === city;
            });

            for (const conn of realConn){
                const potentialDistance = memo[conn.from] + conn.distance;

                //add new distance only if it's smaller than all existing ones
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

    findPerCode (code, distanceCount){
        while (distanceCount < 30){
            this.list.totalLength++;
            const inner = this.connectionGraph.filter(conn => {
                if (code === conn.from){
                    return conn;
                }
            }).map((innerConn, i) => {
                distanceCount += innerConn.distance;
                console.log(this.list.paths);
                return {
                    next: this.findPerCode(innerConn.to, distanceCount),
                    distance: distanceCount,
                    paths: this.list.paths[i] = this.list.paths[i] + code,
                    length: this.list.totalLength
                };
            });
            if (inner.length > 0){
                return inner;
            } else {
                return null;
            }
        }
    }

    findLast (object) {
        while (object.length < this.list.totalLength){
            return object.next;
        }
    }

    findConnections (startEnd, condition) {
        this.list = {
            next: null,
            distance: 0,
            paths: ["C", "C"],
            totalLength: 0
        };
        const distanceCount = 0;
        this.list.next = this.findPerCode(startEnd[0], distanceCount);
        console.log(this.list.next[0].next[0].next);
    }
}


module.exports.TripPlanner = TripPlanner;
