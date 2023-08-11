import React from 'react';

// import { Wrapper, Content } from './WellRow.styles';

const WellRow = ({ 
  wellId, 
  reagent,
  antibody,
  concentration, 
}) => (
  <tr key={wellId}>
    <td key={wellId + "_well_id"} >{wellId}</td>
    <td key={wellId + "_reagent"} >{reagent}</td>
    <td key={wellId + "_antibody"} >{antibody}</td>
    <td key={wellId + "_concentration"} >{concentration}</td>
  </tr>
);

export default WellRow;