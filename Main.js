let Graphs = [];
let LastRequestTimer = 0;

function setup(){
  createCanvas(windowWidth - 5, windowHeight - 5);
  frameRate(60);
  Initialize();
  Graphs[0].GetLastMonth();
  Graphs[1].RealTimeUpdate();
}

function draw(){
  LastRequestTimer++;
   background(18);
  Graphs[0].PlotStocks();
  Graphs[1].PlotStocks();
  if (LastRequestTimer > 300){
    Graphs[1].RealTimeUpdate();
    LastRequestTimer = 0;
  }

  push();
  fill(255);
  text(LastRequestTimer, 0, windowHeight - 10);
  pop();
}
