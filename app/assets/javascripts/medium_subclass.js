/**
Extension of the Medium.js library: a few new functions 
*/
function ExtendedMedium(settings) {
  Medium.call(this, settings);
};

ExtendedMedium.prototype = Object.create(Medium.prototype);



ExtendedMedium.prototype.createElementForTagSelection3=function(tag, tagCode, attrValuesTable){
		var i;
		var el=document.createElement(tag);
		el.setAttribute("tagCode",tagCode);
		el.setAttribute("class","medium-"+tag);
		if(attrValuesTable.length>0){
			for(i=0; i<attrValuesTable.length; i++){
				el.setAttribute(attrValuesTable[i][0],attrValuesTable[i][1]);
			}
		}
		return el;
	};



ExtendedMedium.prototype.focusNadya= function (pos,focusEl) {
		var range = rangy.createRange();
		range.selectNodeContents(focusEl);
		var sel = rangy.getSelection();
		sel.removeAllRanges();
		sel.setSingleRange(range);
		sel.collapse(focusEl, pos);

        Medium.activeElement=focusEl;

		return this;
	};

ExtendedMedium.prototype.removeTags= function (checkedTagcodes, callback, skipChangeEvent){
		var i;

		for (i=0; i<checkedTagcodes.length; i++){
			$("[tagcode="+checkedTagcodes[i]+"]").replaceWith(function() { 
				return this.innerHTML.replace(/^[\u200C]\|(.*)\|[\u200C]$/g, "$1"); //Takes into account tags that have pipes around the text
			});
		}

		this.makeUndoable();
		return this;
	};

ExtendedMedium.prototype.changeSelectedTag= function (tagCode, newAttrsValuesTable, callback, skipChangeEvent){
		var attr;
		for (attr in newAttrsValuesTable){
			$("[tagcode="+tagCode+"]").attr(attr,newAttrsValuesTable[attr]);
		}
		this.makeUndoable();
		return this;
	};

ExtendedMedium.prototype.cursorAfterTag= function (focusEl, callback, skipChangeEvent) {
		//var el = this.element;
		var sel = rangy.getSelection();

		var emptyElement = document.createTextNode('\u200B');
        var parentOfFocus=focusEl.parentNode;
        var grandParentofFocus=parentOfFocus.parentNode;

        grandParentofFocus.insertBefore(emptyElement, parentOfFocus.nextSibling);

        var range = document.createRange()
        range.setStartAfter(emptyElement); 
          
        sel.removeAllRanges();
        sel.addRange(range);
            
        Medium.activeElement=emptyElement;

		return this;
	};

// Get all *text* nodes contained in a selection object.
// Adapted from code by Tim Down.
// http://stackoverflow.com/questions/4398526/how-can-i-find-all-text-nodes-between-to-element-nodes-with-javascript-jquery
// https://gist.github.com/chriszarate/5092641
ExtendedMedium.prototype.getTextNodesBetween=function(selection) {
  var range = selection.getRangeAt(0), rootNode = range.commonAncestorContainer,
      startNode = range.startContainer, endNode = range.endContainer,
      startOffset = range.startOffset, endOffset = range.endOffset,
      pastStartNode = false, reachedEndNode = false, textNodes = [];
  function getTextNodes(node) {
    var val = node.nodeValue;
    if(node == startNode && node == endNode && node !== rootNode) {
      if(val) textNodes.push(val.substring(startOffset, endOffset));
      pastStartNode = reachedEndNode = true;
    } else if(node == startNode) {
      if(val) textNodes.push(val.substring(startOffset));
      pastStartNode = true;
    } else if(node == endNode) {
      if(val) textNodes.push(val.substring(0, endOffset));
      reachedEndNode = true;
    } else if(node.nodeType == 3) {
      if(val && pastStartNode && !reachedEndNode && !/^\s*$/.test(val)) {
        textNodes.push(val);
      }
    }
    for(var i = 0, len = node.childNodes.length; !reachedEndNode && i < len; ++i) {
      getTextNodes(node.childNodes[i]);
    }
  }
  getTextNodes(rootNode);
  return textNodes;
}

