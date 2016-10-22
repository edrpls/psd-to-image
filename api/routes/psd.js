'use strict';

import fs from 'fs';
import path from 'path';
import multer from 'multer';
import logger from '../helpers/logger';
import filePathExists from '../helpers/file-exists';
import fileCleanup from '../helpers/file-cleanup';
import { getZippedPngsFromPsd } from '../helpers/psd-parse';

const readUpload = multer({ dest: '/tmp/' });

module.exports = (router, app) => {

    /**
     * @api {post} /psd Upload a PSD file
     * @apiName CreatePsd
     * @apiGroup Psd
     *
     * @apiParam {File}    :file      PSD file
     * @apiParam {String}  :fileName  PSD display name
     * @apiSuccess {String} :zipName Name of the file on disk
     * @apiSuccess {Number} :id id of the db entry
     * @apiSuccess {String} :title displayName of the psd
     */
    router.post('/psd', readUpload.single('file'), function postPsd(req, res, next) {
        const file = req.file;
        const filePath = file.path;
        const fileName = req.body.fileName || file.originalName;
        if (!file) return next({message: 'You need to upload a PSD file', status: 400});
        const newPsd = {
            AccountId: req.user.accountId,
            title: fileName
        };
        const psdIsInvalid = file => {
            return file.mimetype !== 'image/vnd.adobe.photoshop' &&
                (file.mimetype !== 'application/octet-stream' &&
                 !file.originalName.includes('.psd'));
        }
        if (psdIsInvalid (file)) {
            fileCleanup([filePath]);
            return next({message: 'Please upload a PSD file. Other file types are not accepted.', status: 400});
        }
        const assign = (...args) => Object.assign({}, ...args);
        getZippedPngsFromPsd(filePath)
            .then(zipName => res.json({zipName}))
            .catch(next);
    });

    /**
     * @api {get} /psd/zip/:zipName Upload an asset
     * @apiName GetPsdZip
     * @apiGroup Psd
     *
     * @apiParam {String}  :zipName  PSD file name
     * @TODO: check authorization before download
     */
    router.get('/psd/zip/:zipName', async function getPsd(req, res, next) {
        try {
            const fileName = req.params.zipName;
            if (!fileName) return next({message: 'Zip name is required', status: 400});
            res.download(path.resolve(`./tmp/${fileName}`), err => {
                if (err) return next(err);
            });
        } catch (err) {
            return next(err);
        }
    });
};
