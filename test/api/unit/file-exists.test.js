import chai from 'chai';
import {writeFile} from 'fs';
//Helper to test
import filePathExists from '../../../api/helpers/file-exists';

describe('File Exists helper', function () {
    const should = chai.should();

    it('returns true if a file exists', function () {
        const testPath = 'test/assets/logo.png';
        return filePathExists(testPath)
            .then(function (exists) {
                exists.should.be.true;
            })
            .catch(function (err) {
                throw err;
            });
    });

    it('returns false if a file doesn\'t exist', function () {
        const now = Date.now();
        const testPath = `${now}/${now}.tiff`;
        return filePathExists(testPath)
            .then(function (exists) {
                exists.should.be.false;
            })
            .catch(function (err) {
                throw err;
            });
    });

    it('throws an error if no path is given', function () {
        filePathExists()
            .then(function (res) {
                should.not.exist(res);
            })
            .catch(function (err) {
                console.log(err);
                err.should.throw(TypeError);
            });
    });

});
