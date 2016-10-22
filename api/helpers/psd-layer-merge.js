import Canvas from 'canvas';
import { fabric } from 'fabric';
import fs from 'fs';
import createId from './create-id';

const Image = Canvas.Image;
/*
 * This is a workaround for fabric screwing things up:
 * props to this guy: https://github.com/kangax/fabric.js/issues/1871
 */
const createCanvasForNode = fabric.createCanvasForNode;
fabric.createCanvasForNode = function () {
    const canvas = createCanvasForNode.apply(this, arguments);
    canvas.nodeCanvas = new Canvas(canvas.width, canvas.height);
    canvas.contextContainer = canvas.nodeCanvas.getContext('2d');
    return canvas;
};

/*
 * Reads the simplified psd tree and merges layers grouped together
 * @param {object} tree - simplified psd tree
 * @returns {Promise} resolves with array of merged pngs
 */
export default function mergeLayers(tree) {
    //console.log(JSON.stringify(tree, null, 4));
    //throw Error('OH SHIT');
    const groups = tree.groups.reverse();
    const groupLayers = groups.map(g => getGroupLayers(undefined, g));//=> [[{}.{}], [{}]]
    const canvases = groups.map((g, i) => mergeGroupLayers(g, groupLayers[i]));
    return Promise.all(groups.map((g, i) => exportPng(canvases[i], g.name)));
    //return Promise.all(canvases.map(exportPng));
}

/*
 * Exports canvas data to a PNG
 * @param {object} canvas - fabric.js canvas object
 * @returns {Promise} resolves with png filepath
 */
function exportPng(canvas, fileName = createId(6)) {
    return new Promise((resolve, reject) => {
        const filePath = `./tmp/${fileName}.png`;
        const stream = canvas.createPNGStream();
        const out = fs.createWriteStream(filePath);
        stream.on('data', chunk => out.write(chunk));
        stream.on('error', err => reject(err));
        stream.on('end', () => {
            resolve(filePath)
        });
    });
}

/*
 * finds the layers of a group
 * @param {array} target - new layers container
 * @param {object} group - node to evaluate
 * @returns {array} target - layers of the node
 */
function getGroupLayers(target = [], group) {
    // Reverse to start from bottom up
    const layers = group.layers && group.layers.length && group.layers.reverse();
    const groups = group.groups && group.groups.length && group.groups.reverse();
    const imagePaths = [];
    if (layers) layers.forEach(layer => target.push(layer));
    if (groups) target = groups.reduce(getGroupLayers, target);
    return target;
}

/*
 * Creates a canvas object with its groups and layers
 * @param {object} contains dimensions of he new canvas
 * @returns {object} canvas with layers
 */
function mergeGroupLayers({width, height}, layers) {
    const canvas = fabric.createCanvasForNode(width, height);
    layers.forEach(layer => {
        const img = new Image;
        img.src = fs.readFileSync(layer.path);
        const imgInstance = new fabric.Image(img, {
            left: layer.x,
            top: layer.y
        });
        canvas.add(imgInstance);
    })
    return canvas;
}
