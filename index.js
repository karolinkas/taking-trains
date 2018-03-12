const Planner = require("./app/trains.js").TripPlanner;


//these can come from a POST request in the future version of this program
const trainConnections = ["AB5", "BC4", "CD8", "DC8", "DE6", "AD5", "CE2", "EB3", "AE7"];

const tripPlanner = new Planner(trainConnections);

const response = {
    1: tripPlanner.getDistance("ABC"),
    2: tripPlanner.getDistance("AD"),
    3: tripPlanner.getDistance("ADC"),
    4: tripPlanner.getDistance("AEBCD"),
    5: tripPlanner.getDistance("AED"),
    6: tripPlanner.getTripCount("CC", ">= 3"),
    7: tripPlanner.getTripCount("AC", "== 4"),
    8: tripPlanner.findShortestTrip("AC"),
    9: tripPlanner.findShortestTrip("BB"),
    10: tripPlanner.findConnections("CC", "<= 30")
};

console.log(response);

