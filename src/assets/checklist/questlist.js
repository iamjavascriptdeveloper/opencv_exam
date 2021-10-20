import { answersheet } from "@/assets/checklist/answersheet.js";

const setShade = (item, i) => {
  let alreadyAdd = false;
  
  alreadyAdd = answersheet.defineShade(item)

}

class ShadeList {
  questionCnts = []

  setOnDifferentShadeList() {
    this.questionCnts.forEach(setShade);
  }

}

const shadeList = new ShadeList();

export {
  shadeList, 
  ShadeList 
}