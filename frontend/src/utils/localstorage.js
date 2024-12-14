export const setData = (props)=>{
    for (let key in props){
        localStorage.setData(key,props[key]);
    }
}
