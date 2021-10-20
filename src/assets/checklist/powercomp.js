import { Rect2D } from "@/assets/CAD2D/rect.js"

class PowerCompanyChecklist extends Rect2D{
  question = [];

  constructor(){
    super()
  }

  boundary = new Rect2D( {x: 1080, y: 590, width: 250, height: 75} );

  listSelection = [
    new Rect2D( {x: 1083, y: 595, width: 23, height: 23} ),
    new Rect2D( {x: 1177, y: 595, width: 23, height: 23} ),
    new Rect2D( {x: 1271, y: 595, width: 23, height: 23} ),
    new Rect2D( {x: 1083, y: 624, width: 23, height: 23} ),
    new Rect2D( {x: 1177, y: 624, width: 23, height: 23} ),
    new Rect2D( {x: 1271, y: 624, width: 23, height: 23} ),
    new Rect2D( {x: 1083, y: 652, width: 23, height: 23} ),
    new Rect2D( {x: 1177, y: 652, width: 23, height: 23} ),
    new Rect2D( {x: 1271, y: 652, width: 23, height: 23} ),
  ]

  listString = [
    '北海道',
    '東北',
    '東京',
    '北陸',
    '中部',
    '関西',
    '中国',
    '四国',
    '九州'
  ]

  itemValue (pt) {
    for (let i = 0; i < this.listSelection.length; i++) {
      if ( this.listSelection[i].pointInRect( pt ) === true ) {
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

let powerCompanyChecklist = new PowerCompanyChecklist()

export { PowerCompanyChecklist, powerCompanyChecklist }