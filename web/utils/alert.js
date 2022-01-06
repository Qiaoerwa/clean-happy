/*
 * @Description:
 * @Autor: fylih
 * @Date: 2021-05-11 10:47:28
 * @LastEditors: fylih
 * @LastEditTime: 2021-05-13 17:12:28
 */
var Alert = function (text) {
    var div = document.createElement("div");
    div.style.backgroundColor = " #22b9ff";
    div.style.color = " #fff";
    div.style.position = "fixed";
    div.style.zIndex = 9999999;
    div.style.width = "40%";
    div.style.height = "40px";
    div.style.top = " 10%";
    div.style.left = "50%";
    div.style.transform = "translateX(-50%)";
    div.style.lineHeight = " 40px";
    div.style.borderRadius = " 4px";
    div.style.fontSize = " 12px";
    div.style.textAlign = "center";
    div.style.padding = "0 30px";
    div.className = "animated  bounceInDown";
    div.innerHTML = text;
    document.getElementsByTagName("body")[0].appendChild(div);
    setTimeout(function () {
        document.getElementsByTagName("body")[0].removeChild(div);
    }, 3000);
}