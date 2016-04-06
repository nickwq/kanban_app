export default {
    get(k){
        try{
            return localStorage.getItem(k);
        }
        catch(e){
            return null;
        }
    },
    set(k, v){
        localStorage.setItem(k, JSON.stringify(v));
    }
}