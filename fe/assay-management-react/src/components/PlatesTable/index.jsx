import React, { useState, useEffect, useRef } from 'react';
import API from '../../API';
// styles
import { Wrapper, Content } from './PlatesTable.styles';
// components
import PlateRow from '../PlateRow';


const initialState = {
  plates: [],
};


const PlatesTable = (props) => {
  const [state, setState] = useState(initialState);  
  const initial = useRef(true);


  const refreshPlates = async (page=1) => {
    const plates = await API.fetchPlates();
    setState(prev => ({...plates}));
  }

  useEffect(() => {
    if (initial.current) {
      initial.current = false;
      refreshPlates(1);
      return;
    }

    const timer = setTimeout(() => {
      refreshPlates(1);
    }, 5_000);

    return () => clearTimeout(timer);
  }, [state, setState]);

  return (
    <Wrapper>
      <table>
        <tbody>
          <tr>
            <th>Plate ID</th>
            <th>Plate Name</th>
            <th>Number of Wells</th>
            <th>Created On</th>
          </tr>
          { (state.plates) ? state.plates.map(p => (
            <PlateRow 
              plateId={p.plate_id}
              plateName={p.description}
              plateSize={p.n_wells}
              createdDt={p.created_dt}
            />
            )) : null
          }
        </tbody>
      </table>
    </Wrapper>
  );
};

export default PlatesTable;