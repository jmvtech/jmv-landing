var CARTHIKE_ENV = "prod";

var currentScript = {
  src: `${window.location.href}?shop=${window.Shopify.shop}`,
};

var chConfig = null;

var CARTHIKE_SERVER_URL = "http://localhost:3333";
if (CARTHIKE_ENV === "dev") {
  CARTHIKE_SERVER_URL = "http://localhost:3333";
} else if (CARTHIKE_ENV === "staging") {
  CARTHIKE_SERVER_URL = "https://staging.carthike.com";
} else if (CARTHIKE_ENV === "prod") {
  CARTHIKE_SERVER_URL = "https://whatsapp.carthike.com";
}

function getParameterByName(name, url) {
  if (!url) url = window.location.href;
  name = name.replace(/[\[\]]/g, "\\$&");
  var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
    results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return "";
  return decodeURIComponent(results[2].replace(/\+/g, " "));
}

function carthike_injectCss(css) {
  /** @type {Element} */
  var style = document.createElement("style");
  /** @type {string} */
  style.type = "text/css";
  /** @type {string} */
  style.rel = "stylesheet";
  style.media = "all";
  try {
    /** @type {string} */
    style.styleSheet.cssText = css;
  } catch (t) {}
  try {
    /** @type {string} */
    style.innerHTML = css;
  } catch (t) {}
  document.getElementsByTagName("head")[0].appendChild(style);
}

function carthike_getCss() {
  return ".carthike-mobile-messenger-active {overflow: hidden;height: 100%;width: 100%;position: fixed;}";
}

carthike_injectCss(carthike_getCss());

var oc_isMobile = null;

var OC_DOM = new (function () {
  var IS_READY = false;
  var CALLBACKS = [];
  var SELF = this;

  SELF.ready = function (callback) {
    //check to see if we're already finished
    if (IS_READY === true && typeof callback === "function") {
      callback();
      return;
    }

    //else, add this callback to the queue
    CALLBACKS.push(callback);
  };
  var addEvent = function (event, obj, func) {
    if (window.addEventListener) {
      obj.addEventListener(event, func, false);
    } else if (document.attachEvent) {
      obj.attachEvent("on" + event, func);
    }
  };
  var doScrollCheck = function () {
    //check to see if the callbacks have been fired already
    if (IS_READY === true) {
      return;
    }

    //now try the scrolling check
    try {
      document.documentElement.doScroll("left");
    } catch (error) {
      setTimeout(doScrollCheck, 1);
      return;
    }

    //there were no errors with the scroll check and the callbacks have not yet fired, so fire them now
    fireCallbacks();
  };
  var fireCallbacks = function () {
    //check to make sure these fallbacks have not been fired already
    if (IS_READY === true) {
      return;
    }

    //loop through the callbacks and fire each one
    var callback = false;
    for (var i = 0, len = CALLBACKS.length; i < len; i++) {
      callback = CALLBACKS[i];
      if (typeof callback === "function") {
        callback();
      }
    }

    //now set a flag to indicate that callbacks have already been fired
    IS_READY = true;
  };
  var listenForDocumentReady = function () {
    //check the document readystate
    if (document.readyState === "complete") {
      return fireCallbacks();
    }

    //begin binding events based on the current browser
    if (document.addEventListener) {
      addEvent("DOMContentLoaded", document, fireCallbacks);
      addEvent("load", window, fireCallbacks);
    } else if (document.attachEvent) {
      addEvent("load", window, fireCallbacks);
      addEvent("readystatechange", document, fireCallbacks);

      //check for the scroll stuff
      if (document.documentElement.doScroll && window.frameset === null) {
        doScrollCheck();
      }
    }
  };

  //since we have the function declared, start listening
  listenForDocumentReady();
})();

function ocAppendScript(src) {
  var n = document.createElement("script");
  return (n.type = "text/javascript"), (n.charset = "utf-8"), (n.src = src), n;
}

