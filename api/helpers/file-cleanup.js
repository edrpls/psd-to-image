// Delete Files
import { unlink } from 'fs';
import { resolve } from 'path';

/*
 * Deletes files
 * @param {array} files - relative paths to files
 * @returns {undefined}
 */
export default function fileCleanup(files) {
    files.forEach(file => {
        const absPath = resolve(file);
        unlink(absPath, err => err && console.log(err));
        //Dunno what to do with this error, I don't mind
        //if it fails but it would be nice to know.
    });
}
