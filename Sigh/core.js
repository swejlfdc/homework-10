var  inf = 0x7fffffff;

var c= Array();
var N, M;
var HEXT=false, VEXT=false, FINDRECT=false;
var ans= Array(), Count = 0; 
var selected = Array();
var CurAns = Array();
var scanRow, scanCol;

function inputFromFile(dataSoure) {
	var dataArea =  document.getElementById(dataSoure);
	var text = dataArea.value;
	//text = "4,4\n1,2,3,4\n12,-1,-1,5\n11,-1,-1,6\n10,9,8,7";

	var lines = text.split('\n');
	var head = lines[0].split(',');
	console.log(text);
	N = parseInt(head[0]);
	M = parseInt(head[1]);
	for(var i = 1; i <= N; ++i) {
		var cline = lines[i].split(',');
		c[i - 1] = Array(M);
		selected[i - 1] = Array(M);
		for(var j = 0; j < M; ++j) {
			c[i - 1][j] = parseInt(cline[j]);
			selected[i - 1][j] = false;
		}
	}
	console.log(c);
}

function getmax(a, b) {
	return a > b ? a : b;
}

function apply2DIntArr(row,  col) {	
	var ret = Array();
	for(var i = 0; i < row; ++i) {
		ret[i] = Array(col);
		for(var j = 0; j < col; ++j) {
			ret[i][i] = 0;
		}
	}
	return ret;
}

function GetSel(row_size, col_size, si, sj, ei, ej) {
	var ret = apply2DIntArr(row_size, col_size);
	for(var i = 0; i < row_size; ++i)
		for(var j = 0; j < col_size; ++j) ret[i][j] = false;
	for(var i = si; i <= ei; ++i) 
		for(var j = sj; j <= ej; ++j) {
			ret[i % row_size][j % col_size] = true;
		}
	return ret;
}

function _maxsum(c, size, r1, r2, sc, preans) {
	var ret = preans, minpre = 0, prefix = 0;
	var l, ll, rr;
	ll = 0; l = -1; rr = 0;
	for(var i = 0; i < size; i++) {
		prefix += c[i];
		if(prefix - minpre > ret) {
			ret = prefix - minpre;
			ll = l + 1;
			rr = i;
			CurAns = GetSel(scanRow, scanCol, r1, sc + ll, r2, sc + rr);
		} 
		selected[Count]= GetSel(scanRow, scanCol, r1, sc + 0, r2, sc + i);
		ans[Count] = CurAns;
		Count++;
		if(prefix < minpre) {
			minpre = prefix;
			l = i;
		}
	}
	return [ret, ll, rr];
}

function maxsum(mat, row_size, col_size, rRow, rCol) {
	var arr;
	var ret = -inf;
	var sec = 1;
	for(var ni = 0; ni < row_size; ++ni)
		for(var nj = 0; nj < col_size - rCol + 1; ++nj) {			
			arr= Array(col_size);
			for(var i = 0; i < col_size; ++i) arr[i] = 0;
			for(var i = ni; i < ni + rRow && i < row_size; ++i) {
				for(var j = nj; j < nj + rCol && j < col_size; ++j)
					arr[j - nj] += mat[i][j];
				tmp = _maxsum(arr, rCol, ni, i, nj, ret);
				if(tmp[0] > ret) {
					ret = tmp[0];
					//selected = GetSel(rRow, rCol, ni, tmp[1], i, tmp[2])
					//drawFlip(selected, rRow, rCol);
					//setTimeout("flipGrid([" + selected.toString() +"], " + rRow + "," + rCol+ ")",sec * 1500);
					//console.log(selected.toString());
					//sec++;
				}
			}
	}
	return ret;
}
/*	
function maxsum(mat, row_size, col_size) {
	var arr;
	var ret = -inf;
	for(i = 0; i < row_size; ++i) {
		arr = Array(col_size);
		for(j = i; j < row_size; ++j) {
			for( k = 0; k < col_size; ++k)
				arr[k] += mat[j][k];
			tmp = maxsum(arr, col_size);
			ret = getmax(ret, tmp);
		}
	}
	return ret;
}
*/
/*
void colorBlock(int** mat, int row_size, int col_size, int row, int col, int color) {
	queue<pair<int, int> > Q;
	Q.push(make_pair(row, col));
	while(!Q.empty()) {
		pair<int, int> cur = Q.front();
		Q.pop();
		int r = cur.first, c = cur.second;
		if(r < 0 || r >= row_size || c < 0 || c >= col_size) continue;
		if(mat[r][c] == -1) {
			mat[r][c] = color;
			Q.push(make_pair(r - 1, c));
			Q.push(make_pair(r, c - 1));
			Q.push(make_pair(r + 1, c));
			Q.push(make_pair(r, c + 1));
		}
	}
}*/

