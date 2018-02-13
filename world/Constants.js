//Constants.js
//Stophin
//20160417

var graphics = null;
var world = null;
var preview = null;
var resm = null;
var gui = null;

var username = "guest";
var curfolder = username;
var worldinfo = username;
var mainfolder = "./folder/upload/" + curfolder + "/";

var Animation_Mode =
{
	Still:0,
	Step:1,
	Auto:2,
	Loop:3
};

// AnimationID Calculate:
// Animation_Base + Animation_Direction
// e.g. moving object heading right up
// Move:100 + Right_Up:104
// then the animation of player's definition is
// 204
var Animation_Base =
{
	Still:0,
	Move:100,
	Run:200,
	Attack:300,
	Dead:400
};
// When using 8 directions use this variable
//var Animation_Direction =
//{
//	Undefined:0,
//	Left:1,
//	Left_Up:2,
//	Up:3,
//	Right_Up:4,
//	Right:5,
//	Right_Down:6,
//	Down:7,
//	Left_Down:8
//};
// When using 4 directions use this variable
// Just using some duplicated value
var Animation_Direction =
{
	Undefined:0,
	Left:1,
	Left_Up:2,
	Up:3,
	Right_Up:4,
	Right:5,
	Right_Down:6,
	Down:7,
	Left_Down:8
};

var Role_Link =
{
	Role:0,
	Sort:1,
	Object:2,
	Back:3,
	Front:4,
	Player:5,
	Collision:6,
	Sortsbacks:7,
	QuadTree:8,
	Temp1:9,
	Temp2:10,
	End: 11,
	Max: 20
};

var Role_Type =
{
	Disabled:0,
	Normal:1,
	Back:2,
	Cursor:3,
	Pitch:4,
	Player:5,
};

var Path_Link =
{
	Path:0,
	Open:1,
	Close:2,
	Max:3
};


var DEF_ZERO = 1e-10;

function DEF_ISZERO(x) {
	return (x > - DEF_ZERO && x < DEF_ZERO);
}

var Relation =
{
	A:0,
	B:1,
	C:2,
	D:3,
	D_L:4,
	D_T:5,
	D_R:6,
	D_B:7
};

var RB_Color =
{
	Red:0,
	Black:1
};


var DEF_ASTAR_LIMIT = 100;

var DEF_FETCH_SPEED = 2;
var DEF_OCCUPY = 100;

var DEF_QUAD_W = 10000;
var DEF_QUAD_H = 10000;

var DEF_RANGE_W = 2;
var DEF_RANGE_H = 2;

var DEF_HEALTH = 300;

var Astar_Infinity = 999999999;

var PI = 3.141592654;
