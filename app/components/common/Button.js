'use strict';

import React from 'react';

const Button = ({
    action = console.log, mods = [], text = '', group, icon
}) => {
    const base = 'gds-button';
    const type = action === 'submit' ? action : 'button';
    const cAction = action === 'submit' ? null : action;
    const modsClass = mods.length && mods
        .split(' ')
        .map(m => ` ${base}--${m.trim()}`)
        .join('');
    let cssClass = modsClass ? base + modsClass : base;
    if (group) cssClass += ' ' + base + '-group__button';
    const iconElt = icon && <span className={`fa fa-${icon}`}></span>;
    return (
        <button className={ cssClass }
            type={ type } onClick={ cAction } >
            { iconElt } { text }
        </button>
    );
};

export default Button;

