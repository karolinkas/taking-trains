"use strict";

const Graph = require("../app/connections.js").ConnectionGraph;
const StopInCity = require("../app/stop.js").StopInCity;

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
        this.connectionGraph = new Graph(this.connectionsStrings).connectionGraph;
        this.cities = new Graph(this.connectionsStrings).cities;
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
     * @param {string} Route string
     * @param {string} Condition string
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
     * @param {string} String of city codes
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

    collectUniqueTrips (trip){
        if (trip.slice(-1) === this.tripEnd){
            this.uniqueTrips.add(trip);
        }
    }

    /**
    * Recursive function that creates a doubly linked list
    * which is required here to be able to have references to previous
    * connections to make sure that the distance limit doesn't get
    * exceeded and to remember the full trip to check if all conditions are
    * beeing fulfilled.
    **/
    createLinkedList (code, previous, condition){
        const dynamicCondition = `${previous.distance} ${condition}`;
        while (eval(dynamicCondition)){

            /**
            * Find all further connections from a city
            * and track their distance, the previous connection and concatenate a string
            * that stores the cities already passed during the trip
            */
            const inner = this.connectionGraph.filter(conn => {
                if (code === conn.from){
                    return conn;
                }
            }).map((innerConn, i) => {
                const newDistance = previous.getCurrentDistance() + innerConn.distance;
                const newPath = previous.getCurrentPath() + innerConn.to;

                //create instance for each inner connection
                const current = new StopInCity(undefined, newDistance, newPath, previous);

                //add inner connection only if it also doesn't exed total trip limit
                const tripLimit = `${current.distance} ${condition}`;
                if (eval(tripLimit)){
                    this.collectUniqueTrips(current.path);
                    current.next = this.createLinkedList(innerConn.to, current, condition);
                    return current;
                }
            });
            return inner;

        }
    }

    /**
    * Calls recursive function to make a plan of "train connections".
    * @param {string} String of city codes
    * @param {string} String that contains condition
    * @return {number} Count of unique trips that fullfill conditions
    **/
    findConnections (startEnd, condition) {

        this.tripStart = startEnd[0];
        this.tripEnd = startEnd[1];

        /**
        * Create an empty set
        * this is where we will be collecting all possible
        * combinations of paths that fulfill our conditions
        **/
        this.uniqueTrips = new Set();

        //create first instance to know where all connections will be coming from
        //since we don't not where the train connections are going to yet next is null,
        //as is previous since there will never be any previous connection in that instance
        this.list = new StopInCity(null, 0, this.start, null);

        //start looking for all possible paths through the graph
        this.list.next = this.createLinkedList(this.tripStart, this.list, condition);

        return Array.from(this.uniqueTrips).length;
    }
}

module.exports.TripPlanner = TripPlanner;
