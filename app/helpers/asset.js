import HelperConstants from '../constants/HelperConstants';
export const setAlignment = (currentWidth, asset, x) => {
    let assetCenter = x + (asset.width / 2),
        left = currentWidth * HelperConstants.LEFT_THRESHOLD,
        right = currentWidth * HelperConstants.RIGHT_THRESHOLD;
    if (assetCenter < left && asset.originId !== 0) {
        return 0;
    } else if (assetCenter > right && asset.originId !== 2) {
        return 2;
    } else if (assetCenter > left && assetCenter < right && asset.originId !== 1) {
        return 1;
    }
    return asset.originId;
}

export const convertPosition = (currentWidth, asset, newOriginId) => {
    let assetWidth = asset.width,
        isPX = (asset.positionUnit == 'px'),
        oldX = isPX ? asset.x : (asset.x / 100 * currentWidth),
        newX;
    switch (asset.originId) {
        case 0: // from left
            switch (newOriginId) {
                case 1:
                    newX = oldX - currentWidth / 2 + assetWidth / 2;
                    break; // to center
                case 2:
                    newX = currentWidth - oldX - assetWidth;
                    break; // to right
            }
            break;
        case 1: // from center
            switch (newOriginId) {
                case 0:
                    newX = currentWidth / 2 - assetWidth / 2 + oldX;
                    break; // to left
                case 2:
                    newX = currentWidth / 2 - assetWidth / 2 - oldX;
                    break; // to right
            }
            break;
        case 2: // from right
            switch (newOriginId) {
                case 0:
                    newX = currentWidth - assetWidth - oldX;
                    break; // to left
                case 1:
                    newX = currentWidth / 2 - oldX - assetWidth / 2;
                    break; // to center
            }
            break;
    }
    return ~~(asset.positionUnit == 'px' ? newX : ((newX / currentWidth) * 100));
};