function getCarthikeConfig(shop) {
  let url = `${CARTHIKE_SERVER_URL}/api/chat/public/config?shop=${shop}`;
  if (
    window.Shopify &&
    typeof window.Shopify.AdminBarInjector !== "undefined"
  ) {
    url = `${url}&admin=true`;
  }
  return fetch(url).then((response) => {
    return response.json();
  });
}

function processCarthikeConfig(config) {
  const element = document.getElementById("carthike-chat-wrapper");
  if (element) {
    console.log("script already installed ignoring current script");
    return;
  }
  if (config && config.isEnabled) {
    renderChatButton(config);
    // renderWidget(config);
  }
  if (config && config.shareButton.isEnabled) {
    renderShareButton(config);
  }
}

function getCarthikeChatButtonCss(config) {
  return `
      :root { --carthike-button-background-color:
        ${config.colors.buttonBackgroundColor};
         --carthike-button-text-color:
        ${config.colors.buttonTextColor}; 
        --carthike-button-icon-color:
        ${config.colors.buttonIconColor} };
        --carthike-share-button-background-color:
        ${config.shareButton.colors.buttonBackgroundColor} };
        --carthike-share-button-text-color:
        ${config.shareButton.colors.buttonTextColor} };
        --carthike-share-button-icon-color:
        ${config.shareButton.colors.buttonIconColor} };
      
    
  #carthike-chat-wrapper{
    max-width: 128px;
  }
  #carthike-chat-button-container.right{
    position: fixed;
    bottom: ${config.dimensions.bottomPosition}px;
    right: ${config.dimensions.rightPosition}px;
    z-index: 1000000;
  }
  #carthike-chat-button-container.left{
    position: fixed;
    bottom: ${config.dimensions.bottomPosition}px;
    left: ${config.dimensions.leftPosition}px;
    z-index: 1000000;
  }

  
  #carthike-chat-button-container .whatsappbutton{  
    
    border-radius: 6px;
    background-color: var(--carthike-button-background-color);
    color: var(--carthike-button-text-color);
    cursor: pointer;
    font-size: ${config.dimensions.buttonTextFontSize}px;
    font-weight: 600;
    display: inline-flex;
    align-items: center;
    padding-left: 1rem;
    padding-right: 1rem;
    padding-top: 0.5rem;
    padding-bottom: 0.5rem;
    border:0
  }
  #carthike-chat-button-container .whatsappbutton svg {
    fill: var(--carthike-button-icon-color);
    stroke:none;
  }

  #carthike-chat-button-container .whatsappbutton svg{  
  width:${config.dimensions.iconSize}px;
  margin-left:-0.25rem;
  margin-right:0.5rem;
  height:${config.dimensions.iconSize}px;
  }
  #carthike-chat-button-container .whatsappbutton.buttonWithIcon {
    border-radius: 50%;
  
    padding: 12px 12px;
  }
  #carthike-chat-button-container .whatsappbutton.buttonWithIcon svg {
    margin: 0;
  }
  
  
  
    
    #carthike-container .carthike-messenger-frame {
        z-index: 2147483000!important;
        position: fixed!important;
        bottom: 20px;
        right: 20px;
        height: calc(100% - 20px - 20px);
        width: 370px;
        max-height: 590px!important;
        -webkit-box-shadow: 0 5px 40px rgba(0,0,0,.16)!important;
        box-shadow: 0 5px 40px rgba(0,0,0,.16)!important;
        border-radius: 8px!important;
        overflow: hidden!important;
        opacity: 1!important;
    }
    @media screen and (max-width: 767px){
      #carthike-chat-button-container .whatsappbutton{
        display:${config.mobile.isEnabled ? "inline-flex" : "none"};
      }
      #carthike-chat-button-container.right{
        position: fixed;
        bottom: ${config.mobile.dimensions.bottomPosition}px;
        right: ${config.mobile.dimensions.rightPosition}px;
        z-index: 1000000;
      }
      #carthike-chat-button-container.left{
        position: fixed;
        bottom: ${config.mobile.dimensions.bottomPosition}px;
        left: ${config.mobile.dimensions.leftPosition}px;
        z-index: 1000000;
      }
      #carthike-chat-button-container .whatsappbutton svg{  
        width:${config.mobile.dimensions.iconSize}px;
        margin-left:-0.25rem;
        margin-right:0.5rem;
        height:${config.mobile.dimensions.iconSize}px;
        }
        #carthike-chat-button-container .whatsappbutton{
          font-size: ${config.mobile.dimensions.buttonTextFontSize}px;
        }

    }
      `;
}

