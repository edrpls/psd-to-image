import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
chai.use(sinonChai)
//Helper to test
import logger from '../../../api/helpers/logger';

describe('Logger helper', function () {
    const should = chai.should();
    let logStub;

    beforeEach(function () {
        logStub = sinon.stub(console, 'log', console.log);
    });

    afterEach(function () {
        console.log.restore();
    });

    it('logs to console a DEBUG level message', function () {
        logger.debug('This is a test');
        logStub.should.have.been.calledOnce;
        const args = logStub.args;
        const hasFlag = args.some(a => a.should.contain('DEBUG'));
        const includesText = args.some(a => a.should.contain('"This is a test"'));
        hasFlag.should.be.true;
        includesText.should.be.true;
    });

    it('logs to console an INFO level message', function () {
        logger.info('This is a test');
        logStub.should.have.been.calledOnce;
        const args = logStub.args;
        const hasFlag = args.some(a => a.should.contain('INFO'));
        const includesText = args.some(a => a.should.contain('"This is a test"'));
        hasFlag.should.be.true;
        includesText.should.be.true;
    });

    it('logs to console an ERROR level message', function () {
        logger.error('This is a test');
        logStub.should.have.been.calledOnce;
        const args = logStub.args;
        const hasFlag = args.some(a => a.should.contain('ERROR'));
        const includesText = args.some(a => a.should.contain('"This is a test"'));
        hasFlag.should.be.true;
        includesText.should.be.true;
    });

    it('logs to console custom level message', function () {
        logger.custom('2spooky4me')('This is a test');
        logStub.should.have.been.calledOnce;
        const args = logStub.args;
        const hasFlag = args.some(a => a.should.contain('2spooky4me'));
        const includesText = args.some(a => a.should.contain('"This is a test"'));
        hasFlag.should.be.true;
        includesText.should.be.true;
    });

});
