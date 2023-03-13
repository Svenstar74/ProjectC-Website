import { IconButton, TextField, Tooltip } from '@mui/material';
import SaveSharpIcon from '@mui/icons-material/SaveSharp';

import { StringRepresentation } from '@svenstar74/business-logic';
import classes from './StringRepresentationForm.module.css';
import { useState } from 'react';
import { useApiClient } from '../../hooks/useApiClient';

export const StringRepresentationForm = ({ climateConceptId, string, type }: {
  climateConceptId: string
  string: string;
  type?: 'Cause' | 'Effect';
}) => {
  const apiClient = useApiClient();

  const stringRepresentation = StringRepresentation.parse(string);

  const [currentChangeDirection, setCurrentChangeDirection] = useState(stringRepresentation.changeDirection);
  const [currentTypeOf, setCurrentTypeOf] = useState(stringRepresentation.typeOf.toString());
  const [currentBase, setCurrentBase] = useState(stringRepresentation.base);
  const [currentAspectChanging, setCurrentAspectChanging] = useState(stringRepresentation.aspectChanging);
  
  const saveStringRepresentation = async () => {
    await apiClient.updateNodeString(
      climateConceptId,
      StringRepresentation.parse(`${currentChangeDirection}_${currentTypeOf}_${currentBase}_${currentAspectChanging}`).toString()
    );
  }
  
  return (
    <div className={classes.container}>
      {type && <p>{type}</p>}
      <TextField
        style={{ width: '150px', marginRight: '10px' }}
        variant="filled"
        label='changeDirection'
        defaultValue={currentChangeDirection}
        onChange={(event) => setCurrentChangeDirection(event.target.value)}
      />

      <TextField
        InputProps={{ className: classes.textfield }}
        variant="filled"
        label='typeOf'
        defaultValue={currentTypeOf}
        onChange={(event) => setCurrentTypeOf(event.target.value)}
      />

      <TextField
        InputProps={{ className: classes.textfield }}
        required
        variant="filled"
        label='base'
        defaultValue={currentBase}
        onChange={(event) => setCurrentBase(event.target.value)}
      />

      <TextField
        InputProps={{ className: classes.textfield }}
        required
        variant="filled"
        label='aspectChanging'
        defaultValue={currentAspectChanging}
        onChange={(event) => setCurrentAspectChanging(event.target.value)}
      />

      <Tooltip title='Save Changes' placement='right'>
        <IconButton size='large' onClick={saveStringRepresentation}>
          <SaveSharpIcon fontSize='inherit'/>
        </IconButton>
      </Tooltip>
    </div>
  );
};
