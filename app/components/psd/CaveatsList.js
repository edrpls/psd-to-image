'use strict';

import React from 'react';
import PsdStore from 'stores/PsdStore';

const  CaveatsList = (props) => {
    const caveats = PsdStore.getState().caveats;
    return (<div>
        <p className="gds-well gds-well--warning gds-text--body-md -m-b-2">Caveats</p>
        <ul className="gds-well gds-well--default" style={ {listStyleType: 'bullet'} }>
            { caveats.map((caveat, index) => <li key={ index }>
                <p className="gds-well__text">{caveat}</p>
            </li>) }
        </ul>
    </div>);
};

export default CaveatsList;
