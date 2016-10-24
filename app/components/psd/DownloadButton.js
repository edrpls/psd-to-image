'use strict';

import React from 'react';
import PsdActions from 'actions/PsdActions';

const DownloadButton = ({ zipName, title }) => (
    <a href={ `/api/psd/zip/${zipName}` } className="gds-button gds-button--primary gds-button--sm gds-button-group__button">
        <span className="fa fa-download"></span> Download zip file
    </a>
);

export default DownloadButton;