ExtendedMedium.prototype.getTextNodesBetweenNadya=function(selection) {
  var range = selection.getRangeAt(0), rootNode = range.commonAncestorContainer,
      startNode = range.startContainer, endNode = range.endContainer,
      startOffset = range.startOffset, endOffset = range.endOffset,
      pastStartNode = false, reachedEndNode = false, textNodes = [];
  function getTextNodes(node) {
    var val = node.nodeValue;
    if(node == startNode && node == endNode && node !== rootNode) {
      //if(val) textNodes.push(val.substring(startOffset, endOffset));
      //if(val) textNodes.push(node);
      pastStartNode = reachedEndNode = true;
    } else if(node == startNode) {
      if(val) textNodes.push(val.substring(startOffset));
      if(val){return val.substring(startOffset);}
      //if(val) textNodes.push(node);
      pastStartNode = true;
    } else if(node == endNode) {
      //if(val) textNodes.push(val.substring(0, endOffset));
      if(val) textNodes.push(node);
      reachedEndNode = true;
    } else if(node.nodeType == 3) {
      if(val && pastStartNode && !reachedEndNode && !/^\s*$/.test(val)) {
        //textNodes.push(val);
        //textNodes.push(node);
      }
    }
    for(var i = 0, len = node.childNodes.length; !reachedEndNode && i < len; ++i) {
      getTextNodes(node.childNodes[i]);
    }
  }
  getTextNodes(rootNode);
  return textNodes;
}

/*
// Lazy Range object detection.
function isRange(obj) {
  return ('type' in obj && obj.type === 'Range');
}

// Good-enough Range object comparison.
function rangeChange(data1, data2) {
  return (data1.type !== data2.type || data1.focusNode !== data2.focusNode || data1.focusOffset !== data2.focusOffset);
}
*/


ExtendedMedium.prototype.getRangeSelectedNodes=function(range) {
    var node = range.startContainer;
    var endNode = range.endContainer;

    // Special case for a range that is contained within a single node
    if (node == endNode) {
        return [node];
    }

    // Iterate nodes until we hit the end container
    var rangeNodes = [];
    while (node && node != endNode) {
        rangeNodes.push( node = nextNode(node) );
    }

    // Add partially selected nodes at the start of the range
    node = range.startContainer;
    while (node && node != range.commonAncestorContainer) {
        rangeNodes.unshift(node);
        node = node.parentNode;
    }

    return rangeNodes;
}

