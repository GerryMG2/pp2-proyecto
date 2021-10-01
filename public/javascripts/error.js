function showLog(log){
    alert(log);
}


function deleteE(id){
    if (window.confirm("¿Quieres borrar el error?")){
        window.location.replace(`/errlist/${id}`);
    }
}