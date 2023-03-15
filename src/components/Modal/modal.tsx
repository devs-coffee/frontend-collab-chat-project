import { Dispatch, ReactNode, SetStateAction, useRef } from 'react';
import './modal.scss';


type openModal = {
  setIsOpen : Dispatch<SetStateAction<boolean>>,
  childComponent: ReactNode
}

function Modal( {setIsOpen, childComponent} : openModal) {
  const modalRef = useRef<HTMLDivElement>(null);

  const closeModal = () => {
    setIsOpen(false);
  };

  return (
    <>
      <div className="modal-overlay">
        <div className="modal" ref={modalRef}>
          <button className="modal-close" onClick={closeModal}>
            X
          </button>
          <div className="modal-content">
            {childComponent}
          </div>
        </div>
      </div>
    </>
  );
}

export default Modal;