function getCarthikeShareButtonCss(config) {
  return `
      :root { 
        --carthike-share-button-background-color:
        ${config.shareButton.colors.buttonBackgroundColor};
        --carthike-share-button-text-color:
        ${config.shareButton.colors.buttonTextColor};
        --carthike-share-button-icon-color:
        ${config.shareButton.colors.buttonIconColor} };
      
    
  #carthike-share-wrapper{
    max-width: 128px;
  }
  #carthike-share-button-container{
    max-width: 128px;
  }
  #carthike-share-button-container.right{
    position: fixed;
    bottom: 50%;
    right: 0;
    z-index: 1000000;
  }
  #carthike-share-button-container.left{
    position: fixed;
    bottom: 50%;
    left: 0px;
    z-index: 1000000;
    
  }

  
  #carthike-share-button-container .whatsappsharebutton{  
    background-color: var(--carthike-share-button-background-color);
    color: var(--carthike-share-button-text-color);
    display:flex;
    cursor: pointer;
    flex-direction:column-reverse;
    font-size: 14px;
    font-weight: 500;
    display: inline-flex;
    align-items: center;
    padding-left: 0.5rem;
    padding-right: 0.5rem;
    padding-top: 0.5rem;
    padding-bottom: 0.5rem;
    border:0
  }
  #carthike-share-button-container.right .whatsappsharebutton {
    border-radius: unset !important;
  border-top-left-radius: 6px !important;
    border-bottom-left-radius: 6px !important;
  }
  #carthike-share-button-container.left .whatsappsharebutton {
    border-radius: unset !important;
    border-top-right-radius: 6px !important;
      border-bottom-right-radius: 6px !important;
    }

  #carthike-share-button-container .whatsappsharebutton span{
    writing-mode: tb;
    transform: rotate(-180deg);
    text-transform: capitalize;
  }
  

  #carthike-share-button-container .whatsappsharebutton svg {
    fill: var(--carthike-share-button-icon-color);
  }

  #carthike-share-button-container .whatsappsharebutton svg{  
   width:16px;
  margin-left:-0.25rem;
  margin-top:0.5rem;
  height:16px;
  }
  #carthike-share-button-container .whatsappsharebutton.buttonWithIcon {
    border-radius: 50%;
  
    padding: 12px 12px;
  }
  #carthike-share-button-container .whatsappsharebutton.buttonWithIcon svg {
    margin: 0;
  }
  
  `;
}

