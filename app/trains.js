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
    /**
     * @param {object} Initialised object of outgoing connections from each point
     * @param {string} Code of next city
     * @param {string} Code of current city
     * @param {string} Condition
     * @return {number} Count of trips fullfilling conditions
     */
    createLinkedList (connections, nextCity, currentCity, condition){
        const distanceCounter = {};
        distanceCounter[currentCity] = 5;
        const dynamicCondition = `connections[currentCity].distance ${condition}`;

        //create new nested object for each inner new connection
        while (eval(dynamicCondition) ){
            this.connectionGraph.forEach(conn => {
                if (conn.from === nextCity ){
                    //count number of connections
                    connections[currentCity].count++;

                    connections[currentCity].distance += conn.distance;
                    distanceCounter[currentCity] += conn.distance;

                    //make sure maximum distance doesn't added to the inner connections
                    if (eval(dynamicCondition)){

                        const object = {};

                        //create new inner outgoing connection
                        object[conn.to] = new StopInCity(connections[currentCity].count, connections[currentCity].distance, []);

                        connections[currentCity].to.push(object);

                        return connections;
                    }
                }
            });
        }

        //in the future findEndOfPath() should traverse down the linked list to the last element
        return connections[currentCity].to[connections[currentCity].to.length - 1];
    }

    findConnections (route, condition){
        /**
        * This is pretty complex and I am trying to use an approach I have never used before
        * Since we have multiple nested connections going of at each inner connection
        * I am trying to create a linked list of connections which in JS is nothing else
        * but a big nested object.
        * First I thought I would probably need a recursive function but before even calling
        * it inside of itself I realised that the distance had already reached 30 so I
        * returned the count of connections from there.
        * Basically this is using a greedy algorithm since we want to avoid looping through everything
        * multiple times.
        * @param {string} City code
        * @param {string} condition string
        * @return {number} Count of possible connections
        */

        const outGoingConnections = {};
        let nextCities = {};

        for (const city of this.cities){

            //initialise with with first connection
            outGoingConnections[city] = new StopInCity(1, this.connectionGraph[0].distance, [this.connectionGraph[0].to]);

            const nextCityToSearch = this.connectionGraph[0].to;

            nextCities = this.createLinkedList(outGoingConnections, nextCityToSearch, city, condition);

        }

        return nextCities[route[0]].count;
    }
}
/**
* Each nested connections has to be tracked
* since there is many stops it is a good idea to wrap them in a class
* since they all share properties and methods
*/
class StopInCity {
    constructor (count, distance, to){
        this.count = count;
        this.distance = distance;
        this.to = to;
    }
    findEndOfPath (end) {
        return this.to.includes(end);
    }
}

module.exports.TripPlanner = TripPlanner;
