import chai from 'chai';
import {loadAsync} from 'jszip';
import { readFile } from 'fs';
import fileCleanup from '../../../api/helpers/file-cleanup';
//Helper to test
import zipFiles from '../../../api/helpers/zip-files';

describe('PSD Layer Merge helper', function () {
    const should = chai.should();
    const origin = ['./test/assets/merge_img_1.png', './test/assets/logo.png'];
    let files = [];

    after(function () {
        fileCleanup(files);
    });

    it('compresses a list of files into a zip file', async function () {
        try {
            const zipPath = await zipFiles(origin);
            zipPath.should.be.a('string')
                .and.contain('.zip');
            const filePath = `./tmp/${zipPath}`;
            files = files.concat(filePath);
            return new Promise(function (resolve, reject) {
                readFile(filePath, function (err, data) {
                    if (err) return reject(err);
                    loadAsync(data).then(function (zip) {
                        zip.should.be.an('object').and.have.property('files');
                        const keys = Object.keys(zip.files);
                        origin.forEach(o => keys.should.include(o));
                        resolve();
                    });
                });
            });
        } catch (err) {
            throw err
        }
    });

});
