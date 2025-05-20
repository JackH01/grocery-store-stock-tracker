// Using https://blog.logrocket.com/creating-reusable-pop-up-modal-react/

import { useRef, useEffect } from "react";
import "./Modal.css"

interface ModalProps {
    isOpen: boolean;
    hasCloseBtn?: boolean; // ? at end = optional.
    onClose?: () => void;
    children: React.ReactNode;
}


const Modal = ({
    isOpen,
    onClose,
    hasCloseBtn = true,
    children,
}: ModalProps) => {
    const modalRef = useRef<HTMLDialogElement>(null);

    const handleCloseModal = () => {
        if(onClose) {
            onClose();
        }
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLDialogElement>) => {
        if (event.key === "Escape") {
            handleCloseModal();
        }
    }

    useEffect(() => {
        // Grabbing a reference to the modal in question
        const modalElement = modalRef.current;
        if (!modalElement) return;

        // Open modal when 'isOpen' changes to true
        if (isOpen) {
            modalElement.showModal();
        } else {
            modalElement.close()
        }
    }, [isOpen]);

    

    return (
        <dialog ref={modalRef} className="modal" onKeyDown={handleKeyDown}>
            {hasCloseBtn && (
                <button className="modal-close-btn" onClick={handleCloseModal}>
                    Close
                </button>
            )}
            {children}
        </dialog>
    )
}

export default Modal;