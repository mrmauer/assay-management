import React from 'react';

// import { Wrapper, Content } from './PlateRow.styles';

const PlateRow = ({ 
  plateId, 
  plateName, 
  plateSize, 
  createdDt, 
}) => (
  <tr>
    <td>{plateId}</td>
    <td>{plateName}</td>
    <td>{plateSize}</td>
    <td>{createdDt}</td>
  </tr>
);

export default PlateRow;