ExtendedMedium.prototype.tagSelection3Chrome=function(tag, attrValuesTable, anchorEl, focusEl, beginningOfSelection, endOfSelection, callback, skipChangeEvent){
	var el;
	var range;
	var d = new Date();
	var milliseconds = d.getTime();
	var tagCode=milliseconds.toString();

	if(anchorEl===focusEl){
		range = document.createRange();
		range.setStart(anchorEl, beginningOfSelection);
		range.setEnd(focusEl, endOfSelection);

		el=ExtendedMedium.prototype.createElementForTagSelection3(tag, tagCode, attrValuesTable);

		range.surroundContents(el);
		range.collapse(true);

		return;

	}else{
		try{
			range = document.createRange();
			range.setStart(anchorEl, beginningOfSelection);
			range.setEnd(focusEl, endOfSelection);

			el=ExtendedMedium.prototype.createElementForTagSelection3(tag, tagCode, attrValuesTable);

			range.surroundContents(el);
			range.collapse(true);

			return;
		}catch(error){
			var closestCommonAncestor = $(anchorEl).parents().has($(focusEl)).first()[0];

			//Tag to the right till the common ancestor

			var nodeToTag=anchorEl;
			var currentNode;
			var nodes;
			var childTextNodes, rangeIn;
			var sel = window.getSelection();
			sel.removeAllRanges();

			while(nodeToTag!=closestCommonAncestor ){
				range = document.createRange();
				
				if(beginningOfSelection!=null){				
					range.setStart(nodeToTag, beginningOfSelection);
					range.setEndAfter(nodeToTag);
					el=ExtendedMedium.prototype.createElementForTagSelection3(tag, tagCode, attrValuesTable);

					range.surroundContents(el);
					sel.addRange(range);

					var rangeContents=ExtendedMedium.prototype.getRangeSelectedNodes(range);
					nodeToTag=rangeContents[0].children[0];					

				}else{
					range.setStartBefore(nodeToTag);
					range.setEndAfter(nodeToTag);

					var k;
					childTextNodes=[];
					var rangeNodes=ExtendedMedium.prototype.getRangeSelectedNodes(range);
					for (k=0; k<rangeNodes.length; k++){
						childTextNodes.concat(rangeNodes[k].children);
						if(k==(rangeNodes.length-1)){

							if(childTextNodes.length>0){
								childTextNodes.forEach(function(child, index) {
  									rangeIn = document.createRange();
  									rangeIn.setStartBefore(child);
									rangeIn.setEndAfter(child);
									el=ExtendedMedium.prototype.createElementForTagSelection3(tag, tagCode, attrValuesTable);

									rangeIn.surroundContents(el);
									sel.addRange(rangeIn);
								});
								nodeToTag=childTextNodes[0].parentNode;
							}else{
								nodeToTag=nodeToTag.parentNode;
							}
						}
					}
				}
				
				if(nodeToTag.parentNode===closestCommonAncestor){
					break;
				}

				

				while(true){
					if(nodeToTag===closestCommonAncestor){break;}

					if(nodeToTag.parentNode===closestCommonAncestor){
						break;
					}

					if(nodeToTag.nextSibling!=null){
						if(nodeToTag.nextSibling===focusEl){break;}
						nodeToTag=nodeToTag.nextSibling;
						if(!(nodeToTag.nodeType==3 && nodeToTag.nodeValue=='')){

							if(nodeToTag.tagName!="BR"){
								break;
							}
						}
					}else{
						nodeToTag=nodeToTag.parentNode;
					}
				}

				if(nodeToTag.parentNode===closestCommonAncestor){
						break;
					}

				if(nodeToTag.nextSibling!=null && nodeToTag.nextSibling===focusEl){break;}

				if(nodeToTag.nodeType==3){
					beginningOfSelection=0;
				}else{
					beginningOfSelection=null;
				}
			}

			//Tag to the left till the common ancestor

			var nodeToTag2=focusEl;
			

			while(nodeToTag2!=closestCommonAncestor){

				range = document.createRange();
				range.setStartBefore(nodeToTag2);

				if(endOfSelection!=null){				
					range.setEnd(nodeToTag2,endOfSelection);
					el=ExtendedMedium.prototype.createElementForTagSelection3(tag, tagCode, attrValuesTable);

					range.surroundContents(el);
					sel.addRange(range);

					var rangeContents=ExtendedMedium.prototype.getRangeSelectedNodes(range);

					nodeToTag2=rangeContents[0].children[0].parentNode;
					

				}else{
					range.setEndAfter(nodeToTag2);

					var k;
					childTextNodes=[];
					var rangeNodes=ExtendedMedium.prototype.getRangeSelectedNodes(range);

					for (k=0; k<rangeNodes.length; k++){
						childTextNodes.concat(rangeNodes[k].children);
						if(k==(rangeNodes.length-1)){

							if(childTextNodes.length>0){
								childTextNodes.forEach(function(child, index) {
  									rangeIn = document.createRange();

  									rangeIn.setStartBefore(child);
									rangeIn.setEndAfter(child);
									el=ExtendedMedium.prototype.createElementForTagSelection3(tag, tagCode, attrValuesTable);

									rangeIn.surroundContents(el);
									sel.addRange(rangeIn);
								});
								nodeToTag2=childTextNodes[0].parentNode;
							}else{
								nodeToTag2=nodeToTag2.parentNode;
							}
						}
					}					
				}

				
				while(true){
					if(nodeToTag2===closestCommonAncestor){break;}

					if(nodeToTag2.previousSibling!=null){
						nodeToTag2=nodeToTag2.previousSibling;

						if(!(nodeToTag2.nodeType==3 && nodeToTag2.nodeValue=='')){

							if(nodeToTag2.tagName!="BR"){
								break;
							}
						}
						
					}else{
						nodeToTag2=nodeToTag2.parentNode;
					}
				}

				if(nodeToTag2===nodeToTag){
					sel.removeAllRanges();
					return;
				}

				if(nodeToTag2===closestCommonAncestor){
					sel.removeAllRanges();
					return;
				}

				if(nodeToTag2.nodeType==3){
					endOfSelection=nodeToTag2.length;
				}else{
					endOfSelection=null;
				}
				
			}

			sel.removeAllRanges();
			return;
		}
	}
};

