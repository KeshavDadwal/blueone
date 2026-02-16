import React from "react";
import ReactDOM from "react-dom";

const Modal = ({ onClose, children, title }) => {
    const handleCloseClick = (e) => {
        e.preventDefault();
        onClose();
    };

    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    const modalContent = (
        <div className="modal-overlay" onClick={handleOverlayClick}>
            <div className="modal-wrapper">
                <div className="modal">
                    <div className="modal-header">
                        <button 
                            onClick={handleCloseClick}
                            className="modal-close-btn"
                            aria-label="Close modal"
                        >
                            <svg 
                                width="24" 
                                height="24" 
                                viewBox="0 0 24 24" 
                                fill="none" 
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path 
                                    d="M18 6L6 18M6 6L18 18" 
                                    stroke="currentColor" 
                                    strokeWidth="2" 
                                    strokeLinecap="round" 
                                    strokeLinejoin="round"
                                />
                            </svg>
                        </button>
                    </div>
                    {title && (
                        <div className="modal-title-wrapper">
                            <i>
                                <h2 className="modal-title">{title}</h2>
                            </i>
                        </div>
                    )}
                    <div className="modal-body">{children}</div>
                </div>
            </div>
        </div>
    );

    return ReactDOM.createPortal(
        modalContent,
        document.getElementById("modal-root")
    );
};

export default Modal