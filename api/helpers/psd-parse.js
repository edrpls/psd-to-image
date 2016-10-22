import Chance from 'chance';
import path from 'path';
import PSD from 'psd';
import fs from 'fs';
import mergeLayers from './psd-layer-merge';
import fileCleanup from './file-cleanup';
import zipFiles from './zip-files';
import createId from './create-id';
const chance = new Chance();

/*
 * Reads a PSD file and returns it's layers and groups in an
 * easy to parse object
 * @param {String} filePath - Path to PSD file, opts
 * @returns {Promise} resolves with visible: {layers, groups}
 */
export default function psdParse(filePath) {
    return readPsd(filePath)
        .then(scanPsd)
        .then(getVisibleLayers);
}

/*
 * Reads a PSD file merges groups, exports them to PNG and zips them
 * All pngs are deleted after deletion
 * @param {String} filePath - Path to PSD file, opts
 * @returns {Promise} resolves with the filename of the zipfile on disk,
 * hardcoded to ./tmp/
 */
export async function getZippedPngsFromPsd(filePath) {
    try {
        const psdData = await psdParse(filePath);
        const hasGroups = psdData.groups && psdData.groups.length ? true : false;
        const freePngs = getFreePngs(psdData);
        const tree = hasGroups && regroup(psdData);//TODO: avoid tree structure
        const groupedPngs = (hasGroups  && tree.groups && await mergeLayers(tree)) || [];
        const toDelete = [...groupedPngs, ...psdData.layers.map(l => l.path)];
        const zipName = await zipFiles([...freePngs, ...groupedPngs]);
        fileCleanup(toDelete);
        return zipName;
    } catch (err) {
        return Promise.reject(err);
    }
}

/*
 * Halts the process if the psd has > 50 layers. More than enough IMO.
 * @param {Object} psdTree raw PSD tree from PSD.js
 * @returns {Object} if the psd has more than 50 visible layers returns
 * a rejected promise, otherwise the unmodified psdTree
 */
function scanPsd(psdTree) {
    const nodes = psdTree.children();
    const totalLayers = countLayers(0, nodes);
    if (totalLayers > 50) {
        return Promise.reject({
            status: 400,
            message: `Excesive number of visible layers (${totalLayers}). Check the visible groups on the PSD.`
        });
    }
    return psdTree;
}

/*
 * Counts the number of layers on the PSD
 * @param {number} total - current total of visible layers
 * @param {array} elements - current nodes to evaluate
 * @returns {number} grand total of visible layers
 */
function countLayers(total, elements) {
    function countCore(total, node) {
        if (node.visible() && node.isGroup() && node.hasChildren()) {
            total = countLayers(total, node.children());
        } else if (node.isLayer() && node.visible()) {
            total += 1;
        }
        return total;
    }
    return elements.reduce(countCore, total);
}

/*
 * Gets the paths to images that don't belong to a group and the
 * merged images
 * @param {Object} psdData - has keys layers and groups
 * @returns {array} relative paths on disk to images
 */
function getFreePngs({layers, groups}) {
    const freeLayers = layers.length && layers.filter(l => !l.groupId);
    const rootId = groups.length && groups.find(g => g.groupId === null).id;
    const groupLayers = rootId && layers.filter(l => l.groupId === rootId);
    return [...freeLayers, ...groupLayers].map(l => l.path);
}

/*
 * Finds the root group of a node
 * @param {array} groups - nodes to evaluate
 * @param {string} id - string to compare against
 * @returns {object} pops - root group
 */
function findRoot(groups, id) {
    if (!groups.length) return null;
    const pops = id && groups.find(g => g.id === id);
    const gramps = pops && groups.find(g => g.id === pops.groupId);
    if (!pops || !gramps) return;
    if (gramps && gramps.groupId === null) {
        return pops;
    } else {
        return findRoot(groups, pops.groupId);
    }
}

/*
 * Reduces the psd.js tree to a simple object that contains
 * layers and groups that could be associated by group.id
 * @param {Object} target - Final container of the data
 * @param {array} elements - current nodes to evaluate
 * @param {Object} node - Current element to evaluate:
 * Groups get reduced and their object receives an id
 * Layers are exported to PNG, this generates a promise,
 * it receives the id of the latest group created
 * @returns {Object} - The target object after processing
 * @example {layers: [{...}, {...}], groups: [{...}, {...}]}
 */
