import { Icon } from '@iconify/react';
import { useRef, useState } from 'react';
import editFill from '@iconify/icons-eva/edit-fill';
import { Link as RouterLink } from 'react-router-dom';
import trash2Outline from '@iconify/icons-eva/trash-2-outline';
import moreVerticalFill from '@iconify/icons-eva/more-vertical-fill';
// material
import {
  Menu,
  MenuItem,
  IconButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import { Beenhere, Cancel } from '@mui/icons-material';

// ----------------------------------------------------------------------

export default function GameMoreMenu({ game }) {
  const ref = useRef(null);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <IconButton ref={ref} onClick={() => setIsOpen(true)}>
        <Icon icon={moreVerticalFill} width={20} height={20} />
      </IconButton>

      <Menu
        open={isOpen}
        anchorEl={ref.current}
        onClose={() => setIsOpen(false)}
        PaperProps={{
          sx: { width: 200, maxWidth: '100%' },
        }}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuItem sx={{ color: 'error.main' }}>
          <ListItemIcon>
            {' '}
            <Cancel />
          </ListItemIcon>

          <ListItemText
            primary='Reject'
            primaryTypographyProps={{ variant: 'body2' }}
          />
        </MenuItem>

        <MenuItem component={RouterLink} to='#' sx={{ color: 'success.main' }}>
          <ListItemIcon>
            <Beenhere />
          </ListItemIcon>
          <ListItemText
            primary='Approve'
            primaryTypographyProps={{ variant: 'body2' }}
          />
        </MenuItem>
      </Menu>
    </>
  );
}
