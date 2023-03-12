import { Dispatch, ReactNode, SetStateAction, useRef } from 'react';
import './modal.scss';


type openModal = {
  setIsOpen : Dispatch<SetStateAction<boolean>>,
  childComponent: ReactNode
}

function Modal( {setIsOpen, childComponent} : openModal) {
  // const [isOpen, setIsOpen] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  // const openModal = () => {
  //   setIsOpen(true);
  // };

  const closeModal = () => {
    setIsOpen(false);
  };

  // const handleOutsideClick = (event: MouseEvent) => {
  //   if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
  //     setIsOpen(false);
  //   }
  // };

  // useEffect(() => {
  //   if (isOpen) {
  //     document.addEventListener('mousedown', handleOutsideClick);
  //   } else {
  //     document.removeEventListener('mousedown', handleOutsideClick);
  //   }

  //   return () => {
  //     document.removeEventListener('mousedown', handleOutsideClick);
  //   };
  // }, [isOpen]);

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
