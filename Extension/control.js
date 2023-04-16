// Tạo một function để gửi href của các thẻ <a> tới background.js
var currentTab = -1;
var hrefList = [];
var isBlock = false;

// function sendLinksToBackground(links) {
//     const hrefs = Array.from(links).map(link => link.href);
//     chrome.runtime.sendMessage({ type: "ct", tabId: currentTab, hrefs });

// }
// function sendLinksToBackgroundStatic() {
//     const links = document.querySelectorAll('a');
//     const hrefs = Array.from(links).map(link => link.href);
//     chrome.runtime.sendMessage({ type: "ct", tabId: currentTab, hrefs });
// }

function hideNotification() {
    var alertBox = document.getElementsByClassName("alerturlphisingextentionalert1234");
    if (alertBox.length)  {
        alertBox[0].style.display = 'none'
    }
    
}

function displayNotification() {
    var alertBox = document.getElementsByClassName("alerturlphisingextentionalert1234");
    //console.log(alertBox);
    if (alertBox.length) {
        alertBox[0].style.display = 'block';
    }
}


function showNotification() {   
    var head = document.head;
    var link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css?family=Roboto';
    head.appendChild(link);

    var alertBox = document.createElement('div');
    var alertMessage = document.createElement('p');
    var alertMessage2 = document.createElement('p');
    var alertButton = document.createElement('button');
    var alertButton2 = document.createElement('button');
    var buttonBox = document.createElement('div');
    

    alertBox.className = 'alerturlphisingextentionalert1234';
    alertBox.style.backgroundColor = '#F97440'
    alertBox.style.border = '0px';
    alertBox.style.padding = '0px';
    alertBox.style.position = 'fixed';
    alertBox.style.top = '0px';
    alertBox.style.left = '50%';
    alertBox.style.padding = '10px'
    alertBox.style.transform = 'translateX(-50%)';
    alertBox.style.fontFamily = 'Roboto, sans-serif';
    alertBox.style.zIndex = '99999';


    alertMessage.textContent = 'CẢNH BÁO: ĐÂY CÓ THỂ LÀ TRANG WEB LỪA ĐẢO';
    alertMessage.style.color = 'white';
    alertMessage.style.fontWeight = 'bold';
    alertMessage.style.fontSize = '24px';
    alertMessage.style.textAlign = 'center';
    alertMessage.style.marginTop = '25px';
    alertMessage.style.marginBottom = '2px'; // giảm khoảng cách chiều dọc

    alertMessage2.textContent = 'Cẩn thận với trang web này!';
    alertMessage2.style.color = 'white';
    alertMessage2.style.fontFamily = 'Roboto';
    alertMessage2.style.fontWeight = 'lighter';
    alertMessage2.style.fontSize = '20px';
    alertMessage2.style.textAlign = 'center';
    alertMessage2.style.paddingTop = '10px';
    alertMessage2.style.marginTop = '2px';
    alertMessage2.style.marginBottom = '22px'; 

    buttonBox.style.display = "flex";
    buttonBox.style.justifyContent  = "center";
    buttonBox.style.marginTop = "10px"

    alertButton.textContent = 'Quay lại';
    alertButton.style.display = 'block';
    alertButton.style.width = '110px';
    alertButton.style.height = '50px';
    alertButton.style.margin = '5px auto 0';
    alertButton.style.marginLeft = '100px';
    alertButton.style.color = 'white';
    alertButton.style.padding = '10px 20px';
    alertButton.style.backgroundColor = '#087D01';
    alertButton.style.border = 'none';
    alertButton.style.borderRadius = '5px';
    alertButton.style.fontSize = '16px';
    alertButton.style.cursor = 'pointer';
    //alertButton.style.webkitTextStroke = '0.5px #000';
    alertButton.onclick = function () {
        chrome.runtime.sendMessage({ type: "back_page"});
    }
    alertButton.onmouseover = function () {
        alertButton.style.backgroundColor = '#0BA801'
    }
    alertButton.onmouseout = function () {
        alertButton.style.backgroundColor = '#087D01'
    }


    alertButton2.textContent = 'Đóng';
    alertButton2.style.display = 'block';
    alertButton2.style.width = '110px';
    alertButton2.style.height = '50px';
    alertButton2.style.margin = '5px auto 0';
    alertButton2.style.marginRight = '100px';
    alertButton2.style.color = 'white';
    alertButton2.style.padding = '10px 20px';
    alertButton2.style.backgroundColor = '#DE0000';
    alertButton2.style.border = 'none';
    alertButton2.style.borderRadius = '5px';
    alertButton2.style.fontSize = '16px';
    alertButton2.style.cursor = 'pointer';
    alertButton2.onclick = function () {
        alertBox.style.display = 'none';
    }
    alertButton2.onmouseover = function () {
        alertButton2.style.backgroundColor = '#FF0000'
    }
    alertButton2.onmouseout = function () {
        alertButton2.style.backgroundColor = '#DE0000'
    }

    alertBox.appendChild(alertMessage);
    alertBox.appendChild(alertMessage2);
    buttonBox.appendChild(alertButton);
    buttonBox.appendChild(alertButton2);
    alertBox.appendChild(buttonBox);
    document.body.appendChild(alertBox);
}

