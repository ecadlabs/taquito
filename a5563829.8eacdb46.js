(window.webpackJsonp=window.webpackJsonp||[]).push([[18],{76:function(e,t,a){"use strict";a.r(t),a.d(t,"frontMatter",(function(){return i})),a.d(t,"metadata",(function(){return c})),a.d(t,"rightToc",(function(){return s})),a.d(t,"default",(function(){return b}));var n=a(2),r=a(6),o=(a(0),a(96)),i={id:"lambda_view",title:"Using the Lambda View"},c={unversionedId:"lambda_view",id:"lambda_view",isDocsHomePage:!1,title:"Using the Lambda View",description:"This is a prerelease feature. If you have questions or issues, please feel free to file them on our Github issue tracker.",source:"@site/../docs/lambda_view.md",slug:"/lambda_view",permalink:"/docs/lambda_view",version:"current",sidebar:"docs",previous:{title:"RPC nodes",permalink:"/docs/rpc_nodes"},next:{title:"Batch API",permalink:"/docs/batch_API"}},s=[{value:"Recap: Views &amp; Callbacks",id:"recap-views--callbacks",children:[]},{value:"Limitations to Views &amp; Callbacks",id:"limitations-to-views--callbacks",children:[]},{value:"Enter Lambda View",id:"enter-lambda-view",children:[]},{value:"Considerations",id:"considerations",children:[]},{value:"Usage",id:"usage",children:[]}],l={rightToc:s};function b(e){var t=e.components,a=Object(r.a)(e,["components"]);return Object(o.b)("wrapper",Object(n.a)({},l,a,{components:t,mdxType:"MDXLayout"}),Object(o.b)("div",{className:"admonition admonition-caution alert alert--warning"},Object(o.b)("div",Object(n.a)({parentName:"div"},{className:"admonition-heading"}),Object(o.b)("h5",{parentName:"div"},Object(o.b)("span",Object(n.a)({parentName:"h5"},{className:"admonition-icon"}),Object(o.b)("svg",Object(n.a)({parentName:"span"},{xmlns:"http://www.w3.org/2000/svg",width:"16",height:"16",viewBox:"0 0 16 16"}),Object(o.b)("path",Object(n.a)({parentName:"svg"},{fillRule:"evenodd",d:"M8.893 1.5c-.183-.31-.52-.5-.887-.5s-.703.19-.886.5L.138 13.499a.98.98 0 0 0 0 1.001c.193.31.53.501.886.501h13.964c.367 0 .704-.19.877-.5a1.03 1.03 0 0 0 .01-1.002L8.893 1.5zm.133 11.497H6.987v-2.003h2.039v2.003zm0-3.004H6.987V5.987h2.039v4.006z"})))),"note")),Object(o.b)("div",Object(n.a)({parentName:"div"},{className:"admonition-content"}),Object(o.b)("p",{parentName:"div"},"This is a prerelease feature. If you have questions or issues, please feel free to file them on our ",Object(o.b)("a",Object(n.a)({parentName:"p"},{href:"https://github.com/ecadlabs/taquito"}),"Github")," issue tracker."))),Object(o.b)("p",null,"The lambda view is a way to retrieve data from a smart contract's storage\nwithout incurring fees via a contract's ",Object(o.b)("inlineCode",{parentName:"p"},"view method"),". This is a temporary\nsolution that will be addressed in a future protocol update."),Object(o.b)("h2",{id:"recap-views--callbacks"},"Recap: Views & Callbacks"),Object(o.b)("p",null,"As you develop applications on the blockchain, you'll soon realize you not only\nwant to interact with Smart Contracts by updating information but also by\nreading back pieces of data."),Object(o.b)("p",null,"Many Smart Contracts have what's known as ",Object(o.b)("inlineCode",{parentName:"p"},"view methods"),", which allow you to\nspecify parameters around what data you'd like to retrieve. They also require\nyou to supply a callback contract whose storage will update as a result of\nexecuting the view method."),Object(o.b)("p",null,"You can read more about views by going through the ",Object(o.b)("a",Object(n.a)({parentName:"p"},{href:"https://assets.tqtezos.com/docs/token-contracts/fa12/3-fa12-lorentz/#views"}),"FA1.2 Lorentz Tutorial"),"\nin the TQ Tezos Assets Portal."),Object(o.b)("h2",{id:"limitations-to-views--callbacks"},"Limitations to Views & Callbacks"),Object(o.b)("p",null,"One issue with using views and callbacks is that, just like any operation\nexecuted on Tezos, each read has a small fee attached to it. The amount is\ntrivial for occasional reads, but it becomes a burden at higher volumes."),Object(o.b)("p",null,"Another drawback is speed: since we're invoking a contract method, we have to\nwait for confirmation in order retrieve the data we requested. This may not be\nacceptable if the application you're working on requires consistent, faster\nresponse times."),Object(o.b)("h2",{id:"enter-lambda-view"},"Enter Lambda View"),Object(o.b)("p",null,'What we can do to work around these limitations is to send our contract address,\nview method, and parameters as its own "view" to a simple lambda contract that\n',Object(o.b)("em",{parentName:"p"},"always"),' fails. We refer to this method as a "lambda view".'),Object(o.b)("p",null,"The result of invoking our always-failing lambda contract is an error from the\nblockchain. That may not sound very useful, but the clever part is that the\nerror we receive contains the information we requested! This allows us to ",Object(o.b)("em",{parentName:"p"},"not"),"\nincur a fee for requesting data or wait for confirmation from the network in\norder to call view methods."),Object(o.b)("h2",{id:"considerations"},"Considerations"),Object(o.b)("ul",null,Object(o.b)("li",{parentName:"ul"},Object(o.b)("p",{parentName:"li"},"This method for retrieving data from the blockchain is not considered ideal. A\nfuture protocol update will make this goal easier to attain without the use of\na lambda view.")),Object(o.b)("li",{parentName:"ul"},Object(o.b)("p",{parentName:"li"},"Invoking the lambda view in the browser will raise errors in the web console."))),Object(o.b)("h2",{id:"usage"},"Usage"),Object(o.b)("p",null,"The lambda view feature has been integrated into the ",Object(o.b)("inlineCode",{parentName:"p"},"ContractAbstraction")," class. This allows retrieving data from a view in a very similar way than calling other entrypoints of a smart contract with Taquito."),Object(o.b)("p",null,"Here's an example of using the Lambda View on an FA1.2 contract."),Object(o.b)("p",null,"Taquito dynamically creates a ",Object(o.b)("inlineCode",{parentName:"p"},"getAllowance"),", ",Object(o.b)("inlineCode",{parentName:"p"},"getBalance")," and ",Object(o.b)("inlineCode",{parentName:"p"},"getTotalSupply")," view method that the developer can call as follows:"),Object(o.b)("ul",null,Object(o.b)("li",{parentName:"ul"},Object(o.b)("inlineCode",{parentName:"li"},"myContract.views.getAllowance(parameters)")),Object(o.b)("li",{parentName:"ul"},Object(o.b)("inlineCode",{parentName:"li"},"myContract.views.getBalance(parameters)")),Object(o.b)("li",{parentName:"ul"},Object(o.b)("inlineCode",{parentName:"li"},"myContract.view.getTotalSupply(parameters)"))),Object(o.b)("div",{className:"admonition admonition-note alert alert--secondary"},Object(o.b)("div",Object(n.a)({parentName:"div"},{className:"admonition-heading"}),Object(o.b)("h5",{parentName:"div"},Object(o.b)("span",Object(n.a)({parentName:"h5"},{className:"admonition-icon"}),Object(o.b)("svg",Object(n.a)({parentName:"span"},{xmlns:"http://www.w3.org/2000/svg",width:"14",height:"16",viewBox:"0 0 14 16"}),Object(o.b)("path",Object(n.a)({parentName:"svg"},{fillRule:"evenodd",d:"M6.3 5.69a.942.942 0 0 1-.28-.7c0-.28.09-.52.28-.7.19-.18.42-.28.7-.28.28 0 .52.09.7.28.18.19.28.42.28.7 0 .28-.09.52-.28.7a1 1 0 0 1-.7.3c-.28 0-.52-.11-.7-.3zM8 7.99c-.02-.25-.11-.48-.31-.69-.2-.19-.42-.3-.69-.31H6c-.27.02-.48.13-.69.31-.2.2-.3.44-.31.69h1v3c.02.27.11.5.31.69.2.2.42.31.69.31h1c.27 0 .48-.11.69-.31.2-.19.3-.42.31-.69H8V7.98v.01zM7 2.3c-3.14 0-5.7 2.54-5.7 5.68 0 3.14 2.56 5.7 5.7 5.7s5.7-2.55 5.7-5.7c0-3.15-2.56-5.69-5.7-5.69v.01zM7 .98c3.86 0 7 3.14 7 7s-3.14 7-7 7-7-3.12-7-7 3.14-7 7-7z"})))),"note")),Object(o.b)("div",Object(n.a)({parentName:"div"},{className:"admonition-content"}),Object(o.b)("p",{parentName:"div"},"Parameters must not include the callback parameter"))),Object(o.b)("p",null,"Then we call the ",Object(o.b)("inlineCode",{parentName:"p"},"read()")," method, which takes an optional lambda contract address. ",Object(o.b)("em",{parentName:"p"},"This optional parameter is useful for the sandbox users as they will need to deploy and use their own lambda contract.")),Object(o.b)("pre",null,Object(o.b)("code",Object(n.a)({parentName:"pre"},{className:"language-js",metastring:"live noInline",live:!0,noInline:!0}),"Tezos.contract.at('KT1A87ZZL8mBKcWGr34BVsERPCJjfX82iBto')\n.then(contract => {\n  return contract.views.getTotalSupply([['Unit']]).read()\n}).then(response => {\n  println(response)\n}).catch(error => println(`Error: ${error} ${JSON.stringify(error, null, 2)}`));\n")),Object(o.b)("pre",null,Object(o.b)("code",Object(n.a)({parentName:"pre"},{className:"language-js",metastring:"live noInline",live:!0,noInline:!0}),"Tezos.contract.at('KT1A87ZZL8mBKcWGr34BVsERPCJjfX82iBto')\n.then(contract => {\n  return contract.views.getBalance('tz1c1X8vD4pKV9TgV1cyosR7qdnkc8FTEyM1').read()\n}).then(response => {\n  println(response)\n}).catch(error => println(`Error: ${error} ${JSON.stringify(error, null, 2)}`));\n")),Object(o.b)("p",null,Object(o.b)("strong",{parentName:"p"},"How to deploy a lambda contract (sandbox users):")),Object(o.b)("pre",null,Object(o.b)("code",Object(n.a)({parentName:"pre"},{className:"language-js"}),"import { VIEW_LAMBDA } from '@taquito/taquito/src/contract/view_lambda'\n\nconst op = await tezos.contract.originate({\n  code: VIEW_LAMBDA.code,\n  storage: VIEW_LAMBDA.storage,\n});\n\nconst lambdaContract = await op.contract();\nconst lambdaContractAddress = lambdaContract.address\n")),Object(o.b)("div",{className:"admonition admonition-note alert alert--secondary"},Object(o.b)("div",Object(n.a)({parentName:"div"},{className:"admonition-heading"}),Object(o.b)("h5",{parentName:"div"},Object(o.b)("span",Object(n.a)({parentName:"h5"},{className:"admonition-icon"}),Object(o.b)("svg",Object(n.a)({parentName:"span"},{xmlns:"http://www.w3.org/2000/svg",width:"14",height:"16",viewBox:"0 0 14 16"}),Object(o.b)("path",Object(n.a)({parentName:"svg"},{fillRule:"evenodd",d:"M6.3 5.69a.942.942 0 0 1-.28-.7c0-.28.09-.52.28-.7.19-.18.42-.28.7-.28.28 0 .52.09.7.28.18.19.28.42.28.7 0 .28-.09.52-.28.7a1 1 0 0 1-.7.3c-.28 0-.52-.11-.7-.3zM8 7.99c-.02-.25-.11-.48-.31-.69-.2-.19-.42-.3-.69-.31H6c-.27.02-.48.13-.69.31-.2.2-.3.44-.31.69h1v3c.02.27.11.5.31.69.2.2.42.31.69.31h1c.27 0 .48-.11.69-.31.2-.19.3-.42.31-.69H8V7.98v.01zM7 2.3c-3.14 0-5.7 2.54-5.7 5.68 0 3.14 2.56 5.7 5.7 5.7s5.7-2.55 5.7-5.7c0-3.15-2.56-5.69-5.7-5.69v.01zM7 .98c3.86 0 7 3.14 7 7s-3.14 7-7 7-7-3.12-7-7 3.14-7 7-7z"})))),"note")),Object(o.b)("div",Object(n.a)({parentName:"div"},{className:"admonition-content"}),Object(o.b)("p",{parentName:"div"},"Taquito internally contains a list of lambda contracts. Thus, no need to deploy a lambda contract if you are using Mainnet, Delphinet, or Carthagenet. Taquito will detect the current network and use the appropriate lambda contract. "))),Object(o.b)("p",null,Object(o.b)("strong",{parentName:"p"},"More examples:")),Object(o.b)("pre",null,Object(o.b)("code",Object(n.a)({parentName:"pre"},{className:"language-js",metastring:"live noInline",live:!0,noInline:!0}),"Tezos.contract.at('KT1BkrcPjCXGPrQoYhVGFNwWMMyW2LrgBg9Q')\n.then(contract => {\n  return contract.views.balance_of([{ owner: 'tz1c1X8vD4pKV9TgV1cyosR7qdnkc8FTEyM1', token_id: '0' }]).read()\n}).then(response => {\n  println(JSON.stringify(response, null, 2))\n}).catch(error => println(`Error: ${error} ${JSON.stringify(error, null, 2)}`));\n")),Object(o.b)("pre",null,Object(o.b)("code",Object(n.a)({parentName:"pre"},{className:"language-js",metastring:"live noInline",live:!0,noInline:!0}),"Tezos.contract.at('KT1QXZMKbNYBf2wa9WJ3iXeBFEqd7HqmDh3H')\n.then(contract => {\n  return contract.views.getBalance('tz1h3rQ8wBxFd8L9B3d7Jhaawu6Z568XU3xY').read()\n}).then(response => {\n  println(JSON.stringify(response, null, 2))\n}).catch(error => println(`Error: ${error} ${JSON.stringify(error, null, 2)}`));\n")))}b.isMDXComponent=!0},96:function(e,t,a){"use strict";a.d(t,"a",(function(){return p})),a.d(t,"b",(function(){return u}));var n=a(0),r=a.n(n);function o(e,t,a){return t in e?Object.defineProperty(e,t,{value:a,enumerable:!0,configurable:!0,writable:!0}):e[t]=a,e}function i(e,t){var a=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),a.push.apply(a,n)}return a}function c(e){for(var t=1;t<arguments.length;t++){var a=null!=arguments[t]?arguments[t]:{};t%2?i(Object(a),!0).forEach((function(t){o(e,t,a[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(a)):i(Object(a)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(a,t))}))}return e}function s(e,t){if(null==e)return{};var a,n,r=function(e,t){if(null==e)return{};var a,n,r={},o=Object.keys(e);for(n=0;n<o.length;n++)a=o[n],t.indexOf(a)>=0||(r[a]=e[a]);return r}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(n=0;n<o.length;n++)a=o[n],t.indexOf(a)>=0||Object.prototype.propertyIsEnumerable.call(e,a)&&(r[a]=e[a])}return r}var l=r.a.createContext({}),b=function(e){var t=r.a.useContext(l),a=t;return e&&(a="function"==typeof e?e(t):c(c({},t),e)),a},p=function(e){var t=b(e.components);return r.a.createElement(l.Provider,{value:t},e.children)},d={inlineCode:"code",wrapper:function(e){var t=e.children;return r.a.createElement(r.a.Fragment,{},t)}},m=r.a.forwardRef((function(e,t){var a=e.components,n=e.mdxType,o=e.originalType,i=e.parentName,l=s(e,["components","mdxType","originalType","parentName"]),p=b(a),m=n,u=p["".concat(i,".").concat(m)]||p[m]||d[m]||o;return a?r.a.createElement(u,c(c({ref:t},l),{},{components:a})):r.a.createElement(u,c({ref:t},l))}));function u(e,t){var a=arguments,n=t&&t.mdxType;if("string"==typeof e||n){var o=a.length,i=new Array(o);i[0]=m;var c={};for(var s in t)hasOwnProperty.call(t,s)&&(c[s]=t[s]);c.originalType=e,c.mdxType="string"==typeof e?e:n,i[1]=c;for(var l=2;l<o;l++)i[l]=a[l];return r.a.createElement.apply(null,i)}return r.a.createElement.apply(null,a)}m.displayName="MDXCreateElement"}}]);