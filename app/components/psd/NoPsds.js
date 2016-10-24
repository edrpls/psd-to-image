'use strict';

import React from 'react';
import UploadButton from './UploadButton';
import Description from './Description';

const NoPsds = () => (
    <div className="gds-layout__container--full-width -text-center">
        <Description />
        <div className="-p-v-2">
            <UploadButton /> a <b>.psd</b> file.
        </div>
    </div>
);

export default NoPsds;
