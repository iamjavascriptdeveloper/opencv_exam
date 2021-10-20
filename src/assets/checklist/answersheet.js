import { Rect2D } from "@/assets/CAD2D/rect.js"

class AnswerSheet extends Rect2D{
    #corrects = [];
    #listSelection = []; // araray of array
    #question = [];
    #listString = ['A', 'B', 'C', 'D'];
    #answers = [];

    constructor(){
        super();
        this.setListSelection()
    }

    loadAnswers(){
        this.#answers = [
            'A',
            'A',
            'B',
            'D',
            'A',
            'A',
            'A',
            'A',
            'A',
            'A'
        ]   
    }

    choices(pt){

        for( let numbers of this.#listSelection){
            for ( let i in numbers){ 
                if ( numbers[i].pointInRect(pt) ){
                    return this.#listString[i];
                }
            }
        }
        
        return ''
    }

    defineShade( item ){
        const c = item.bRect.center;
        
        item.name = this.choices( c )
        this.#question.push(item);
       
        return item.name != ''  
    }

    getCheck(){
        return this.#corrects;
    }

    checkAnswer(){

        for( let element of this.#question){
            if (element.child <= 3 || element == '') continue;

            let found = false;
            for( let n in this.#listSelection){

                let numbers = this.#listSelection[ n ];

                for ( let i in numbers){ 
                    if ( numbers[i].pointInRect( element.bRect.center ) ){

                        if ( this.#answers[n] == this.#listString[i] ){
                            found = true;
                            this.#corrects.push({
                                number: Number(n) + 1,
                                answer: this.#listString[i]
                            })
                            break;
                        }
                        
                    }
                }

                if (found) break;
            }

        }

        return this    
        
    }

    setListSelection(){

        const left = 66.5;
        const top = 16.5;
        const width = 151;
        const height = 69;
        

        let y = top;
        for(let i = 1; i<=10; i++){

            let  item = []
            let x = left
            for (let j=1;j<=4;j++){

                item.push(
                    new Rect2D( 
                        {
                            x, 
                            y,
                            width, 
                            height
                    } )
                )

                x += width;
                
            }
            y += height; 

            this.#listSelection.push( item )
        }
    }

}

let answersheet = new AnswerSheet()

export {
    AnswerSheet,
    answersheet
}