function getWelcomeMessageCss(config) {
  return `
  #carthike-welcome-message-container{
    display: flex;
    opacity:0;
    -webkit-transition: all 800ms ease-in-out;
  }
  #carthike-welcome-message-container .welcome-message-button{
    box-shadow:0px 0px 5px 0px #d3d3d3;
    padding-left: 0.5rem;
    padding-right: 0.5rem;
    padding-top: 0.5rem;
    padding-bottom: 0.5rem;
    display:flex;
    border-radius: 0.375rem;
    font-size: 16px;
    background-color: rgb(255, 255, 255);
    position:relative;
    color: #374151;
    cursor:pointer;
    
    
  }
  #carthike-welcome-message-container .welcome-close-button-wrapper{
    top: -8px;
    right: -5px;
    position: absolute;
    width: 16px;
    height: 16px;
    cursor: pointer;
    border-radius: 9999px;
    border: 1px solid #9fa6b2;
    background-color: #ffffff;
  }
  #carthike-welcome-message-container .welcome-close-button-wrapper svg{
    stroke: currentColor;
    color: #9fa6b2;
  }
  #carthike-welcome-message-container.right{
    position: fixed;
    bottom:40px;
    right: 16px;
    z-index: 1000000;
  }
  #carthike-welcome-message-container.left{
    position: fixed;
    bottom: 64px;
    left: 16px;
    z-index: 1000000;
  }
  #carthike-welcome-message-container.animate-card{
    opacity:1;
    bottom: calc(${config.dimensions.bottomPosition}px + 48px);
  }
  @media screen and (max-width: 767px){
    #carthike-welcome-message-container.animate-card{
      opacity:1;
      bottom: calc(${config.mobile.dimensions.bottomPosition}px + 48px);
    } 
  }

  
  `;
}

function getChatWidgetCSS(config) {
  return `
  :root { 
    --carthike-widget-header-background-color:
    ${config.colors.widgetHeaderColor};
    --carthike-widget-header-text-color:
    ${config.colors.widgetHeaderTextColor};
  }

  #carthike-chat-widget{
    box-shadow: 0 0 30px rgb(0 0 0 / 30%);
    background: #fff;
    overflow: hidden;
    width: 350px;
    font-family: inherit;
    font-size: 14px;
    line-height: 1.4;
    bottom: 0px;
    display: block;
    z-index:99999999;
    border-radius:8px;
    -webkit-transition: all 100ms ease-in-out;
    opacity:0;
  }
  
  #carthike-chat-widget.right{
    right: 20px;
    position:fixed;
  }
  #carthike-chat-widget.left{
    left: 20px;
    position:fixed;
  }
  #carthike-chat-widget .chat-widget-header{
    color: var(--carthike-widget-header-text-color);
    padding: 24px;
    background-color: var(--carthike-widget-header-background-color);
  }
  #carthike-chat-widget .chat-widget-close-btn{
    position:absolute;
    right:12px;
    cursor:pointer;
  }
  #carthike-chat-widget .chat-widget-title{
    font-family: inherit;
    font-style: normal;
    font-weight: 300;
    font-size: 28px;
    line-height: 100%;
    text-align: left;
  }
  #carthike-chat-widget .chat-widget-description{
    margin-top: 12px;
    font-family: inherit;
    font-style: normal;
    font-weight: 300;
    font-size: 16px;
    
    text-align: left;
  }
  #carthike-chat-widget .chat-cont{
    padding: 0;
    background: #ffffff;
    height: 400px;
    overflow-y: auto;
  }
  #carthike-chat-widget .chat-list-cont{
    font-size: 13px;
    padding: 8px 8px;
  overflow: hidden;
  border-bottom: 1px solid #F0F0F0;
  background-color: lightgrey;
  display: flex;
  background: #FFF;
  cursor: pointer;
  
  }
  #carthike-chat-widget .chat-user-avatar{
    
  display: inline-block;
  vertical-align: middle;
  margin-right: 5px;
  overflow: hidden;
  right: 10px;
  border-radius: 60px;
  
  }
  

  #carthike-chat-widget .chat-user-meta{
    display: inline-block;
  vertical-align: middle;
  line-height: 1;
  color: #000;
  font-size: 14px;
  margin-top: 2px;
  text-align: left;
  flex: 1;
  padding-left: 6px;
  }
  #carthike-chat-widget .chat-user-name{
    display: block;
    font-size: 18px;
    font-weight: 300;
    margin-block-start: 0.3em;
    margin-block-end: 0.4em;
   text-transform:capitalize; 
  }
  #carthike-chat-widget .chat-user-desc{
    display: block;
    font-weight: normal;
    margin: 0;
    padding: 0;
    line-height: 1;
    color: #555555cc;
    text-transform:capitalize; 
    
  }
  @media screen and (max-width: 767px){
    #carthike-chat-widget{
      right: 0px !important;
    width: 100%;
    height: 100%;
    bottom: 0px !important;

    }
  }
  #carthike-chat-widget.animate-widget{
    opacity:1;
    bottom: 20px;
  }
  
  `;
}

