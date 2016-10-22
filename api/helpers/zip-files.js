import { createReadStream, createWriteStream } from 'fs';
import path from 'path';
import JSZip from 'jszip';
import createId from './create-id';

/*
 * Creates a zip file from its input
 * @param {array} files - strings of relative paths to zip
 * @returns {Promise} Resolves to the filepath of the zip
 */
export default function zipFiles(files) {
    return new Promise((resolve, reject) => {
        if (!files.length) return reject('zipFiles expects an array with file paths');
        const zip = new JSZip();
        const zipName = `${createId(8)}.zip`;
        files.forEach(file => {
            const stream = createReadStream(file);
            zip.file(file, stream);
        });
        zip
            .generateNodeStream({type: 'nodebuffer', streamFiles: true})
            .pipe(createWriteStream(path.resolve(`./tmp/${zipName}`)))
            .on('finish', () => resolve(zipName))
            .on('error', err => reject(err));
    });
}
