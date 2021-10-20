import {DTXObject} from "./dtxbase.js"
import planInformation from "./dtxplaninfo.js"

class DTXHeader extends DTXObject{
  
  planInfo = planInformation;

  constructor(){
    super();
  }
}

export { DTXHeader }