
// function DOMtoString(document_root) {

//     var html = '',
//         node = document_root.firstChild;
//     while (node) {
//         switch (node.nodeType) {
//         case Node.ELEMENT_NODE:
//             html += node.outerHTML;
//             break;
//         case Node.TEXT_NODE:
//             html += node.nodeValue;
//             break;
//         case Node.CDATA_SECTION_NODE:
//             html += '<![CDATA[' + node.nodeValue + ']]>';
//             break;
//         case Node.COMMENT_NODE:
//             html += '<!--' + node.nodeValue + '-->';
//             break;
//         case Node.DOCUMENT_TYPE_NODE:
//             // (X)HTML documents are identified by public identifiers
//             html += "<!DOCTYPE " + node.name + (node.publicId ? ' PUBLIC "' + node.publicId + '"' : '') + (!node.publicId && node.systemId ? ' SYSTEM' : '') + (node.systemId ? ' "' + node.systemId + '"' : '') + '>\n';
//             break;
//         }
//         node = node.nextSibling;
//     }

//     return html;
// }

// chrome.runtime.sendMessage({
//     action: "getSource",
//     source: DOMtoString(document)
// });

function httpGet(theUrl)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", theUrl, false ); // false for synchronous request
    xmlHttp.send( null );
    return xmlHttp.responseText;
}

function httpGetAsync(theUrl, callback)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            return xmlHttp.responseText;
    }
    xmlHttp.open("GET", theUrl, true); // true for asynchronous 
    xmlHttp.send(null);
}

function getDeletedContents(id){
    url=`https://api.pushshift.io/reddit/search/comment/?ids=${id}`
    
    var json_res = httpGet(url);
    var res = JSON.parse(json_res)
    return res["data"][0]["body"];
}

function parseComment(deleted_elements){
    deleted_element = deleted_elements.children[2];

    return deleted_element.innerHTML;
}

function parseId(deleted_elements){
    var permalink = deleted_elements.getAttribute('data-permalink');
    var strs = permalink.split('/');
    var id = strs[strs.length - 2];

    return id;
}

function replaceText(text, undeleted){
    return text.replace('<p>[deleted]</p>', `<p>${undeleted}</p>`);
}

function replaceComment(deleted_item){
    const comment = parseComment(deleted_item);
    const id = parseId(deleted_item);

    const deleted_comment_text = getDeletedContents(id);
    const deleted_comment = replaceText(comment, deleted_comment_text);

    comment.innerHTML = deleted_comment;
}

function controller(){
    const deleted_items = document.getElementsByClassName("deleted");

    for (const i = 0 ; i < deleted_items.length ; i++) {
        replaceComment(deleted_items[i]);
    }
}

controller();
