let Graphs = [];
let GraphAmount = 3;
let GraphAmountSlider;
let SpeedSlider;
let SmoothSlider;

function setup(){
  createCanvas(windowWidth - 5, windowHeight - 5);
  GraphAmountSlider = createSlider(1, 6, 3, 1);
  GraphAmountSlider.position(windowWidth - 290, 50);
  GraphAmountSlider.size(100, 20);
  SmoothSlider = createSlider(0.0001, 0.1, 0.01, 0.0001);
  SmoothSlider.position(windowWidth - 290, 100);
  SmoothSlider.size(100, 20);
  SpeedSlider = createSlider(1, 5, 1, 1);
  SpeedSlider.position(windowWidth - 290, 150);
  SpeedSlider.size(100, 20);
  Initialization();
  frameRate(60);
}

function draw(){
  background(18);

  push();
  fill(255);
  textSize(15);
  text(GraphAmountSlider.value() * GraphAmountSlider.value() + " Graph(s)", windowWidth - 180, 67);
  text(Math.round((1 - (SmoothSlider.value()  * 10)) * 1000) / 1000 + " Smoothness", windowWidth - 180, 117);
  text(SpeedSlider.value() + "X Speed", windowWidth - 180, 167);
  pop();

  for (let i = 0; i < Graphs.length; ++i){
    for (let it = 0; it < SpeedSlider.value(); ++it)
      Graphs[i].Update(SmoothSlider.value());
    Graphs[i].Plot();
  }

  if (GraphAmount != GraphAmountSlider.value()){
    GraphAmount = GraphAmountSlider.value();
    Initialization();
  }
}

function Initialization(){
  Graphs = [];
  const GraphW = (windowWidth - 310) / GraphAmount;
  const GraphH = (windowHeight - 25) / GraphAmount;
  for (let i = 0; i < GraphAmount; ++i){
    for (let j = 0; j < GraphAmount; ++j){
      const StartX = 10 + ((i % GraphAmount) * GraphW);
      const StartY = 10 + ((j % GraphAmount) * GraphH);
      let NewGraph = new Graph(StartX, StartY, GraphW, GraphH);
      Graphs.push(NewGraph);
    }
  }
}
