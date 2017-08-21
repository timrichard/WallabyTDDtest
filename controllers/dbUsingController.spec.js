// jshint ignore: start
const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
chai.use(sinonChai);
const expect = chai.expect;
const httpMocks = require('node-mocks-http');
const EventEmitter = require('events').EventEmitter;

const knex = require('knex');
const mockKnex = require('mock-knex');

const mockDB = knex({
    client: 'pg'
});

const lodash = {};

let req, res, dbUsingController, tracker;

describe('all DB controller methods', () => {
    before(function () {
        lodash.toLower = sinon.stub();
        dbUsingController = require('./dbUsingController')({
            knex: mockDB,
            _: lodash
        });
    });

    after(function () {
    });

    beforeEach(function () {
        req = httpMocks.createRequest();
        res = httpMocks.createResponse({eventEmitter: EventEmitter});
    });

    afterEach(function () {
    });

    describe('all methods that use the mock DB', () => {
        beforeEach(function () {
            tracker = mockKnex.getTracker();
            mockKnex.mock(mockDB);
            tracker.install();
        });

        afterEach(function () {
            tracker.uninstall();
            mockKnex.unmock(mockDB);
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

        it('should let me prepare fixtures for a sequence of queries in one method', function (done) {
            const queryChain = [
                (query) => {
                    expect(query.method).to.equal('select');
                    query.response({'a': 'b'});
                },
                (query) => {
                    expect(query.method).to.equal('update');
                    query.response({'c': 'd'});
                },
                (query) => {
                    expect(query.method).to.equal('insert');
                    query.response({'e': 'f'});
                }
            ];

            tracker.on('query', (query) => {
                queryChain.shift().call(this, query);
            });

            dbUsingController.multipleQueries(req, res);

            res.on('end', function() {
                expect(res.statusCode).to.equal(204);
                done();
            });
        });

    });

    describe('all methods that just demo stubbing', () => {
        it('should return a fixture when I call a utility function that uses a stubbed dependency', function () {
            lodash.toLower.withArgs('hello').returns('world');
            expect(dbUsingController.utilityUsesStubFixture('hello')).to.equal('world');
        });
    });
});
