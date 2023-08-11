import React, { useState } from 'react';

// styles
import GlobalStyle from './GlobalStyle.styles';

// components
import PlateModal from './components/PlateModal';
import WellsModal from './components/WellsModal';
import PlatesTable from './components/PlatesTable';


const App = () => {
  const [count, setCount] = useState(0);
  const [showPlateModal, setShowPlateModal] = useState(false);
  const [showWellsModal, setShowWellsModal] = useState(false);

  const openPlateModal = () => {
    setShowPlateModal(showPlateModal => !showPlateModal);
  };

  const openWellsModal = () => {
    setShowWellsModal(showWellsModal => !showWellsModal);
  };

  return (
    <div>
      <GlobalStyle />
      <h1>Assay Manager</h1>
      <div className="card">
        <button onClick={openPlateModal}>
          Create a new Plate
        </button>
        <button onClick={openWellsModal}>
          Edit a Plate
        </button>
      </div>
      <PlateModal showModal={showPlateModal} setShowModal={setShowPlateModal} />
      <WellsModal showModal={showWellsModal} setShowModal={setShowWellsModal} />
      <PlatesTable/>
    </div>
  )
}

export default App;
