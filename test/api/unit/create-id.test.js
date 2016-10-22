import chai from 'chai';
//Helper to test
import createId from '../../../api/helpers/create-id';

describe('CreateId Helper', function () {
    const should = chai.should();

    it('creates a random string', function () {
        const id = createId();
        id.should.be.a('string').with.length(5);
    });

    it('creates a random string of 10 chars', function () {
        const id = createId(10);
        id.should.be.a('string').with.length(10);
    });

});
