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
        console.log('Search fruit', rule);
    }

}