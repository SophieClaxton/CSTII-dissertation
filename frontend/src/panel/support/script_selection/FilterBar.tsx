import Button from '@mui/material/Button/Button';
import Chip from '@mui/material/Chip/Chip';
import Stack from '@mui/material/Stack/Stack';
import Website from '../../models/API/Website';
import User from '../../models/API/User';
import React from 'react';

interface FilterBarProps {
  setOpenFilterDialog: (value: boolean) => void;
  websiteFilters: Website[];
  setWebsiteFilters: (value: Website[]) => void;
  authorFilters: User[];
  setAuthorFilters: (value: User[]) => void;
}

const FilterBar: React.FC<FilterBarProps> = ({
  setOpenFilterDialog,
  websiteFilters,
  setWebsiteFilters,
  authorFilters,
  setAuthorFilters,
}) => {
  return (
    <Stack direction={'row'} spacing={1} sx={{ width: '100%' }}>
      <Button onClick={() => setOpenFilterDialog(true)} variant="contained">
        Filters
      </Button>
      {websiteFilters.map((website) => (
        <Chip
          key={`W${website.id}`}
          label={website.url}
          onDelete={() => {
            const newWebsiteFilters = websiteFilters.filter(
              (other) => other.id != website.id,
            );
            setWebsiteFilters(newWebsiteFilters);
          }}
        />
      ))}
      {authorFilters.map((author) => (
        <Chip
          key={`U${author.id}`}
          label={author.name}
          onDelete={() => {
            const newAuthorFilters = authorFilters.filter(
              (other) => other.id != author.id,
            );
            setAuthorFilters(newAuthorFilters);
          }}
        />
      ))}
    </Stack>
  );
};

export default FilterBar;
