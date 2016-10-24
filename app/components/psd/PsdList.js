'use strict';

import React from 'react';
import NoPsds from './NoPsds';
import Description from './Description';
import PsdCard from './PsdCard';
import UploadButton from './UploadButton';

const PsdList = ({ psds, psdData, remove }) => {
    let view = <NoPsds />;
    const styles = {
        display: 'flex',
        flexFlow: 'row wrap',
        justifyContent: 'flex-start'
    };
    if (psds && psds.length) {
        view = (<div>
            <div className="-p-a-2">
                <UploadButton message="Import .PSD" />
                <Description />
            </div>
            <div className="gds-layout__column--xl-12 gds-layout__column--md-4"
                style={styles}>
                { psds.map(psd => (
                    <PsdCard
                        key={ Math.random() }
                        psd={ psd }
                        remove={ remove } />
                )) }
            </div>
        </div>);
    }
    return (
        <div className="PsdList">
            { view }
        </div>
    );
};

export default PsdList;
