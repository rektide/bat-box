"use strict"

var
  c= require( "cassowary"),
  diag= Math.pow( 3, 0.5) / 2

/**
* Return how circles of radius r fit into an x,y sized rectangle
*/
function fit( d, x, y){
	// find columns
	var
	  cols= new c.Variable({ name: "cols"}),
	  colEq= new c.Equation( c.times( d, cols), x, c.Strength.required, 0),
	  colSolver= new c.SimplexSolver()
	colSolver.addConstraint( colEq)


	// find rows
	var
	  h= d * diag,
	  rows= new c.Variable({ name: "rows"}),
	  rowEq= new c.Equation( c.times( h, c.minus(rows, 1)), c.minus(y, d), c.Strength.required, 0),
	  rowSolver= new c.SimplexSolver()
	rowSolver.addConstraint( rowEq)

	// find counts
	var
	  floorCols= Math.floor( cols.value),
	  floorRows= Math.floor( rows.value),
	  unpruned= floorCols* floorRows,
	  insetRows= Math.floor( rows.value/ 2), // how many inset rows are there?
	  insetTrim= ( cols.value - floorCols)< 0.5, // does inset need to be trimmed?
	  trim= insetTrim&& insetRows|| 0,
	  count= unpruned- trim
	return {
		cols: cols.value,
		rows: rows.value,
		count
	}
}

module.exports= fit