ExtendedMedium.prototype.tagSelection3= function (tag, attrValuesTable, anchorEl, focusEl, beginningOfSelection, endOfSelection, callback, skipChangeEvent) {
		var isChrome = !!window.chrome && !!window.chrome.webstore;

		//In any case we call the function tagSelection3Chrome, because it works better
		if (isChrome==true || isChrome==false){
			ExtendedMedium.prototype.tagSelection3Chrome(tag, attrValuesTable, anchorEl, focusEl, beginningOfSelection, endOfSelection, callback, skipChangeEvent);
			this.makeUndoable();
			return this;
		}else{ //Is never called, but I left the code (because has successfully been used with firefox and no bugs  were reported)

		var range,
			el3,
			sel=rangy.getSelection(),
			rangeR = sel.getRangeAt(0),
			el;

		var d = new Date();
		var milliseconds = d.getTime();
		var tagCode=milliseconds.toString();

		var closestCommonAncestor = $(anchorEl).parents().has($(focusEl)).first()[0];

		if(anchorEl===focusEl){
			range = rangy.createRange();		
			range.setStart(anchorEl, beginningOfSelection);
			range.setEnd(anchorEl, endOfSelection);
			el=ExtendedMedium.prototype.createElementForTagSelection3(tag, tagCode, attrValuesTable);
			//el=createElementForTagSelection3(tag, tagCode, attrValuesTable);

			range.surroundContents(el);
			range.collapse(true);
			sel = rangy.getSelection();
			sel.removeAllRanges();

			this.makeUndoable();

			return this;
			
		}else if(rangeR.canSurroundContents()){
				range = rangy.createRange();		
				range.setStart(anchorEl, beginningOfSelection);
				range.setEnd(focusEl, endOfSelection);
				el=ExtendedMedium.prototype.createElementForTagSelection3(tag, tagCode, attrValuesTable);

				range.surroundContents(el);
				range.collapse(true);
				sel = rangy.getSelection();
				sel.removeAllRanges();

				this.makeUndoable();

				return this;
			
		}else{	
			sel = rangy.getSelection();
			sel.removeAllRanges();

			//Tag to the right till the common ancestor

			var nodeToTag=anchorEl;
			var currentNode;
			var nodes;
			var childTextNodes, rangeIn;

			while(nodeToTag!=closestCommonAncestor ){

				range = rangy.createRange();
				
				if(beginningOfSelection!=null){				
					range.setStart(nodeToTag, beginningOfSelection);
					range.setEndAfter(nodeToTag);
					el=ExtendedMedium.prototype.createElementForTagSelection3(tag, tagCode, attrValuesTable);
					//el=createElementForTagSelection3(tag, tagCode, attrValuesTable);

					range.surroundContents(el);
					sel.addRange(range);

					childTextNodes = range.getNodes([3], function(node) {
    					return node.data;
					});
					nodeToTag=childTextNodes[0].parentNode;

				}else{
					range.setStartBefore(nodeToTag);
					range.setEndAfter(nodeToTag);
					childTextNodes = range.getNodes([3], function(node) {
    					return node.data;
					});

					if(childTextNodes.length>0){
						childTextNodes.forEach(function(child, index) {
  							rangeIn = rangy.createRange();
  							rangeIn.setStartBefore(child);
							rangeIn.setEndAfter(child);
							el=ExtendedMedium.prototype.createElementForTagSelection3(tag, tagCode, attrValuesTable);
							//el=createElementForTagSelection3(tag, tagCode, attrValuesTable);

							rangeIn.surroundContents(el);
							sel.addRange(rangeIn);
						});

						nodeToTag=childTextNodes[0].parentNode;
					}else{
						nodeToTag=nodeToTag.parentNode;
					}

					
				}
				
				if(nodeToTag.parentNode===closestCommonAncestor){
					break;
				}

				

				while(true){
					if(nodeToTag===closestCommonAncestor){break;}

					if(nodeToTag.parentNode===closestCommonAncestor){
						break;
					}

					if(nodeToTag.nextSibling!=null){
						if(nodeToTag.nextSibling===focusEl){break;}
						nodeToTag=nodeToTag.nextSibling;
						//break;
						if(!(nodeToTag.nodeType==3 && nodeToTag.nodeValue=='')){

							if(nodeToTag.tagName!="BR"){
								break;
							}
						}
					}else{
						nodeToTag=nodeToTag.parentNode;
					}
				}

				if(nodeToTag.parentNode===closestCommonAncestor){
						break;
					}

				if(nodeToTag.nextSibling!=null && nodeToTag.nextSibling===focusEl){break;}

				if(nodeToTag.nodeType==3){
					beginningOfSelection=0;
				}else{
					beginningOfSelection=null;
				}
			}

			//Tag to the left till the common ancestor

			var nodeToTag2=focusEl;
			

			while(nodeToTag2!=closestCommonAncestor){

				range = rangy.createRange();
				range.setStartBefore(nodeToTag2);
				if(endOfSelection!=null){				
					range.setEnd(nodeToTag2,endOfSelection);
					el=ExtendedMedium.prototype.createElementForTagSelection3(tag, tagCode, attrValuesTable);
					//el=createElementForTagSelection3(tag, tagCode, attrValuesTable);

					range.surroundContents(el);
					sel.addRange(range);
					
					childTextNodes = range.getNodes([3], function(node) {
    					return node.data;
					});
					
					nodeToTag2=childTextNodes[0].parentNode;

				}else{
					range.setEndAfter(nodeToTag2);

					childTextNodes = range.getNodes([3], function(node) {
    					return node.data;
					});

					if(childTextNodes.length>0){
						childTextNodes.forEach(function(child, index) {
  							rangeIn = rangy.createRange();
  							rangeIn.setStartBefore(child);
							rangeIn.setEndAfter(child);
							el=ExtendedMedium.prototype.createElementForTagSelection3(tag, tagCode, attrValuesTable);
							//el=createElementForTagSelection3(tag, tagCode, attrValuesTable);

							rangeIn.surroundContents(el);
							sel.addRange(rangeIn);
						});
						nodeToTag2=childTextNodes[0].parentNode;
					}else{
						nodeToTag2=nodeToTag2.parentNode;
					}

					
				}

				
				while(true){
					if(nodeToTag2===closestCommonAncestor){break;}

					if(nodeToTag2.previousSibling!=null){
						nodeToTag2=nodeToTag2.previousSibling;

						if(!(nodeToTag2.nodeType==3 && nodeToTag2.nodeValue=='')){

							if(nodeToTag2.tagName!="BR"){
								break;
							}
						}
						
					}else{
						nodeToTag2=nodeToTag2.parentNode;
					}
				}

				if(nodeToTag2===nodeToTag){
					sel.removeAllRanges();

					this.makeUndoable();
					return this;
				}

				if(nodeToTag2.nodeType==3){
					endOfSelection=nodeToTag2.length;
				}else{
					endOfSelection=null;
				}
				
			}
			sel.removeAllRanges();

			this.makeUndoable();
			return this;
		}
		}
	};

