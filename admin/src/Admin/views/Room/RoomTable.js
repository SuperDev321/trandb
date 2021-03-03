import React, { useEffect } from 'react';
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
import Grid from '@material-ui/core/Grid';
import SearchBar from 'material-ui-search-bar';
import config from 'config';
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
  { id: 'type', numeric: false, disablePadding: false, label: 'Type'},
  { id: 'avatar', numeric: false, disablePadding: false, label: 'Avatar'},
  { id: 'owner', numeric: false, disablePadding: true, label: 'User Name' },
  { id: 'name', numeric: false, disablePadding: false, label: 'Room Name' },
  { id: 'category', numeric: false, disablePadding: false, label: 'Category'},
  { id: 'maxUsers', numeric: false, disablePadding: false, label: 'Max users' },
  { id: 'description', numeric: false, disablePadding: false, label: 'Description' },
  { id: 'welcomeMessage', numeric: false, disablePadding: false, label: 'Welcome Message' },
  { id: 'icon', numeric: false, disablePadding: false, label: 'icon' },
  { id: 'cover', numeric: false, disablePadding: false, label: 'Cover' },
  { id: 'created_at', numeric: false, disablePadding: false, label: 'Created at' },
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

  const onClickDelete = (row) => {
    console.log(row)
    let id = row._id;
    Axios.delete(`${config.server_url}/api/rooms/` + id)
    .then((response) => {
      console.log(response);
      if(response.status === 204) {
        let newRows = rows.filter((row) => (row._id !== id));
        setRows(newRows);
        addToast('Successfully deleted', { appearance: 'success' })
      }
    })
    .catch((err) => {
      console.log(err)
      addToast('Delete failed', { appearance: 'error' })
    })
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
      const rooms = await Axios.get(`${config.server_url}/api/rooms`);
      let roomsToShow = rooms.data.data.map((item, index) => ({...item, no: index+1}));
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
                        <TableCell className={classes.space}>
                          general
                        </TableCell>
                        <TableCell className={classes.space}>
                          <img width="42px" src="/img/avatars/default_avatar.png" alt="avatar" />
                        </TableCell>
                        <TableCell component="th" id={labelId} scope="row" padding="none" className={classes.space}>
                          {row.owner}
                        </TableCell>
                        <TableCell align="left" className={classes.space}>{row.name}</TableCell>
                        <TableCell align="left" className={classes.space}>{row.category}</TableCell>
                        <TableCell align="left" className={classes.space}>{row.maxUsers}</TableCell>
                        <TableCell align="left" className={classes.space}>{row.description}</TableCell>
                        <TableCell align="left" className={classes.space}>{row.welcomeMessage}</TableCell>
                        <TableCell align="left" className={classes.space}>
                          <img width="42px" src={row.cover? "/img/rooms/"+row.cover:"/img/public_chat.png"}
                          alt="cover image" />
                        </TableCell>
                        <TableCell className={classes.space}>
                            <img width="42px" src={row.icon? "/img/rooms/"+row.icon:"/img/public_chat.png"}
                          alt="cover image" />
                        </TableCell>
                        <TableCell className={classes.space}>2021-2-6</TableCell>
                        <TableCell align="right" className={classes.space}>
                           <IconButton style={{color:"#4caf50"}} onClick={() => {onClickEdit(row)}}>
                            <CreateIcon />
                          </IconButton>
                          <IconButton style={{color:"#f44336"}}>
                            <DeleteIcon onClick={() => {onClickDelete(row)}} />
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
