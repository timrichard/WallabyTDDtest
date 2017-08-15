// jshint ignore: start
const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
chai.use(sinonChai);
const expect = chai.expect;
const httpMocks = require('node-mocks-http');

const knex = require('knex');
// const mockDB = require('mock-knex');

const db = knex({
    client: 'pg'
});


let req, res, dbUsingController, mockDB, tracker;

before(function () {
    const deps = {db};
    dbUsingController = require('./dbUsingController')(deps);
    mockDB = require('mock-knex');
    mockDB.mock(db);
});

after(function () {
    mockDB.unmock(db);
});

describe('simple SQL methods', () => {
    beforeEach(function () {
        req = httpMocks.createRequest();
        res = httpMocks.createResponse({eventEmitter: require('events').EventEmitter});
        tracker = mockDB.getTracker();
        tracker.install();
    });

    afterEach(function () {
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
            expect(res.statusCode).to.equal(101);
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
            expect(res.statusCode).to.equal(102);
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
            expect(res.statusCode).to.equal(103);
            done();
        });
    });

});
