import _foreach from 'lodash/forEach';

export default class Neiron {

    fruit = {};
    coeficent = {
        factor: 1,
        color: 2,
    };

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
        var candidates = {

        };
        _foreach(this.fruit, (fruit, key)=>{
            candidates[key] = [];
            _foreach(fruit, (value)=>{
                candidates[key].push({
                    factor: Math.abs(value.factor - rule.factor),
                    color:  Math.abs(value.color.red - rule.color.red)
                    + Math.abs(value.color.green - rule.color.green)
                    + Math.abs(value.color.blue - rule.color.blue)
                });
            })
        });
        var candidatesNew = {};
        _foreach(candidates,(fruit, key)=>{
            var result = {
                factor: 0,
                color: 0,
            };
            _foreach(fruit,(value)=>{
                let temp = {
                    factor: 100 - (value.factor * 100),
                    color: 100 - (value.color * 100 / 765),
                };
                if(result.factor < temp.factor){
                    result.factor = temp.factor;
                }
                if(result.color < temp.color){
                    result.color = temp.color;
                }
            });
            candidatesNew[key] = result;
        });
        var candidate = {
            value: 0,
            name: 'HZ',
        };
        console.log(candidatesNew);
        _foreach(candidatesNew, (value,key)=>{
            if(candidate.value < ((value.factor * this.coeficent.factor) + (value.color * this.coeficent.color))){
                candidate.value = ((value.factor * this.coeficent.factor) + (value.color * this.coeficent.color));
                candidate.name = key;
            }
        });
        console.log(candidate);
        return candidate.name;
    }

}