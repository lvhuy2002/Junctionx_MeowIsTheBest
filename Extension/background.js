var listURLEachTab = [];
var listURLPhishingInEach = [];

function addToListURL(arr, obj) {
    const objMap = arr.reduce((map, item) => {
        map[item.tabId] = item;
        return map;
    }, {});

    if (obj.tabId in objMap) {
        objMap[obj.tabId].hrefs.push(...obj.hrefs);
    } else {
        arr.push(obj);
        objMap[obj.tabId] = obj;
    }

    return arr;
}

// remove URL duplicate
function removeDuplicateStrings(arr) {
    return [...new Set(arr.filter(Boolean))];
}

// remove URL duplicate in a tab
function removeDuplicateStringsInATab(arr, tabId, hrefs) {
    const targetItem = arr.find(item => item.tabId === tabId);
    if (targetItem) {
        const targetSet = new Set(targetItem.hrefs);
        hrefs = hrefs.filter(item => !targetSet.has(item));
    }
    return hrefs;
}

function removeURLByTabId(arr, tabId) {
    for (let i = 0; i < arr.length; i++) {
        if (arr[i].tabId === tabId) {
            arr.splice(i, 1);
            i--;
        }
    }
    return arr;
}

function removeURLWhenReloadTab(listURLEachTab, tabId) {
    const targetIndex = listURLEachTab.findIndex(item => item.tabId === tabId);
    if (targetIndex > -1) {
        listURLEachTab[targetIndex].hrefs = [];
    }
    return listURLEachTab;
}

function removeURLSafe(arr) {
    const filteredArr = arr.filter(item => item.check); // Lọc các phần tử có check = true
    const hrefOnlyArr = filteredArr.map(item => item.href); // Lấy ra giá trị href
    return hrefOnlyArr;
}

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
    listURLEachTab = removeURLWhenReloadTab(listURLEachTab, tabId);
    listURLPhishingInEach = removeURLWhenReloadTab(listURLPhishingInEach, tabId);
    if (changeInfo.status === "complete") {
        //console.log(tab.url);
        var result = await CallAPIOneURL(tab.url);
        chrome.tabs.sendMessage(tabId, {
            status: 1,
            tabId: tabId,
            url: tab.url,
            checking: result
        });
    }
});

chrome.tabs.onRemoved.addListener((tabId, removeInfo) => {
    listURLEachTab = removeURLByTabId(listURLEachTab, tabId)
    listURLPhishingInEach = removeURLByTabId(listURLEachTab, tabId)
});

chrome.tabs.onActivated.addListener(activeInfo => {
    chrome.tabs.sendMessage(activeInfo.tabId, {
        status: 3,
        tabId: activeInfo.tabId
    })
});

chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {

    //const { type, tabId, hrefs } = message;
    //console.log(tabId)
    // if (type === 'ct') {
    //     // refactor hrefs
    //     var hrefsNoDup = removeDuplicateStrings(hrefs)
    //     hrefsNoDup = removeDuplicateStringsInATab(listURLEachTab, tabId, hrefsNoDup);
    //     if (hrefsNoDup.length > 0) {
    //         // call api
    //         //var result = await CallAPI(hrefsNoDup)
    //         listURLEachTab = addToListURL(listURLEachTab, { tabId: tabId, hrefs: hrefsNoDup })
    //         listURLPhishingInEach = addToListURL(listURLPhishingInEach, { tabId: tabId, hrefs: result});
    //         //send mess to show in web
    //         chrome.tabs.sendMessage(tabId, {
    //             status: 2,
    //             hrefPhishingList: listURLPhishingInEach
    //         });
    //     }
    // }
    if (message.type === 'back_page') {
        chrome.tabs.goBack();
    }
});

// fetch('http://52.140.197.200:8080/order/', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//                 'Access-Control-Allow-Origin':'*'
//             },
//             body: JSON.stringify(data)
//         })
//             .then(res => res.json())
//             .then(post => setSave(post))
//             .catch(err => alert(err))

// async function CallAPI(hrefList) {
//     try {
//         const urls = hrefList;
//         const a = [];
//         const response = await fetch('http://127.0.0.1:5000/route', {
//             method: 'GET',
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//             body: JSON.stringify({urls})
//         });
//         const data = await response.json();
//         console.log(removeURLSafe(data.prediction))
//         return removeURLSafe(data.prediction);
//     } catch {
//         console.error(error);
//         return false;
//     } 

// }

async function CallAPIOneURL(href) {
    try {
      const response = await fetch('http://127.0.0.1:5000/predict?url=' + href);
      const data = await response.json();
      return parseInt(data.prediction);
    } catch (error) {
      console.error(error);
      return false;
    }
}