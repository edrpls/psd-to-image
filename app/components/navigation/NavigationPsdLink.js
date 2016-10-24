'use strict';

import React from 'react';
import { Link } from 'react-router';

const NavigationPsdLink = () => (
    <Link to={ '/psd' } className="NavigationItem Link">
        <span className="fa fa-camera"></span>
        <span className="NavigationPsdLink">PSD Manager</span>
    </Link>
);

export default NavigationPsdLink;
