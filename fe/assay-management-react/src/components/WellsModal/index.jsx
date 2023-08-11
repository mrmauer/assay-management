import React, { useRef, useState, useEffect, useCallback } from 'react';

import API from '../../API';
// styles
import { 
  Background,
  ModalWrapper,
  ModalContent,
  CloseModalButton
} from './WellsModal.styles';
// components
import WellsTable from '../WellsTable';
import NewWellForm from '../NewWellForm';


const initialState = {
  wells: [],
};

const WellsModal = ({ showModal, setShowModal }) => {
  const [state, setState] = useState(initialState);
  const [plateId, setPlateId] = useState('');
  const modalRef = useRef();

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


  const fetchWells = async () => {
    const plate = await API.fetchPlate(plateId);
    setState(prev => ({...plate}));
  }

  const handleWellFetch = useCallback(e => {
    setState(initialState);
    console.log("fetching wells")
    fetchWells();
  }, [plateId, setState]);

  return (
    <>
      {showModal ? (
        <Background onClick={closeModal} ref={modalRef}>
          <ModalWrapper>
            <ModalContent>
              <h3>Plate ID</h3>
              <input
                type='text'
                placeholder='Plate ID'
                onChange={e => setPlateId(e.currentTarget.value)}
                value={plateId}
              />
              <h3>Wells</h3>
              <button onClick={handleWellFetch}>
                Get Wells
              </button>
              {
                state.wells ? (
                <WellsTable 
                  state={state}
                />
                ) : null
              }
            <NewWellForm plateId={plateId} />
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

export default WellsModal;