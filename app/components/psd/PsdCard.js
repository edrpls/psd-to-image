'use strict';

import React from 'react';
import { Link } from 'react-router';
import Button from '../common/Button';
import DownloadButton from './DownloadButton';

const PsdCard = ({ psd }) => {
    return (
        <div className="gds-card gds-card--white -m-a-3 -p-a-3"
            style={ {width: '250px'} }>
            <p className="gds-card__title -ellipsis">{ psd.title }</p>
            <div className="gds-button-group">
                <DownloadButton zipName={ psd.zipName } />
            </div>
        </div>
    )
};
export default PsdCard;