ExtendedMedium.prototype.insertHtmlNadya= function (tag, tagCode, attrValuesTable, frombutton) {
		var sel = rangy.getSelection();
		var range, ra, textNode;
		var el, fromb;

		//If no argument has been passed, it defaults to false
        if(frombutton==true){
           	fromb=true;
        }else{
        	fromb=false;
        }


        if (sel.getRangeAt && sel.rangeCount) {
            range = sel.getRangeAt(0);            
            el=ExtendedMedium.prototype.createElementForTagSelection3(tag, tagCode, attrValuesTable);

			if(attrValuesTable.length==1 && fromb==true){
				textNode = document.createTextNode("\u200C||\u200C");	//To circumvent a bug: the cursor is not put into the tag, when the tag is sent from a button and the category has no attributes filled by the user			
			}else{
				textNode=document.createTextNode("\u200B"); //Inserting a zero width non-joiner Unicode code point, because if I create an empty text node, it does not work in Chrome
			}
			
			el.appendChild(textNode);
			range.insertNode(el);
			ra = rangy.createRange();
            ra.setStartAfter(textNode);

            sel.removeAllRanges();
			
			sel.addRange(ra);
			
			el.tabindex=-1;

			setTimeout(function(){el.focus()}, 1);

			Medium.activeElement=el;
			this.activeElement=el;
			ExtendedMedium.prototype.activeElement=el;

			lastElement=el;

			this.makeUndoable();
			return this;
        }
        
	};


ExtendedMedium.prototype.returnOffset=function() {
		var win = win || window,
        	docF = win.document,
        	selF = docF.selection,
        	sel;

		if (selF) {
        	if (selF.type != "Control") {
            	sel=selF;
        	}
      	} else if (win.getSelection) {
        	sel = win.getSelection();
    	}


		var range = sel.getRangeAt(0),
			focusNode=range.endContainer,
			anchorNode = range.startContainer,
			focusOffset=range.endOffset,
			anchorOffset = range.startOffset;

			if(range.commonAncestorContainer==range.startContainer && anchorOffset==0){
				anchorNode=range.endContainer;
			}else if(range.commonAncestorContainer==range.endContainer && focusOffset==0){
				focusNode=range.startContainer;
			}

			if(anchorNode.id=="page_source_text" || anchorNode.id=="bigDiv"){
				anchorNode=focusNode;
				anchorOffset=0;
			}

			if(focusNode.id=="page_source_text" || focusNode.id=="bigDiv"){
				focusNode=anchorNode;
			}

			if(anchorNode.childNodes.length==0 && anchorNode.textContent==""){
				anchorNode=focusNode;
			}

			if(focusNode.childNodes.length==0 && focusNode.textContent==""){
				focusNode=anchorNode;
			}

		if(anchorNode===focusNode && anchorOffset>focusOffset){
			return [anchorOffset,focusNode,focusOffset,anchorNode];
		}else{
			return [focusOffset,focusNode,anchorOffset,anchorNode];
		}
		
	};

