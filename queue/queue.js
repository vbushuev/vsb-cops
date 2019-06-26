const uuid = require('uuid');
class queue{
    constructor(){
        this._queue = {};
        this._adapters = [];
    }
    put(item){
        const _id = this.generateUID();
        this._queue[_id]={
            id: _id,
            status: 'request',
            request: item,
            response: {},
            error:{}
        };
        this.event(this._queue[_id].request.type,this._queue[_id]); // need to check existings of type field but that's could be solved by message routing
        return this._queue[_id];
    }
    get(id){
        return this._queue[id] || {error:`Transaction #${id} not found`};
    }
    event(type,item){
        for(let i in this._adapters){
            const adapter = this._adapters[i];
            if(typeof(adapter[`on${this.UPCfirst(type)}`])=='function' ) {
                item = adapter[`on${this.UPCfirst(type)}`](item);
                // setting changes of item back to queue 
            }
        }
        // So what does that means - if adapter has method onTopup ( for exmple ) object will call that method;
    }
    use(adapter){
        // accept Adapters to work with queue. That method only for example. Queue could be external (like message-Q) so addapters will have own events handler to do thiers job
        this._adapters.push(adapter);
    }
    generateUID(){
        return uuid.v1();
    }
    UPCfirst(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
}

module.exports = queue;
