// jshint ignore: start
const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
chai.use(sinonChai);
const expect = chai.expect;
const httpMocks = require('node-mocks-http');
const EventEmitter = require('events').EventEmitter;

const knex = require('knex');
const mockDB = require('mock-knex');

const db = knex({
    client: 'pg'
});

const lodash = {};

let req, res, dbUsingController, deps, tracker;

before(function () {
    lodash.toLower = sinon.stub();
    deps = {db, lodash};
    dbUsingController = require('./dbUsingController')(deps);
});

after(function () {
});

describe('simple SQL methods', () => {
    beforeEach(function () {
        req = httpMocks.createRequest();
        res = httpMocks.createResponse({eventEmitter: EventEmitter});
        tracker = mockDB.getTracker();
        mockDB.mock(db);
        tracker.install();
    });

    afterEach(function () {
        mockDB.unmock(db);
        tracker.uninstall();
    });

    it('should perform simple first select and get one row back', function (done) {
        tracker.on('query', (query) => {
            expect(query.method).to.equal('first');
            query.response({
                fieldA: 'A',
                fieldB: 'B'
            });
        });
        dbUsingController.simpleSelectOneRow(req, res);
        res.on('end', function () {
            expect(res.statusCode).to.equal(201);
            done();
        });
    });

    it('should perform a simple select and get multi rows back', function (done) {
        tracker.on('query', (query) => {
            expect(query.method).to.equal('select');
            query.response([
                {
                    fieldA: 'A',
                    fieldB: 'B'
                },
                {
                    fieldA: 'C',
                    fieldB: 'D'
                }
            ]);
        });
        dbUsingController.simpleSelectMultiRows(req, res);
        res.on('end', function () {
            expect(res.statusCode).to.equal(202);
            done();
        });
    });

    it('should let me execute a raw query to trigger a stored procedure', function (done) {
        tracker.on('query', (query) => {
            expect(query.method).to.equal('raw');
            query.response(true);
        });
        dbUsingController.simpleStoredProcedure(req, res);
        res.on('end', function () {
            expect(res.statusCode).to.equal(203);
            done();
        });
    });

    it('should return a fixture when I call a utility function that uses a stubbed dependency', function () {
        lodash.toLower.withArgs('hello').returns('world');
        expect(dbUsingController.utilityUsesStubFixture('hello')).to.equal('world');
    });

});
