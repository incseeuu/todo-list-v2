import React from 'react';
import s from './FetchLoder.module.css'

const FetchLoader = () => {
    return (
        <div className={s.container}>
            <div className={s.linearActivity}>
                <div className={s.indeterminate}></div>
            </div>
        </div>
    );
};

export default FetchLoader;