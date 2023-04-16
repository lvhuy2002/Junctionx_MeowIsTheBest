const toggleSwitch = document.getElementById("toggleSwitch");

const toggleSwitchState = localStorage.getItem("toggleSwitchState");
const tabStates = {};
if (toggleSwitchState === "on" || toggleSwitchState === undefined) {
    toggleSwitch.checked = true;
} 
if (toggleSwitchState === "off") {
    toggleSwitch.checked = false;
}
toggleSwitch.addEventListener("change", function() {
  if (toggleSwitch.checked) {
    // Nút switch đang  được bật
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        console.log(tabs)
        //console.log('haha')
        var currentTab = tabs[0];
        if (currentTab && currentTab.id) {
            chrome.tabs.sendMessage(currentTab.id,{ status: 4});
        }
    });
    
    localStorage.setItem("toggleSwitchState", "on");
  } else {
    // Nút switch đang được tắt
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        var currentTab = tabs[0];
        if (currentTab && currentTab.id) {
            chrome.tabs.sendMessage(currentTab.id, { status: 5});
        }
    });
    localStorage.setItem("toggleSwitchState", "off");
  }
});

// chrome.runtime.onMessage.addListener( async (message, sender, sendResponse) => {
//     if (message.type === 'get_state') {
//         await sendResponse({state: localStorage.getItem("toggleSwitchState")})
//     }
//     return true;
// });