import React from 'react';
import './Modal.css';

export default function Modal({isOpen, onClose, children}){
    if (!isOpen) return null; // Don't render if closed

    return(
        <div id='Modal' onClick={onClose}>
            <div className='popup' onClick={(e) => e.stopPropagation()}>
                <div className='close'><div id="close" onClick={onClose}>x</div></div>
                <div className='content'>
                    {children}
                </div>
            </div>
        </div>
    )
}