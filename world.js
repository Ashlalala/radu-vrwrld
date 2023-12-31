class World{
  constructor(graph,roadWidth=40,roadRoundness=11){
    this.graph=graph;
    this.roadWidth=roadWidth;
    this.roadRoundness=roadRoundness;

    this.envelopes=[];
    this.roadBorders=[];

    this.generate();
  }

  generate(){
    this.envelopes.length=0;
    for(const segment of this.graph.segments){
      this.envelopes.push(
        new Envelope(segment,this.roadWidth,this.roadRoundness)
      );
    }

    this.roadBorders=Polygon.union(this.envelopes.map((e)=>e.polygon));
    
  }


  draw(ctx){
    for(const envelope of this.envelopes){
      envelope.draw(ctx,{fill:'#BBB',stroke:'#BBB',lineWidth:14});
    }
    for(const segment of this.graph.segments){
      segment.draw(ctx,{color:'white',width:4,dash:[10,10]});
    }
    for(const segment of this.roadBorders){
      segment.draw(ctx,{color:'white',width:4});
    }    
  }
}