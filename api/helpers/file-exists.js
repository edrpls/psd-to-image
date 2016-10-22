import fs from 'fs';

/*
 * Verifies if a filepath exists in disk
 * @param {String} filePath - Path to file
 * @returns {Promise} Boolean
 */
export default function filePathExists(filePath) {
    return new Promise((resolve, reject) => {
        fs.stat(filePath, (err, stats) => {
            if (err === null) {
                return resolve(true);
            } else if (err.code === 'ENOENT') {
                return resolve(false);
            } else {
                reject(err);
            }
        });
    });
}