function reducePsd(target, elements, id = null) {
    function reducePsdCore(target, node) {
        if (!node) {
            return target;
        }
        const nodeName = node.get('name');
        const width = node.get('width');
        const height = node.get('height');
        const rows = node.get('rows');
        const cols = node.get('cols');
        const notMask = (data => data.every(v => v !== 0))([width, height, rows, cols]);
        const nLeft = node.get('left');
        const nTop = node.get('top');
        const rootNode = findRoot(target.groups, id);
        const x = rootNode ? nLeft - rootNode.x : nLeft;
        const y = rootNode ? nTop - rootNode.y : nTop;
        const baseData = {
            groupId: id,
            name: nodeName,
            width,
            height,
            x: x > 0 ? x : 0,
            y: y > 0 ? y : 0,
            blendMode: node.layer.blendMode.mode,
            opacity: node.layer.blendMode.opacity
        };

        if (node.visible() && node.isGroup() && node.hasChildren()) {
            const newId = createId();
            const newGroup = Object.assign({}, baseData, { id: newId });
            target.groups.push(newGroup);
            target = reducePsd(target, node.children(), newGroup.id);
        } else if (node.isLayer() && node.visible() && notMask) {
            const exportName = createNewPath(nodeName);
            const newLayer = Object.assign({}, baseData, { path: exportName });
            target.promises.push(node.saveAsPng(exportName));
            target.layers.push(newLayer);
        }
        return target;
    }
    return elements.reduce(reducePsdCore, target);
}

/*
 * Separates layers and groups and exports them to PNG
 * @param {Object} psdTree - A psd.js tree object
 * @returns {Promise} Contains Layers and Groups if successful
 */
function getVisibleLayers(psdTree) {
    const baseObj = { layers: [], groups: [], promises: [] };
    const nodes = psdTree.children();
    const data = reducePsd(baseObj, nodes);
    return Promise.all(data.promises)
        .then(() => ({
            layers: data.layers,
            groups: data.groups
        }));
}

/*
 * Rebuilds a much simpler tree of the psd data
 * @param {object} psdTree - A psd.js tree object
 * @returns {object} simple tree structure of the psd
 */
function regroup({ layers, groups }) {
    let data = { groups: [], layers: [] };
    if (groups.length) {
        data = groups.reduce((target, g) => {
            const groupLayers = layers.filter(l => l.groupId === g.id);
            target.groups = [...target.groups, Object.assign({}, g, { layers: groupLayers })];
            return target;
        }, data);
    }
    data.groups = data.groups.reduce((target, group, i, a) => {
        let container;
        if (group.groupId) {
            const inTarget = findParent(group.groupId, target);
            const inArray = a.find(g => g.id === group.groupId);
            container = inTarget || inArray;
            if (container) {
                const containerGroups = container.groups || [];
                container.groups = [...containerGroups, group];
                if (!inTarget) {
                    target.push(container);
                } else {
                    const groupIndex = target.indexOf(container);
                    target[groupIndex] = container;
                }
            } else {//Is root group
                target.push(group);
            }
        } else {
            target.push(group);
        }
        return target
    }, []);
    return data.groups[0];
}

/*
 * Returns a simplePath from ./tmp that includes the creation timestamp
 * @param {String} name - Layer name, defaults to chance.string
 * @returns {String} Path like: ./tmp/timestamp_name.png
 */
function createNewPath(name = createId(6)) {
    return `./tmp/${name}_${createId(4)}.png`;
}

/*
 * Reads the PSD file with psd.js and returns the document tree
 * @param {String} filePath - PSD file path
 * @returns {Promise} PSD tree object if successful
 */
function readPsd(filePath) {
    const fullPath = path.resolve(filePath);
    return PSD.open(fullPath)
        .then(psd => psd.tree());
}

/*
 * finds the direct parent of a node
 * @param {string} parentId - string id of the parent
 * @returns {array} elements to evaluate
 */
function findParent(parentId, collection) {
    let thisParent;
    collection.forEach(e => {
        let found = e.id === parentId;
        if (found) {
            thisParent = e;
            return;
        } else if (e.groups) {
            thisParent = findParent(parentId, e.groups);
            return;
        }
    });
    return thisParent;
}
