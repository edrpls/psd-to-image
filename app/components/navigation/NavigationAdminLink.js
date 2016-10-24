'use strict';

import React from 'react';
import { Link } from 'react-router';

const NavigationAdminLink = () => (
    <Link
        to={ '/admin' }
        className="NavigationItem Link"
        >
        <span className="fa fa-cogs"></span>
        <span className="NavigationAdminLink">Admin Panel</span>
    </Link>
);

export default NavigationAdminLink;
