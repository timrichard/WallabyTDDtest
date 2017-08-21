// jshint ignore: start
const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
chai.use(sinonChai);
const expect = chai.expect;
const httpMocks = require('node-mocks-http');

let req, res, deps, bookController;

beforeEach(function () {
    deps = {runner: 'tests'};
    bookController = require('./bookController')({});
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

    describe('libCallbackCallerString', () => {
        it('should exist', function () {
            expect(bookController).to.respondTo('libCallbackCallerString');
        });

        it('should throw an exception if no callback is supplied', function () {
            expect(() => {
                bookController.libCallbackCallerString()
            }).to.throw('Callback required')
        });

        // Similar-ish looking tests here to provide a wide variety as templates for reuse
        it('should call my callback', function () {
            const myCallback = sinon.spy();
            bookController.libCallbackCallerString(myCallback);

            expect(myCallback).to.have.been.called;
        });

        it('should call my callback with an expected string', function () {
            const myCallback = sinon.spy();
            bookController.libCallbackCallerString(myCallback);

            expect(myCallback).to.have.been.calledWith('hello');
        });
    });

    describe('libCallbackCallerJSON', () => {
        it('should exist', function () {
            expect(bookController).to.respondTo('libCallbackCallerJSON');
        });

        it('should throw an exception if no callback is supplied', function () {
            expect(() => {
                bookController.libCallbackCallerJSON()
            }).to.throw('Callback required')
        });

        it('should call my callback', function () {
            const myCallback = sinon.spy();
            bookController.libCallbackCallerJSON(myCallback);

            expect(myCallback).to.have.been.called;
        });

        it('should call my callback with an expected object structure', function () {
            const myCallback = sinon.spy();
            bookController.libCallbackCallerJSON(myCallback);

            expect(myCallback).to.have.been.calledWithExactly({
                a: 'b',
                c: 'd'
            });
        });


    });

});
