import React, { useEffect, useContext } from 'react';
import Axios from 'axios';
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
import VisibilityIcon from '@material-ui/icons/Visibility';
import Grid from '@material-ui/core/Grid';
import SearchBar from 'material-ui-search-bar';
import config from 'config';
import RoomContext from './context';
import { useToasts } from 'react-toast-notifications';
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
  { id: 'from', numeric: false, disablePadding: false, label: 'From'},
  { id: 'to', numeric: false, disablePadding: false, label: 'To' },
  { id: 'created_at', numeric: false, disablePadding: false, label: 'Created at' },
  { id: 'updated_at', numeric: false, disablePadding: false, label: 'Updated at' },
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
            className={classes.space}
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
          className={classes.space}
          align={'right'}
          padding={'default'}
        >
          Actions
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
  space: {
    padding: '16px 11px',
  },
}));

export default function RoomTable( {onClickEdit} ) {
  const classes = useStyles();
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('no');
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [query, setQuery] = React.useState('');
  const [rows, setRows] = React.useState([]);
  const [filteredRows, setFilteredRows] = React.useState([]);
  const { addToast } = useToasts();
  const {dispatch} = useContext(RoomContext);

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

  const onClickView = (row) => {
    const {from, to} = row
    dispatch({type: 'resolved', data: {from, to}})
  }

  useEffect(() => {
    if(query !== '') {
      let filteredRows = rows.filter((row) => {
        let strTmp = row.name + ' ';
        if(row.no) strTmp += row.no + ' ';
        if(row.type) strTmp += row.type + ' ';
        if(row.owner) strTmp += row.owner + ' ';
        if(row.name) strTmp += row.name + ' ';
        if(row.category) strTmp += row.category + ' ';
        if(row.welcomeMessage) strTmp += row.welcomeMessage + ' ';
        if(row.description) strTmp += row.description + ' ';
        if(row.maxUsers) strTmp += row.maxUsers + ' ';
        if(row.created_at) strTmp += row.created_at;
        if(row.updated_at) strTmp += row.updated_at;
        if(strTmp.toLowerCase().indexOf(query.toLowerCase()) < 0) return false;
        else return true;
      })
      setFilteredRows(filteredRows);
    } else {
      setFilteredRows([...rows]);
    }
  }, [rows, query])

  useEffect(() => {
    const roomRead = async () => {
      let token = window.localStorage.getItem('token');
      const rooms = await Axios.get(`${config.server_url}/api/room/names/private`, {
        headers: {
          authorization: token
        }
      });
      let roomsToShow = rooms.data.rooms.map((item, index) => ({...item, no: index+1}));
      setRows(roomsToShow);
    }
    roomRead()
  }, []);

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
                {stableSort(filteredRows, getComparator(order, orderBy))
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
                        <TableCell className={classes.space}>
                          {row.no}
                        </TableCell>
                        <TableCell align="left" className={classes.space}>{row.from}</TableCell>
                        <TableCell align="left" className={classes.space}>{row.to}</TableCell>
                        <TableCell align="left" className={classes.space}>{row.created_at}</TableCell>
                        <TableCell align="left" className={classes.space}>{row.updated_at}</TableCell>
                        <TableCell align="right" className={classes.space}>
                           <IconButton style={{color:"#4caf50"}} onClick={() => {onClickView(row)}}>
                            <VisibilityIcon />
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
