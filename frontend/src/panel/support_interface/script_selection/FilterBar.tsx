import Button from '@mui/material/Button/Button';
import Chip from '@mui/material/Chip/Chip';
import Stack from '@mui/material/Stack/Stack';
import Website from '../../models/api/Website';
import User from '../../models/api/User';
import React from 'react';
import { StateSetter } from '../../models/utilTypes';

interface FilterBarProps {
  setOpenFilterDialog: StateSetter<boolean>;
  websiteFilters: Website[];
  setWebsiteFilters: StateSetter<Website[]>;
  authorFilters: User[];
  setAuthorFilters: StateSetter<User[]>;
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
