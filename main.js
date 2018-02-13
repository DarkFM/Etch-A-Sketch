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
  // var parentArray = [];
  var element;
  for(var i = 0; i < this.rows; i++)
  {
    element = document.createElement("div");
    element.className = "row" + i;
    var decimalColor = Math.floor(Math.random()*Math.pow(256, 3));
    var color = "#" + decimalColor.toString(16);
    element.style.backgroundColor = color;
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
      target.style.backgroundColor = "#fff";      
    }

  })

  document.addEventListener("mouseover", function (ev) {
    var target = ev.target;
    var targetClasses = target.classList;    
    
    if(targetClasses.contains("box") && Grid.drag && Grid.leftClick)
      target.style.backgroundColor = Grid.colorPicker.value;
    else if(targetClasses.contains("box") && Grid.drag && Grid.rightClick)
    {
      target.style.backgroundColor = "#fff";      
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
      node.style.backgroundColor = "#fff";
    })

    // element.style.backgroundColor = "#fff";
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
      // debugger        
      grid.NewGrid(rows, cols)
    }
    else if(target.id === "reset_btn")
    {
      grid.Reset();
    }
  }
}

// function start()
// {
//   var count = false;
//   var colorInput = document.querySelector("[type=color]");
//   var color;

//   colorInput.addEventListener("click", function (ev) {
//     color = ev.target.value;
//     console.log(color)
//   });

//   return function () {
//     if(!count) count = true;
//     else return;
//     var sketch = new Grid(50, 50, 600, 600);
//     sketch.CreateGrid();
//     sketch.AddEventListener()
//   }
// }



// document.addEventListener("DOMContentLoaded", start())

window.onload = function()
{
  var count = false;
  Grid.colorPicker = document.querySelector("[type=color]");
  document.addEventListener("contextmenu", function(ev) {
     ev.preventDefault(); 
  })

  var sketch = new Grid(50, 50, 600, 600);
  sketch.CreateGrid();
  sketch.AddEventListener()
  controls.addEventListener("click", AddBtnEvents(sketch));

};