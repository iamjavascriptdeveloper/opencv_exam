import { Rect2D } from "@/assets/CAD2D/rect.js"

class HouseTypeChecklist extends Rect2D{
  question = [];

  constructor(){
    super();
  }
  
  boundary = new Rect2D( {x: 1080, y: 224, width: 250, height: 41} );
  
  listSelection = [
    new Rect2D( {x: 1083, y: 224, width: 23, height: 23} ),
    new Rect2D( {x: 1222, y: 224, width: 23, height: 23} ),
    new Rect2D( {x: 1083, y: 251, width: 23, height: 23} ),
    new Rect2D( {x: 1222, y: 251, width: 23, height: 23} )
  ]

  listString = [
    'i-smart',
    'i-cube',
    'i-smile',
    'i-palette'
  ]

  itemValue (pt) {
    for (let i = 0; i < this.listSelection.length; i++) {
      if ( this.listSelection[i].pointInRect( pt ) == true ) {
        return this.listString[i];
      }
    }
  }

  defineShade( item ){
    const c = item.bRect.center;
    const res = this.boundary.pointInRect(c)
    if ( res === true ) {
      item.name = this.itemValue( c )
      this.question.push(item);
    }
    return res
  }

  get shadePortion() {
    for (let el of this.question) {
      if (el.child > 3)
        return el.name;
    }
    return ''
  }
    
}

let houseTypeChecklist = new HouseTypeChecklist()

export { HouseTypeChecklist, houseTypeChecklist }
