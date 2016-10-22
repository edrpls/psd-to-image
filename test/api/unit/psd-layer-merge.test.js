import chai from 'chai';
import psdTree from '../../seeds/layer-merge';
import fileCleanup from '../../../api/helpers/file-cleanup';
//Helper to test
import mergeLayers from '../../../api/helpers/psd-layer-merge';

describe('PSD Layer Merge helper', function () {
    const should = chai.should();
    const fileName = 'TestGroup.png';

    after(function () {
        fileCleanup([`./tmp/${fileName}`]);
    });

    it('merges groups into a single png file', function () {
        return mergeLayers(psdTree)
            .then(function (images) {
                images.should.be.an('array').with.length(1);//source contains a single group
                images[0].should.be.a('string')
                    .and.contain(fileName);
            })
            .catch(function (err) {
                throw err;
            });
    });

    it('saves the new images to a specified directory');

});
