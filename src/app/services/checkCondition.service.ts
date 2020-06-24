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
                    console.log(value);
                    console.log(valueDefault);
                    console.log(value <= valueDefault);
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
                if (!(value === condition.choice.value)) {
                    bool = false;
                }
            }
            resolve(bool);
        });
      }

}
