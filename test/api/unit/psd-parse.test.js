import chai from 'chai';
import fileCleanup from '../../../api/helpers/file-cleanup';
//Helper to test
import psdParse, {getZippedPngsFromPsd} from '../../../api/helpers/psd-parse';

describe('PSD Layer Merge helper', function () {
    const should = chai.should();
    const filePath = './test/assets/simple.psd';
    let files = [];

    after(function () {
        fileCleanup(files);
    });

    it('merges groups into a single png file', async function () {
        try {
            const tree = await psdParse(filePath);
            tree.should.be.an('object');
            tree.should.have.property('layers')
                .and.be.an('array')
                .and.have.length(7);
            tree.should.have.property('groups')
                .and.be.an('array')
                .and.have.length(0);
            const paths = tree.layers.map(l => l.path);
            files = [...files, ...paths];
        } catch (err) {
            throw err;
        }
    });

    it('returns a path to a zip file containing the PSD layers', async function () {
        try {
            const zipFile = await getZippedPngsFromPsd(filePath);
            zipFile.should.be.a('string').and.contain('.zip');
            files = [...files, `./tmp/${zipFile}`];
        } catch (err) {
            throw err;
        }
    });

});

