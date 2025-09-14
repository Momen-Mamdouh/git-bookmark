
// elementToAttachKeyIn.dataset._lastCacheKey = this._lastCachedKey;

export class CachingData{


    constructor(){
        this._cachedMap = new Map();
        this._lastCachedKey = ``;
    }



    createCacheKey(category, value){
        this._lastCachedKey = `${category}__${value}__Cached`;
        return this._lastCachedKey;  
    }
    getLastCacheKey(){
        return this._lastCachedKey;
    }
    updateCacheKey(newCacheKey){
        this._lastCachedKey = newCacheKey;
    }

    getAllKeys() { return Array.from(this._cachedMap.keys()); };
    getAllValues() { return Array.from(this._cachedMap.values()); };
    getDataByKey(dataKey){
        return this._cachedMap.get(dataKey) ?? null;
    }

    addDataInCachedMap( dataArr, urlLines){
        const cacheKey = this.getLastCacheKey(); 
        const entry = { dataArr, urlLines, timestamp: Date.now() };
        this._cachedMap.set(cacheKey, entry);
        return entry;
    }
    updateDataInCachedMapByKey(dataKey, dataArr, urlLines){
        if (this._cachedMap.has(dataKey)) this._cachedMap.set(dataKey, { dataArr, urlLines, timestamp: Date.now() });
    }

    isLastCacheKey(currentCacheKey){
        return  this._lastCachedKey === currentCacheKey;
    }

    removeDataByKey(dataKey){
        this._cachedMap.delete(dataKey);
    }
    clearCachedDataMap(){
        this._cachedMap.clear();
        this._lastCachedKey = "";
    }
    
    checkCacheChange(prevCache, currentData){
        for (let i = 0; i < prevCache.length; i++) {
            const prevObj = prevCache[i];
            const currObj = currentData[i];

            for (const key in prevObj) {
                if (Object.prototype.hasOwnProperty.call(prevObj, key)) {
                    if (prevObj[key] !== currObj[key]) {
                        return false;
                    }
                }
            }
        }

        return true; // all matched
    }

   
}

