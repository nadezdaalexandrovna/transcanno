/**
Extension of the Medium.js library: a few new functions 
*/
function ExtendedMedium(settings) {
	//console.log("in ExtendedMedium 1");
  Medium.call(this, settings);
  //console.log("in ExtendedMedium 2");
};

ExtendedMedium.prototype = Object.create(Medium.prototype);



ExtendedMedium.prototype.createElementForTagSelection3=function(tag, tagCode, attrValuesTable){
		console.log("in ExtendedMedium.prototype.createElementForTagSelection3");
		console.log("attrValuesTable");
		console.log(attrValuesTable);
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
			$("[tagcode="+checkedTagcodes[i]+"]").replaceWith(function() { return this.innerHTML; });
		}
		
		return this;
	};

ExtendedMedium.prototype.changeSelectedTag= function (tagCode, newAttrsValuesTable, callback, skipChangeEvent){
		var attr;
		for (attr in newAttrsValuesTable){
			$("[tagcode="+tagCode+"]").attr(attr,newAttrsValuesTable[attr]);
		}
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


ExtendedMedium.prototype.tagSelection3= function (tag, attrValuesTable, anchorEl, focusEl, beginningOfSelection, endOfSelection, callback, skipChangeEvent) {
		//console.log("in ExtendedMedium.prototype.tagSelection3");
		var range,
			el3,
			sel,
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

					//medium.makeUndoable();
					return this;
				}

				if(nodeToTag2.nodeType==3){
					endOfSelection=nodeToTag2.length;
				}else{
					endOfSelection=null;
				}
				
			}
			sel.removeAllRanges();

			return this;
		}
		
	};

ExtendedMedium.prototype.insertHtmlNadya= function (tag, tagCode, attrValuesTable) {
		console.log("in insertHtmlNadya");
		var sel = rangy.getSelection();
		var range, outerhtml;
		var el;

        if (sel.getRangeAt && sel.rangeCount) {
            range = sel.getRangeAt(0);            
            el=ExtendedMedium.prototype.createElementForTagSelection3(tag, tagCode, attrValuesTable);


			var textNode=document.createTextNode("\u200B"); //Inserting a zero width non-joiner Unicode code point, because if I create an empty text node, it does not work in Chrome
			el.appendChild(textNode);

            console.log("el");
            console.log(el);

            range.insertNode(el);

            
            var ra = rangy.createRange();
            ra.setStartAfter(textNode);		
		
			
            sel.removeAllRanges();
			
			sel.addRange(ra);
			
			//$("#user-type-input").click();

			

			//document.getElementById("myCheck").click();

			Medium.activeElement=el;
			
			console.log("Medium.activeElement");
			console.log(Medium.activeElement);

            console.log("range");
            console.log(ra);
            console.log("sel");
            console.log(sel);
            

			lastElement=el;
        }
		return this;
	};

/*
ExtendedMedium.prototype.insertHtmlNadya= function (tag, tagCode, attrValuesTable, html,pos, focusEl, callback, skipChangeEvent) {
		var sel = rangy.getSelection();
		var node = document.createTextNode(html);
		var range, outerhtml;
		var el;

        if (sel.getRangeAt && sel.rangeCount) {
            range = sel.getRangeAt(0);            
            el=ExtendedMedium.prototype.createElementForTagSelection3(tag, tagCode, attrValuesTable);
            range.insertNode(el);
            range.selectNodeContents(el);
            sel.removeAllRanges();
			sel.addRange(range);
            
			lastElement=el;
        }
		return this;
	};
*/

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

