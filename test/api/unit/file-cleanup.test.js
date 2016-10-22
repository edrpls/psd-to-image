import chai from 'chai';
import {writeFile} from 'fs';
import filePathExists from '../../../api/helpers/file-exists';
//Helper to test
import fileCleanup from '../../../api/helpers/file-cleanup';

describe('File Cleanup helper', function () {
    const should = chai.should();

    it('deletes a list of given files', function () {
        return new Promise(function (resolve, reject) {
            const filePath = 'tmp/test.txt';
            writeFile(filePath, 'Test file', function (err) {
                if (err) return reject(err);
                filePathExists(filePath)
                    .then(function (exists) {
                        exists.should.be.true;
                    })
                    .then(function () {
                        fileCleanup([filePath]);
                        setTimeout(function () {
                            filePathExists(filePath)
                                .then(function (exists) {
                                    exists.should.be.false;
                                    resolve();
                                });
                        }, 100);
                    })
                    .catch(function (err) {
                        reject(err);
                    });
            });
        });

    });

});
