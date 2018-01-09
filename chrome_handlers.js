var config = {
    omnibox_keyword: "gool_load"
};

chrome.contextMenus.create({
    title: "Copy current cookies to clipboard",
});

var copyToClipboard = function(text) {
    var backgroundPage = chrome.extension.getBackgroundPage();

    var clipboard = backgroundPage.document.getElementById("clipboard");
    clipboard.value = text;
    clipboard.select();

    backgroundPage.document.execCommand("Copy");
};

chrome.contextMenus.onClicked.addListener(function(info, tab) {
    var cookie_data = getAllCookies(info.pageUrl, function(cookie_data) {
        copyToClipboard(
            config.omnibox_keyword + " " + encode_cookie_object(cookie_data)
        );
    });
});

chrome.omnibox.onInputEntered.addListener(function(text) {
    var data = decode_cookie_string(text);
    if (data.url) {
        var url = loadCookies(data);

        chrome.tabs.create({
            url: url
        });
    }
});

var updateOmniboxSuggestion = function(text) {
    var description = "Load the cookies";
    if (text) {
        try {
            var cookie_data = decode_cookie_string(text);
            if (cookie_data && cookie_data.url) {
                description = "Load cookies and website at <url>"
                    + cookie_data.url + "</url>";
            }
        } catch (e) {
        }
    }
    chrome.omnibox.setDefaultSuggestion({description:description});
};

updateOmniboxSuggestion();
chrome.omnibox.onInputStarted.addListener(updateOmniboxSuggestion);
chrome.omnibox.onInputChanged.addListener(updateOmniboxSuggestion);