function getWhatsappButtonSVG() {
  return ` <svg
  xmlns="http://www.w3.org/2000/svg"
  width="16"
  height="16.074"
  viewBox="0 0 16 16.074"
>
  <g
    id="Group_63773"
    data-name="Group 63773"
    transform="translate(-426.525 -322.416)"
  >
    <path
      id="Path_12957"
      d="M537.461 442.133a2.6 2.6 0 0 0 .792.121 3.292 3.292 0 0 0 .491-.039 2.106 2.106 0 0 0 1.41-1 1.658 1.658 0 0 0 .1-1.026.694.694 0 0 0-.316-.22l-.105-.052c-.138-.069-1.153-.57-1.349-.642a.417.417 0 0 0-.573.141c-.119.179-.469.594-.611.756-.063.072-.114.11-.289.022-.035-.017-.079-.036-.135-.061a4.916 4.916 0 0 1-1.414-.894 5.756 5.756 0 0 1-1.066-1.328c-.069-.119-.031-.164.068-.263.063-.062.133-.148.2-.231l.1-.118a1.215 1.215 0 0 0 .184-.294l.027-.055a.471.471 0 0 0-.016-.443c-.031-.062-.227-.539-.384-.922l-.216-.524c-.156-.375-.341-.406-.5-.4h-.038c-.125-.006-.269-.007-.381-.007a.826.826 0 0 0-.6.281l-.037.04a2.29 2.29 0 0 0-.677 1.668 3.843 3.843 0 0 0 .821 2.091l.032.045a8.577 8.577 0 0 0 3.356 2.945 11.314 11.314 0 0 0 1.126.409z"
      
      data-name="Path 12957"
      transform="translate(-101.636 -108.015)"
    />
    <path
      id="Path_12958"
      d="M440.2 324.745a7.945 7.945 0 0 0-12.526 9.544l-1.15 4.2 4.3-1.127a7.946 7.946 0 0 0 9.379-12.617zm-5.622 12.015a6.386 6.386 0 0 1-3.255-.891l-.278-.165-2.32.609.619-2.261-.181-.288a6.4 6.4 0 1 1 5.418 3v.113z"
      
      data-name="Path 12958"
    />
  </g>
</svg>`;
}

function renderChatButton(config) {
  carthike_injectCss(getCarthikeChatButtonCss(config));

  console.log(config);
  if (canShowContactUsButton(config)) {
    const div = document.createElement("div");
    div.id = "carthike-chat-wrapper";
    var label = "";
    var ariaLabel = "";
    if (config.design === "buttonWithTextIcon") {
      label = `<span>
      ${config.texts.contactUsLabel}
    </span>`;
      ariaLabel = config.texts.contactUsLabel;
    } else {
      ariaLabel = "Contact us";
    }

    var html = `<div id="carthike-chat-button-container" class="${
      config.position
    }">
    <button type="button" class="whatsappbutton ${
      config.design
    }" id="chwhatsapp-btn" aria-label="${ariaLabel}">
        ${getWhatsappButtonSVG()}
        ${label}
      </button>
      </div>`;
    div.innerHTML = html;
    const body = document.querySelector("body");
    body.appendChild(div);
    CHcreateMessageListener();
    if (config.welcomeMessage.isEnabled) {
      setTimeout(() => {
        renderWelcomeMessageCard(config);
      }, config.welcomeMessage.delay * 1000);
    }
  }
}

