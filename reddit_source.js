
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
    const xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", theUrl, false ); // false for synchronous request
    xmlHttp.send( null );
    return xmlHttp.responseText;
}

function httpGetAsync(theUrl, callback)
{
    const xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            return xmlHttp.responseText;
    }
    xmlHttp.open("GET", theUrl, true); // true for asynchronous 
    xmlHttp.send(null);
}

function getDeletedContents(id){
    url=`https://api.pushshift.io/reddit/search/comment/?ids=${id}`
    
    const json_res = httpGet(url);
    const res = JSON.parse(json_res)
    return res["data"][0]["body"];
}

function parseComment(deleted_item){
    return deleted_item.children[2];
    // deleted_element = deleted_item.children[2];

    // return deleted_element.innerHTML;
}

function parseId(deleted_elements){
    const permalink = deleted_elements.getAttribute('data-permalink');
    const strs = permalink.split('/');
    const id = strs[strs.length - 2];

    return id;
}

function replaceText(comment, undeleted_text){
    return comment.replace('<p>[deleted]</p>', `<p>${undeleted_text}</p>`);
}

function replaceComment(deleted_item){
    const comment = parseComment(deleted_item);
    const id = parseId(deleted_item);

    const deleted_comment_text = getDeletedContents(id);
    const deleted_comment = replaceText(comment.innerHTML, deleted_comment_text);

    comment.innerHTML = deleted_comment;
}

function controller(){
    const deleted_items = document.getElementsByClassName("deleted");

    for (var i = 0 ; i < deleted_items.length ; i++) {
        replaceComment(deleted_items[i]);
    }

    console.log("complete");
}

controller();
