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
  { id: 'question', numeric: false, disablePadding: false, label: 'Question'},
  { id: 'answer', numeric: false, disablePadding: false, label: 'Answer'},
  // { id: 'action', numeric: true, disablePadding: false, label: 'action'}, 
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

export default function Quizes( {onClickNew} ) {
  // donfsdodifj
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

  const handleClickDelete = (id) => {
    Axios.delete(`${config.server_url}/api/quizes/` + id)
    .then((response) => {
      console.log(response);
      if(response.status === 204) {
        let newRows = rows.filter((row) => (row._id !== id));
        setRows(newRows);
      }
    })
    .catch((err) => {
      console.log(err)
      addToast('Delete failed', { appearance: 'error' })
    })
  }
  React.useEffect(() => {
    const getQuizes = async () => {
      const result = await Axios.get(`${config.server_url}/api/quizes`);
      let quizesToShow = result.data.quizes.map((item, index) => ({...item, no: index+1}));
      setRows(quizesToShow);
    }
    getQuizes()
  }, []);
  React.useEffect(() => {
    if(query !== '') {
      let filteredRows = rows.filter((row) => {
        let strTmp = row.question + ' ' + row.answer;
        if(strTmp.toLowerCase().indexOf(query.toLowerCase()) < 0) return false;
        else return true;
      })
      setFilteredRows(filteredRows);
    } else {
      setFilteredRows([...rows]);
    }
  }, [query, rows])

  

  return (
  	<Paper className={classes.paper}>
	    <Card>
	      <CardHeader color="warning" icon>
	        <CardIcon color="primary">
	          <AssignmentIcon />
	        </CardIcon>
	        <div style={{display:'flex', justifyContent:'space-between'}}>
	        <p className={classes.cardCategory}>Quizes</p>
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
	                        {row.question}
                        </TableCell>
                        <TableCell align="left">
                            {row.answer}
                        </TableCell>
                        <TableCell align="right">
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

}
