import _foreach from 'lodash/forEach';

export default class Neiron {

    fruit = {};

    teach(fruit, rule){
        if(this.fruit[fruit] == undefined){
            this.fruit[fruit] = [];
        }
        this.fruit[fruit].push({
            factor: rule.factor,
            color: {
                red: rule.color.red,
                green: rule.color.green,
                blue: rule.color.blue,
            }
        })
    }

    search(rule){
        var candidate = {
            factor: 1000,
            color: 1000,
            name: '',
        };
        _foreach(this.fruit, (fruit, key)=>{
            _foreach(fruit, (value)=>{
                let _color = Math.abs(value.color.red - rule.color.red)
                    + Math.abs(value.color.green - rule.color.green)
                    + Math.abs(value.color.blue - rule.color.blue);
                if(candidate.factor > Math.abs(value.factor - rule.factor)
                    && candidate.color > _color){
                    candidate.factor = Math.abs(value.factor - rule.factor);
                    candidate.color = _color;
                    console.log(key, (Math.abs(value.factor - rule.factor)), _color);
                    candidate.name = key;
                }
            })
        });
        console.log(candidate);
        return candidate.name;
    }

}