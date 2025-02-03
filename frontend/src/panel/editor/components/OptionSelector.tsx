import Select from '@mui/material/Select/Select';
import InterfaceElement, { Option } from '../../models/InterfaceElement';
import { useState } from 'react';
import MenuItem from '@mui/material/MenuItem/MenuItem';
import FormControl from '@mui/material/FormControl/FormControl';
import InputLabel from '@mui/material/InputLabel/InputLabel';
import { CSTSelectNode } from '../../models/CST/CST';
import { mapIdToString } from '../../unpublishedScriptReducer/mappers/nodeIds';

interface OptionSelectorProps {
  stepId: CSTSelectNode['id'];
  element: InterfaceElement;
  option: Option | undefined;
}
const OptionSelector: React.FC<OptionSelectorProps> = ({
  stepId,
  element,
  option,
}) => {
  const options: Option[] = getOptionsFromOuterHTML(element.outerHTML);
  if (options.length === 0) {
    throw Error('Could not get options');
  }
  const [selectedOption, setSelectedOption] = useState(
    option ?? options.at(0)!,
  );

  return (
    <FormControl sx={{ margin: '0 5% 0 5%' }}>
      <InputLabel id={`${mapIdToString(stepId)}-selet-option`}>
        Selected Option
      </InputLabel>
      <Select
        labelId={`${mapIdToString(stepId)}-selet-option`}
        size={'small'}
        value={selectedOption.value}
        label={'Selected option'}
        onChange={(event) => {
          const [selected] = options.filter(
            (option) => option.value === event.target.value,
          );
          if (selected) {
            setSelectedOption(selected);
          }
        }}
      >
        {options.map((option) => (
          <MenuItem value={option.value}>{option.text}</MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

const getOptionsFromOuterHTML = (outerHTML: string): Option[] => {
  const optionsRegex = /value="([\w\d]*)">([\w\s\d]*)</g;
  const matches = outerHTML.matchAll(optionsRegex);
  return Array.from(matches, (match) => ({ value: match[1], text: match[2] }));
};

export default OptionSelector;
