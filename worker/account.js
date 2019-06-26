class account{
    constructor(id){
        this.id = id;
        this.getAllDataFromDBStorage();
        this.otb = 1000; // online transaction balance for cheching funds avaliable
        this.balance = 1000; // real confirmed balance. Changed only after reconsilation. Confirmation of each transaction
    }
    getAllDataFromDBStorage(){
        // getting data from storage (DB or else )
    }
    change(amount){
        if(this.otb < amount + this.otb){
            throw "Not enough balance";
        }
        this.otb+=amount;
    }
}

module.exports = account;
