import np from "numjs";

import { Rect2D } from "@/assets/CAD2D/rect.js";
import { shadeList } from "@/assets/checklist/questlist.js";

import _ from 'lodash';

const OPENCV_URL = 'opencv.js';

class UtilsCustom {

  constructor() {
     
  }

  loadOpenCv = (onloadCallback) => {
    
    let script = document.createElement('script');
    script.setAttribute('async', '');
    script.setAttribute('type', 'text/javascript');
    script.addEventListener('load', () => {
      if (cv.getBuildInformation){
        console.log(cv.getBuildInformation());
        onloadCallback();
      }else{
        // WASM
        cv['onRuntimeInitialized'] = () =>{
          console.log(cv.getBuildInformation());
          onloadCallback();
        }
      }

    });
    script.addEventListener('error', () => {
        self.printError('Failed to load ' + OPENCV_URL);
    });
    script.src = OPENCV_URL;
    let node = document.getElementsByTagName('script')[0];
    node.parentNode.insertBefore(script, node);
  };

  loadImageToCanvas = (url, canvas) => {
    let ctx = canvas.getContext('2d');
    let img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0, img.width, img.height);
    };
    img.src = url;
  };

}

class Utils extends UtilsCustom{
  
  constructor(){
    super();
  }

  executeCode = () => {

    let orgImg = cv.imread('canvasInput');

    let gray = new cv.Mat();
    cv.cvtColor(orgImg, gray, cv.COLOR_RGB2GRAY, 0);
    
    let blurred = new cv.Mat(); 
    let ksize = new cv.Size(5, 5);
    cv.GaussianBlur(gray, blurred, ksize, 0, 0, cv.BORDER_DEFAULT);

    let edged = new cv.Mat();
    cv.Canny(blurred, edged, 75, 200, 3, false);

    let cnts = new cv.MatVector(); 
    let hierarchy = new cv.Mat();
    cv.findContours(edged, cnts, hierarchy, cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE);

    let margin;
    let largestArea = 0;
 
    //find the margin
    for (let i = 0; i < cnts.size(); i++) {
      if (cv.contourArea(cnts.get(i), false) > largestArea) {
        margin = cnts.get(i);
        largestArea = cv.contourArea(margin, false);
      }
    }

    //get margin to rotate & apply setting
    let rotatedRect = cv.minAreaRect(margin);  
    let angle = rotatedRect.angle;
    let dsize = new cv.Size(1500, 1500);
    let center = rotatedRect.center;
    let M = cv.getRotationMatrix2D(center, angle , 1);

    //rotate the image
    let rot = new cv.Mat(); 
    cv.warpAffine(edged, rot, M, dsize, cv.INTER_LINEAR, cv.BORDER_CONSTANT, new cv.Scalar());
    cv.warpAffine(gray, gray, M, dsize, cv.INTER_LINEAR, cv.BORDER_CONSTANT, new cv.Scalar());

    // get external contour
    let rpcnts = new cv.MatVector(); 
    let rphierarchy = new cv.Mat();
    cv.findContours(rot, rpcnts, rphierarchy, cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE);
    
    //find the largest area of contour for margin
    largestArea = 0;
    for (let i = 0; i < rpcnts.size(); i++) {
      if (cv.contourArea(rpcnts.get(i), false) > largestArea) {
        margin = rpcnts.get(i);
        largestArea = cv.contourArea(margin, false);
      }
    }

    //get image to crop & apply setting
    rotatedRect = cv.minAreaRect(margin);
    let mRect = cv.boundingRect( margin );
    let rect = new cv.Rect(mRect.x + 5, mRect.y + 5, mRect.width - 5, mRect.height - 5);
  
    //crop the image
    let warped = new cv.Mat();
    warped = gray.roi(rect);

    // image binary conversion
    let thresh = new cv.Mat();
    cv.threshold(warped, thresh, 0, 255, cv.THRESH_BINARY_INV | cv.THRESH_OTSU)[1];
    
    //use to find circle
    let cnts2 = new cv.MatVector(); 
    let hierarchy2 = new cv.Mat();
    cv.findContours(thresh, cnts2, hierarchy2, cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE);
    
    
    //use to find shaded circle
    let cntsShade = new cv.MatVector(); 
    let hierShade = new cv.Mat();
    cv.findContours(thresh, cntsShade, hierShade, cv.RETR_TREE, cv.CHAIN_APPROX_SIMPLE);
    // console.log(cntsShade.size())
    let shadedCnts = [];
    
    for (let j = 0; j < cntsShade.size(); j++) {
      // console.log( cv.minAreaRect(cntsShade.get(j)) )
      // console.log( hierShade.intPtr(0, j) )
      shadedCnts.push( hierShade.intPtr(0, j) );
    }

    let compRect = {
      rectQuest : {},
      rectShade : {}
    }

    for (let i = 0; i < cnts2.size(); i++) {
      
      let c = cnts2.get(i);
      compRect.rectQuest =  cv.boundingRect(c);
      
      let selPortion = {
        bRect : new Rect2D( cv.boundingRect(c) ),
        sIndx : -1,
        child : 0
      }

      let ar = selPortion.bRect.width / selPortion.bRect.height
      
      if ( (selPortion.bRect.width = 10) && (selPortion.bRect.height = 10) && (ar >= 0.9) && (ar <= 1.1) ){
        
        for (let j = 0; j < cntsShade.size(); j++) {
          
          let shdCnt = cntsShade.get(j);
          
          compRect.rectShade =  cv.boundingRect(shdCnt);

          if ( _.isEqual(compRect.rectQuest,  compRect.rectShade) ) {
            selPortion.sIndx = j;
            break;  
          }

        }

        shadeList.questionCnts.push(selPortion);

      }		
      
    }

    for (let i = 0; i < shadeList.questionCnts.length; i++ ){
      for (let j = 0; j < shadedCnts.length; j++){
        if ( shadedCnts[j][3] === -1) continue
        if ( shadedCnts[j][3] === shadeList.questionCnts[i].sIndx ) {
          shadeList.questionCnts[i].child += 1
        }
      }  
    }

    console.log( shadeList.questionCnts)

    shadeList.setOnDifferentShadeList();

    cv.imshow('canvasOutput', thresh);
  
    orgImg.delete(); 
    gray.delete();
    blurred.delete();
    edged.delete();
    cnts.delete();
    hierarchy.delete();
    warped.delete();

  };
  
}


export { Utils }
