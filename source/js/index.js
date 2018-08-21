"use strict";
(function(){
    function $(id) {
        return document.getElementById(id);
    }

    var curNum;

    window.onload = function() {
        curNum = 0;
        $("add").onclick = addLink;
        $("generate").onclick = generateQR;
        $("save").onclick = download;
        $("once").onclick = function() {
            $("once-enter").classList.remove("hidden");
            $("single-enter").classList.add("hidden");
            $("mode").classList.add("hidden");
        }
        $("viaFile").onclick = function() {
            $("import-via-file").classList.remove("hidden");
            $("single-enter").classList.add("hidden");
            $("mode").classList.add("hidden");
        }
        $("import-once").onclick = readInLinks;
        $("file").onchange = readInFiles;
        $("import-file").onclick = back;
        var goBack = document.querySelectorAll(".back");
        for (var i = 0; i < goBack.length; i++) {
            goBack[i].onclick = back;
        }
    };

    function addLink() {
        if (curNum == 0) {
            $("null").classList.add("hidden");
        }
        curNum++;

        var newItem = document.createElement("div");
        newItem.classList.add("link-item");
        newItem.id = "item" + curNum;

        var newLink = document.createElement("p");

        var newInput = document.createElement("input");
        newInput.id = "input" + curNum;
        newLink.innerHTML = "网址 " + curNum + ": ";

        var newQR = document.createElement("div");
        newQR.classList.add("qr");
        newQR.id = "qrcode" + curNum;

        var newDownloadLink = document.createElement("a");
        newDownloadLink.id = "download-link" + curNum;
        
        newLink.appendChild(newInput);
        newItem.appendChild(newLink);
        newItem.appendChild(newQR);
        newItem.appendChild(newDownloadLink);
        $("links").appendChild(newItem);
    }

    function generateQR() {
        var allQR = document.querySelectorAll(".qr");
        for (var i = 0; i < allQR.length; i++) {
            allQR[i].innerHTML = "";
        }
        for (var i = 1; i <= curNum; i++) {
            var txt = $("input" + i).value;
            var curQR = $("qrcode" + i);
            curQR.onclick = downloadSingle;
            if (txt) {
                var qrcode = new QRCode(curQR, {
                    text: txt,
                    width: 128, //生成的二维码的宽度
                    height: 128, //生成的二维码的高度
                    colorDark : "#000000", // 生成的二维码的深色部分
                    colorLight : "#ffffff", //生成二维码的浅色部分
                    correctLevel : QRCode.CorrectLevel.H
                });
            }
        }
    }

    function download() {
        if (!$("links").hasChildNodes()) {
            alert("尚未添加任何网址");
            return;
        }
        var zip = new JSZip();
        zip.file("README.txt", "二维码打包生成");
        for (var i = 1; i <= curNum; i++) {
            if ($("input" + i).value) {
                var img = $("qrcode" + i).getElementsByTagName("img")[0];
                var canvas = document.createElement("canvas");
                canvas.width = 128;
                canvas.height = 128;
                canvas.getContext("2d").drawImage(img, 0, 0);
                var url = canvas.toDataURL("img/png").split(",")[1];
                zip.file(i + ".png", url, {base64: true});
            }
        }
        zip.generateAsync({type:"blob"}).then(function(content) {
            saveAs(content, "QRCode.zip");
        });
    }

    function downloadSingle() {
        var img = this.getElementsByTagName("img")[0];
        var i = this.id.charAt(this.id.length-1);
        var canvas = document.createElement("canvas");
        canvas.width = 128;
        canvas.height = 128;
        canvas.getContext("2d").drawImage(img, 0, 0);
        var url = canvas.toDataURL("img/png");
        var downLink = $("download-link" + i);
        downLink.setAttribute("href", url);
        downLink.setAttribute("download", "QRCode.png");
        downLink.click();
    }

    function readInLinks() {
        var links = $("once-text-box").value;
        links = links.split("\n");
        for (var i = 1; i <= links.length; i++) {
            addLink();
            $("input" + curNum).value = links[i-1];
        }
        back();
    }

    function readInFiles() {
        var f = $("file").files[0];
        var reader = new FileReader();
        reader.readAsText(f);
        reader.onload = function(e) {
            var links = e.target.result.split("\n");
            for (var i = 1; i <= links.length; i++) {
                addLink();
                $("input" + curNum).value = links[i-1];
            }
        }
    }

    function back() {
        $("import-via-file").classList.add("hidden");
        $("once-enter").classList.add("hidden");
        $("single-enter").classList.remove("hidden");
        $("mode").classList.remove("hidden");
    }
})();