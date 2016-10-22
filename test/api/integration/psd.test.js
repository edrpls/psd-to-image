import chai from 'chai';
import chaiHttp from 'chai-http';

import { app } from '../../../api/server';

describe('PSDs API', function () {
    const should = chai.should();
    let createdPsd;

    it('returns an error creating a PSD if the file is missing', function () {
        return chai.request(app)
            .post('/api/psd')
            .field('fileName', 'Test PSD Name')
            .then(function (res) {
                should.not.exist(res);
            })
            .catch(function (err) {
                err.status.should.equal(500);
            });
    });

    it('parses a PSD', function () {
        return chai.request(app)
            .post('/api/psd')
            .attach('file', 'test/assets/simple.psd')
            .field('fileName', 'Test PSD Name')
            .then(function (res) {
                res.status.should.equal(200);
                res.body.should.have.property('zipName');
                createdPsd = res.body.zipName;
            })
            .catch(function (err) {
                throw err;
            });
    });

    it('gets a PSD as a zipFile', function () {
        return chai.request(app)
            .get(`/api/psd/zip/${createdPsd}`)
            .then(function (res) {
                res.status.should.equal(200);
            })
            .catch(function (err) {
                throw err;
            });
    });

});
