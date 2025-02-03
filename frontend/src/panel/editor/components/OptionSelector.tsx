import Select from '@mui/material/Select/Select';
import InterfaceElement, { Option } from '../../models/InterfaceElement';
import { useState } from 'react';
import MenuItem from '@mui/material/MenuItem/MenuItem';
import { CSTSelectNode } from '../../models/CST/CST';

interface OptionSelectorProps {
  stepId: CSTSelectNode['id'];
  element: InterfaceElement;
  option: Option | undefined;
}
const OptionSelector: React.FC<OptionSelectorProps> = ({ element, option }) => {
  const options: Option[] = getOptionsFromOuterHTML(element.outerHTML);
  if (options.length === 0) {
    throw Error('Could not get options');
  }
  const [selectedOption, setSelectedOption] = useState(
    option ?? options.at(0)!,
  );

  return (
    <Select
      sx={{ margin: '0 5% 0 5%', backgroundColor: 'white' }}
      size={'small'}
      value={selectedOption.value}
      onChange={(event) => {
        const [selected] = options.filter(
          (option) => option.value === event.target.value,
        );
        if (selected) {
          setSelectedOption(selected);
        }
      }}
      SelectDisplayProps={{
        style: { padding: '0.25rem 0.5rem', textAlign: 'left' },
      }}
    >
      {options.map((option) => (
        <MenuItem value={option.value}>{option.text}</MenuItem>
      ))}
    </Select>
  );
};

const getOptionsFromOuterHTML = (outerHTML: string): Option[] => {
  const optionsRegex = /value="([\w\d]*)">([\w\s\d]*)</g;
  const matches = outerHTML.matchAll(optionsRegex);
  return Array.from(matches, (match) => ({ value: match[1], text: match[2] }));
};

export default OptionSelector;
