import React, { useState, useEffect, useCallback } from 'react';

import API from '../../API';
// styles
import { Wrapper, Content } from './NewWellForm.styles';

const NewWellForm = ({ plateId }) => {
  const [wellId, setWellId] = useState(null);
  const [reagent, setReagent] = useState('');
  const [antibody, setAntibody] = useState('');
  const [concentration, setConcentration] = useState(null);
  
  const upsertWell = async () => {
    const result = await API.upsertWell(
      plateId,
      wellId,
      reagent,
      antibody,
      parseFloat(concentration),
    );
  }

  const handleUpsertWell = useCallback(e => {
    console.log(`upserting well ${wellId} for plate ${plateId}`)
    upsertWell();
  }, [wellId, reagent, antibody, concentration]);

  return (
    <Wrapper>
      <Content>
        <input
          type='text'
          placeholder='Well ID'
          onChange={e => setWellId(e.currentTarget.value)}
          value={wellId}
        />
        <input
          type='text'
          placeholder='Reagent'
          onChange={e => setReagent(e.currentTarget.value)}
          value={reagent}
        />
        <input
          type='text'
          placeholder='Antibody'
          onChange={e => setAntibody(e.currentTarget.value)}
          value={antibody}
        />
        <input
          type='number'
          placeholder='Concentration'
          onChange={e => setConcentration(e.currentTarget.value)}
          value={concentration}
        />
        <button onClick={handleUpsertWell}>
          Set Well
        </button>
      </Content>
    </Wrapper>
  );
};

export default NewWellForm;