/*global describe, it*/

const expect = require("chai").expect;
const Planner = require("../app/trains.js").TripPlanner;

describe("Checking train connections", () => {

    const trainConnections = ["AB5", "BC4", "CD8", "DC8", "DE6", "AD5", "CE2", "EB3", "AE7"];

    describe("Finding out trip distances", function () {

        it("Distance between A-B-C should be correct", function () {

            const tripPlanner = new Planner(trainConnections);

            expect(tripPlanner.getDistance("ABC")).to.equal(9);

        });

        it("Distance between A-D should be correct", function () {

            const tripPlanner = new Planner(trainConnections);

            expect(tripPlanner.getDistance("AD")).to.equal(5);

        });

        it("Distance between A-D-C should be correct", function () {

            const tripPlanner = new Planner(trainConnections);

            expect(tripPlanner.getDistance("ADC")).to.equal(13);

        });

        it("Distance between A-E-B-C-D should be correct", function () {

            const tripPlanner = new Planner(trainConnections);

            expect(tripPlanner.getDistance("AEBCD")).to.equal(22);

        });

        it("Distance between A-E-D should be correct", function () {

            const tripPlanner = new Planner(trainConnections);

            expect(tripPlanner.getDistance("AED")).to.equal("NO SUCH ROUTE");

        });

    });

    describe("Find count of trips with certain amount of stops", function () {

        it("Trip from C to C with maximimum 3 stops", function () {

            const tripPlanner = new Planner(trainConnections);

            expect(tripPlanner.getTripCount("CC", ">= 3")).to.equal(2);

        });

        it("Trip from A to C with 4 stops", function () {

            const tripPlanner = new Planner(trainConnections);

            expect(tripPlanner.getTripCount("CC", "== 4")).to.equal(3);

        });

    });

    describe("Find shortest connection length", function () {

        it("Trip from A to C", function () {

            const tripPlanner = new Planner(trainConnections);

            expect(tripPlanner.findShortestTrip("AC")).to.equal(9);

        });


        it("Trip from B to B", function () {

            const tripPlanner = new Planner(trainConnections);

            expect(tripPlanner.findShortestTrip("BB")).to.equal(9);

        });
    });

    describe("Count possible connections between locations", function () {

        it("Trip from A to C", function () {

            const tripPlanner = new Planner(trainConnections);

            expect(tripPlanner.findConnections("AC")).to.equal(7);

        });

    });
});
