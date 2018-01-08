#!/usr/bin/env node
"use strict"

var
  c= require( "cassowary"),
  diag= Math.pow( 3, 0.5) / 2

/**
* Return how circles of radius r fit into an x,y sized rectangle
*/
function fit2D( d, x, y){
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
	  insetTrim= ( cols.value- floorCols)< 0.5, // does inset need to be trimmed?
	  insetRows= Math.floor( rows.value/ 2), // how many inset rows are there?
	  trim= insetTrim&& insetRows|| 0,
	  count= unpruned- trim,
	  colSize= floorCols+ (insetTrim? 0: 0.5) // physical size of cols

	// calculate free space
	var
	  freeX= x- (d* colSize),
	  freeY= y- ((d* diag* (floorRows- 1))+ d)
	return {
		count,
		cols: cols.value,
		rows: rows.value,
		depth: 0,
		x,
		freeX,
		y,
		freeY,
		z: 0,
		freeZ: 0
	}
}


/**
* Return permutations of how cylinders of d,h fit into an x,y,z sized space
*/
function fit3D( d, h, x, y, z){
	// three possible orientations
	var
	  a= fit2D( d, x, y),
	  b= fit2D( d, x, z),
	  c= fit2D( d, y, z)
	// calculate how many deep
	a.z= z
	a.depth= Math.floor( z/ h)
	a.freeZ= z- ( a.depth* h)
	a.count*= a.depth

	b.z= y
	b.depth= Math.floor( y/ h)
	b.freeZ= y- ( b.depth* h)
	b.count*= b.depth

	c.z= x
	c.depth= Math.floor( x/ h)
	c.freeZ= x- ( c.depth* h)
	c.count*= c.depth

	return { a, b, c}
}


module.exports.fit2D= fit2D
module.exports.fit3D= fit3D
module.exports= fit3D

if( require.main=== module){
	var args= new Array( 5)
	for( var i= 0; i< args.length; ++i){
		args[ i]= Number.parseFloat( process.argv[ i+ 2])
	}
	var [ d, h, x, y, z]= args
	console.log({ d, h, x, y, z})
	var calc= fit3D.apply( null, args)
	console.log( JSON.stringify( calc, null, "\t"))
}
