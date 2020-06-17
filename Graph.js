class Graph{
  constructor(Xpos, Ypos, Width, Height){
    this.Values = [];
    this.Position = 0;
    this.Xpos = Xpos;
    this.Ypos = Ypos;
    this.Width = Width;
    this.Height = Height;
    this.Seed = Math.random() * 100;
    this.Color = color(Math.random() * 255, Math.random() * 255, Math.random() * 255);
  }

  Update(Speed){
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

  Plot(){
    let XStep = (this.Width) / ((this.Values.length / 5) - 1);
    let YStep = this.Height / (max(this.Values) - min(this.Values));

    let PlotValues = this.Copy(this.Values);
    let Candels = [];

    while (PlotValues.length >= 5){
      let NewCandel = this.CreateCandel(PlotValues.splice(0, 5));
      Candels.push(NewCandel);
    }

    for (let i = 0; i < Candels.length; ++i){
      Candels[i] = this.Normalize(Candels[i], YStep);
    }

    for (let i = 0; i < Candels.length; ++i){
      let PosX = i * XStep + this.Xpos;
      push();
      if (Candels[i].Open < Candels[i].Close)
        fill(255, 0, 0);
      else {
        fill(0, 255, 0);
      }
      stroke(255);
      strokeWeight(max(XStep / 5, 1));
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
    let Open = Arr[0];
    let Close = Arr[Arr.length - 1];
    let Min = min(Arr);
    let Max = max(Arr);

    let Result = new Candel(Open, Close, Min, Max);

    return Result;
  }

  Normalize(CNDL, YStep){
    const MinValue = min(this.Values);
    CNDL.Open -= MinValue;
    CNDL.Close -= MinValue;
    CNDL.Min -= MinValue;
    CNDL.Max -= MinValue;
    CNDL.Open *= YStep;
    CNDL.Close *= YStep;
    CNDL.Min *= YStep;
    CNDL.Max*= YStep;
    CNDL.Open = (this.Ypos + this.Height) - CNDL.Open;
    CNDL.Close = (this.Ypos + this.Height) - CNDL.Close;
    CNDL.Min = (this.Ypos + this.Height) - CNDL.Min;
    CNDL.Max = (this.Ypos + this.Height) - CNDL.Max;

    CNDL.Open = Math.round(CNDL.Open);
    CNDL.Close = Math.round(CNDL.Close);
    CNDL.Min = Math.round(CNDL.Min);
    CNDL.Max = Math.round(CNDL.Max);

    return CNDL;
  }
}
