export const getUrlSearch = (field, search) => {
  const url = search ? search.replace('?', '') : window.location.search.replace('?', '');
  const params = url.split('&');
  const item = params.filter((o) => o.match(`${field}=`) !== null);
  if (item.length) {
    return item[0].replace(`${field}=`, '');
  } else {
    return undefined;
  }
};

export function  setCookie(c_name,value,expiredays){
  let exdate=new Date()
  exdate.setDate(exdate.getDate()+expiredays)
  let expires=(expiredays===undefined) ? "" : ";expires="+exdate.toGMTString();
  document.cookie=c_name+ "=" +escape(value)+expires+";path=/";
}

export function getCookie(name){
  let arr;
  let reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
  if(arr=document.cookie.match(reg)){
    return unescape(arr[2]);
  }else{
    return "";
  }
}

export const clearCookie = () => {
  var keys = document.cookie.match(/[^ =;]+(?=\=)/g);
  if (keys) {
    for (var i = keys.length; i--; ) {
      document.cookie = keys[i] + '=0;path=/;expires=' + new Date(0).toUTCString(); //清除当前域名下的,例如：m.kevis.com
      document.cookie =
        keys[i] + '=0;path=/;domain=' + document.domain + ';expires=' + new Date(0).toUTCString(); //清除当前域名下的，例如 .m.kevis.com
      document.cookie = keys[i] + '=0;path=/;domain=kevis.com;expires=' + new Date(0).toUTCString(); //清除一级域名下的或指定的，例如 .kevis.com
    }
  }
  localStorage.removeItem('userId');
  localStorage.removeItem('userName');
  localStorage.removeItem('identitytoken');
};

export const getTime = () => {
  let show_day = new Array('星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六');
  let today = new Date();
  let year = today.getFullYear();
  let month = today.getMonth();
  let date = today.getDate();
  let day = today.getDay();
  let now_time = month + 1 + '月' + date + '日' + ' ' + show_day[day] + ' ';
  return now_time;
};

export const objToArr = (obj) => {
    const arr = [];
    for(let k in obj){
        arr.push({
            name: k,
            value: obj[k]
        })
    }
    return arr
}

export const arrToObj = (arr) => {
    const obj = {};
    arr.forEach(e => {
        obj[e.name] = e.value;
    });
    return obj
}
