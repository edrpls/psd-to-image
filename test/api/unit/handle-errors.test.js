import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
chai.use(sinonChai)
//Helper to test
import errorHandler from '../../../api/helpers/handle-errors';

describe('Error Handler Helper', function () {
    const should = chai.should();

    it('returns a text error with id for server errors', function () {
        const err = {message: 'Test error'};
        const res = {
            status: () => {},
            json: () => {}
        };
        const sendStub = sinon.stub();
        const jsonStub = sinon.stub();
        const statusStub = sinon.stub(res, 'status', function () {
            return {
                send: sendStub,
                json: jsonStub
            };
        });
        errorHandler(err, {}, res);
        statusStub.should.have.been.calledOnce;
        statusStub.should.have.been.calledWith(500);
        sendStub.should.have.been.calledWithMatch('Internal server error');
        jsonStub.should.not.have.been.calledOnce;
    });

    it('returns an object with an error message for user errors', function () {
        const err = {status: 404, message: 'Test error'};
        const res = {
            status: () => {},
            json: () => {}
        };
        const sendStub = sinon.stub();
        const jsonStub = sinon.stub();
        const statusStub = sinon.stub(res, 'status', function () {
            return {
                send: sendStub,
                json: jsonStub
            };
        });
        errorHandler(err, {}, res);
        statusStub.should.have.been.calledOnce;
        statusStub.should.have.been.calledWith(404);
        sendStub.should.not.have.been.calledOnce;
        jsonStub.should.have.been.calledOnce;
        jsonStub.should.have.been.calledWith({error: 'Test error'});
    });

});
