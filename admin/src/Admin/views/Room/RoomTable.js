import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Paper from '@material-ui/core/Paper';
import DeleteIcon from '@material-ui/icons/Delete';
import CreateIcon from '@material-ui/icons/Create';
import IconButton from '@material-ui/core/IconButton';
import Card from "Admin/components/Card/Card.js";
import CardHeader from "Admin/components/Card/CardHeader.js";
import CardIcon from "Admin/components/Card/CardIcon.js";
import CardFooter from "Admin/components/Card/CardFooter.js";
import ChatIcon from '@material-ui/icons/Chat';
import Grid from '@material-ui/core/Grid';
import SearchBar from 'material-ui-search-bar';

function createData(no, name, calories, fat, carbs, protein) {
  return { no, name, calories, fat, carbs, protein};
}

const rows = [
  createData( 1, 'Cupcake', 305, 3.7, 67, 4.3),
  createData( 2, 'Donut', 452, 25.0, 51, 4.9),
  createData( 3, 'Eclair', 262, 16.0, 24, 6.0),
  createData( 4, 'Frozen yoghurt', 159, 6.0, 24, 4.0),
  createData( 5, 'Gingerbread', 356, 16.0, 49, 3.9),
  createData( 6, 'Honeycomb', 408, 3.2, 87, 6.5),
  createData( 7, 'Ice cream sandwich', 237, 9.0, 37, 4.3),
  createData( 8, 'Jelly Bean', 375, 0.0, 94, 0.0),
  createData( 9, 'KitKat', 518, 26.0, 65, 7.0),
  createData( 10, 'Lollipop', 392, 0.2, 98, 0.0),
  createData( 11, 'Marshmallow', 318, 0, 81, 2.0),
  createData( 12, 'Nougat', 360, 19.0, 9, 37.0),
  createData( 13, 'Oreo', 437, 18.0, 63, 4.0),
];

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

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const headCells = [
  { id: 'no', numeric: false, disablePadding: false, label: 'No'},
  { id: 'name', numeric: false, disablePadding: true, label: 'Dessert (100g serving)' },
  { id: 'calories', numeric: false, disablePadding: false, label: 'Calories' },
  { id: 'fat', numeric: false, disablePadding: false, label: 'Fat (g)' },
  { id: 'carbs', numeric: false, disablePadding: false, label: 'Carbs (g)' },
  { id: 'protein', numeric: false, disablePadding: false, label: 'Protein (g)' },
];

function EnhancedTableHead(props) {
  const { classes, order, orderBy, onRequestSort } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'default'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <span className={classes.visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </span>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
        <TableCell
          align={'right'}
          padding={'default'}
        >
          Action
        </TableCell>
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  classes: PropTypes.object.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
};

const useStyles = makeStyles((theme) => ({
  paper: {
    width: '100%',
    marginBottom: theme.spacing(2),
  },
  table: {
    minWidth: 750,
  },
  visuallyHidden: {
    border: 0,
    clip: 'rect(0 0 0 0)',
    height: 1,
    margin: -1,
    overflow: 'hidden',
    padding: 0,
    position: 'absolute',
    top: 20,
    width: 1,
  },
  cardCategory: {
    color: '#3C4858',
    margin: "0",
    fontSize: "35px",
    marginTop: "0",
    paddingTop: "15px",
    marginBottom: "10px"
  },
}));

export default function RoomTable( {onClickEdit} ) {
  const classes = useStyles();
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('no');
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [query, setQuery] = React.useState('');

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Paper className={classes.paper}>

      <Card>
        <CardHeader color="warning" icon>
          <CardIcon color="primary">
            <ChatIcon />
          </CardIcon>
          <p className={classes.cardCategory}>Rooms</p>
        </CardHeader>
        <CardFooter style={{display: 'block'}}>
          <Grid container spacing={2} style={{marginBottom:'10px',}}>
            <Grid item xs={12} sm={4}>
              <SearchBar
                value={query}
                onChange={(value) => setQuery(value)}
              />
            </Grid>
            <Grid item sm={2}>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TablePagination
                rowsPerPageOptions={[10, 25, 50]}
                component="div"
                count={rows.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onChangePage={handleChangePage}
                onChangeRowsPerPage={handleChangeRowsPerPage}
              />
            </Grid>
          </Grid>
          <TableContainer>
            <Table
              className={classes.table}
              aria-labelledby="tableTitle"
              aria-label="enhanced table"
            >
              <EnhancedTableHead
                classes={classes}
                order={order}
                orderBy={orderBy}
                onRequestSort={handleRequestSort}
              />
              <TableBody>
                {stableSort(rows, getComparator(order, orderBy))
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) => {
                    const labelId = `enhanced-table-checkbox-${index}`;

                    return (
                      <TableRow
                        hover
                        role="checkbox"
                        tabIndex={-1}
                        key={row.name}
                      >
                        <TableCell>
                          {row.no}
                        </TableCell>
                        <TableCell component="th" id={labelId} scope="row" padding="none">
                          {row.name}
                        </TableCell>
                        <TableCell align="left">{row.calories}</TableCell>
                        <TableCell align="left">{row.fat}</TableCell>
                        <TableCell align="left">{row.carbs}</TableCell>
                        <TableCell align="left">{row.protein}</TableCell>
                        <TableCell align="right">
                           <IconButton style={{color:"#4caf50"}} onClick={() => {onClickEdit()}}>
                            <CreateIcon />
                          </IconButton>
                          <IconButton style={{color:"#f44336"}}>
                            <DeleteIcon  />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          </TableContainer>
          
        </CardFooter>
      </Card>

    </Paper>
  );
}
