import { useState } from 'react';
import { Autocomplete, TextField } from "@mui/material";
import { useSigma } from '@react-sigma/core';
import useApiClient from '../../hooks/useApiClient';

function Searchbar() {
  const apiClient = useApiClient();
  const sigma = useSigma();

  const [options, setOptions] = useState<{ label: string; value: string }[]>([]);
  
  function highlightNodes(inputValue: string) {
    sigma.getGraph().forEachNode(node => {
      sigma.getGraph().setNodeAttribute(node, 'highlighted', false);
    })

    const validNodes = options.filter(option => option.label.toLowerCase().includes(inputValue.toLowerCase()));
    if (validNodes.length < 400) {
      validNodes.forEach(node => {
        sigma.getGraph().setNodeAttribute(node.value, 'highlighted', true);
      })
    }
  }

  async function getOptions() {
    const allNodes = await apiClient.getAllClimateConceptNodes();
    const options = allNodes.map(node => {
      return {
        label: node.name,
        value: node.id
      }
    })

    setOptions(options);      
  }
  
  return (
    <div style={{ width: 400 }}>
      <Autocomplete
        fullWidth
        clearOnBlur={false}
        options={options}
        renderInput={(params) => (
          <TextField {...params} placeholder="Search ..." />
        )}
        onFocus={getOptions}
        isOptionEqualToValue={(option, value) => option.label === value.label}
        onInputChange={(event, newInputValue) => highlightNodes(newInputValue)}
      />
    </div>
  );
}

export default Searchbar;
