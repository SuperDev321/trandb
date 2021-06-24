import React from 'react';
import PropTypes from 'prop-types';
import Axios from 'axios';
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
import IconButton from '@material-ui/core/IconButton';
import Card from "Admin/components/Card/Card.js";
import CardHeader from "Admin/components/Card/CardHeader.js";
import CardIcon from "Admin/components/Card/CardIcon.js";
import CreateIcon from '@material-ui/icons/Create';
import CardFooter from "Admin/components/Card/CardFooter.js";
import AssignmentIcon from '@material-ui/icons/Assignment';
import Grid from '@material-ui/core/Grid';
import SearchBar from 'material-ui-search-bar';
import Button from "Admin/components/CustomButtons/Button.js";
import config from '../../../config'
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
  { id: 'name', numeric: false, disablePadding: false, label: 'Name'},
  { id: 'detail', numeric: false, disablePadding: false, label: 'Detail'},
  { id: 'cost', numeric: false, disablePadding: false, label: 'Cost'},
  { id: 'src', numeric: false, disablePadding: false, label: 'Image'},
];

function EnhancedTableHead({ classes, order, orderBy, onRequestSort }) {
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

function asyncReducer(state, action) {
  switch (action.type) {
    case 'pending': {
      return {status: 'pending', data: null, error: null}
    }
    case 'resolved': {
      return {status: 'resolved', data: action.data, error: null}
    }
    case 'rejected': {
      return {status: 'rejected', data: null, error: action.error}
    }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`)
    }
  }
}

const useRows = (initialState) => {
  const [state, dispatch] = React.useReducer(asyncReducer, {
    data: null,
    status: 'idle',
    error: null,
    ...initialState
  });
  const {data, status, error} = state;
    const run = React.useCallback(promise => {
        if (!promise) {
          return
        }
        dispatch({type: 'pending'})
        promise.then(
          data => {
            dispatch({type: 'resolved', data})
          },
          error => {
            dispatch({type: 'rejected', error})
          },
        )
        // too bad the eslint plugin can't statically analyze this :-(
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, []);

    return {
        error,
        status,
        data,
        run,
    }
}

export default function Gifts( {onClickNew, onClickEdit} ) {
  // donfsdodifj
  const classes = useStyles();
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('no');
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [query, setQuery] = React.useState('');
  // const [rows, setRows] = React.useState([]);
  const [filteredRows, setFilteredRows] = React.useState([]);
  const { addToast } = useToasts();
  const {error, status, data: rows, run} = useRows();

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

  const handleClickDelete = (id) => {
    let token = window.localStorage.getItem('token');
    Axios.delete(`${config.server_url}/api/gift/` + id, {
      headers: {
        authorization: token
      }
    })
    .then((response) => {
      console.log(response);

      run(getGifts());
      if(response.status === 204) {
        // let newRows = rows.filter((row) => (row._id !== id));
        // run(async () => {
        //   return newRows;
        // });
        addToast('Successfully deleted', { appearance: 'success' })
      }
    })
    .catch((err) => {
      console.log(err)
      addToast('Delete failed', { appearance: 'error' })
    })
  }
  const getGifts = () => {
    let token = window.localStorage.getItem('token');
    return Axios.get(`${config.server_url}/api/gifts`, {
      headers: {
        authorization: token
      }
    })
    .then((response) => {
      if(response.data && response.data.gifts) {
        const newGifts = response.data.gifts.map((item, index) => ({...item, no: index + 1}))
        return newGifts;
      } else {
        throw new Error('incorrect api')
      }
    })
  }
  React.useEffect(() => {
    run(getGifts());
  }, []);
  React.useEffect(() => {
    if(Array.isArray(rows)) {
      if(query !== '') {
        let filteredRows = rows.filter((row) => {
          let strTmp = row.name + ' ' + row.detail;
          if(strTmp.toLowerCase().indexOf(query.toLowerCase()) < 0) return false;
          else return true;
        })
        setFilteredRows(filteredRows);
      } else {
        setFilteredRows([...rows]);
      }
    }
    
  }, [query, rows])

  if(status === 'pending' || status === 'idle'){
    return null;
  }
  
  if(status === 'resolved' && Array.isArray(rows))
  return (
  	<Paper className={classes.paper}>
	    <Card>
	      <CardHeader color="warning" icon>
	        <CardIcon color="primary">
	          <AssignmentIcon />
	        </CardIcon>
	        <div style={{display:'flex', justifyContent:'space-between'}}>
	        <p className={classes.cardCategory}>Boots</p>
	        <Button 
	          variant="contained" 
	          color="primary"
	          onClick={() => {onClickNew()} }
	          style={{marginTop: '45px', height: '45px',}}
	        >
	          New
	        </Button>
	        </div>
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
	                      key={row._id}
	                    >
	                      <TableCell>
	                        {row.no}
	                      </TableCell>
                        <TableCell align="left">
                          <div  style={{
                            borderRadius: 4,
                            padding: 4,
                            width: 'fit-content',
                          }}>
                            {row.name}
                          </div>
                        </TableCell>
                        <TableCell align="left">
                          <div  style={{
                            borderRadius: 4,
                            padding: 4,
                            width: 'fit-content',
                          }}>
                            {row.detail}
                          </div>
                        </TableCell>
                        <TableCell align="left">
                          <div  style={{
                            borderRadius: 4,
                            padding: 4,
                            width: 'fit-content',
                          }}>
                            {row.cost}
                          </div>
                        </TableCell>
                        <TableCell align="left">
                          <div  style={{
                            borderRadius: 4,
                            padding: 4,
                            width: 'fit-content',
                          }}>
                            <img src={'/gifts/' + row.src} />
                          </div>
                        </TableCell>
                        <TableCell align="right">
                          <IconButton style={{color:"#4caf50"}} onClick={() => {onClickEdit(row)}}>
                              <CreateIcon />
                          </IconButton>
                          <IconButton style={{color:"#f44336"}} onClick={() => {handleClickDelete(row._id)}}>
                            <DeleteIcon />
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
  else {
    return null
  }
}
