/*global describe, it*/

const expect = require("chai").expect;
const trains = require("../app/trains");

describe("Checking how trains go", () => {
    describe("Finding out trip distances", function () {

        it("Distances between cities should be correct", function () {

            const train = new trains();

            expect(train).to.equal(0);
        });
    });
});
