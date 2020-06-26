class Graph{
  constructor(Xpos, Ypos, Width, Height, Ticket){
    this.Values = [];
    this.Position = 0;
    this.Xpos = Xpos;
    this.Ypos = Ypos;
    this.Width = Width;
    this.Height = Height;
    this.Seed = Math.random() * 100;
    this.Color = color(Math.random() * 255, Math.random() * 255, Math.random() * 255);
    if (Ticket)
      this.Ticket = Ticket;
    else {
      this.Ticket = "AAPL";
    }
  }

  async RealTimeUpdate(){
    const API_URL = "https://api.bcs.ru/udfdatafeed/v1/quotes?symbols=" + this.Ticket;
    let Response = await GetPrice(API_URL);
    console.log(Response);
    this.Values.push(Response.Open);
    this.Values.push(Response.Min);
    this.Values.push(Response.Max);
    this.Values.push(Response.Close);
    if (this.Values.length > 400){
      this.Values.splice(0, 4);
    }
  }

  async GetLastMonth(){
    let API_URL = "https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=" + this.Ticket + "&outputsize=compact&apikey=II9TCPB9UVF23NL8";
    let Data = await GetData(API_URL);
    Data = Data["Time Series (Daily)"];
    console.log(Data);
    let Candels = [];
    for (let i = 1; i < 31; ++i){
      let Day = GetCurrentDate(i);
      let Info;
      if (Data)
        Info = Data[Day];
      if (Info){
        const Opn = parseInt(Info["1. open"]);
        const Hgh = parseInt(Info["2. high"]);
        const Low = parseInt(Info["3. low"]);
        const Cls = parseInt(Info["4. close"]);
        Candels.push(Opn);
        Candels.push(Low);
        Candels.push(Hgh);
        Candels.push(Cls);
      }
    }
    this.Values = Candels;
  }

  RandomUpdate(Speed){
    for (let i = 0; i < 5; ++i){
      if (Speed)
        this.Position += Speed;
      else {
        this.Position += 0.01;
      }
      noiseSeed(this.Seed);
      this.Values.push(noise(this.Position));
    }
    if (this.Values.length > 500){
      this.Values.splice(0, 5);
    }
  }

  PlotStocks(){
    if (this.Values.length == 0)
      return;

    let XStep = (this.Width) / ((this.Values.length / 4) - 1);
    let YStep = this.Height / (max(this.Values) - min(this.Values));

    if (this.Ticket == "LKOH"){
      YStep *= 0.6
    }

    let PlotValues = this.Copy(this.Values);
    let Candels = [];

    while (PlotValues.length >= 4){
      let CandelData = PlotValues.splice(0, 4);
      let CNDL = {};
      CNDL.Open = CandelData[0];
      CNDL.Min = CandelData[1];
      CNDL.Max = CandelData[2];
      CNDL.Close = CandelData[3];
      Candels.push(CNDL);
    }

    for (let i = 0; i < Candels.length; ++i){
      Candels[i] = this.Normalize(Candels[i], YStep);
    }

    for (let i = 0; i < Candels.length; ++i){
      let PosX = i * XStep + this.Xpos;
      push();
      if (Candels[i].Open >= Candels[i].Close)
        fill(255, 0, 0);
      else {
        fill(0, 255, 0);
      }
      stroke(255);
      strokeWeight(min(max(XStep / 5, 1), 5));
      if (i != 0 && i != Candels.length - 1)
        line(PosX, Candels[i].Max, PosX, Candels[i].Min);
      stroke(0);
      //strokeWeight(2);
      noStroke();
      if (i > 0 && i < Candels.length - 1)
        rect(PosX - (XStep / 2), min(Candels[i].Open, Candels[i].Close), XStep, abs(Candels[i].Open - Candels[i].Close));
      else if (i == Candels.length - 1) {
        rect(PosX - (XStep / 2), min(Candels[i].Open, Candels[i].Close), XStep / 2, abs(Candels[i].Open - Candels[i].Close));
      }
      else{
        rect(this.Xpos, min(Candels[i].Open, Candels[i].Close), XStep / 2, abs(Candels[i].Open - Candels[i].Close));
      }
      pop();
    }

    push();
    stroke(246, 202, 9);
    noFill();
    rect(this.Xpos, this.Ypos, this.Width, this.Height);
    fill(255);
    noStroke();
    textSize(15);
    text(this.Ticket, this.Xpos + 5, this.Ypos + 15);
    pop();
  }

  Copy(List){
    let Result = [];
    for (let i = 0; i < List.length; ++i){
      Result[i] = List[i];
    }
    return Result;
  }

  CreateCandel(Arr){
    console.log(Arr);
    let Op = Arr[0];
    let Cl = Arr[Arr.length - 1];
    let Mi = min(Arr);
    let Ma = max(Arr);

    let Result = {
      Open: Op,
      Close: Cl,
      Min: Mi,
      Max: Ma
    };

    return Result;
  }

  Normalize(CNDL, YStep){
    let MinValue = min(this.Values);
    if (this.Ticket == "LKOH")
      MinValue -= 10;
    CNDL.Open -= MinValue;
    CNDL.Close -= MinValue;
    CNDL.Min -= MinValue;
    CNDL.Max -= MinValue;
    CNDL.Open *= YStep;
    CNDL.Close *= YStep;
    CNDL.Min *= YStep;
    CNDL.Max*= YStep;

    if (this.Ticket != "AAPL"){
      CNDL.Open = (this.Ypos + this.Height) - CNDL.Open;
      CNDL.Close = (this.Ypos + this.Height) - CNDL.Close;
      CNDL.Min = (this.Ypos + this.Height) - CNDL.Min;
      CNDL.Max = (this.Ypos + this.Height) - CNDL.Max;
    }

    // CNDL.Open = Math.round(CNDL.Open);
    // CNDL.Close = Math.round(CNDL.Close);
    // CNDL.Min = Math.round(CNDL.Min);
    // CNDL.Max = Math.round(CNDL.Max);

    return CNDL;
  }
}
