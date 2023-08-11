import React, { useRef, useState, useEffect, useCallback } from 'react';

import API from '../../API';

import { 
  Background,
  ModalWrapper,
  ModalContent,
  CloseModalButton
} from './PlateModal.styles';


const PlateModal = ({ showModal, setShowModal }) => {
  const [isSubmit, setIsSubmit] = useState(false);
  const [plateName, setPlateName] = useState('');
  const [plateSize, setPlateSize] = useState('96');
  const modalRef = useRef();

  const onPlateSizeChange = e => {
    setPlateSize(e.target.value);
  };

  const closeModal = e => {
    if (modalRef.current === e.target) {
      setShowModal(false);
    }
  };

  const keyPress = useCallback(
    e => {
      if (e.key === 'Escape' && showModal) {
        setShowModal(false);
        console.log('I pressed');
      }
    },
    [setShowModal, showModal]
  );

  useEffect(
    () => {
      document.addEventListener('keydown', keyPress);
      return () => document.removeEventListener('keydown', keyPress);
    },
    [keyPress]
  );

  useEffect(
    () => {
      // logic for submitting create plate
      if (!isSubmit) return;

      API.createPlate(plateName, parseInt(plateSize));

      setIsSubmit(false);
      setShowModal(false);
    },
    [isSubmit, setIsSubmit, plateName, plateSize]
  );

  return (
    <>
      {showModal ? (
        <Background onClick={closeModal} ref={modalRef}>
          <ModalWrapper>
            <ModalContent>
              <h3>Plate Name</h3>
              <input
                type='text'
                placeholder='Plate Name'
                onChange={e => setPlateName(e.currentTarget.value)}
                value={plateName}
              />
              <h3>Plate Size</h3>
              <div >
                <input 
                  type="radio" 
                  id="size-96" 
                  name="n_wells" 
                  value="96"
                  checked={plateSize == "96"}
                  onChange={onPlateSizeChange}
                /> 96-well plate (12 x 8)
                <br></br>
                <input 
                  type="radio" 
                  id="size-384" 
                  name="n_wells" 
                  value="384"
                  checked={plateSize == "384"}
                  onChange={onPlateSizeChange}
                /> 384-well plate (24 x 16)
              </div>
              <button onClick={() => setIsSubmit(true)}>
                Submit
              </button>
            </ModalContent>
            <CloseModalButton
              aria-label='Close modal'
              onClick={() => setShowModal(prev => !prev)}
            >Close</CloseModalButton>
          </ModalWrapper>
        </Background>
      ) : null}
    </>
  );
};

export default PlateModal;