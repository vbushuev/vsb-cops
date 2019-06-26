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
        item.status='success';
        item.response=item.request;
        return item;
    }
}

module.exports = transaction;
