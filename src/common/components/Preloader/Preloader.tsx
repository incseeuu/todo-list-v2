import React from 'react';
import s from './Preloader.module.scss'

const Preloader = () => {
    return (
        <div className={s.container}>
            <div className={s.scene}>
                <div className={s.cubeWrapper}>
                    <div className={s.cube}>
                        <div className={s.cubeFaces}>
                            <div className={s.cubeFace + ' ' + s.shadow}></div>
                            <div className={s.cubeFace + ' ' + s.bottom}></div>
                            <div className={s.cubeFace + ' ' + s.top}></div>
                            <div className={s.cubeFace + ' ' + s.left}></div>
                            <div className={s.cubeFace + ' ' + s.right}></div>
                            <div className={s.cubeFace + ' ' + s.back}></div>
                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
};

export default Preloader;