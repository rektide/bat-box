"use strict"

var
  Cassowary = require( "cassowary"),
  diag= Math.pow( 3, 0.5)

/**
* Return how circles of radius r fit into an x,y sized rectangle
*/
function fit( r, x, y){
	// find columns
	var
	  r= new Cassowary.Variable({ value: r, name: "r"}),
	  d= new Cassowary.Variable({ value: r* 2, name: "d"}),
	  containerX= new Cassowary.Variable({ value: x, name: "cX"}),
	  cols= new Cassowary.SlackVariable(),
	  colIneq= Cassowary.Inequality( Cassowary.divide(containerX, d), Cassowary.GEQ, cols),
	  colSolver= new Cassowary.SimplexSolver()
	solver.autoSolve= true
	solver.addConstraint( colIneq)
	return {
		solver,
		cols
	}
}

module.exports= fit
