const chai = require('chai');
chai.use(require('sinon-chai'));
const expect = chai.expect;

const deps = {};
const bookController = require('./bookController.js')(deps);

const mockReq = require('sinon-express-mock').mockReq;
const mockRes = require('sinon-express-mock').mockRes;

beforeEach(function(){
});

afterEach(function(){
});

describe('bookController', () => {
    it('canary test should always return true', function () {
        expect(true).to.equal(true);
    });

    describe('get method', () => {
        it('should exist', function () {
            expect(bookController).to.respondTo('get');
        });

        it('should conceal private methods', function () {
            expect(bookController).to.not.respondTo('okStatus');
        });

        it('should return 200', function () {
            const res = mockRes();
            bookController.get(mockReq(), res);
            expect(res.sendStatus).to.be.calledWith(200);
        });

    });

    describe('post method', () => {
        it('should exist', function () {
            expect(bookController).to.respondTo('post');
        });

        it('should return bad request if required body element not supplied', function () {
            const req = mockReq({
                body: {
                }
            });
            const res = mockRes();

            bookController.post(req, res);
            expect(res.sendStatus).to.be.calledWith(401);
        });

        it('should return 200 OK if we supply a valid required field', function () {
          const req = mockReq({
              body: {
                  requiredField: 'string'
              }
          });

          const res = mockRes();
          bookController.post(req, res);
          expect(res.sendStatus).to.be.calledWith(200);
        });

    });
});
