async function GetData(API_URL){
  const Response = await fetch(API_URL);
  const Data = await Response.json();
  return Data;
}

async function GetPrice(API_URL){
  const Response = await fetch(API_URL);
  const Data = await Response.json();
  let Result = {
    Open: Data.d.v.open_price,
    Close: Data.d.v.prev_close_price,
    Min: Data.d.v.low_price,
    Max: Data.d.v.high_price,
  };
  return Result;
}

function Initialize(){
  AAPLGraph = new Graph(10, 10, windowWidth - 20, windowHeight / 2 - 20, "AAPL");
  LKOHGraph = new Graph(10, windowHeight / 2 + 10, windowWidth - 20, windowHeight / 2 - 20, "LKOH");
  Graphs.push(AAPLGraph);
  Graphs.push(LKOHGraph);
}

function GetCurrentDate(Offset){
  let CurrentDate = new Date();
  if (Offset){
    CurrentDate.setDate(CurrentDate.getDate() - Offset);
  }
  let Day = String(CurrentDate.getDate()).padStart(2, '0');
  let Month = String(CurrentDate.getMonth() + 1).padStart(2, '0'); //January is 0!
  let Year = CurrentDate.getFullYear();
  let Result = Year + '-' + Month + '-' + Day;
  return Result;
}

function MaxVal(Candels){
  let LineArr = [];
  for (let i = 0; i < Candels.length; ++i){
    LineArr.push(Candels[i].Max);
  }
  const Result = max(LineArr);
  console.log(LineArr);
  return Result;
}

function MinVal(Candels){
  let Result = Infinity;
  for (let i = 0; i < Candels.length; ++i){
    if (Candels[i].Min < Result)
      Result = Candels[i].Min;
  }
  return Result;
}