function renderShareButton(config) {
  carthike_injectCss(getCarthikeShareButtonCss(config));
  const body = document.querySelector("body");
  const div = document.createElement("div");
  let shareButtonLabel = "";
  if (config.shareButton.design === "buttonWithTextIcon") {
    shareButtonLabel = `<span>
      ${config.shareButton.label}
    </span>`;
  }
  div.id = "carthike-share-wrapper";
  const shareButtonHtml = `<div id="carthike-share-button-container" class="${
    config.shareButton.position
  }">
      <button type="button" class="whatsappsharebutton ${
        config.shareButton.design
      }" id="chwhatsapp-share-btn">
          ${getWhatsappButtonSVG()}
          ${shareButtonLabel}
        </button>
        </div>`;
  div.innerHTML = shareButtonHtml;
  body.appendChild(div);
  CHcreateShareListener();
}

function CHIsToday(dateObj) {}

function renderWelcomeMessageCard(config) {
  let lastShownWelcomeMessageItem = localStorage.getItem(
    "last_shown_welcome_message"
  );
  if (lastShownWelcomeMessageItem) {
    if (config.welcomeMessage.frequency != 0) {
      const diff = Date.now() - Number(lastShownWelcomeMessageItem);
      const daysInMillis = config.welcomeMessage.frequency * 86400000;
      if (diff < daysInMillis) {
        // for one day in millis
        return;
      }
    }
  }
  carthike_injectCss(getWelcomeMessageCss(config));
  const div = document.createElement("div");
  div.id = "carthike-welcome-message-wrapper";
  var html = `<div id="carthike-welcome-message-container" class="${config.position}">
    <div class="welcome-message-button">
    <div
          id="welcome-message-close-button"
          class="welcome-close-button-wrapper"
          
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="stroke-current text-gray-300 "
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </div>
      ${config.welcomeMessage.text}
    </div>
    </div>`;
  div.innerHTML = html;
  const body = document.querySelector("body");
  body.appendChild(div);
  CHcreateCloseWelcomeMessageListener();
  CHcreateWelcomeMessageClickListener();
  setTimeout(() => {
    const cont = document.querySelector("#carthike-welcome-message-container");
    cont.classList.add("animate-card");
  }, 1000);
  localStorage.setItem("last_shown_welcome_message", Date.now());
}

function getCloseIcon() {
  return `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
</svg>`;
}

function renderWidget(config) {
  if (document.querySelector("#carthike-widget-wrapper")) {
    return;
  }
  carthike_injectCss(getChatWidgetCSS(config));
  const div = document.createElement("div");
  div.id = "carthike-widget-wrapper";
  const agents = config.additionalAgents;
  const html = `<div id="carthike-chat-widget" class="${config.position}">
  <div class="chat-widget-header">
  <div id="chat-widget-close-icon" class="chat-widget-close-btn" style="width: 20px;">
  <img style="display: table-row" src="https://cdn.shopify.com/s/files/1/0539/8446/0950/t/1/assets/close.svg?v=1614675365">  </div>
  <div class="chat-widget-title">${config.texts.widgetTitle}</div>
  <div class="chat-widget-description">${config.texts.widgetDescription}</div></div><div class="chat-cont">
  <div id="chat-widget-agent-list">
  </div>
  </div>
  </div>
  </div>`;
  div.innerHTML = html;
  const body = document.querySelector("body");
  body.appendChild(div);
  CHcreateCloseWidgetListener();
  CHCreateAgentList(config);

  setTimeout(() => {
    const cont = document.querySelector("#carthike-chat-widget");
    cont.classList.add("animate-widget");
  }, 200);
}

//simple use case
OC_DOM.ready(function () {
  // createIframe();

  if (currentScript.src) {
    var shopOrgin = getParameterByName("shop", currentScript.src);

    if (shopOrgin) {
      getCarthikeConfig(shopOrgin).then((response) => {
        this.chConfig = response.config;
        processCarthikeConfig(response.config);
      });
    }
  }
});

