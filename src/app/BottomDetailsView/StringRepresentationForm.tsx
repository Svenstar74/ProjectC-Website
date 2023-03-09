import { MenuItem, TextField } from '@mui/material';
import { StringRepresentation } from '@svenstar74/business-logic';
import classes from './StringRepresentationForm.module.css';

export const StringRepresentationForm = ({
  string,
  type,
}: {
  string: string;
  type?: 'Cause' | 'Effect';
}) => {
  const stringRepresentation = StringRepresentation.parse(string);

  return (
    <>
      {type && <p>{type}</p>}
      <TextField
        style={{ width: '150px', marginRight: '10px' }}
        label='changeDirection'
        defaultValue={stringRepresentation.changeDirection}
      >
        <MenuItem value='increase'>increase</MenuItem>
        <MenuItem value='decrease'>decrease</MenuItem>
      </TextField>

      <TextField
        InputProps={{ className: classes.textfield }}
        label='typeOf'
        defaultValue={stringRepresentation.typeOf}
      />

      <TextField
        InputProps={{ className: classes.textfield }}
        required
        label='base'
        defaultValue={stringRepresentation.base}
      />

      <TextField
        InputProps={{ className: classes.textfield }}
        required
        label='aspectChanging'
        defaultValue={stringRepresentation.aspectChanging}
      />
    </>
  );
};
