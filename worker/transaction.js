const account = require('./account.js')
const beginTransaction = ()=>{};
const commitTransaction = ()=>{};
const rollbackTransaction = ()=>{};
class transaction{
    onTopup(item){
        const checkFraud = this.fraud(item);// second check fraud
        const checkRisk = this.risk(item);// second check risks (limits, accptance or other ...)
        if(checkFraud){
            item.error = 'Fraud error';
        }
        if(checkRisk){
            item.error = 'Risk error';
        }
        return this.do(item);
    }
    onWithdraw(item){
        const checkFraud = this.fraud(item);// second check fraud
        const checkRisk = this.risk(item);// second check risks (limits, accptance or other ...)
        if(checkFraud){
            item.error = 'Fraud error';
        }
        if(checkRisk){
            item.error = 'Risk error';
        }
        return this.do(item);
    }
    onTransfer(item){
        //on Trnsafer we do first withdraw from account & topup on second one
        let trx = this.onWithdraw({
            account_id: item.from_id,
            amount: item.amount
        })
        if(trx.error) return trx; // if error stop transaction
        trx = this.onTopup({
            account_id: item.to_id,
            amount: item.amount
        })
        return trx;
    }
    fraud(item){return false;}
    risk(item){ return false;}
    do(item){
        // save to database transaction for history and for reconsilation
        // onTopup from_account_id is correcpond account of merchant from what we get invoice
        // onWithdraw to_account_id is correcpond account of merchant what we make withdraw ...
        // onTransafer - from_account_id & to_account_id are corresponded by request
        beginTransaction(); // snapshot of current state in storage;
        try{
            const acc1 = new account(item.account_id || item.from_id);
            if( item.type == 'topup' ){
                acc1.change( Math.abs(item.amount) );
            }
            else if( item.type == 'withdraw' ){
                acc1.change( -Math.abs(item.amount) );
            }
            else if( item.type == 'transafer' ){
                acc1.change( -Math.abs(item.amount) );
                acc2 = new account(item.to_id);
                acc2.change( Math.abs(item.amount) );
            }
            item.status='success';
            item.response=item.request;
        }
        catch(e){
            item.status='failed';
            item.error=e;
            rollbackTransaction();
        }
        commitTransaction();
        return item;
    }
}

module.exports = transaction;
