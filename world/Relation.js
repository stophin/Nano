//Relation.js
//Stophin
//20160417

function getRelation(tango, item)
{
	if (tango == null || item == null)
	{
		return Relation.A;
	}
	var item_posX = item.flatting.X;
	var item_posY = item.flatting.Y;
	var item_geomW = item.flatting.Width;
	var item_geomH = item.flatting.Height;
	var tango_posX = tango.flatting.X;
	var tango_posY = tango.flatting.Y;
	var tango_geomW = tango.flatting.Width;
	var tango_geomH = tango.flatting.Height;

	item_posY += item_geomH;
	tango_posY += tango_geomH;
	
	return getRelationExternal(item_posX, item_posY, item_geomW, item_geomH, tango_posX, tango_posY, tango_geomW, tango_geomH);
}

function getRelationExternal(item_posX, item_posY, item_geomW, item_geomH, tango_posX, tango_posY, tango_geomW, tango_geomH)
{
	if (item_posX >= tango_posX && item_posX <= tango_posX + tango_geomW)
	{
		if (item_posY <= tango_posY && item_posY - item_geomH >= tango_posY - tango_geomH)
		{
			return Relation.D;
		}
		if (item_posY - item_geomH <= tango_posY && item_posY >= tango_posY - tango_geomH)
		{
			return Relation.D;
		}
	}
	if (item_posX + item_geomW >= tango_posX && item_posX + item_geomW <= tango_posX + tango_geomW)
	{
		if (item_posY <= tango_posY && item_posY - item_geomH >= tango_posY - tango_geomH)
		{
			return Relation.D;
		}
		if (item_posY - item_geomH <= tango_posY && item_posY >= tango_posY - tango_geomH)
		{
			return Relation.D;
		}
	}
	if (item_posX + item_geomW < tango_posX + tango_geomW && item_posY - item_geomH < tango_posY)
	{
		return Relation.A;
	}
	if (item_posX < tango_posX + tango_geomW && item_posY < tango_posY - tango_geomH)
	{
		return Relation.A;
	}
	if (item_posX >= tango_posX + tango_geomW && item_posY - item_geomH >= tango_posY)
	{
		return Relation.B;
	}
	if (item_posX + item_geomW >= tango_posX && item_posY - item_geomH >= tango_posY - tango_geomH)
	{
		return Relation.B;
	}
	if (item_posX + item_geomW < tango_posX && item_posY >= tango_posY - tango_geomH)
	{
		return Relation.C;
	}
	if (item_posX >= tango_posX + tango_geomW && item_posY - item_geomH < tango_posY)
	{
		return Relation.C;
	}

	return Relation.A;
}

function isRelationD(relation)
{
	return (relation > Relation.C);
}

function stringRelation(relation)
{
	var string = "";
	switch (relation)
	{
	case Relation.A:
		string = "A";
		break;
	case Relation.B:
		string = "B";
		break;
	case Relation.C:
		string = "C";
		break;
	case Relation.D:
		string = "D";
		break;
	case Relation.D_L:
		string = "D_L";
		break;
	case Relation.D_R:
		string = "D_R";
		break;
	case Relation.D_T:
		string = "D_T";
		break;
	case Relation.D_B:
		string = "D_B";
		break;
	}
	return string;
}
