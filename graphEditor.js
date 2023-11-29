class GraphEditor {
  constructor(viewport,graph){
    this.viewport=viewport;
    this.canvas=viewport.canvas;
    this.graph=graph;

    this.ctx=this.canvas.getContext('2d');

    this.mouse=null;

    this.range=16;
    this.hovered=null;
    this.selected=null;

    this.dragged=null;

    this.remove=null;

    this.#addEventListeners();
    
  }

  dispose(){
    this.graph.dispose();
    this.selected=null;
    this.hovered=null;
    this.dragged=null;
  }

  #addEventListeners(){
    this.canvas.addEventListener('mousedown',this.#handleMouseDown.bind(this));

    this.canvas.addEventListener('mouseup',(e)=>{
      this.dragged=null;
    });

    this.canvas.addEventListener('mousemove',(e)=>{
      this.mouse=this.viewport.getMouse(e, true);
      this.hovered=checkPointInRange(this.mouse,this.graph.points,this.range*this.viewport.zoom);
      if(this.dragged){
        this.dragged.x=this.mouse.x;
        this.dragged.y=this.mouse.y;

      }
    });

    this.canvas.addEventListener('contextmenu',(e)=>e.preventDefault());

  }

  #handleMouseDown(e){
    if(e.button==2){//right-click
      if(this.selected){
        this.selected=null;
      }else if(this.hovered){
        this.#removePoint(this.hovered);
      }
    }

    if(e.button==0){//left-click
      if(this.hovered){
        this.#tryTryAddSegment(this.selected, this.hovered);
        this.selected=this.hovered;
        this.dragged=this.selected;
        return;
      }
      this.#tryTryAddSegment(this.selected, this.mouse);
      this.graph.addPoint(this.mouse);
      this.selected=this.mouse;
      this.hovered=this.selected;
    }
  }

  #removePoint(point){
    this.graph.removePoint(point);
    if(this.selected==point){
      this.selected=null;
    }
    this.hovered=null
  }

  #tryTryAddSegment(currSelected, mouse){
    if(currSelected){
      const newSegment=new Segment(currSelected, mouse);
      this.graph.tryAddSegment(newSegment);
    }
  }

  #rrr(a,b){
    if(a==b)return true;
    else return false;
  }
  display(){
    this.graph.draw(this.ctx);

    
    if(this.hovered){
      this.hovered.draw(this.ctx,{hovered:true});
    }
    if(this.selected){
      const to=this.hovered&&this.hovered!=this.selected?this.hovered:this.mouse;
      new Segment(this.selected,to).draw(ctx,{dash:[3,3]});
      const isHovered=this.selected==this.hovered;
      this.selected.draw(this.ctx,{outline: true,hovered: isHovered});
    }




  }
}