document.addEventListener("DOMContentLoaded", function (event) {});

function CH_isMobile() {
  let check = false;
  (function (a) {
    if (
      /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(
        a
      ) ||
      /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
        a.substr(0, 4)
      )
    )
      check = true;
  })(navigator.userAgent || navigator.vendor || window.opera);
  return check;
}

function CHcreateMessageListener() {
  const button = document.querySelector("#chwhatsapp-btn");
  button.addEventListener("click", CHOpenWhatsappChat);
}

function CHcreateShareListener() {
  console.log("am called inside carthike.js");
  const button = document.querySelector("#chwhatsapp-share-btn");
  button.addEventListener("click", CHOpenWhatsappShare);
}

function CHcreateCloseWelcomeMessageListener() {
  const button = document.querySelector("#welcome-message-close-button");
  button.addEventListener("click", function (event) {
    event.preventDefault();
    event.stopPropagation();
    const welcomeMessageWrapper = document.querySelector(
      "#carthike-welcome-message-wrapper"
    );
    welcomeMessageWrapper.remove();
  });
}
function CHcreateWelcomeMessageClickListener() {
  const button = document.querySelector("#carthike-welcome-message-container");
  button.addEventListener("click", function (event) {
    event.preventDefault();
    event.stopPropagation();
    const welcomeMessageWrapper = document.querySelector(
      "#carthike-welcome-message-wrapper"
    );
    welcomeMessageWrapper.remove();
    CHOpenWhatsappChat();
  });
}

function CHgetPhoneNumber(config) {
  const numArray = [config.phoneNumber];
  if (config.additionalAgents && config.additionalAgents.length > 0) {
    for (const agent of config.additionalAgents) {
      if (agent.isEnabled) {
        numArray.push(agent.phoneNumber);
      }
    }
  }
  const randomNumber = Math.floor(Math.random() * numArray.length) + 0;
  return numArray[randomNumber];
}

function CHOpenWhatsappChat() {
  if (
    chConfig.widget.isEnabled &&
    chConfig.additionalAgents &&
    chConfig.additionalAgents.length > 0
  ) {
    renderWidget(chConfig);
    return;
  }
  CHOpenChatInNewTab(chConfig.phoneNumber);
}

function CH_isFacebookIBA() {
  if (
    navigator.userAgent &&
    (navigator.userAgent.indexOf("FB_IAB") > -1 ||
      navigator.userAgent.indexOf("FBAN") > -1 ||
      navigator.userAgent.indexOf("Instagram") > -1)
  ) {
    return true;
  }
  return false;
}

function CHOpenChatInNewTab(phoneNumber) {
  phoneNumber = phoneNumber.replace("+", "");
  let link = `https://api.whatsapp.com/send`;

  if (CH_isMobile()) {
    link = `https://api.whatsapp.com/send`;
  }

  if (CH_isFacebookIBA()) {
    link = `whatsapp://send`;
  }

  let url = `${link}/?phone=${phoneNumber}`;
  if (chConfig.defaultMessage && chConfig.defaultMessage.isEnabled) {
    url = `${url}&text=${chConfig.defaultMessage.text}`;
  }

  if (chConfig.addProductUrlInMessage && chIsProductPage()) {
    if (chConfig.defaultMessage && chConfig.defaultMessage.isEnabled) {
      url = `${url} ${location.href}`;
    } else {
      url = `${url}&text=${location.href}`;
    }
  }

  window.open(url, "_blank");
  updateChAnalyticEvent("chat_clicked");
}

function CHOpenWhatsappShare() {
  let link = `https://api.whatsapp.com/send`;
  if (CH_isMobile()) {
    link = `https://api.whatsapp.com/send`;
  }
  const url = window.location.href;
  window.open(`${link}/?text=${url}`, "_blank");
  updateChAnalyticEvent("share_clicked");
}

