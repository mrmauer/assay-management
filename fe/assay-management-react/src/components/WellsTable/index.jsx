import React, { useState, useEffect, useRef, useCallback } from 'react';
// styles
import { Wrapper, Content } from './WellsTable.styles';
// components
import WellRow from '../WellRow';


const WellsTable = ({ state }) => {

  return (
    <Wrapper>
      <table>
        <tbody key="wells_body">
          <tr key="wells_header">
            <th key="wells_header_well_id">Well ID</th>
            <th key="wells_header_reagent">Reagent</th>
            <th key="wells_header_antibody">Antibody</th>
            <th key="wells_header_concentration">Concentration</th>
          </tr>
          { (state.wells) ? state.wells.map(w => (
            <WellRow 
              wellId={w.well_id}
              reagent={w.reagent}
              antibody={w.antibody}
              concentration={w.concentration}
            />
            )) : null
          }
        </tbody>
      </table>
    </Wrapper>
  );
};

export default WellsTable;