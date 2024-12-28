export const setData = (props)=>{
    console.log(props);
    for (let key in props){
        localStorage.setData(key,props[key]);
    }
}
