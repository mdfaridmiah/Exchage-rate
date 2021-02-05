// UI Controller

let  UIController = (()=> {
    let DOMstrings = {

        fromCurrency: 'from_currency',
        fromAmount: 'from_ammount',
        toCurrency: 'to_currency',
        toAmount: 'to_ammount',
        rate: 'rate'
    };

    return{
        getDOMstrings: ()=> {
            return DOMstrings;
        },

        displayTotal: (amount, rate)=> {
            document.getElementById(DOMstrings.toAmount).value = (amount * rate).toFixed(2);
        },

        displayUnit: (from, to,rate)=> {
            document.getElementById(DOMstrings.rate).innerText = `1 ${from} = ${rate.toFixed(2)} ${to}`
        }
    };
})();


// App Controller

let  Controller = ( (UICtrl) =>{

    let setupEventListeners = () => {
        let DOM = UICtrl.getDOMstrings();
        document.getElementById(DOM.fromCurrency).addEventListener('change', calculate);

        document.getElementById(DOM.fromAmount).addEventListener('input', calculate);

        document.getElementById(DOM.toCurrency).addEventListener('change', calculate);

        document.getElementById(DOM.toAmount).addEventListener('input', calculate);

    };


    let calculate  = async () => {
        try{
            var DOM = UICtrl.getDOMstrings();
            const fromCurrency = document.getElementById(DOM.fromCurrency).value;
            const toCurrency = document.getElementById(DOM.toCurrency).value;

            // console.log("NULL OR NOT-NULL =>" + fromCurrency);
            // const response = await fetch(`https://api.exchangerate-api.com/v4/latest/USD`);

            const response = await fetch(`https://api.exchangerate-api.com/v4/latest/${fromCurrency}`);
            const data = await response.json();
            
            // const rate = data.rates["INR"];
            const rate = data.rates[toCurrency];
            let fromAmount =  document.getElementById(DOM.fromAmount).value;
            UICtrl.displayTotal(fromAmount, rate);
            UICtrl.displayUnit(fromCurrency, toCurrency, rate)

            // throw "Brocken";
        }
        catch(err){
            alert(err);
            // throw "Error something...";
            // return "something...";
        }
       
    }

    let addEl = (currencies, select_id)=>{
        let select  = document.getElementById(select_id);
        let DOM = UICtrl.getDOMstrings();
        for (let currency of currencies){
            let option = document.createElement('option');
            option.value = currency;
            option.innerHTML = currency;
            if(option.value === "MVR") continue;
            if(option.value === "USD" && select_id === DOM.fromCurrency)continue;
            if(option.value === "INR" && select_id === DOM.toCurrency)continue;
            select.appendChild(option);
        }

    }

    let createEl = async ()=>{
        try{
            let DOM = UICtrl.getDOMstrings();
            const response = await fetch(`https://api.exchangerate-api.com/v4/latest/USD`);
            const data = await response.json();
            const val = data.rates;
            currencies = Object.keys(val); // Array
            addEl(currencies, DOM.fromCurrency);
            addEl(currencies, DOM.toCurrency);

        }
        catch(err){
            alert(err);
        }
        
    }

    return {
        init: ()=> {
            console.log('Started...');
            createEl();
            calculate();
            setupEventListeners();
        }
    };
})(UIController);

Controller.init();