function updateChAnalyticEvent(event) {
  var shopOrgin = getParameterByName("shop", currentScript.src);
  return fetch(
    CARTHIKE_SERVER_URL + "/api/chat/analytics/add?shop=" + shopOrgin,
    {
      method: "POST",
      body: JSON.stringify({ event }),
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
}

function getCurrentDayByTz(tzString) {
  return new Date().toLocaleString("en-US", {
    timeZone: tzString,

    weekday: "long",
  });
}

function getCurrentHourByTz(tzString) {
  return new Date().toLocaleString("en-US", {
    timeZone: tzString,
    hour: "numeric",
    hour12: false,
  });
}
function isUrlIsInHiddenList(urls) {
  const currentLocation = window.location.href.split("?")[0];
  if (urls) {
    for (const url of urls) {
      if (currentLocation === url) {
        return true;
      }
    }
  }
  return false;
}

function isWithinOfficeHours(officeHours, timezone) {
  const currentDay = getCurrentDayByTz(timezone);
  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];
  const dayIndex = days.indexOf(currentDay);
  const currentOfficeHourDay = officeHours[dayIndex];
  if (currentOfficeHourDay && currentOfficeHourDay.officeClosed) {
    return false;
  }
  const hour = getCurrentHourByTz(timezone);
  if (
    currentOfficeHourDay &&
    hour >= currentOfficeHourDay.officeHoursOpen &&
    hour < currentOfficeHourDay.officeHoursClosed
  ) {
    return true;
  }
  return false;
}

function canShowContactUsButton(config) {
  if (config.isEnabled === false) {
    return false;
  }
  if (config.showOnlyOnHomePage && !chIsHomePage()) {
    return false;
  }

  if (config.officeHours.isEnabled) {
    return isWithinOfficeHours(
      config.officeHours.officeHours,
      config.officeHours.timezone
    );
  }
  if (config.hideButtonUrls && config.hideButtonUrls.isEnabled) {
    const shouldHide = isUrlIsInHiddenList(config.hideButtonUrls.urls);
    if (shouldHide) {
      return false;
    }
  }

  return true;
}

function CHcreateCloseWidgetListener() {
  console.log("close welcome message clicked");
  const closeIcon = document.querySelector("#chat-widget-close-icon");
  closeIcon.addEventListener("click", () => {
    CHCloseWidget();
  });
}

function CHCloseWidget() {
  document.querySelector("#carthike-widget-wrapper").remove();
}

function CHcreateContactClickListener(agent) {
  return function () {
    openAgentChatInNewTab(agent);
  };
}

function openAgentChatInNewTab(agent) {
  CHOpenChatInNewTab(agent.phoneNumber);
  CHCloseWidget();
}

function CHCreateAgentList(config) {
  const agents = config.additionalAgents;
  const chatWidgetAgentList = document.querySelector("#chat-widget-agent-list");
  for (const agent of agents) {
    const chatListCont = document.createElement("div");
    chatListCont.className = "chat-list-cont";
    chatListCont.innerHTML = `
     <div class="chat-user-avatar">
     <img style="height: 55px; width: 55px; border-radius: 50%;" class="avatar-theme-301" src="${agent.avatarUrl}">
     </div>
     <div class="chat-user-meta">
     <div class="chat-user-name">${agent.name}</div>
     <p class="chat-user-desc">${agent.description}</p>
     </div>`;
    chatListCont.onclick = CHcreateContactClickListener(agent);
    chatWidgetAgentList.appendChild(chatListCont);
  }
}

function chIsProductPage() {
  const currentUrl = location.href;
  return currentUrl.indexOf("/products/") != -1;
}

function chIsHomePage() {
  const currentPath = location.pathname;
  return currentPath === "/";
}