function _maxUnicomBlock(mat, row_size, col_size) {
	var map = apply2DIntArr(row_size, col_size);
	//for(int i = 0; i < row_size; ++i) memset(map[i], 0, sizeof(int) * col_size);

	for(i = 0; i < row_size; ++i)
		for(j = 0; j < col_size; ++j) 
			map[i][j] = (mat[i][j] >= 0) ? -1 : 0;

	//color positive block
	var block_num = 0;
	for(i = 0; i < row_size; ++i)
		for(j = 0; j < col_size; ++j) 
			if(map[i][j] == -1) colorBlock(map, row_size, col_size, i, j, ++block_num);
	//count block value 
	var block = Array(block_num + 1);
	for(i = 0; i < row_size; ++i)
		for(j = 0; j < col_size; ++j) 
			block[map[i][j]] += mat[i][j];
	var ret = -inf;
	for(i = 1; i <= block_num; ++i) 
		ret = getmax(ret, block[i]);
	return ret;
}
/*
int maxUnicomBlock(int mat[][MAXCOL], int row_size, int col_size, int rRow, int rCol) {
	int** rect;
	int ret = -inf;
	//apply for memory
	rect = apply2DIntArr(rRow, rCol);
	//main program
	for(int ni = 0; ni < row_size - rRow + 1; ++ni)
		for(int nj = 0; nj < col_size - rCol + 1; ++nj) {
			for(int i = ni; i < ni + rRow; ++i)
				for(int j = nj; j < nj + rCol; ++j) 
					rect[i - ni][j - nj] = mat[i][j];
			int tmp = _maxUnicomBlock(rect, rRow, rCol);
			getmax(ret, tmp);
		}
	//release memory
	release2DIntArr(rect, rRow, rCol);
	return ret;
}
*/
function VDoubleExtend(mat, row_size, col_size) {
	for(var i = 0; i < row_size; ++i) {
		mat[i + row_size] = Array();
	}
	for(var i = 0; i < row_size; ++i)
		for(var j = 0; j < col_size; ++j) 
			mat[i + row_size][j] = mat[i][j];
}

function HDoubleExtend(mat, row_size, col_size) {
	for(var i = 0; i < row_size; ++i)
		for(var j = 0; j < col_size; ++j) 			
			mat[i][j + col_size] = mat[i][j];
}

function calc(dataSoure, vext, hext, frect, load) {
	HEXT = hext;
	VEXT = vext;
	FINDRECT = true;
	Count = 0;
	inputFromFile(dataSoure);
	load(c, N, M);	
	scanRow = N, scanCol = M;
	if(VEXT) {
		VDoubleExtend(c, N, M); N *= 2;
	}
	if(HEXT) {
		HDoubleExtend(c, N, M); M *= 2;
	}
	CurAns = GetSel(scanRow, scanCol, 0, 0, scanRow, scanCol);
	if(FINDRECT) 
		maxsum(c, N, M, scanRow, scanCol);
	else  
		maxUnicomBlock(c, N, M, scanRow, scanCol);
	console.log(ans);
	console.log(selected);	
}
