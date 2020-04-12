import { Injectable } from '@angular/core';
@Injectable({
  providedIn: 'root'
})
export class CheckConditionService {
    constructor() { }

    checkCondition(condition, value) {
        return new Promise<any>( (resolve) => {
            let bool = true;
            if (condition.choice.type === 'number') {
                const valueDefault = Number(condition.choice.value);
                switch (condition.choice.operator) {
                  case '>':
                    if (!(value > valueDefault)) {
                        bool = false;
                        console.log(bool);
                    }
                    break;
                  case '>=':
                    if (!(value >= valueDefault)) {
                        bool = false;
                    }
                    break;
                  case '<':
                    if (!(value < valueDefault)) {
                        bool = false;
                    }
                    break;
                  case '<=':
                    if (!(value <= valueDefault)) {
                        bool = false;
                    }
                    break;
                  case '==':
                    if (!(value === valueDefault)) {
                        bool = false;
                    }
                    break;
                }
            } else if (condition.choice.type === 'string' || condition.choice.type === 'boolean') {
                console.log("COUCOU");
                console.log(value);
                console.log(condition.choice.value);
                console.log((value === condition.choice.value));
                if (!(value === condition.choice.value)) {
                    bool = false;
                }
            }
            console.log('ICI');
            console.log(bool);
            resolve(bool);
        });
      }

}
