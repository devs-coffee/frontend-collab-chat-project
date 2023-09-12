import { Dispatch, ReactNode, SetStateAction, useRef } from 'react';

import DisabledByDefaultRoundedIcon from '@mui/icons-material/DisabledByDefaultRounded';

import './Modal.scss';


type openModal = {
  setIsOpen : Dispatch<SetStateAction<boolean>>,
  childComponent: ReactNode
}

export function Modal( {setIsOpen, childComponent} : openModal) {
  const modalRef = useRef<HTMLDivElement>(null);

  const closeModal = () => {
    setIsOpen(false);
  };

  return (
    <>
      <div className="modal-overlay">
        <div className="modal" ref={modalRef}>
          <div className='modal-close'>
            <DisabledByDefaultRoundedIcon color="warning" onClick={closeModal}/>
          </div>
          
          <div className="modal-content">
            {childComponent}
          </div>
        </div>
      </div>
    </>
  );
}

