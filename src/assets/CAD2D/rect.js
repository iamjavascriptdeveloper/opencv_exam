
const defaults = {
  x: 0,
  y: 0,   
  width: 0,
  height: 0,
}

class Rect2D {

  left = 0;
  right = 0;
  top = 0;
  bottom = 0;
  width = 0;
  height = 0;

  constructor(options = { x: 0, y: 0, width: 0, height: 0 }) {

    this.left = options.x                     | defaults.x;
    this.top = options.y                      | defaults.y;
    this.right = options.x + options.width    | defaults.x + defaults.width;
    this.bottom = options.y + options.height  | defaults.y + defaults.height;

    this.width = options.width                | defaults.width;
    this.height = options.height              | defaults.height;

  }

  pointInRect = (pt) => {
    return (pt.x > this.left) && (pt.x < this.right ) && (pt.y > this.top ) && (pt.y < this.bottom )
  }

  get center() {
    let c = {x:0, y:0}
    c.x = (this.left + this.right) / 2
    c.y = (this.top + this.bottom) / 2
    return c
  }

  isSameRect(aRect) {
    return (this.left === aRect.left) && ( this.top === aRect.top) && (this.width === aRect.width) && (this.height === aRect.height) 
  }

}

export { Rect2D }