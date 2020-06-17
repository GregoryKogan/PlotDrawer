class Candel{
  constructor(Open, Close, Min, Max){
    if (Open && Close && Min && Max){
      this.Open = Open;
      this.Close = Close;
      this.Min = Min;
      this.Max = Max;
    }
    else{
      this.Open = undefined;
      this.Close = undefined;
      this.Min = undefined;
      this.Max = undefined;
    }
  }
}
