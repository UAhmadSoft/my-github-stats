import { filter } from 'lodash';
import { sentenceCase } from 'change-case';
import { useState } from 'react';
// material
import {
  Card,
  Table,
  Stack,
  Avatar,
  TableRow,
  TableBody,
  TableCell,
  Container,
  Typography,
  TableContainer,
  TablePagination,
} from '@mui/material';
// components
import Page from '../components/Page';
import Label from '../components/Label';
import Scrollbar from '../components/Scrollbar';
import SearchNotFound from '../components/SearchNotFound';
import { UserListHead, UserListToolbar } from '../components/_dashboard/user';
//
import GAMELIST from '../_mocks_/game';
import GameMoreMenu from 'src/components/_dashboard/game/UserMoreMenu';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { name: 'name', label: 'name', alignRight: false },
  { user: 'user', label: 'user', alignRight: false },
  { description: 'description', label: 'description', alignRight: false },
  { category: 'category', label: 'category', alignRight: false },
  { price: 'price', label: 'price', alignRight: false },
  { licenseType: 'licenseType', label: 'licenseType', alignRight: false },
  { status: 'status', label: 'status', alignRight: false },
  { id: '' },
];

// ----------------------------------------------------------------------

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function applySortFilter(array, comparator, query) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if (query) {
    return filter(
      array,
      (_user) => _user.name.toLowerCase().indexOf(query.toLowerCase()) !== -1
    );
  }
  return stabilizedThis.map((el) => el[0]);
}

export default function Games() {
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('name');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = GAMELIST.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const getColor = (status) => {
    return status === 'rejected'
      ? 'error'
      : status === 'approved'
      ? 'primary'
      : 'warning';
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilterByName = (event) => {
    setFilterName(event.target.value);
  };

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - GAMELIST.length) : 0;

  const filteredGames = applySortFilter(
    GAMELIST,
    getComparator(order, orderBy),
    filterName
  );

  const isGameNotFound = filteredGames.length === 0;

  return (
    <Page title='Games'>
      <Container>
        <Stack
          direction='row'
          alignItems='center'
          justifyContent='space-between'
          mb={5}
        >
          <Typography variant='h4' gutterBottom>
            Game
          </Typography>
        </Stack>

        <Card>
          <UserListToolbar
            numSelected={selected.length}
            filterName={filterName}
            onFilterName={handleFilterByName}
          />

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <UserListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={GAMELIST.length}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}
                  noCheckBox
                />
                <TableBody>
                  {filteredGames
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => {
                      const {
                        id,
                        user,
                        name,
                        images,
                        category,
                        description,
                        price,
                        licenseType,
                        status,
                      } = row;
                      {
                        console.log(`row`, row);
                      }
                      const isItemSelected = selected.indexOf(name) !== -1;

                      return (
                        <TableRow
                          hover
                          key={id}
                          tabIndex={-1}
                          role='checkbox'
                          selected={isItemSelected}
                          aria-checked={isItemSelected}
                        >
                          <TableCell padding='checkbox'></TableCell>
                          <TableCell component='th' scope='row' padding='none'>
                            <Stack
                              direction='row'
                              alignItems='center'
                              spacing={2}
                            >
                              <Avatar alt={name} src={images?.[0]} />
                              <Typography variant='subtitle2' noWrap>
                                {name}
                              </Typography>
                            </Stack>
                          </TableCell>
                          <TableCell align='left'>{user.name}</TableCell>
                          <TableCell align='left'>{description}</TableCell>
                          <TableCell align='left'>{category}</TableCell>
                          <TableCell align='left'>{price}</TableCell>
                          <TableCell align='left'>{licenseType}</TableCell>
                          <TableCell align='left'>
                            <Label variant='ghost' color={getColor(status)}>
                              {sentenceCase(status)}
                            </Label>
                          </TableCell>{' '}
                          {/**/}
                          {status === 'pending' && (
                            <TableCell align='right'>
                              <GameMoreMenu game={row} />
                            </TableCell>
                          )}
                        </TableRow>
                      );
                    })}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: 53 * emptyRows }}>
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </TableBody>
                {isGameNotFound && (
                  <TableBody>
                    <TableRow>
                      <TableCell align='center' colSpan={6} sx={{ py: 3 }}>
                        <SearchNotFound searchQuery={filterName} />
                      </TableCell>
                    </TableRow>
                  </TableBody>
                )}
              </Table>
            </TableContainer>
          </Scrollbar>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component='div'
            count={GAMELIST.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
      </Container>
    </Page>
  );
}
