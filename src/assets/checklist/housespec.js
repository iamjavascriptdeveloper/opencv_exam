import { Rect2D } from "@/assets/CAD2D/rect.js"

const is260 = (aName) => {
  return aName === '２６０＋矩計'
}

const isGousetsu = (aName) => {
  return aName === '豪雪仕様' 
}

const isFireProof = (aName) => {
  return (aName === '準防火仕様(B)') || (aName === '準耐火仕様(T)')
}

class HouseSpecChecklist extends Rect2D{
  question = [];

  constructor(){
    super();
  }

  boundary = new Rect2D( {x: 1080, y: 324, width: 250, height: 41} );

  listSelection = [
    new Rect2D( {x: 1083, y: 324, width: 23, height: 23} ),
    new Rect2D( {x: 1222, y: 324, width: 23, height: 23} ),
    new Rect2D( {x: 1083, y: 351, width: 23, height: 23} ),
    new Rect2D( {x: 1222, y: 351, width: 23, height: 23} )
  ]

  listString = [
    '準防火仕様(B)',
    '準耐火仕様(T)',
    '豪雪仕様',
    '２６０＋矩計'
  ]

  houseSpecValue (pt) {
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
      item.name = this.houseSpecValue( c )
      this.question.push(item);
    } 
    return res  
  }

  get houseStructure() {
    for (let el of this.question){
      if (is260(el.name)){
        return el.child > 3 ? el.name : '２４０＋矩計';
      }
    }
    return ''
  }

  get heavySnow() {
    for (let el of this.question){
      if (isGousetsu(el.name)){
        return el.child > 3 ? 'あり' : 'なし';
      }
    }
    return ''
  }

  get fireProof() {
    let el1 = null;
    let el2 = null;

    for (let el of this.question){
      if (isFireProof(el.name)){
        if (el1 === null) {
          el1 = el;  
        }else{
          el2 = el;
          return el1.child > 3 ? el1.name : el2.child > 3 ? el2.name : 'Normal';
        }
      }
    } 
    return '' 
  }


}

let houseSpecChecklist = new HouseSpecChecklist()

export { 
  HouseSpecChecklist, 
  houseSpecChecklist 
}