// function highLightURLPhishing(hrefs) {
//     // Lấy tất cả các thẻ <a> trên trang web
//     var links = document.getElementsByTagName("a");
//     for (var i = 0; i < links.length; i++) {
//       // kiểm tra nếu href của thẻ <a> là một phần tử của mảng hrefs
//       if (hrefs.indexOf(links[i].getAttribute("href")) > -1) {
//         // đổi nền vàng cho thẻ <a>
//         links[i].style.setProperty('background-color', 'yellow', 'important');
//       }
//     }
// }


// // Tạo một function để theo dõi các thay đổi trong DOM và lấy ra các thẻ <a> mới được thêm vào trang web
// function observeDOMChanges() {
//     const targetNode = document.querySelector('body');
//     // Tạo một MutationObserver để theo dõi các thay đổi trong DOM
//     const observer = new MutationObserver((mutationsList, observer) => {
//         for (let mutation of mutationsList) {
//             if (mutation.type === 'childList') {
//                 // Nếu có các node con mới được thêm vào targetNode
//                 if (mutation.addedNodes.length > 0 && mutation.addedNodes[0] instanceof Element) {
//                     // Lấy ra các thẻ <a> mới được thêm vào và gửi href của chúng tới background.js
//                     const newLinks = mutation.addedNodes[0]?.querySelectorAll('a');
//                     if (newLinks.length) {
//                         //highLightURLPhishing(hrefs)
//                         sendLinksToBackground(newLinks);
//                     }
//                 }
//             }
//         }
//     });
//     // Bắt đầu theo dõi các thay đổi trong DOM
//     const config = { childList: true, subtree: true };
//     observer.observe(targetNode, config);
// }



chrome.runtime.onMessage.addListener((obj, sender, sendResponse) => {
    if (obj.status === 1) {
        //currentTab = obj.tabId
        if (obj.checking) {
            showNotification();
        }
        //console.log(currentTab, url);
        //observeDOMChanges();
        //sendLinksToBackgroundStatic()
        
    }
    if (obj.status === 2) {
        //hrefList = obj.hrefPhishingList.filter(item => item.tabId === currentTab).map(item => item.hrefs)[0];
        //console.log(hrefs);
        //console.log(hrefList.includes("https://www.abc.net.au/radio/programs/conversations/maggie-dent-girlhood-raising-girls-modern-challenges-rpt/102173714"))
        //highLightURLPhishing(hrefList);
    }
    // if (obj.status === 3) {
    //     currentTab = obj.tabId
    //     console.log(currentTab);
    // }
    if (obj.status === 4) {
        displayNotification()
        isBlock = true;
    }
    if (obj.status === 5) {
        hideNotification()
        isBlock = false;
    }
});