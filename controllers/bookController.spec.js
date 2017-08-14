const expect = require('chai').expect;
const httpMocks = require('node-mocks-http');

const deps = {};
const bookController = require('./bookController.js')(deps);

let req, res;

beforeEach(function () {
    // Request object overridden in methods if config needed beyond defaults
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
});

afterEach(function () {
});

describe('bookController', () => {
    describe('get method', () => {
        it('should exist', function () {
            expect(bookController).to.respondTo('get');
        });

        it('should conceal private methods', function () {
            expect(bookController).to.not.respondTo('okStatus');
        });

        it('should return 200 in all cases', function () {
            bookController.get(req, res);
            expect(res.statusCode).to.equal(200);
        });
    });

    describe('post method', () => {
        it('should exist', function () {
            expect(bookController).to.respondTo('post');
        });

        it('should return bad request if required body element not supplied', function () {
            bookController.post(req, res);
            expect(res.statusCode).to.equal(400);
        });

        it('should return 200 OK if we supply a valid required field', function () {
            req = httpMocks.createRequest({
                body: {
                    requiredField: 'something'
                }
            });
            bookController.post(req, res);
            expect(res.statusCode).to.equal(200);
        });

        it('should return some diffable json if I supply the magic word', function () {
            req = httpMocks.createRequest({
                body: {
                    requiredField: 'bingo'
                }
            });

            bookController.post(req, res);
            const responseData = JSON.parse(res._getData());
            expect(responseData.hello).to.equal('world');
        });

    });
});
