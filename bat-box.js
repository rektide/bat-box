"use strict"

var
  c= require( "cassowary"),
  diag= Math.pow( 3, 0.5)

/**
* Return how circles of radius r fit into an x,y sized rectangle
*/
function fit( d, x, y){
	d= new c.Expression( d)
	x= new c.Expression( x)
	y= new c.Expression( y)
	// find columns
	var
	  cols= new c.Variable({ name: "cols"}),
	  colEq= new c.Equation( c.times( d, cols), x, c.Strength.required, 0),
	  colSolver= new c.SimplexSolver()
	colSolver.addConstraint( colEq)
	return {
		solver: colSolver,
		cols,
		d,
		x,
		y	
	}
}

module.exports= fit
