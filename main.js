function Box(color, width, height)
{
  this.color = color;
  this.width = width;
  this.height = height;
  this.element = document.createElement("div");
  this.element.classList.add("" + Box.row + "," + Box.col, "box");
  this.element.style.height = height+"px";
  this.element.style.width = width+"px";
}


// Static variables on Box class
Box.row = 0;
Box.col = 0;


// appends the box to the parent node
Box.prototype.JoinNodes = function(parent)
{
  parent.appendChild(this.element);
}

function Grid(rows, cols, width, height)
{  
  this.rows = rows;
  this.cols = cols;
  this.width = width;
  this.height = height;
  this.grid = [];
  this.container = document.getElementById("container");
  this.container.style.height = height+"px";
  this.container.style.width = width+"px";

}

// static varibles for Grid Class
Grid.colorPicker = null;
Grid.drag = false;
Grid.rightClick = false;
Grid.leftClick = false;


// returns array of parent divs
Grid.prototype.CreateParentRows = function()
{
  var element;
  for(var i = 0; i < this.rows; i++)
  {
    element = document.createElement("div");
    element.className = "row" + i;
    this.grid.push(element);
  }
  
}

Grid.prototype.CalcBoxWidth = function()
{
  return Math.floor(this.width / this.cols);
}

Grid.prototype.CalcBoxHeight = function()
{
  return Math.floor(this.height / this.rows);
}


Grid.prototype.AppendToHTML = function()
{
  var grid = this.grid;
  for(var i = 0; i < grid.length; i++)
  {
    this.container.appendChild(grid[i]);
  }
}

Grid.prototype.CreateGrid = function()
{
  var boxWidth = this.CalcBoxWidth();
  var boxHeight = this.CalcBoxHeight();
  var parent, box,
      tempParentArray = [];
  
  this.CreateParentRows();
  
  for(var row = 0; row < this.grid.length; row++)
  {
    Box.row = row;
    parent = this.grid[row];
    for(var col = 0; col < this.cols; col++)
    {
      Box.col = col;
      box = new Box("#000000", boxWidth, boxHeight );
      box.JoinNodes(parent);
    }
  }
  
  this.AppendToHTML();
}

Grid.prototype.AddEventListener = function()
{
  document.addEventListener("mousedown", function (ev) {
    var target = ev.target;
    var targetClasses = target.classList;
    ev.preventDefault()
    if(targetClasses.contains("box") && ev.button === 0)
    {
      Grid.drag = true;
      Grid.leftClick = true;
      target.style.backgroundColor = Grid.colorPicker.value;
    }
    else if(targetClasses.contains("box") && ev.button === 2)
    {
      Grid.drag = true;
      Grid.rightClick = true;
      // target.style.backgroundColor = "#fff";
      target.style.removeProperty("background-color");
    }

  })

  document.addEventListener("mouseover", function (ev) {
    var target = ev.target;
    var targetClasses = target.classList;    
    
    if(targetClasses.contains("box") && Grid.drag && Grid.leftClick)
      target.style.backgroundColor = Grid.colorPicker.value;
    else if(targetClasses.contains("box") && Grid.drag && Grid.rightClick)
    {
      // target.style.backgroundColor = "#fff";      
      target.style.removeProperty("background-color");
      
    }  
  })

  document.addEventListener("mouseup", function(ev) {
    Grid.drag = false;
    Grid.rightClick = false;
    Grid.leftClick = false;
  })
}

Grid.prototype.NewGrid = function (rows, cols)
{
  this.container.innerHTML = "";
  this.rows = rows;
  this.cols = cols;
  this.grid = [];
  this.CreateGrid();
}

Grid.prototype.Reset = function () {
  var grid = this.grid;
  // console.log(grid[1])
  for (var row = 0; row < grid.length; row++) {
    var element = grid[row];
    var nodes = element.getElementsByClassName("box");

    Array.prototype.forEach.call(nodes, function (node) {
      node.style.removeProperty("background-color");
      // node.style.backgroundColor = "#fff";
    })

  }
}

/***************************************
 * Regular Functions
 **************************************/

function AddBtnEvents(grid) {
  return function (ev) {
    var target = ev.target;
    if(target.id === "new_grid_btn")
    {
      var usrInput = prompt("Enter number of rows and Cols (eg. 10,20)")
        .split(",");
      var rows = usrInput[0].trim();
      var cols = usrInput[1].trim();
      grid.NewGrid(rows, cols)
    }
    else if(target.id === "reset_btn")
    {
      grid.Reset();
    }
  }
}

function RandomColor(sketch) {
  return function(){
    var row = Math.floor(Math.random() * sketch.rows);
    var col = Math.floor(Math.random() * sketch.cols);
    var element = sketch.container.getElementsByClassName(row+","+col)[0];
    var decimalColor = Math.floor(Math.random() * Math.pow(256, 3));
    var color = "#" + decimalColor.toString(16);
    element.style.backgroundColor = color;
    // setTimeout(function(){sketch.Reset()}, 800);
  }
}

function DiscoTime(sketch) 
{
  var magic = false;
  var timerID = resetTimerID = null;
  var RandomizeCellColor = null;
  var discoBtn = document.getElementById("magic");
  return function () {
    if(!magic)
    {
      RandomizeCellColor = RandomColor(sketch);
      timerID = setInterval(RandomizeCellColor, 0);
      resetTimerID = setInterval(function(){sketch.Reset()}, 800);
      magic = true;
      discoBtn.classList.add("red");
    } 
    else
    {
      magic = false;  
      clearInterval(timerID);
      clearInterval(resetTimerID);
      discoBtn.classList.remove("red");
    }
  }
}


window.onload = function()
{
  var magic = false;
  Grid.colorPicker = document.querySelector("[type=color]");
  document.addEventListener("contextmenu", function(ev) {
     ev.preventDefault(); 
  })

  var sketch = new Grid(50, 50, 600, 600);
  sketch.CreateGrid();
  sketch.AddEventListener()
  controls.addEventListener("click", AddBtnEvents(sketch));

  var magic = document.getElementById("magic");
  magic.addEventListener("click", DiscoTime(sketch));

};