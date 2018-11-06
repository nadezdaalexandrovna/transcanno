// Use the Module pattern
var TranscriptionModule = (function () {
  "use strict";

  var focusOffset,
      focusNode,
      anchorOffset,
      anchorNode,
      beginningOfSelection,
      enableChosen,
      newDropdown,
      categoryTypesTable,
      rangeLength,
      catHashLength,
      seqAttrsTable,
      attrHash,
      seqAttrsPerLevel=[],
      numsSeqAttrPerLevel=[],
      categoriesInfo=[],
      categoryTypesHash={},
      categoryTypesHashAdv,
      initialAttrIds,
      medium,
      config,
      coords,
      hotkeysHash={};

  var Module = {
    
    init: function() {
      //Get the information about categories, their attributes and values for the simple mode
      categoryTypesHash=parseJsonData("categoryTypesDiv");

      var attr_name,
        catID;
      for (catID in categoryTypesHash){
        categoriesInfo[catID]=[];
        for (attr_name in categoryTypesHash[catID]){
          categoriesInfo[catID].push([attr_name, categoryTypesHash[catID][attr_name]['allow_user_input'], categoryTypesHash[catID][attr_name]['values'], categoryTypesHash[catID][attr_name]['default'], categoryTypesHash[catID][attr_name]['only'], categoryTypesHash[catID][attr_name]['max_len']]);
        }
      }

      //Get the information about categories, their attributes, values and sequences of these values (attributes to be filled) for the advanced mode
      categoryTypesHashAdv=parseJsonData("categoryTypesDivAdv");

      //Get the initial attributes' ids
      initialAttrIds=parseJsonData("initialAttrIds");

      //Decide wich categories to show in the menu: for the simple mode or for the advanced mode
      showSimpleOrAdvancedModeCategories(Cookies.get("use_advanced_mode"));

      //Parse the transcription text to transform it into XML
      var l=document.getElementById("page_source_text");

      //Take out the header
      var str = l.textContent.match("<textinfoheader>(.*?)</textinfoheader>");
      if (str != null) {
        //Put the header categories values into the menu above the transcription text area   
        fillHeaderCategoriesValues(str[1]);
      }
      var xml=l.textContent.replace(/\<textinfoheader>.*?\<\/textinfoheader\>/, '');

      xml=xml.replace(/^\<div id=\"bigDiv\"\>(.*)\<\/div\>$/, "$1");

      xml = "<div id=\"bigDiv\">"+xml+"</div>";
      xml = xml.replace(/<\/br>/g, "");
      var parser = new DOMParser();
      var doc = parser.parseFromString(xml, "text/html");
      var allDocContent=doc.childNodes[0].childNodes[1].childNodes[0];
      var article=l;
      var firstChild=article.firstChild;

      if(firstChild==null){
        article.nodeValue=allDocContent;
      }else{
        firstChild.parentNode.replaceChild(allDocContent,firstChild);
      }

      var closingElement=article.getElementsByTagName("closing")[0];

      var container = article.parentNode;

        
      medium = new ExtendedMedium({
        element: article,
        activeElement: article,
        mode: ExtendedMedium.richMode,
        attributes: null,
        placeholder:"",
        tags:null,
        pasteAsText: false
      });

      $(".popupBody").hide();
      $(".popupBody2").hide();
      $(".popupBodyAdv").hide();
      $(".popupBodyAdv2").hide();
      $("#newDropdownDiv").hide();
      $("#deletion_div").hide();
      $("#change_div").hide();
      $("#change_selected_div").hide();    

      
      config = {
        ".chosen-select-no-results": {width:"100%"},
        ".chosen-select-no-results2": {width:"100%"},
        ".chosen-adv": {width:"100%"},
        ".chosen-adv2": {width:"100%"}
      }

      var selector;
      for (selector in this.config) {
        $(selector).chosen(this.config[selector]);
      }    

      $(".chosen-select-no-results").chosen();
      $(".chosen-select-no-results2").chosen();
      $(".chosen-adv").chosen();
      $(".chosen-adv2").chosen();

      //If the user has defined his own hot keys, we take their values from the localstorage object
      hotkeysHash["insert_tag"] = localStorage["insert_tag"] || "Alt+C";
      hotkeysHash["get_out_of_tag"] = localStorage["get_out_of_tag"] || "Alt+X";
      hotkeysHash["modify_tag"] = localStorage["modify_tag"] || "Alt+M";
      hotkeysHash["delete_tag"] = localStorage["delete_tag"] || "Alt+N";
      hotkeysHash["hide_popup"] = localStorage["hide_popup"] || "Alt+R";
      hotkeysHash["insert_lower_quote"] = localStorage["insert_lower_quote"] || "Alt+,";
      hotkeysHash["insert_upper_quote"] = localStorage["insert_upper_quote"] || "Alt+.";

      updateHotkeysInButtonTitles();

      //On form submit (button "Save changes")
      this.formSubmitHandler=AddMediumValue.bind(this);
      $(".page-editor").on('submit', this.formSubmitHandler);
      
      this.transcriptionFinishedHandler=transcriptionFinishedFunction.bind(this);
      $("#transcription_finished").mousedown(this.transcriptionFinishedHandler);
      // If unit tests are run multiple times, it is important to be able to
      // detach events so that one test run does not interfere with another.
      this.changeModeHandler=switchBetweenSimpleAndAdvancedMode.bind(this);
      $("#use_advanced_mode").on('change', this.changeModeHandler);

      this.goOutOfTheCurrentTagHandler=goOutOfTheCurrentTag.bind(this);
      jQuery('#page_source_text').bind('keydown', hotkeysHash['get_out_of_tag'], this.goOutOfTheCurrentTagHandler);

      this.addTagHandler=addTag.bind(this);
      jQuery('#page_source_text').bind('keydown', hotkeysHash['insert_tag'], this.addTagHandler);

      this.undoHandler=undo.bind(this);
      $( ".undo" ).mousedown(this.undoHandler);

      this.fireDeleteTagHandler=fireDeleteTag.bind(this);
      $( ".delete_tag" ).mousedown(this.fireDeleteTagHandler);

      this.fireChangeTagHandler=fireChangeTag.bind(this);
      $( ".change_tag" ).mousedown(this.fireChangeTagHandler);

      this.fireInsertLowerQuoteHandler=fireInsertLowerQuote.bind(this);
      $( ".insert_lower_quote" ).mousedown(this.fireInsertLowerQuoteHandler);

      this.fireInsertUpperQuoteHandler=fireInsertUpperQuote.bind(this);
      $( ".insert_upper_quote" ).mousedown(this.fireInsertUpperQuoteHandler);

      this.showChangeHotkeysHandler=showChangeHotkeysMenu.bind(this);
      $( ".show_change_hotkeys" ).mousedown(this.showChangeHotkeysHandler);

      this.showSavingTimeHandler=showSavingTimeMenu.bind(this);
      $( ".show_saving_time" ).mousedown(this.showSavingTimeHandler);

      this.hideSavingTimeHandler=hideSavingTimeMenu.bind(this);
      $("#hide_popup_changetime").mousedown(this.hideSavingTimeHandler);

      this.changeSavingTimeTimeHandler=changeSavingTime.bind(this);
      $("#changeSavingTimeButton").mousedown(this.changeSavingTimeTimeHandler);

      this.changeHotKeysHandler=changeHotKeys.bind(this);
      $( "#changeHotKeys" ).mousedown(this.changeHotKeysHandler); 

      this.fireModifyTagHandler=fireModifyTag.bind(this);
      jQuery('#page_source_text').bind('keydown', hotkeysHash['modify_tag'], this.fireModifyTagHandler);

      this.fireDeleteFromHotkeyTagHandler=fireDeleteFromHotkeyTag.bind(this);
      jQuery('#page_source_text').bind('keydown', hotkeysHash['delete_tag'], this.fireDeleteFromHotkeyTagHandler);

      //Problem here, doesn't work
      this.hidePopUpHandler1=hidePopUp.bind.apply(hidePopUp,[this].concat("#popupBody", "select_a_tag", ".chosen-select-no-results"));
      $( "#hidePopupBody" ).mousedown(this.hidePopUpHandler1);
      
      this.hidePopUpHandler2=hidePopUp.bind.apply(hidePopUp,[this].concat("#popupBody2", "select_a_tag", ".chosen-select-no-results2"));
      $( "#hidePopupBody2" ).mousedown(this.hidePopUpHandler2);

      this.hidePopUpHandler3=hidePopUp.bind.apply(hidePopUp,[this].concat("#popupBodyAdv", "select_a_tag", ".chosen-adv"));
      $( "#hidePopupBodyAdv" ).mousedown(this.hidePopUpHandler3);

      this.hidePopUpHandler4=hidePopUp.bind.apply(hidePopUp,[this].concat("#popupBodyAdv2", "select_a_tag", ".chosen-adv2"));
      $( "#hidePopupBodyAdv2" ).mousedown(this.hidePopUpHandler4);

      this.hideNewDropdownDivHandler=hideNewDropdownDiv.bind(this);
      $(".hide_popup_new").mousedown(this.hideNewDropdownDivHandler);

      this.hideChangeKeysHandler=hideChangeKeysPopup.bind(this);
      $( ".hide_popup_changekeys" ).mousedown(this.hideChangeKeysHandler);

      this.hidePopupsHandler=hidePopups.bind(this);
      jQuery(document).bind('keydown', hotkeysHash['hide_popup'], this.hidePopupsHandler);
      jQuery('#page_source_text').bind('keydown', hotkeysHash['hide_popup'], this.hidePopupsHandler);
      jQuery('.popupBody').bind('keydown', hotkeysHash['hide_popup'], this.hidePopupsHandler);
      jQuery('.popupBody').children().bind('keydown', hotkeysHash['hide_popup'], this.hidePopupsHandler);
      jQuery('.popupBody2').bind('keydown', hotkeysHash['hide_popup'], this.hidePopupsHandler);
      jQuery('.popupBody2').children().bind('keydown', hotkeysHash['hide_popup'], this.hidePopupsHandler);
      jQuery('.popupBodyAdv').bind('keydown', hotkeysHash['hide_popup'], this.hidePopupsHandler);
      jQuery('.popupBodyAdv2').bind('keydown', hotkeysHash['hide_popup'], this.hidePopupsHandler);
      jQuery('.popupBodyAdv2').children().bind('keydown', hotkeysHash['hide_popup'], this.hidePopupsHandler);
      jQuery('#newDropdownDiv').bind('keydown', hotkeysHash['hide_popup'], this.hidePopupsHandler);
      jQuery('#newDropdownDiv').children().bind('keydown', hotkeysHash['hide_popup'], this.hidePopupsHandler);
      jQuery('#deletion_div').bind('keydown', hotkeysHash['hide_popup'], this.hidePopupsHandler);
      jQuery('#change_div').bind('keydown', hotkeysHash['hide_popup'], this.hidePopupsHandler);
      jQuery('#change_div').children().bind('keydown', hotkeysHash['hide_popup'], this.hidePopupsHandler);
      jQuery('#change_selected_div').bind('keydown', hotkeysHash['hide_popup'], this.hidePopupsHandler);
      jQuery('#change_selected_div').children().bind('keydown', hotkeysHash['hide_popup'], this.hidePopupsHandler);
      jQuery('#changeHotkeysMenu').bind('keydown', hotkeysHash['hide_popup'], this.hidePopupsHandler);
      jQuery('#changeHotkeysMenu').children().bind('keydown', hotkeysHash['hide_popup'], this.hidePopupsHandler);
      jQuery('#changeHotKeysInternal').bind('keydown', hotkeysHash['hide_popup'], this.hidePopupsHandler);
      jQuery('#changeHotKeysInternal').children().bind('keydown', hotkeysHash['hide_popup'], this.hidePopupsHandler);
      jQuery('.hotkeyDropdownMenu').bind('keydown', hotkeysHash['hide_popup'], this.hidePopupsHandler);
      jQuery('.hotkeyDropdownMenu').children().bind('keydown', hotkeysHash['hide_popup'], this.hidePopupsHandler);
      jQuery('#select-type-input').bind('keydown', hotkeysHash['hide_popup'], this.hidePopupsHandler);
      jQuery('#select-type-input').children().bind('keydown', hotkeysHash['hide_popup'], this.hidePopupsHandler);
      jQuery('.chosen-search').bind('keydown', hotkeysHash['hide_popup'], this.hidePopupsHandler);
      jQuery('.chosen-search').children().bind('keydown', hotkeysHash['hide_popup'], this.hidePopupsHandler);
      jQuery('.hotkeyDropdownMenu').bind('keydown', hotkeysHash['hide_popup'], this.hidePopupsHandler);
      jQuery('#page_source_text').bind('keydown', hotkeysHash['insert_lower_quote'], this.fireInsertLowerQuoteHandler);
      jQuery('#page_source_text').bind('keydown', hotkeysHash['insert_upper_quote'], this.fireInsertUpperQuoteHandler);
      
      this.printMediumValueHandler=printMediumValue.bind(this);
      jQuery('#page_source_text').bind('keydown', 'alt+h', this.printMediumValueHandler);
      
    },

    teardown: function() {
      // detach event handlers so that subsequent test runs do not interfere
      // with each other.
      $("#use_advanced_mode").off('change', this.changeModeHandler);
      jQuery('#page_source_text').unbind('keydown', this.hotkeysHash['get_out_of_tag'], this.goOutOfTheCurrentTagHandler);
      jQuery('#page_source_text').unbind('keydown', this.hotkeysHash['insert_tag'], this.addTagHandler);
      jQuery('#page_source_text').unbind('keydown', this.hotkeysHash['modify_tag'], this.fireModifyTagHandler);
      jQuery('#page_source_text').unbind('keydown', this.hotkeysHash['delete_tag'], this.fireDeleteFromHotkeyTagHandler);

      jQuery('#page_source_text').unbind('keydown', this.hotkeysHash['insert_lower_quote'], this.fireInsertLowerQuoteHandler);
      jQuery('#page_source_text').unbind('keydown', this.hotkeysHash['insert_upper_quote'], this.fireInsertUpperQuoteHandler);

      jQuery(document).unbind('keydown', hotkeysHash['hide_popup'], this.hidePopupsHandler);
      jQuery('#page_source_text').unbind('keydown', hotkeysHash['hide_popup'], this.hidePopupsHandler);
      jQuery('.popupBody').unbind('keydown', hotkeysHash['hide_popup'], this.hidePopupsHandler);
      jQuery('.popupBody').children().unbind('keydown', hotkeysHash['hide_popup'], this.hidePopupsHandler);
      jQuery('.popupBody2').unbind('keydown', hotkeysHash['hide_popup'], this.hidePopupsHandler);
      jQuery('.popupBody2').children().unbind('keydown', hotkeysHash['hide_popup'], this.hidePopupsHandler);
      jQuery('.popupBodyAdv').unbind('keydown', hotkeysHash['hide_popup'], this.hidePopupsHandler);
      jQuery('.popupBodyAdv2').unbind('keydown', hotkeysHash['hide_popup'], this.hidePopupsHandler);
      jQuery('.popupBodyAdv2').children().unbind('keydown', hotkeysHash['hide_popup'], this.hidePopupsHandler);
      jQuery('#newDropdownDiv').unbind('keydown', hotkeysHash['hide_popup'], this.hidePopupsHandler);
      jQuery('#newDropdownDiv').children().unbind('keydown', hotkeysHash['hide_popup'], this.hidePopupsHandler);
      jQuery('#deletion_div').unbind('keydown', hotkeysHash['hide_popup'], this.hidePopupsHandler);
      jQuery('#change_div').unbind('keydown', hotkeysHash['hide_popup'], this.hidePopupsHandler);
      jQuery('#change_div').children().unbind('keydown', hotkeysHash['hide_popup'], this.hidePopupsHandler);
      jQuery('#change_selected_div').unbind('keydown', hotkeysHash['hide_popup'], this.hidePopupsHandler);
      jQuery('#change_selected_div').children().unbind('keydown', hotkeysHash['hide_popup'], this.hidePopupsHandler);
      jQuery('#changeHotkeysMenu').unbind('keydown', hotkeysHash['hide_popup'], this.hidePopupsHandler);
      jQuery('#changeHotkeysMenu').children().unbind('keydown', hotkeysHash['hide_popup'], this.hidePopupsHandler);
      jQuery('#changeHotKeysInternal').unbind('keydown', hotkeysHash['hide_popup'], this.hidePopupsHandler);
      jQuery('#changeHotKeysInternal').children().unbind('keydown', hotkeysHash['hide_popup'], this.hidePopupsHandler);
      jQuery('.hotkeyDropdownMenu').unbind('keydown', hotkeysHash['hide_popup'], this.hidePopupsHandler);
      jQuery('.hotkeyDropdownMenu').children().unbind('keydown', hotkeysHash['hide_popup'], this.hidePopupsHandler);
      jQuery('#select-type-input').unbind('keydown', hotkeysHash['hide_popup'], this.hidePopupsHandler);
      jQuery('#select-type-input').children().unbind('keydown', hotkeysHash['hide_popup'], this.hidePopupsHandler);
      jQuery('.chosen-search').unbind('keydown', hotkeysHash['hide_popup'], this.hidePopupsHandler);
      jQuery('.chosen-search').children().unbind('keydown', hotkeysHash['hide_popup'], this.hidePopupsHandler);
      jQuery('.hotkeyDropdownMenu').unbind('keydown', hotkeysHash['hide_popup'], this.hidePopupsHandler);
    },

    buttonFunction: function(categoryid,categoryTag,coords){   
      if(Cookies.get('use_advanced_mode')==1){
        tagButtonInAdvancedMode(categoryid,categoryTag,coords);
      }else{
        tagButtonInSimpleMode(categoryid,categoryTag,coords);
      }
    },

    addMediumValue: function(categoryid,categoryTag,coords){      
      return AddMediumValue();
    },
    repeatingFunction:function(){
      //Automatically submits the form (= saves the transcription to the database). The default automatic transcription saving interval is 3 minutes, but it can be modified by the user
      submitTranscription();
    },

    buttonClickFunction:function(categoryid, butTitle, domElement){
      var position = domElement.getBoundingClientRect();
      var coords = {x:position.left, y:position.top};
      this.buttonFunction(categoryid,butTitle+"_id"+categoryid,coords);
      return false;
    },

    getTranscriptionSavingInterval:function(){
      //Set the time interval for transcription saving
      var transcriptionSavingInterval=Cookies.get("transcription_saving_interval")||180000;
      return transcriptionSavingInterval;
    }

    // BEGIN TESTING API
    // A build script could strip this out to save bytes.
    //checkTranscription: checkTranscription
    // END TESTING API
  };

  return Module;
  

  
  function submitTranscription(){
    AddMediumValue(function(){
      document.getElementsByName("save")[0].click();
    });
    
  }

  function undo(){
    medium.undo();
    return false;
  }
    
    function fireDeleteTag(){
      //var position = $(this).offset();
      var position = $(".delete_tag").offset();      
      //var coords = {x:position.left, y:position.top};
      //var coords = {x:position.left, y:390};
      coords = {x:position.left, y:390};
      deleteTag(coords,true);
    }    

    
    function fireChangeTag(){
      var position = $(".change_tag").offset();
      //var coords = {x:position.left, y:position.top};
      //var coords = {x:position.left, y:430};
      coords = {x:position.left, y:430};
      changeTag(coords,true);
    }

    function fireInsertLowerQuote(){
      medium.insertHtml("\u201E");
    }
    
    function fireInsertUpperQuote(){
      medium.insertHtml("\u201D");
    }

    function fireModifyTag(){
      //var coords = getSelectionCoords();
      coords = getSelectionCoords();
      changeTag(coords,false);
    }

    function fireDeleteFromHotkeyTag(){
      //var coords = getSelectionCoords();
      coords = getSelectionCoords();
      deleteTag(coords,false);
    }

  function addTag(){
    if(Cookies.get('use_advanced_mode')==1){
      tagInAdvancedMode();
    }else{
      tagInSimpleMode();
    }
  }

  //Only for development, to check the medium value
  function printMediumValue(){
    var m = medium.value();

    if(m.match(/\u200B/)!=null){
      console.log("found invisible caracters");
    }
      
      return false;
  }

  //If the cursor is inside a tag, it goes out of this tag and is placed directly after this tag
  function goOutOfTheCurrentTag(){
    var offset,focusEl;
    var TempTable=medium.returnOffset();
    offset=TempTable[0];
    focusEl=TempTable[1];
    //[offset,focusEl]=medium.returnOffset();

    if(focusEl.textContent.length==1){
      if(focusEl.getAttribute("mode")!=null){
        var content = document.createTextNode("|\u200C");
        focusEl.appendChild(content);
        content = document.createTextNode("\u200C|");
        focusEl.insertBefore(content, focusEl.firstChild);
        medium.focus();
        medium.focusNadya(0,focusEl.lastChild);
        medium.cursorAfterTag(focusEl.lastChild);
      }
    }else if(focusEl.parentNode.id!="page_source_text" && focusEl.parentNode.id!="bigDiv" && focusEl.id!="page_source_text" && focusEl.id!="bigDiv"){
    //if(focusEl.id!="page_source_text" && focusEl.id!="bigDiv"){
      medium.focus();
      medium.focusNadya(offset,focusEl);
      medium.cursorAfterTag(focusEl);
    }
    
    return false;
  }
  

  //Update hot keys indicated in buttons titles
  function updateHotkeysInButtonTitles(){
    document.getElementsByClassName("change_tag")[0].title+=localStorage["modify_tag"] || "Alt+M";
    document.getElementsByClassName("change_tag")[1].title+=localStorage["modify_tag"] || "Alt+M";
    document.getElementsByClassName("delete_tag")[0].title+=localStorage["delete_tag"] || "Alt+N";
    document.getElementsByClassName("delete_tag")[1].title+=localStorage["delete_tag"] || "Alt+N";
    document.getElementsByClassName("hide_popup_new")[0].title+=localStorage["hide_popup"] || "Alt+R";
    document.getElementsByClassName("hide_popup_small")[0].title+=localStorage["hide_popup"] || "Alt+R";
    document.getElementsByClassName("hide_popup_small")[1].title+=localStorage["hide_popup"] || "Alt+R";
    document.getElementsByClassName("hide_popup_small")[2].title+=localStorage["hide_popup"] || "Alt+R";
    document.getElementsByClassName("hide_popup_small")[3].title+=localStorage["hide_popup"] || "Alt+R";
  }


  function chosenReset(selector){
    $(selector).chosen('destroy');
    $(selector).prop('selectedIndex', 0);
    $(selector).chosen(config);
  }


  function parseJsonData(elementid){
      var categoryTypesDiv=document.getElementById(elementid);
      if(categoryTypesDiv!=null){
        var categoriesText=categoryTypesDiv.attributes[2].value;
        var categoryTypesHash=JSON && JSON.parse(categoriesText) || $.parseJSON(categoriesText);
        return categoryTypesHash;
      }else{
        return null;
      }
    }

  function hidePopUp(bodySelector, inputFieldId, chosenSelector){
    $(bodySelector).hide();
    $(bodySelector).css({"top":0,"left":0});
    document.getElementById(inputFieldId).innerHTML = "";


    //$(chosenSelector).chosen_reset(config);
    chosenReset(chosenSelector);
    //$(chosenSelector).chosen('destroy');
    //$(chosenSelector).prop('selectedIndex', 0);
  }

  function hidePopups(){
      hidePopUp("#popupBody", "select_a_tag", ".chosen-select-no-results");
      hidePopUp("#popupBody2", "select_a_tag", ".chosen-select-no-results2");
      hidePopUp("#popupBodyAdv", "select_a_tag", ".chosen-adv");
      hidePopUp("#popupBodyAdv2", "select_a_tag", ".chosen-adv2");
      hideNewDropdownDiv();
      hideChangeKeysPopup();
      hideDeletionPopup();
      hideChangePopup();
      medium.focus();
      medium.focusNadya(focusOffset,focusNode);
    }

    function hideNewDropdownDiv(){
      $("#newDropdownDiv").hide();
      chosenReset(".chosen-select-type");
      //$(".chosen-select-type").chosen_reset(config);
      $("#newDropdownDiv").css({"top":0,"left":0});
      document.getElementById("select_a_tag").innerHTML = "";
      document.getElementById("user-type-input").value = "";
      $("#user-type-input").hide();
    }

    //Hides the change hot keys pop up menu
    function hideChangeKeysPopup(){
      $("#changeHotKeysInternal").empty();
      $("#changeHotkeysMenu").hide();
    }

    function hideDeletionPopup(){
      $("#deletion_div").empty();
      $("#deletion_div").hide();
      $(".popup_title_div").empty();
    }

    function hideChangePopup(){
      //Delete the radios from the menu div
      $('#change_div').empty();
      //Hide the menu
      $("#change_div").hide();
      //$(".popup_title_div").empty();
    }

    function hideChangeAttributesPopup(){
      //Delete the radios from the menu div
      $("#change_selected_div").empty();
      //Hide the menu
      $("#change_selected_div").hide();
    }

    function showSimpleOrAdvancedModeCategories(checked){
      if(checked==1){
        $("#verticalMediumClickableSpans").hide();
        $("#verticalMediumClickableSpansAdv").show();
      }else{
        $("#verticalMediumClickableSpans").show();
        $("#verticalMediumClickableSpansAdv").hide();
      }
    }

    function switchBetweenSimpleAndAdvancedMode(){
      var checked = $("#use_advanced_mode").is(':checked') ? 1 : 0 ;
      $("#use_advanced_mode_").val(checked);
      Cookies.set("use_advanced_mode", checked, { expires: 365 });
      document.getElementsByName("page[use_advanced_mode]")[0].value=checked;
      showSimpleOrAdvancedModeCategories(checked);
    }

    //Shows the menu that lets the user change the transcription saving frequency
    function showSavingTimeMenu(){
      var inputValue=(Cookies.get("transcription_saving_interval")/60000)||3;
      $("#input_time").val(inputValue);
      $("#changeSavingTimeMenu").show();
    }

    //Hides the menu that lets the user change the transcription saving frequency
    function hideSavingTimeMenu(){
      $("#changeSavingTimeMenu").hide();
    }

    //Change the transcription saving frequency
    function changeSavingTime(){
      var newInterval=$("#input_time").val();
      if(newInterval==null || newInterval==""){
        newInterval=180000; //The default automatic transcription saving interval is 3 minutes
      }else{
        newInterval=newInterval*60000;
      }
      Cookies.set("transcription_saving_interval", newInterval, { expires: 365 });
      hideSavingTimeMenu();
    }

    //When the user pushes the button with a key on it, this function fires and shows a popup menu that lets him change hot keys
    function showChangeHotkeysMenu(){
      var listOfHelpKeys=["","Alt","Ctrl","Shift","Insert","PGUP","PGDN","FN","Tab"];

      var changeHotKeysInternal=document.getElementById("changeHotKeysInternal");

      jQuery.each(hotkeysHash, function (name, value) {
        var keyPlusKey=value.split('+');
        
        var firstKey=keyPlusKey[0];
        var middleKey="";
        if(keyPlusKey.length==3){
          middleKey=keyPlusKey[1];
        }

        var lastKey=keyPlusKey[keyPlusKey.length-1];

        var select = document.createElement("select");
        select.id = name;
        select.name=name;
        select.className="hotkeyDropdownMenu";

        var select2 = document.createElement("select");
        select2.id = name+'2';
        select2.name=name+'2';
        select2.className="hotkeyDropdownMenu";

        var h,
            option,
            option2;

        for(h=0; h<listOfHelpKeys.length; h++){          

          option = document.createElement("option");
          option.value=listOfHelpKeys[h];
          
          if(listOfHelpKeys[h]==firstKey){
            option.selected="checked";
          }else{
            option.selected="";
          }

          option.innerHTML= listOfHelpKeys[h];
          select.appendChild(option);

          option2 = document.createElement("option");
          option2.value=listOfHelpKeys[h];
          
          if(listOfHelpKeys[h]==middleKey){
            option2.selected="checked";
          }else{
            option2.selected="";
          }        
          option2.innerHTML= listOfHelpKeys[h];
          select2.appendChild(option2);
        }

        if(middleKey==''){
          select2.selectedIndex = -1;
        }        

        $('#changeHotKeysInternal').append('<label class="hotkey_label">' + name.replace(/_/g, ' ') + ':</label>');
        $('#changeHotKeysInternal').append(select);
        $('#changeHotKeysInternal').append(select2);
        $('#changeHotKeysInternal').append('<input type="text" id="input_'+name+'" class="hotkeyDropdownMenu" maxlength="1" value="'+lastKey+'"></input><br/>');
        
      });

      $("#changeHotkeysMenu").show();
    }


    //Applies the changes to hot keys made by the user
    function changeHotKeys(){
      if (typeof(Storage) !== "undefined") {
        // Code for localStorage
        var firstKey,
            middleKey,
            lastKey,
            newValue,
            keyPlusKey,
            name,
            i,
            select1,
            valselect1=null,
            select2,
            valselect2=null,
            keys = Object.keys(hotkeysHash),
            len = keys.length;


        for(i=0; i<len; i++) {
          name=keys[i];
          keyPlusKey=hotkeysHash[name].split('+');
        
          firstKey=keyPlusKey[0];
          middleKey='';
          if(keyPlusKey.length==3){
            middleKey=keyPlusKey[1];
          }

          select1 = document.getElementById(name);
          if(select1.selectedIndex==-1){
            valselect1='';
          }else{
            valselect1 = select1.options[select1.selectedIndex].value || '';
          }

          select2=document.getElementById(name+'2');
          if(select2.selectedIndex==-1){
            valselect2='';
          }else{
            valselect2 = select2.options[select2.selectedIndex].value || '';
          }

          if(valselect1!=null){
            firstKey=valselect1;
          }
          if(valselect2!=null){
            middleKey=valselect2;
          }
          if(document.getElementById('input_'+name).value!=null){
            lastKey=document.getElementById('input_'+name).value;
          }
          
          if(middleKey!=''){
            newValue=firstKey+'+'+middleKey+'+'+lastKey;
          }else{
            newValue=firstKey+'+'+lastKey;
          }

          //If the values of all the 3 fields corresponding to new hot keys are empty, we give an error message 
          if(newValue=='+'){
            alert("The \""+name.replace(/_/g, ' ')+"\" hot key is empty. Please, choose a value.");
            break;
          }else{
            localStorage.setItem(name,newValue);
            hotkeysHash[name]=newValue;
          }

          if(i==(len-1)){
            //Hide the popup menu
            hideChangeKeysPopup();
            alert("The hot keys have been changed. Please, reload the page in your browser.");
            updateHotkeysInButtonTitles();
          }
        }

      } else {
        // Sorry! No Web Storage support..
        alert("Sorry, hot keys can't be changed. Your browser doesn't support HTML Storage.");
        //Hide the popup menu
        hideChangeKeysPopup();
      }
    }

    //If the user types text in the input field of the category type select box in order to select one of the options
    function filterByTextS (selector, textbox, medium, varTag, userChosenAttributesAndValues, attrName, num,categoryTable, focusOffset,focusNode, notCollapsedArgsTable,coords,onButton) {
      var option;
      var select;
      var options;
      var options2;
      var search;
      var regex;
      var arrowPosition=0;

      return $(selector).each(function() {
        select = this;
        var length=$(select).attr("size");
        options = [];
        $(select).find('option').each(function() {
          options.push({value: $(this).val(), text: $(this).text()});
        });
        $(select).data('options', options);

        $(textbox).off().on('change keyup', function(e) {

          if (e.which == 40) {
            if(arrowPosition>=0 && arrowPosition<options.length){
              $(textbox).val(options[arrowPosition]['text']);
              if(arrowPosition!=(options.length-1)){
                arrowPosition+=1;
              }
            }
          }else if(e.which == 38){
            if(arrowPosition>=0 && arrowPosition<options.length){
              $(textbox).val(options[arrowPosition]['text']);
              if(arrowPosition!=0){
                arrowPosition=arrowPosition-1;
              }
            }
          }else{

            options2 = $(select).empty().data('options');
            $(select).attr("size", 0);
            search = $.trim($(this).val());

            if(search!=null && search!=""){
              regex = new RegExp("^"+search,"gi");

              $.each(options2, function(i) {
                if(options2!=null){
                option = options2[i];
                if(option.value!="" && option.value.match(regex) !== null) {
                  $(select).append(
                    $('<option>').text(option.text).val(option.value)
                  );
                  $(select).attr("size", $(select).attr("size")+1);
                  //If the user presses enter
                  if (e.which == 13) {
                    if(notCollapsedArgsTable==null){
                      $("#newDropdownDiv").hide();
                      document.getElementById("select_a_tag").innerHTML = "";
                      userChosenAttributesAndValues.push([attrName,option.value]);

                      options2=null;

                      if (num<(categoryTable.length-1)){
                        getNextSomethingSelected(userChosenAttributesAndValues,varTag, num+1, categoryTable, focusOffset,focusNode, notCollapsedArgsTable,coords,onButton);
                      }

                      if (num==(categoryTable.length-1)){
                        medium.tagSelection3(varTag, userChosenAttributesAndValues, anchorNode, focusNode, anchorOffset, focusOffset);
                      }
                    }else{
                      $("#newDropdownDiv").hide();
                      $("#select-type-input").hide();
                      $("#select-type-input")[0].value="";
                      $('#chosen-select-type').empty();
                      $('#chosen-select-type')[0].value="";

                      document.getElementById('select_a_tag').innerHTML = "";

                      userChosenAttributesAndValues.push([attrName,option.value]);

                      if (num<(categoryTable.length-1)){
                        getNextSomethingSelected(userChosenAttributesAndValues,varTag, num+1, categoryTable, focusOffset,focusNode, notCollapsedArgsTable,coords,onButton);
                      }

                      if (num==(categoryTable.length-1)){
                        medium.tagSelection3(varTag, userChosenAttributesAndValues, anchorNode, focusNode, anchorOffset, focusOffset);
                      }
                    }
                  }
                }
                }
              });
            }else{ // if search==null || search==""
              $(select).attr("size", length);
              $.each(options2, function(i) {
                option = options2[i];
                if(option.value!="") {
                  $(select).append(
                    $('<option>').text(option.text).val(option.value)
                  );
                }
              });
            }
          }
        });
      });
    };

    //If the user types text in the input field of the category type select box in order to select one of the options
    function filterByTextCollapsed (selector,textbox, medium, varTag, userChosenAttributesAndValues, attrName, num,categoryTable, focusOffset,focusNode, notCollapsedArgsTable,coords,onButton) {
      var option;
      var select;
      var options;
      var options2;
      var search;
      var regex;
      var arrowPosition=0;
      
      return $(selector).each(function() {
        select = this;
        var length=$(select).attr("size");
        options = [];
        $(select).find('option').each(function() {
          options.push({value: $(this).val(), text: $(this).text()});
        });
        $(select).data('options', options);

        $(textbox).off().on('change keyup', function(e) {

        if (e.which == 40) {
          if(arrowPosition>=0 && arrowPosition<options.length){
            $(textbox).val(options[arrowPosition]['text']);
            if(arrowPosition!=(options.length-1)){
              arrowPosition+=1;
            }
          }
        }else if(e.which == 38){
          if(arrowPosition>=0 && arrowPosition<options.length){
            $(textbox).val(options[arrowPosition]['text']);
            if(arrowPosition!=0){
              arrowPosition=arrowPosition-1;
            }
          }
        }else{
          options2 = $(select).empty().data('options');
          $(select).attr("size", 0);
          search = $.trim($(this).val());
          if(search!=null && search!=""){
            regex = new RegExp("^"+search,"gi");

            $.each(options2, function(i) {
              if(options2!=null){
              option = options2[i];
              if(option.value!="" && option.value.match(regex) !== null) {
                $(select).append(
                  $('<option>').text(option.text).val(option.value)
                );
                $(select).attr("size", $(select).attr("size")+1);
                //If the user presses enter
                if (e.which == 13) {
                  
                    $("#newDropdownDiv").hide();

                    $("#select-type-input").hide();
                    $("#select-type-input")[0].value="";
                    $('#chosen-select-type').empty();
                    $('#chosen-select-type')[0].value="";

                    document.getElementById('select_a_tag').innerHTML = "";
                    userChosenAttributesAndValues.push([attrName,option.value]);
                    options2=null;
                    if (num<(categoryTable.length-1)){
                      getNextCollapsed(userChosenAttributesAndValues, varTag,num+1, categoryTable, focusOffset,focusNode, notCollapsedArgsTable,coords,onButton);
                    }

                    if (num==(categoryTable.length-1)){
                      document.getElementById('select_a_tag').innerHTML = "";
                      addCategoryWithTypeS (medium, varTag, userChosenAttributesAndValues, focusOffset,focusNode);

                    }

                }
              }
              }
            });

          }else{ // if search==null || search==""
            $(select).attr("size", length);
            $.each(options2, function(i) {
              option = options2[i];
              if(option.value!="") {
                $(select).append(
                  $('<option>').text(option.text).val(option.value)
                );

              }
            });
          }
          }
        });
      });
    };

    // Inserts the tag into the text (for categories with and without types)
    function addCategoryWithTypeS (medium, varTag, userChosenAttributesAndValues, focusOffset,focusNode, fromButton){
      var couple;
      var attrString="";

      medium.focus();

      var d = new Date();
      var milliseconds = d.getTime();
      var tagCode=milliseconds.toString();
      
      for (couple in userChosenAttributesAndValues){
        attrString+=" "+userChosenAttributesAndValues[couple][0]+"=\""+userChosenAttributesAndValues[couple][1]+"\"";
      }

      medium.focusNadya(focusOffset,focusNode);
      medium.insertHtmlNadya(varTag, tagCode, userChosenAttributesAndValues, fromButton);


      $('#chosen-select-type').empty();
      $('#chosen-select-type')[0].value="";

      return false;
    }


    function tagSelectionWithType (userChosenAttributesAndValues,categoryid, categoriesInfo, medium, varTag, focusOffset,focusNode, notCollapsedArgsTable, coords,onButton){
      var categoryTable=categoriesInfo[categoryid];
                
      getNextSomethingSelected(userChosenAttributesAndValues,varTag, 0, categoryTable,focusOffset,focusNode, notCollapsedArgsTable,coords,onButton);
      
    }


    function getNextSomethingSelected(userChosenAttributesAndValues,varTag, num, categoryTable, focusOffset,focusNode, notCollapsedArgsTable,coords,onButton){
        var i;  
        var categoryTypesTable=categoryTable[num][2];
        var attrName=categoryTable[num][0];
        var allow_user_input=categoryTable[num][1];
        var defaultValue=categoryTable[num][3];
        
        
      if(categoryTypesTable.length==1 && allow_user_input==0){ //If there is only one predefined value and the user input is not allowed
        userChosenAttributesAndValues.push([attrName,categoryTypesTable[0]]);

        if (num<(categoryTable.length-1)){
          getNextSomethingSelected(userChosenAttributesAndValues,varTag, num+1, categoryTable, focusOffset,focusNode, notCollapsedArgsTable,coords,onButton);
        }

        if (num==(categoryTable.length-1)){
          medium.tagSelection3(varTag, userChosenAttributesAndValues, anchorNode, focusNode, anchorOffset, focusOffset);
        }

      }else if(categoryTypesTable.length>0){  //If there are predefined values for this attribute
        //Create the new dropdown menu for category types
        var newDropdown=addNewDropdown(categoryTypesTable.length,attrName, "Select");
        var option = document.createElement("option");
        option.value="";
        option.selected="checked";
        option.innerHTML="";
        newDropdown.append(option);

        for(i=0; i< categoryTypesTable.length; i++){
          //Add an option for the category types dropdown menu
          addAnOption(newDropdown,categoryTypesTable[i]);
                    
          if(i==(categoryTypesTable.length-1)){
            if(onButton==true){
              $("#newDropdownDiv").css({'top':coords.y,'left':'','right':'4vw', 'position':'absolute'});
            }else{
              $("#newDropdownDiv").css({'top':coords.y,'left':coords.x, 'right':'','position':'absolute'});
            }
            
            $("#newDropdownDiv").show();
            $('#select-type-input').show();
            $("#select-type-input")[0].value=defaultValue;
            $('#select-type-input').focus();

            if(allow_user_input==1){ //If the user can enter a new value for this attribute
              $('#user-type-input').value=defaultValue;         
              $('#user-type-input').show();
              setTimeout(function(){$('#user-type-input').focus()}, 1); //A trick to make focus work (known bug in the internet dev community)
              userInputAttrValueSomethingSelected ($('#user-type-input'), medium, varTag, userChosenAttributesAndValues, attrName, num,categoryTable, focusOffset,focusNode, notCollapsedArgsTable,coords,onButton);
            }

            //$('#chosen-select-type').filterByTextS($('#select-type-input'), medium, varTag, userChosenAttributesAndValues, attrName, num,categoryTable,focusOffset,focusNode, notCollapsedArgsTable,coords,onButton);
            filterByTextS('#chosen-select-type',$('#select-type-input'), medium, varTag, userChosenAttributesAndValues, attrName, num,categoryTable,focusOffset,focusNode, notCollapsedArgsTable,coords,onButton);
                      
            $("#chosen-select-type").off().change(attrName,function(event3){                        
                                                
              if(event3.target == this){
                var type=$(this).val();
                if(type!=null && type!=''){
                  var newType=type;
                  type='';

                  userChosenAttributesAndValues.push([attrName,newType]);
                  hidePopups();       
                  $("#newDropdownDiv").hide();
                  $('#chosen-select-type').empty();
                  $('#chosen-select-type')[0].value="";
                  document.getElementById('select_a_tag').innerHTML = "";
                            
                  if (num<(categoryTable.length-1)){
                    getNextSomethingSelected(userChosenAttributesAndValues,varTag, num+1, categoryTable, focusOffset,focusNode, notCollapsedArgsTable,coords,onButton);
                  }

                  if (num==(categoryTable.length-1)){
                    medium.tagSelection3(varTag, userChosenAttributesAndValues, anchorNode, focusNode, anchorOffset, focusOffset);
                  }
                            
                }
              }
                      
            });
          }
        }
      }else{//If there are no predefined values for this attribute
        if(allow_user_input==1){ //If the user can enter a new value for this attribute
          //Create the new dropdown menu for category types
          var newDropdown=addNewDropdown(categoryTypesTable.length,attrName, "Input");
          var option = document.createElement("option");
          option.value="";
          option.selected="checked";
          option.innerHTML="";
          newDropdown.append(option);

          if(onButton==true){
            $("#newDropdownDiv").css({'top':coords.y,'left':'','right':'4vw', 'position':'absolute'});
          }else{
            $("#newDropdownDiv").css({'top':coords.y,'left':coords.x,'right':'', 'position':'absolute'});
          }
          
          $("#newDropdownDiv").show();
          $("#select-type-input").hide();
          //$("#select-type-input").empty();
          $("#select-type-input")[0].value="";
          $('#chosen-select-type').empty();
          $('#chosen-select-type')[0].value="";
          $("#chosen-select-type").hide();          
          $('#user-type-input').show();
          setTimeout(function(){$('#user-type-input').focus()}, 1); //A trick to make focus work (known bug in the internet dev community)
          userInputAttrValueSomethingSelected ($('#user-type-input'), medium, varTag, userChosenAttributesAndValues, attrName, num,categoryTable, focusOffset,focusNode, notCollapsedArgsTable,coords,onButton);
        }else{ //The user can't enter a new value (erroneous case: the attribute exists, but has no values and can't obtain one)

          alert("There is a mistake in the attribute \""+attrName+"\" design: an attribute should either have a list of predefined values or allow user input.");
          return false;
          
        }

      }     
    }

    function filterByTextAdvanced(selector,level,textbox, medium, varTag,initialAttrIds, userChosenAttributesAndValues, attrName,attrHash, num,numSeqAttr, seqAttrsTable,categorySeqHash, focusOffset,focusNode, notCollapsedArgsTable,coords,onButton,selected){
      var option;
      var select;
      var options;
      var options2;
      var search;
      var regex;
      var arrowPosition=0;

      
      return $(selector).each(function() {
        select = this;
        var length=$(select).attr("size");
        options = [];
        $(select).find('option').each(function() {
          options.push({value: $(this).val(), text: $(this).text()});
        });
        $(select).data('options', options);

        $(textbox).off().on('change keyup', function(e) {

        if (e.which == 40) {
          if(arrowPosition>=0 && arrowPosition<options.length){
            $(textbox).val(options[arrowPosition]['text']);
            if(arrowPosition!=(options.length-1)){
              arrowPosition+=1;
            }
          }
        }else if(e.which == 38){
          if(arrowPosition>=0 && arrowPosition<options.length){
            $(textbox).val(options[arrowPosition]['text']);
            if(arrowPosition!=0){
              arrowPosition=arrowPosition-1;
            }
          }
        }else{
          options2 = $(select).empty().data('options');
          $(select).attr("size", 0);
          search = $.trim($(this).val());
          if(search!=null && search!=""){
            regex = new RegExp("^"+search,"gi");

            $.each(options2, function(i) {
              if(options2!=null){
              option = options2[i];
              if(option.value!="" && option.value.match(regex) !== null) {
                $(select).append(
                  $('<option>').text(option.text).val(option.value)
                );
                $(select).attr("size", $(select).attr("size")+1);
                //If the user presses enter
                if (e.which == 13) {
                    var newType=option.value;
                    $("#newDropdownDiv").hide();
                    $("#select-type-input").show();
                    $('#chosen-select-type').empty();
                    $('#chosen-select-type')[0].value="";
                    $("#chosen-select-type").show();                    
                    $('#user-type-input').hide();

                    $("#select-type-input")[0].value="";

                    options2=null;

                    document.getElementById('select_a_tag').innerHTML = "";
                    
                    userChosenAttributesAndValues.push([attrName,option.value]);

                    //If the chosen value has consequent attributes
                    if(attrHash[newType].length>0){

                      seqAttrsTable=attrHash[newType];
                      numSeqAttr=0;

                      tagSeqs(userChosenAttributesAndValues,level+1,varTag,initialAttrIds, num, numSeqAttr, seqAttrsTable, categorySeqHash,focusOffset,focusNode, notCollapsedArgsTable,coords,onButton,selected);
                      return;
                    }else{ //If the chosen value doesn't have consequent attributes
 
                      if (numSeqAttr<(seqAttrsTable.length-1)){
                        tagSeqs(userChosenAttributesAndValues,level,varTag,initialAttrIds, num, numSeqAttr+1, seqAttrsTable, categorySeqHash,focusOffset,focusNode, notCollapsedArgsTable,coords,onButton,selected);
                        return;
                      }else if (numSeqAttr==(seqAttrsTable.length-1) && numSeqAttr==0){
                        seqAttrsTable=seqAttrsPerLevel[level-1];
                        tagSeqs(userChosenAttributesAndValues,level-1,varTag,initialAttrIds, num, -1, seqAttrsTable, categorySeqHash,focusOffset,focusNode, notCollapsedArgsTable,coords,onButton,selected);
                        return;
                      }else if (numSeqAttr==(seqAttrsTable.length-1) && numSeqAttr!=0){
                        if(level==1 || level==0){
                          tagSeqsInitial(userChosenAttributesAndValues,varTag,num+1, initialAttrIds, categorySeqHash,focusOffset,focusNode, notCollapsedArgsTable,coords,onButton,selected);
                          return;
                        }else{
                          seqAttrsTable=seqAttrsPerLevel[level-1];
                          tagSeqs(userChosenAttributesAndValues,level-1,varTag,initialAttrIds, num, -1, seqAttrsTable, categorySeqHash,focusOffset,focusNode, notCollapsedArgsTable,coords,onButton,selected);
                          return;
                        }
                      }
                    }
                }
              }
              }
            });

          }else{ // if search==null || search==""
            $(select).attr("size", length);
            $.each(options2, function(i) {
              option = options2[i];
              if(option.value!="") {
                $(select).append(
                  $('<option>').text(option.text).val(option.value)
                );

              }
            });
          }
          }
        });
      });
    }


      //The user types the value of a category attribute in advanced mode
    function userInputAttrValueAdvanced (level,textbox, medium, varTag,initialAttrIds, userChosenAttributesAndValues, attrName, num,numSeqAttr, seqAttrsTable,categorySeqHash, focusOffset,focusNode, notCollapsedArgsTable,coords,onButton,selected) {
      var option;
      var select;
      var options;
      var options2;
      var search;
      var regex;

      $(textbox).off().on('change keyup', function(e) {
        //If the user presses enter
        if (e.which == 13) {
            
          $("#newDropdownDiv").hide();
          $("#select-type-input").show();
          $("#select-type-input")[0].value="";
          $("#chosen-select-type").show();
          $('#chosen-select-type').empty();
          $('#chosen-select-type')[0].value="";
          $('#user-type-input').hide();
          document.getElementById('select_a_tag').innerHTML = "";

          
          var attrId=seqAttrsTable[numSeqAttr][0];
          var only=categorySeqHash[attrId]['only'];
          var length=categorySeqHash[attrId]['max_len'];

          var typedValue=cleanAttrValueRestrictAdvanced($(textbox).val(),only,length,level,textbox, medium, varTag,initialAttrIds, userChosenAttributesAndValues, attrName, num,numSeqAttr, seqAttrsTable,categorySeqHash, focusOffset,focusNode, notCollapsedArgsTable,coords,onButton,selected);
          
          if (typedValue.length>0){
            hidePopups();
            userChosenAttributesAndValues.push([attrName,cleanAttrValue(typedValue)]);
          
            if (numSeqAttr<(seqAttrsTable.length-1)){
              tagSeqs(userChosenAttributesAndValues,level,varTag,initialAttrIds, num, numSeqAttr+1, seqAttrsTable, categorySeqHash,focusOffset,focusNode, notCollapsedArgsTable,coords,onButton,selected);
              return;
            }else if (numSeqAttr==(seqAttrsTable.length-1) && numSeqAttr==0){
              seqAttrsTable=seqAttrsPerLevel[level-1];
              tagSeqs(userChosenAttributesAndValues,level-1,varTag,initialAttrIds, num, -1, seqAttrsTable, categorySeqHash,focusOffset,focusNode, notCollapsedArgsTable,coords,onButton,selected);
              return;
            }else if (numSeqAttr==(seqAttrsTable.length-1) && numSeqAttr!=0){
              if(level==1 || level==0){
                tagSeqsInitial(userChosenAttributesAndValues,varTag,num+1, initialAttrIds, categorySeqHash,focusOffset,focusNode, notCollapsedArgsTable,coords,onButton,selected);
                return;
              }else{
                seqAttrsTable=seqAttrsPerLevel[level-1];
                tagSeqs(userChosenAttributesAndValues,level-1,varTag,initialAttrIds, num, -1, seqAttrsTable, categorySeqHash,focusOffset,focusNode, notCollapsedArgsTable,coords,onButton,selected);
                return;
              }
            }
          }
        }
      });
    }

    //The user types the value of a category attribute
    function userInputAttrValueAdvancedInitial (level,textbox, medium, varTag,initialAttrIds,categorySeqHash, userChosenAttributesAndValues, attrName, num,categoryTable, focusOffset,focusNode, notCollapsedArgsTable,coords,onButton,selected) {
      var option;
      var select;
      var options;
      var options2;
      var search;
      var regex;

        $(textbox).off().on('change keyup', function(e) {
          //If the user presses enter
          if (e.which == 13) {
            
              $("#newDropdownDiv").hide();
              $("#select-type-input").show();
              $("#select-type-input")[0].value="";
              $("#chosen-select-type").show();
              $('#chosen-select-type').empty();
              $('#chosen-select-type')[0].value="";
              $('#user-type-input').hide();
              document.getElementById('select_a_tag').innerHTML = "";

              var attrId=initialAttrIds[0];
              var only=categorySeqHash[attrId]['only'];
              var length=categorySeqHash[attrId]['max_len'];

              var typedValue=cleanAttrValueRestrictAdvancedInitial($(textbox).val(),only,length,level,textbox, medium, varTag,initialAttrIds,categorySeqHash, userChosenAttributesAndValues, attrName, num,categoryTable, focusOffset,focusNode, notCollapsedArgsTable,coords,onButton,selected);
              $(textbox).empty();
              if (typedValue.length>0){
                hidePopups();
                userChosenAttributesAndValues.push([attrName,typedValue]);
                $(textbox).val('');
              
                if (num<(initialAttrIds.length-1)){
                  tagSeqsInitial(userChosenAttributesAndValues,varTag,num+1, initialAttrIds, categorySeqHash,focusOffset,focusNode, notCollapsedArgsTable,coords,onButton,selected);
                  return;
                }else if (num==(initialAttrIds.length-1)){
                  //addCategoryWithTypeS (medium, varTag, userChosenAttributesAndValues, focusOffset,focusNode);
                  tagSeqsInitial(userChosenAttributesAndValues,varTag,num+1, initialAttrIds, categorySeqHash,focusOffset,focusNode, notCollapsedArgsTable,coords,onButton,selected);
                  return;
                }
              }
          }
      });
      
    }

    function tagSeqs(userChosenAttributesAndValues,level,varTag,initialAttrIds, num, numSeqAttr, seqAttrsTable, categorySeqHash,focusOffset,focusNode, notCollapsedArgsTable,coords,onButton,selected){

      if(level<=0){
        tagSeqsInitial(userChosenAttributesAndValues,varTag,num+1, initialAttrIds, categorySeqHash,focusOffset,focusNode, notCollapsedArgsTable,coords,onButton,selected);
        return;
      }else{

      //When going up we register the information for this level. This information will be used when going down
      if(numSeqAttr!=-1){
        numsSeqAttrPerLevel[level]=numSeqAttr;
        seqAttrsPerLevel[level]=seqAttrsTable;
      }
      
      var attrId;
      if (numSeqAttr>-1){ //When going up
        attrId=seqAttrsTable[numSeqAttr][0];
      }else if(numSeqAttr==-1){ //When going down
        //We take the registered number and take the following one
        numSeqAttr=numsSeqAttrPerLevel[level]+1;
        //And we register the number of the attribute we are going to use. It will be the last attribute used on this level
        numsSeqAttrPerLevel[level]=numSeqAttr;

        seqAttrsTable=seqAttrsPerLevel[level];

        //If the last attribute of this level was defined, we go down
        if(numSeqAttr>=seqAttrsTable.length){
          seqAttrsTable=seqAttrsPerLevel[level-1];
          tagSeqs(userChosenAttributesAndValues,level-1,varTag,initialAttrIds, num, -1, seqAttrsTable, categorySeqHash,focusOffset,focusNode, notCollapsedArgsTable,coords,onButton,selected);
          return;
        }else{
          attrId=seqAttrsTable[numSeqAttr][0];
        }        
      }

      var categoryTypesHa=categorySeqHash[attrId];
      var attrName=categoryTypesHa['name'];
      var allow_user_input=categoryTypesHa['allow_user_input'];
      var defaultValue=categoryTypesHa['default'];
      attrHash=categoryTypesHa['values'];
      var categoryTypesTable=Object.keys(attrHash);
      
      var i;

      //If an attribute has no predefined values and no user input possibility, give an error message
      if(categoryTypesTable.length==0 && allow_user_input==0){
        alert("There is an error in the attribute's "+attrName+" conception. It should either have predefined values or allow user input.");
      }else if(categoryTypesTable.length==1 && allow_user_input==0){
        var newType=categoryTypesTable[0];
        userChosenAttributesAndValues.push([attrName,newType]);
        //If the chosen value has consequent attributes
        if(attrHash[newType].length>0){
          seqAttrsTable=attrHash[newType];
          numSeqAttr=0;

          tagSeqs(userChosenAttributesAndValues,level+1,varTag,initialAttrIds, num, numSeqAttr, seqAttrsTable, categorySeqHash,focusOffset,focusNode, notCollapsedArgsTable,coords,onButton,selected);
          return;

        }else{ //If the chosen value doesn't have consequent attributes
 
          if (numSeqAttr<(seqAttrsTable.length-1)){
            tagSeqs(userChosenAttributesAndValues,level,varTag,initialAttrIds, num, numSeqAttr+1, seqAttrsTable, categorySeqHash,focusOffset,focusNode, notCollapsedArgsTable,coords,onButton,selected);
            return;
          }else if (numSeqAttr==(seqAttrsTable.length-1) && numSeqAttr==0){
            seqAttrsTable=seqAttrsPerLevel[level-1];
            tagSeqs(userChosenAttributesAndValues,level-1,varTag,initialAttrIds, num, -1, seqAttrsTable, categorySeqHash,focusOffset,focusNode, notCollapsedArgsTable,coords,onButton,selected);
            return;
          }else if (numSeqAttr==(seqAttrsTable.length-1)){
            if(level==1 || level==0){
              tagSeqsInitial(userChosenAttributesAndValues,varTag,num+1, initialAttrIds, categorySeqHash,focusOffset,focusNode, notCollapsedArgsTable,coords,onButton,selected);
              return;
            }else{
              seqAttrsTable=seqAttrsPerLevel[level-1];
              tagSeqs(userChosenAttributesAndValues,level-1,varTag,initialAttrIds, num, -1, seqAttrsTable, categorySeqHash,focusOffset,focusNode, notCollapsedArgsTable,coords,onButton,selected);
              return;
            }
          }
        }
      }else{
        //If there are predefined values for this attribute
        if(categoryTypesTable.length>0){
          //Create the new dropdown menu for category types
          var newDropdown=addNewDropdown(categoryTypesTable.length,attrName, "Select");
          var option = document.createElement("option");
          option.value="";
          option.selected="checked";
          option.innerHTML="";
          newDropdown.append(option);

          for(i=0; i< categoryTypesTable.length; i++){
            //Add an option for the category types dropdown menu
            addAnOption(newDropdown,categoryTypesTable[i]);
                    
            if(i==(categoryTypesTable.length-1)){
              if(onButton){
                $("#newDropdownDiv").css({'top':coords.y,'left':'','right':'4vw', 'position':'absolute'});
              }else{
                $("#newDropdownDiv").css({'top':coords.y,'left':coords.x,'right':'', 'position':'absolute'});
              }
            
              $("#newDropdownDiv").show();
              $('#select-type-input').show();
              $("#select-type-input")[0].value=defaultValue;
              $('#select-type-input').focus();
              $('#chosen-select-type')[0].value=defaultValue;
              $("#chosen-select-type").show();

              if(allow_user_input==1){ //If the user can enter a new value for this attribute
                $('#user-type-input').value=defaultValue;      
                $('#user-type-input').show();
                setTimeout(function(){$('#user-type-input').focus()}, 1); //A trick to make focus work (known bug in the internet dev community)
                userInputAttrValueAdvanced (level,$('#user-type-input'), medium, varTag,initialAttrIds, userChosenAttributesAndValues, attrName, num,numSeqAttr, seqAttrsTable,categorySeqHash, focusOffset,focusNode, notCollapsedArgsTable,coords,onButton,selected);
                return;
              }

              filterByTextAdvanced($('#chosen-select-type'),level,$('#select-type-input'), medium, varTag,initialAttrIds, userChosenAttributesAndValues, attrName,attrHash, num,numSeqAttr, seqAttrsTable,categorySeqHash, focusOffset,focusNode, notCollapsedArgsTable,coords,onButton,selected);
                      
              $("#chosen-select-type").off().change(attrName,function(event3){                       
                document.getElementById('select_a_tag').innerHTML = "";                      
                if(event3.target == this){
                  var type=$(this).val();
                  if(type!=null && type!=''){
                    var newType=type;
                    type='';

                    userChosenAttributesAndValues.push([attrName,newType]);
                    hidePopups();    
                    $("#newDropdownDiv").hide();
                    $('#chosen-select-type').empty();
                    $('#chosen-select-type')[0].value="";

                    //If the chosen value has consequent attributes
                    if(attrHash[newType].length>0){
                      seqAttrsTable=attrHash[newType];
                      numSeqAttr=0;

                      tagSeqs(userChosenAttributesAndValues,level+1,varTag,initialAttrIds, num, numSeqAttr, seqAttrsTable, categorySeqHash,focusOffset,focusNode, notCollapsedArgsTable,coords,onButton,selected);
                      return;

                    }else{ //If the chosen value doesn't have consequent attributes
 
                      if (numSeqAttr<(seqAttrsTable.length-1)){
                        tagSeqs(userChosenAttributesAndValues,level,varTag,initialAttrIds, num, numSeqAttr+1, seqAttrsTable, categorySeqHash,focusOffset,focusNode, notCollapsedArgsTable,coords,onButton,selected);
                        return;
                      }else if (numSeqAttr==(seqAttrsTable.length-1) && numSeqAttr==0){
                        seqAttrsTable=seqAttrsPerLevel[level-1];
                        tagSeqs(userChosenAttributesAndValues,level-1,varTag,initialAttrIds, num, -1, seqAttrsTable, categorySeqHash,focusOffset,focusNode, notCollapsedArgsTable,coords,onButton,selected);
                        return;
                      }else if (numSeqAttr==(seqAttrsTable.length-1)){
                        if(level==1 || level==0){
                          tagSeqsInitial(userChosenAttributesAndValues,varTag,num+1, initialAttrIds, categorySeqHash,focusOffset,focusNode, notCollapsedArgsTable,coords,onButton,selected);
                          return;
                        }else{
                          seqAttrsTable=seqAttrsPerLevel[level-1];
                          tagSeqs(userChosenAttributesAndValues,level-1,varTag,initialAttrIds, num, -1, seqAttrsTable, categorySeqHash,focusOffset,focusNode, notCollapsedArgsTable,coords,onButton,selected);
                          return;
                        }
                      }
                    }         
                  }
                }     
              });
            }
          }
        }else{ //If there are no predefined values for this attribute
          if(allow_user_input==1){ //If the user can enter a new value for this attribute
            //Create the new dropdown menu for category types
            var newDropdown=addNewDropdown(categoryTypesTable.length,attrName, "Input");
            if(onButton){
              $("#newDropdownDiv").css({'top':coords.y,'left':'','right':'4vw', 'position':'absolute'});
            }else{
              $("#newDropdownDiv").css({'top':coords.y,'left':coords.x,'right':'', 'position':'absolute'});
            }
          
            $("#newDropdownDiv").show();
            $("#select-type-input").hide();
            $("#select-type-input")[0].value="";
            $('#chosen-select-type').empty();
            $('#chosen-select-type')[0].value="";
            $("#chosen-select-type").hide();          
            $('#user-type-input').show();
            setTimeout(function(){$('#user-type-input').focus()}, 1); //A trick to make focus work (known bug in the internet dev community)
            userInputAttrValueAdvanced (level,$('#user-type-input'), medium, varTag,initialAttrIds, userChosenAttributesAndValues, attrName, num,numSeqAttr, seqAttrsTable,categorySeqHash, focusOffset,focusNode, notCollapsedArgsTable,coords,onButton,selected);
            return;
          }else{ //The user can't enter a new value (erroneous case: the attribute exists, but has no values and can't obtain one)

            alert("There is a mistake in the attribute \""+attrName+"\" design: an attribute should either have a list of predefined values or allow user input.");
            return false;
          
          }
        }
        //return;
      }
      }
      return;
    }


    function tagSeqsInitial(userChosenAttributesAndValues,varTag,num, initialAttrIds, categorySeqHash,focusOffset,focusNode, notCollapsedArgsTable,coords,onButton,selected){

      if(num>=initialAttrIds.length){
        if(selected==true){
          medium.tagSelection3(varTag, userChosenAttributesAndValues, anchorNode, focusNode, anchorOffset, focusOffset);
        }else{
          addCategoryWithTypeS (medium, varTag, userChosenAttributesAndValues, focusOffset,focusNode);
        }
        return;
      }
      var attrId=parseInt(initialAttrIds[num]);

      var categoryTypesHa=categorySeqHash[attrId];
      var attrName=categoryTypesHa['name'];
      var allow_user_input=categoryTypesHa['allow_user_input'];
      attrHash=categoryTypesHa['values'];
      var defaultValue=categoryTypesHa['default'];
      var categoryTypesTable=Object.keys(attrHash); // categoryTypesTable now contains all the possible values of this attribute
      var i;
   

      //If an attribute has no predefined values and no user input possibility, give an error message
      if(categoryTypesTable.length==0 && allow_user_input==0){
        alert("There is an error in the attribute's "+attrName+" conception. It should either have predefined values or allow user input.");
      }else if(categoryTypesTable.length==1 && allow_user_input==0){ //If an attribute has one predefined value and no user input possibility
        var newType=categoryTypesTable[0];
        userChosenAttributesAndValues.push([attrName,newType]);
        //If the chosen value has consequent attributes
        if(Object.keys(attrHash).length>0 && attrHash[newType].length>0){

          seqAttrsTable=attrHash[newType];

          var numSeqAttr=0;
          var seqAttrId=seqAttrsTable[numSeqAttr][0];
          var seqAttrName=seqAttrsTable[numSeqAttr][1];

            tagSeqs(userChosenAttributesAndValues,1,varTag,initialAttrIds, num, numSeqAttr, seqAttrsTable, categorySeqHash,focusOffset,focusNode, notCollapsedArgsTable,coords,onButton,selected);
        }else{
                            
          if (num<(initialAttrIds.length-1)){
            tagSeqsInitial(userChosenAttributesAndValues,varTag,num+1, initialAttrIds, categorySeqHash,focusOffset,focusNode, notCollapsedArgsTable,coords,onButton,selected);
          }else if (num==(initialAttrIds.length-1)){
            if(selected==true){
              medium.tagSelection3(varTag, userChosenAttributesAndValues, anchorNode, focusNode, anchorOffset, focusOffset);
            }else{
              addCategoryWithTypeS (medium, varTag, userChosenAttributesAndValues, focusOffset,focusNode);
            }
          }
        }
      }else{
        //If there are predefined values for this attribute
        if(categoryTypesTable.length>0){
          //Create the new dropdown menu for category types
          var newDropdown=addNewDropdown(categoryTypesTable.length,attrName, "Select");
          var option = document.createElement("option");
          option.value="";
          option.selected="checked";
          option.innerHTML="";
          newDropdown.append(option);

          for(i=0; i< categoryTypesTable.length; i++){
            //Add an option for the category types dropdown menu
            addAnOption(newDropdown,categoryTypesTable[i]);
                    
            if(i==(categoryTypesTable.length-1)){
              if(onButton){
                $("#newDropdownDiv").css({'top':coords.y,'left':'','right':'4vw', 'position':'absolute'});
              }else{
                $("#newDropdownDiv").css({'top':coords.y,'left':coords.x,'right':'', 'position':'absolute'});
              }
            
              $("#newDropdownDiv").show();
              $('#select-type-input').show();
              $("#select-type-input")[0].value=defaultValue;
              $('#select-type-input').focus();
              //$('#chosen-select-type').empty();
              $('#chosen-select-type')[0].value="";
              $("#chosen-select-type").show();

              if(allow_user_input==1){ //If the user can enter a new value for this attribute
                $('#user-type-input').value=defaultValue;        
                $('#user-type-input').show();
                setTimeout(function(){$('#user-type-input').focus()}, 1); //A trick to make focus work (known bug in the internet dev community)

                userInputAttrValueAdvancedInitial (0,$('#user-type-input'), medium, varTag,initialAttrIds,categorySeqHash, userChosenAttributesAndValues, attrName, num,categorySeqHash, focusOffset,focusNode, notCollapsedArgsTable,coords,onButton,selected);
                
              }

              filterByTextAdvanced($('#chosen-select-type'),0,$('#select-type-input'), medium, varTag,initialAttrIds, userChosenAttributesAndValues, attrName, attrHash,num,num,initialAttrIds,categorySeqHash,focusOffset,focusNode, notCollapsedArgsTable,coords,onButton,selected);
                     
              $("#chosen-select-type").off().change(attrName,function(event3){
                if(event3.target == this){
                  var type=$(this).val();
                  if(type!=null && type!=''){
                    var newType=type;
                    type='';

                    userChosenAttributesAndValues.push([attrName,newType]);
                    hidePopups();
                    $("#newDropdownDiv").hide();
                    $('#user-type-input').empty();
                    $('#chosen-select-type').empty();
                    $('#chosen-select-type')[0].value="";
                    document.getElementById('select_a_tag').innerHTML = "";
                  
                    //If the chosen value has consequent attributes
                    if(Object.keys(attrHash).length>0 && attrHash[newType].length>0){

                      seqAttrsTable=attrHash[newType];

                      var numSeqAttr=0;
                      var seqAttrId=seqAttrsTable[numSeqAttr][0];
                      var seqAttrName=seqAttrsTable[numSeqAttr][1];

                      tagSeqs(userChosenAttributesAndValues,1,varTag,initialAttrIds, num, numSeqAttr, seqAttrsTable, categorySeqHash,focusOffset,focusNode, notCollapsedArgsTable,coords,onButton,selected);
                    }else{
                            
                      if (num<(initialAttrIds.length-1)){
                        tagSeqsInitial(userChosenAttributesAndValues,varTag,num+1, initialAttrIds, categorySeqHash,focusOffset,focusNode, notCollapsedArgsTable,coords,onButton,selected);
                      }else if (num==(initialAttrIds.length-1)){
                        if(selected==true){
                          medium.tagSelection3(varTag, userChosenAttributesAndValues, anchorNode, focusNode, anchorOffset, focusOffset);
                        }else{
                          addCategoryWithTypeS (medium, varTag, userChosenAttributesAndValues, focusOffset,focusNode);
                        }
                      }
                    }         
                  }
                }
                      
              });
            }
          }
        }else{ //If there are no predefined values for this attribute
          if(allow_user_input==1){ //If the user can enter a new value for this attribute
            //Create the new dropdown menu for category types
            var newDropdown=addNewDropdown(categoryTypesTable.length,attrName, "Input");
            if(onButton){
              $("#newDropdownDiv").css({'top':coords.y,'left':'','right':'4vw', 'position':'absolute'});
            }else{
              $("#newDropdownDiv").css({'top':coords.y,'left':coords.x,'right':'', 'position':'absolute'});
            }
          
            $("#newDropdownDiv").show();
            $("#select-type-input").hide();
            $("#select-type-input")[0].value="";
            $('#chosen-select-type').empty();
            $('#chosen-select-type')[0].value="";
            $("#chosen-select-type").hide();          
            $('#user-type-input').show();
            setTimeout(function(){$('#user-type-input').focus()}, 1); //A trick to make focus work (known bug in the internet dev community)
            userInputAttrValueAdvancedInitial (0,$('#user-type-input'), medium, varTag,initialAttrIds,categorySeqHash, userChosenAttributesAndValues, attrName, num,categorySeqHash, focusOffset,focusNode, notCollapsedArgsTable,coords,onButton,selected);
          }else{ //The user can't enter a new value (erroneous case: the attribute exists, but has no values and can't obtain one)

            alert("There is a mistake in the attribute \""+attrName+"\" design: an attribute should either have a list of predefined values or allow user input.");
            return false;
          
          }
        }

      }
    }

    function getNextCollapsed(userChosenAttributesAndValues, varTag,num, categoryTable, focusOffset,focusNode, notCollapsedArgsTable,coords,onButton){
      var i;    
      var categoryTypesTable=categoryTable[num][2];
      var attrName=categoryTable[num][0];
      var allow_user_input=categoryTable[num][1];
      var defaultValue=categoryTable[num][3];

      //If there is only one possible value for this attribute and no user input is allowed
      if(categoryTypesTable.length==1 && allow_user_input!=1){
        userChosenAttributesAndValues.push([attrName,categoryTypesTable[0]]);

        if (num<(categoryTable.length-1)){
          getNextCollapsed(userChosenAttributesAndValues, varTag,num+1, categoryTable, focusOffset,focusNode, notCollapsedArgsTable,coords,onButton);
        }

        if (num==(categoryTable.length-1)){
          addCategoryWithTypeS (medium, varTag, userChosenAttributesAndValues, focusOffset,focusNode);
        }

      }else if(categoryTypesTable.length>0){ //If there are more than one predefined values for this attribute
        
        //Create the new dropdown menu for category types
        var newDropdown=addNewDropdown(categoryTypesTable.length,attrName, "Select");
        var option = document.createElement("option");
        option.value="";
        option.selected="checked";
        option.innerHTML="";
        newDropdown.append(option);

        for(i=0; i< categoryTypesTable.length; i++){
          //Add an option for the category types dropdown menu
          addAnOption(newDropdown,categoryTypesTable[i]);
                    
          if(i==(categoryTypesTable.length-1)){
            if(onButton){
              $("#newDropdownDiv").css({'top':coords.y,'left':'','right':'4vw', 'position':'absolute'});
            }else{
              $("#newDropdownDiv").css({'top':coords.y,'left':coords.x,'right':'', 'position':'absolute'});
            }
            
            $("#newDropdownDiv").show();
            $('#select-type-input').show();
            $("#select-type-input")[0].value=defaultValue;
            $('#select-type-input').focus();
            //$('#chosen-select-type').empty();
            $("#chosen-select-type").show();

            if(allow_user_input==1){ //If the user can enter a new value for this attribute
              $('#user-type-input').value=defaultValue;         
              $('#user-type-input').show();
              setTimeout(function(){$('#user-type-input').focus()}, 1); //A trick to make focus work (known bug in the internet dev community)
              $('#user-type-input').off().on('change keyup', function(e) {
                userInputAttrValueCollapsed($('#user-type-input'), medium, varTag, userChosenAttributesAndValues, attrName, num,categoryTable, focusOffset,focusNode, notCollapsedArgsTable,coords,onButton);
              });
            }

            //$('#chosen-select-type').filterByTextCollapsed($('#select-type-input'), medium, varTag, userChosenAttributesAndValues, attrName, num,categoryTable,focusOffset,focusNode, notCollapsedArgsTable,coords,onButton);
            filterByTextCollapsed('#chosen-select-type', $('#select-type-input'), medium, varTag, userChosenAttributesAndValues, attrName, num,categoryTable,focusOffset,focusNode, notCollapsedArgsTable,coords,onButton);
            

            $("#chosen-select-type").off().change(attrName,function(event3){                       
              document.getElementById('select_a_tag').innerHTML = "";                      
              if(event3.target == this){
                var type=$(this).val();
                if(type!=null && type!=''){
                  var newType=type;
                  type='';

                  userChosenAttributesAndValues.push([attrName,newType]);
                  hidePopups();         
                  $("#newDropdownDiv").hide();
                  $('#chosen-select-type').empty();
                  $('#chosen-select-type')[0].value="";
                            
                  if (num<(categoryTable.length-1)){
                    getNextCollapsed(userChosenAttributesAndValues, varTag,num+1, categoryTable, focusOffset,focusNode, notCollapsedArgsTable,coords,onButton);
                  }

                  if (num==(categoryTable.length-1)){
                    addCategoryWithTypeS (medium, varTag, userChosenAttributesAndValues, focusOffset,focusNode);
                  }
                            
                }
              }
                      
            });
          }
        }
      }else{ //If there are no predefined values for this attribute
        if(allow_user_input==1){ //If the user can enter a new value for this attribute
          //Create the new dropdown menu for category types
          var newDropdown=addNewDropdown(categoryTypesTable.length,attrName, "Input");
          if(onButton){
            $("#newDropdownDiv").css({'top':coords.y,'left':'','right':'4vw', 'position':'absolute'});
          }else{
            $("#newDropdownDiv").css({'top':coords.y,'left':coords.x,'right':'', 'position':'absolute'});
          }
          
          $("#newDropdownDiv").show();
          $("#select-type-input").hide();
          $("#select-type-input")[0].value="";
          $('#chosen-select-type').empty();
          $('#chosen-select-type')[0].value="";
          $("#chosen-select-type").hide();          
          $('#user-type-input').show();
          setTimeout(function(){$('#user-type-input').focus()}, 1); //A trick to make focus work (known bug in the internet dev community)
          userInputAttrValueCollapsed ($('#user-type-input'), medium, varTag, userChosenAttributesAndValues, attrName, num,categoryTable, focusOffset,focusNode, notCollapsedArgsTable,coords,onButton);
        }else{ //The user can't enter a new value (erroneous case: the attribute exists, but has no values and can't obtain one)

          alert("There is a mistake in the attribute \""+attrName+"\" design: an attribute should either have a list of predefined values or allow user input.");
          return false;
          
        }
      }
    }

    function launchNewInput(textbox, medium, varTag, userInputAttrValueFunctionType, userChosenAttributesAndValues, attrName, num,categoryTable, focusOffset,focusNode, notCollapsedArgsTable,coords,onButton){
      var defaultValue=categoryTable[num][3];
      var categoryTypesTable=categoryTable[num][2];
      var i;

      if(categoryTypesTable.length>0){  //If there are predefined values for this attribute
        //Create the new dropdown menu for category types
        var newDropdown=addNewDropdown(categoryTypesTable.length,attrName, "Select");
        var option = document.createElement("option");
        option.value="";
        option.selected="checked";
        option.innerHTML="";
        newDropdown.append(option);

        for(i=0; i< categoryTypesTable.length; i++){
          //Add an option for the category types dropdown menu
            addAnOption(newDropdown,categoryTypesTable[i]);
                    
            if(i==(categoryTypesTable.length-1)){
              if(onButton==true){
              $("#newDropdownDiv").css({'top':coords.y,'left':'','right':'4vw', 'position':'absolute'});
            }else{
              $("#newDropdownDiv").css({'top':coords.y,'left':coords.x, 'right':'','position':'absolute'});
            }
            
            $("#newDropdownDiv").show();
            $('#select-type-input').show();
            $("#select-type-input")[0].value=defaultValue;
            $('#select-type-input').focus();

              $('#user-type-input').value=defaultValue;         
              $('#user-type-input').show();
              setTimeout(function(){$('#user-type-input').focus()}, 1); //A trick to make focus work (known bug in the internet dev community)
              
              if (userInputAttrValueFunctionType=="ss"){
                userInputAttrValueSomethingSelected (textbox, medium, varTag, userChosenAttributesAndValues, attrName, num,categoryTable, focusOffset,focusNode, notCollapsedArgsTable,coords,onButton);
              }else if (userInputAttrValueFunctionType=="co"){
                userInputAttrValueCollapsed (textbox, medium, varTag, userChosenAttributesAndValues, attrName, num,categoryTable, focusOffset,focusNode, notCollapsedArgsTable,coords,onButton);
              }
            }
          }
        }else{  //If there are no predefined values for this attribute
          if(onButton==true){
              $("#newDropdownDiv").css({'top':coords.y,'left':'','right':'4vw', 'position':'absolute'});
            }else{
              $("#newDropdownDiv").css({'top':coords.y,'left':coords.x, 'right':'','position':'absolute'});
            }
            
          $("#newDropdownDiv").show();
          $('#chosen-select-type').empty();
          $('#chosen-select-type')[0].value="";
          $("#select-type-input").hide();
          $("#chosen-select-type").hide();
          $('#user-type-input').value=defaultValue;         
          $('#user-type-input').show();
          setTimeout(function(){$('#user-type-input').focus()}, 1); //A trick to make focus work (known bug in the internet dev community)
          
          if (userInputAttrValueFunctionType=="ss"){  
            userInputAttrValueSomethingSelected (textbox, medium, varTag, userChosenAttributesAndValues, attrName, num,categoryTable, focusOffset,focusNode, notCollapsedArgsTable,coords,onButton);
          }else if (userInputAttrValueFunctionType=="co"){
            userInputAttrValueCollapsed (textbox, medium, varTag, userChosenAttributesAndValues, attrName, num,categoryTable, focusOffset,focusNode, notCollapsedArgsTable,coords,onButton);
          }
        }
    }


    function launchNewInputAdvanced(level,textbox, medium, varTag,initialAttrIds, userChosenAttributesAndValues, attrName, num,numSeqAttr, seqAttrsTable,categorySeqHash, focusOffset,focusNode, notCollapsedArgsTable,coords,onButton,selected){
      var attrId=seqAttrsTable[numSeqAttr][num];

      var predefinedValues=categorySeqHash[attrId]['values'];
      var defaultValue=categorySeqHash[attrId]['default'];
      if(defaultValue==null){
        defaultValue="";
      }

      var categoryTypesTable=Object.keys(predefinedValues);

      if(categoryTypesTable.length>0){  //If there are predefined values for this attribute
        //Create the new dropdown menu for category types
        var newDropdown=addNewDropdown(categoryTypesTable.length,attrName, "Select");
        var option = document.createElement("option");
        option.value="";
        option.selected="checked";
        option.innerHTML="";
        newDropdown.append(option);
        var i;
        for(i=0; i< categoryTypesTable.length; i++){
          //Add an option for the category types dropdown menu
            addAnOption(newDropdown,categoryTypesTable[i]);
                    
            if(i==(categoryTypesTable.length-1)){
              if(onButton==true){
              $("#newDropdownDiv").css({'top':coords.y,'left':'','right':'4vw', 'position':'absolute'});
            }else{
              $("#newDropdownDiv").css({'top':coords.y,'left':coords.x, 'right':'','position':'absolute'});
            }
            
            $("#newDropdownDiv").show();
            $('#select-type-input').show();
            $("#select-type-input")[0].value=defaultValue;
            $('#select-type-input').focus();

              $('#user-type-input').value=defaultValue;         
              $('#user-type-input').show();
              setTimeout(function(){$('#user-type-input').focus()}, 1); //A trick to make focus work (known bug in the internet dev community)
              userInputAttrValueAdvanced(level,textbox, medium, varTag,initialAttrIds, userChosenAttributesAndValues, attrName, num,numSeqAttr, seqAttrsTable,categorySeqHash, focusOffset,focusNode, notCollapsedArgsTable,coords,onButton,selected);  
              
            }
          }
        }else{  //If there are no predefined values for this attribute
          if(onButton==true){
              $("#newDropdownDiv").css({'top':coords.y,'left':'','right':'4vw', 'position':'absolute'});
            }else{
              $("#newDropdownDiv").css({'top':coords.y,'left':coords.x, 'right':'','position':'absolute'});
            }
            
          $("#newDropdownDiv").show();
          $('#chosen-select-type').empty();
          $('#chosen-select-type')[0].value="";
          $("#select-type-input").hide();
          $("#chosen-select-type").hide();
          $('#user-type-input').value=defaultValue;         
          $('#user-type-input').show();
          setTimeout(function(){$('#user-type-input').focus()}, 1); //A trick to make focus work (known bug in the internet dev community)
          userInputAttrValueAdvanced (level,textbox, medium, varTag,initialAttrIds, userChosenAttributesAndValues, attrName, num,numSeqAttr, seqAttrsTable,categorySeqHash, focusOffset,focusNode, notCollapsedArgsTable,coords,onButton,selected);  
          
        }
    }

    function launchNewInputAdvancedInitial(level,textbox, medium, varTag,initialAttrIds,categorySeqHash, userChosenAttributesAndValues, attrName, num,categoryTable, focusOffset,focusNode, notCollapsedArgsTable,coords,onButton,selected){
      var attrId=initialAttrIds[num];
      var attrName=categorySeqHash[attrId]['name'];
      var predefinedValues=categorySeqHash[attrId]['values'];
      var defaultValue=categorySeqHash[attrId]['default'];
      if(defaultValue==null){
        defaultValue="";
      }

      var categoryTypesTable=Object.keys(predefinedValues);

      if(categoryTypesTable.length>0){  //If there are predefined values for this attribute
        hidePopups();
        //Create the new dropdown menu for category types
        var newDropdown=addNewDropdown(categoryTypesTable.length,attrName, "Select");
        var option = document.createElement("option");
        option.value="";
        option.selected="checked";
        option.innerHTML="";
        newDropdown.append(option);

        var i;

        for(i=0; i< categoryTypesTable.length; i++){
          //Add an option for the category types dropdown menu
            addAnOption(newDropdown,categoryTypesTable[i]);
                    
            if(i==(categoryTypesTable.length-1)){
              if(onButton==true){
              $("#newDropdownDiv").css({'top':coords.y,'left':'','right':'4vw', 'position':'absolute'});
            }else{
              $("#newDropdownDiv").css({'top':coords.y,'left':coords.x, 'right':'','position':'absolute'});
            }
            
            $("#newDropdownDiv").show();
            $('#select-type-input').show();
            $("#select-type-input")[0].value=defaultValue;
            $('#select-type-input').focus();

              $('#user-type-input').value=defaultValue;         
              $('#user-type-input').show();
              setTimeout(function(){$('#user-type-input').focus()}, 1); //A trick to make focus work (known bug in the internet dev community)
              userInputAttrValueAdvancedInitial(0,$('#user-type-input'), medium, varTag,initialAttrIds,categorySeqHash, userChosenAttributesAndValues, attrName, num,categorySeqHash, focusOffset,focusNode, notCollapsedArgsTable,coords,onButton,selected);
          
            }
          }
        }else{  //If there are no predefined values for this attribute
          if(onButton==true){
              $("#newDropdownDiv").css({'top':coords.y,'left':'','right':'4vw', 'position':'absolute'});
            }else{
              $("#newDropdownDiv").css({'top':coords.y,'left':coords.x, 'right':'','position':'absolute'});
            }
            
          $("#newDropdownDiv").show();
          $('#chosen-select-type').empty();
          $('#chosen-select-type')[0].value="";
          $("#select-type-input").hide();
          $("#chosen-select-type").hide();
          $('#user-type-input').value=defaultValue;         
          $('#user-type-input').show();
          setTimeout(function(){$('#user-type-input').focus()}, 1); //A trick to make focus work (known bug in the internet dev community)
          
          userInputAttrValueAdvancedInitial (0,$('#user-type-input'), medium, varTag,initialAttrIds,categorySeqHash, userChosenAttributesAndValues, attrName, num,categorySeqHash, focusOffset,focusNode, notCollapsedArgsTable,coords,onButton,selected);
          
        }
    }

    //Remove forbidden characters from an attribute's value
    function cleanAttrValueRestrict(val, only, length, userInputAttrValueFunctionType, textbox, medium, varTag, userChosenAttributesAndValues, attrName, num,categoryTable, focusOffset,focusNode, notCollapsedArgsTable,coords,onButton){
      var defaultValue=categoryTable[num][3];
      var categoryTypesTable=categoryTable[num][2];

      val=$( $.parseHTML(val) ).text(); //Against malicious user input (a script in an input field)
      if(val==null || val==''){
        alert("The attribute's value is empty.");
        return "";
      }else{
        val=val.replace(/[<&"'>]+/g, "_");
        if (length!=0 && val.length!=length){
          var okOrNot=checkIfInputValueCorrespondsToRestrictionsLength(only.toString(), val, "the attribute", length);

          launchNewInput(textbox, medium, varTag, userInputAttrValueFunctionType, userChosenAttributesAndValues, attrName, num,categoryTable, focusOffset,focusNode, notCollapsedArgsTable,coords,onButton);
          
        }else{
          var okOrNot=checkIfInputValueCorrespondsToRestrictions(only.toString(), val, "the attribute", length);
          if(okOrNot==true){
            return val;
          }else{

            launchNewInput(textbox, medium, varTag, userInputAttrValueFunctionType, userChosenAttributesAndValues, attrName, num,categoryTable, focusOffset,focusNode, notCollapsedArgsTable,coords,onButton);

            }
        }
      }     
    }

    function cleanAttrValueRestrictAdvancedInitial(val,only,length,level,textbox, medium, varTag,initialAttrIds,categorySeqHash, userChosenAttributesAndValues, attrName, num,categoryTable, focusOffset,focusNode, notCollapsedArgsTable,coords,onButton,selected){
      val=$( $.parseHTML(val) ).text(); //Against malicious user input (a script in an input field)

      if(val==null || val==''){
        alert("The attribute's value is empty.");
        return "";
      }else{
        val=val.replace(/[<&"'>]+/g, "_");
        if (length!=0 && val.length!=length){
          var okOrNot=checkIfInputValueCorrespondsToRestrictionsLength(only.toString(), val, "the attribute", length);

          launchNewInputAdvancedInitial(level,textbox, medium, varTag,initialAttrIds,categorySeqHash, userChosenAttributesAndValues, attrName, num,categoryTable, focusOffset,focusNode, notCollapsedArgsTable,coords,onButton,selected);
          
        }else{
          var okOrNot=checkIfInputValueCorrespondsToRestrictions(only.toString(), val, "the attribute", length);
          if(okOrNot==true){
            hidePopups();
            $(textbox).empty();
            return val;
          }else{

            launchNewInputAdvancedInitial(level,textbox, medium, varTag,initialAttrIds,categorySeqHash, userChosenAttributesAndValues, attrName, num,categoryTable, focusOffset,focusNode, notCollapsedArgsTable,coords,onButton,selected);

          }
        }
      }
    }

    function cleanAttrValueRestrictAdvanced(val,only,length,level,textbox, medium, varTag,initialAttrIds, userChosenAttributesAndValues, attrName, num,numSeqAttr, seqAttrsTable,categorySeqHash, focusOffset,focusNode, notCollapsedArgsTable,coords,onButton,selected){
      val=$( $.parseHTML(val) ).text(); //Against malicious user input (a script in an input field)

      if(val==null || val==''){
        alert("The attribute's value is empty.");
        return "";
      }else{
        val=val.replace(/[<&"'>]+/g, "_");
        if (length!=0 && val.length!=length){
          var okOrNot=checkIfInputValueCorrespondsToRestrictionsLength(only.toString(), val, "the attribute", length);
          launchNewInputAdvanced(level,textbox, medium, varTag,initialAttrIds, userChosenAttributesAndValues, attrName, num,numSeqAttr, seqAttrsTable,categorySeqHash, focusOffset,focusNode, notCollapsedArgsTable,coords,onButton,selected);
          
        }else{
          var okOrNot=checkIfInputValueCorrespondsToRestrictions(only.toString(), val, "the attribute", length);
          if(okOrNot==true){
            hidePopups();
            $(textbox).empty();
            return val;
          }else{

            launchNewInputAdvanced(level,textbox, medium, varTag,initialAttrIds, userChosenAttributesAndValues, attrName, num,numSeqAttr, seqAttrsTable,categorySeqHash, focusOffset,focusNode, notCollapsedArgsTable,coords,onButton,selected);

          }
        }
      }
    }
            

    function cleanAttrValueForChangeMenu(name, val, only, length){
      val=$( $.parseHTML(val) ).text(); //Against malicious user input (a script in an input field)
      if(val==null || val==''){
        alert("The attribute's "+name+" value is empty.");
        return "";
      }else{
        val=val.replace(/[<&"'>]+/g, "_");
        if (length!=0 && val.length!=length){
          var okOrNot=checkIfInputValueCorrespondsToRestrictionsLength(only.toString(), val, name, length);
          return "";
             
        }else{
          var okOrNot=checkIfInputValueCorrespondsToRestrictions(only.toString(), val, name, length);
          if(okOrNot==true){
            hidePopups();
            $(textbox).empty();
            return val;
          }else{
            return "";
          }
        }
      }
    }

    //Remove forbidden characters from an attribute's value
    function cleanAttrValue(val){
      val=$( $.parseHTML(val) ).text(); //Against malicious user input (a script in an input field)
      if(val==null || val==''){
        alert("The attribute's value is empty.");
      }
      return val.replace(/[<&"'>]+/g, "_");
    }

    //The user types the value of a category attribute in an input field
    function userInputAttrValueSomethingSelected (textbox, medium, varTag, userChosenAttributesAndValues, attrName, num,categoryTable, focusOffset,focusNode, notCollapsedArgsTable,coords,onButton) {
      var option;
      var select;
      var options;
      var options2;
      var search;
      var regex;

        $(textbox).off().on('change keyup', function(e) {
          //If the user presses enter
          if (e.which == 13) {
              $("#newDropdownDiv").hide();
              $("#select-type-input").show();
              $("#select-type-input")[0].value="";
              $("#chosen-select-type").show();
              $('#chosen-select-type').empty();
              $('#chosen-select-type')[0].value="";
              $('#user-type-input').hide();
              document.getElementById('select_a_tag').innerHTML = "";

              var typedValue=cleanAttrValueRestrict($(textbox).val(),categoryTable[num][4],categoryTable[num][5],"ss",textbox, medium, varTag, userChosenAttributesAndValues, attrName, num,categoryTable, focusOffset,focusNode, notCollapsedArgsTable,coords,onButton);
              //var typedValue=cleanAttrValue($(textbox).val());
              if (typedValue.length>0){
                userChosenAttributesAndValues.push([attrName,typedValue]);
                $(textbox).val('');
                if (num<(categoryTable.length-1)){
                  getNextSomethingSelected(userChosenAttributesAndValues,varTag, num+1, categoryTable, focusOffset,focusNode, notCollapsedArgsTable,coords,onButton);
                }

                if (num==(categoryTable.length-1)){
                  medium.tagSelection3(varTag, userChosenAttributesAndValues, anchorNode, focusNode, anchorOffset, focusOffset);

                }
              }else{
                alert("Please type a valid attribute value.");
              }
            
          }
      });
    };


    //The user types the value of a category attribute
    function userInputAttrValueCollapsed (textbox, medium, varTag, userChosenAttributesAndValues, attrName, num,categoryTable, focusOffset,focusNode, notCollapsedArgsTable,coords,onButton) {
      var option;
      var select;
      var options;
      var options2;
      var search;
      var regex;

        $(textbox).off().on('change keyup', function(e) {
          //If the user presses enter
          if (e.which == 13) {
            
              $("#newDropdownDiv").hide();
              $("#select-type-input").show();
              $("#select-type-input")[0].value="";
              $("#chosen-select-type").show();
              $('#chosen-select-type').empty();
              $('#chosen-select-type')[0].value="";
              $('#user-type-input').hide();
              document.getElementById('select_a_tag').innerHTML = "";

              var typedValue=cleanAttrValueRestrict($(textbox).val(),categoryTable[num][4],categoryTable[num][5],"co",textbox, medium, varTag, userChosenAttributesAndValues, attrName, num,categoryTable, focusOffset,focusNode, notCollapsedArgsTable,coords,onButton);
              if (typedValue.length>0){
                userChosenAttributesAndValues.push([attrName,typedValue]);
                $(textbox).val('');
                if (num<(categoryTable.length-1)){
                  getNextCollapsed(userChosenAttributesAndValues, varTag,num+1, categoryTable, focusOffset,focusNode, notCollapsedArgsTable,coords,onButton);
                }

                if (num==(categoryTable.length-1)){
                  addCategoryWithTypeS (medium, varTag, userChosenAttributesAndValues, focusOffset,focusNode);
                }
            }
          }
      });
      
    }

    //Create the new dropdown menu for category types
    function addNewDropdown (length, attr_name, selectOrType){
      var newDropdown=document.getElementById('chosen-select-type');
      newDropdown.setAttribute("size", length+1);
      
      var title=document.getElementById('select_a_tag');
      var content = document.createTextNode(selectOrType+" "+attr_name);
      title.appendChild(content);
      return newDropdown;
    }

    //Add an option to the dropdown menu of category types
    function addAnOption(newDropdown,typedata){
      var optionType=document.createElement("option");
      optionType.text=typedata;
      optionType.value=typedata;
      newDropdown.add(optionType,newDropdown.options[null]);
    }


    function getSelectionCoords(win) {
      var win = win || window,
        docF = win.document,
        selF = docF.selection,
        rangeF=null,
        rectsF=null,
        rectF=null,
        spanF=null,
        spanParentF=null,
        xF = 0,
        yF = 0,
        rangeChildNodes,
        ch;

      if (selF) {
        if (selF.type != "Control") {
            rangeF = selF.createRange();
            rangeF.collapse(true);
            xF = rangeF.boundingLeft;
            yF = rangeF.boundingTop;
        }
      } else if (win.getSelection) {
        selF = win.getSelection();
        if (selF.rangeCount) {
            rangeF = selF.getRangeAt(0).cloneRange();
            if (rangeF.getClientRects.length>0) {
                rangeF.collapse(true);
                rectsF = rangeF.getClientRects();
                if (rectsF.length > 0) {
                    rectF = rects[0];
                }
                xF = rectF.left;
                yF = rectF.top;
            }else{
              // Fall back to inserting a temporary element
              if (xF == 0 && yF == 0) {
                spanF = docF.createElement("span");
                if (spanF.getClientRects) {
                    // Ensure span has dimensions and position by
                    // adding a zero-width space character
                    spanF.appendChild( docF.createTextNode("\u200B") );
                    rangeF.insertNode(spanF); // inserts a node at the end of the range

                    rangeChildNodes=rangeF.endContainer.childNodes;
                    for (ch=0; ch<rangeChildNodes.length; ch++) {
                      var he=rangeChildNodes[ch];
                      if (he.tagName=="SPAN"){
                        spanF=he;
                        break;
                      }
                    }
                    //rangeLength=rangeChildNodes.length;
                    //spanF=rangeF.endContainer.childNodes[rangeChildNodes.length-2];
                    //rectF = getCoords2(spanF);
                    rectF = spanF.getClientRects()[0];
                    xF = rectF.left;
                    yF = rectF.top;
                    spanParentF = spanF.parentNode;
                    
                    spanParentF.removeChild(spanF);

                    // Glue any broken text nodes back together
                    spanParentF.normalize();
                }
              }
            }
        }
      }

      var pageScrolleFromTop=$(window).scrollTop();
      var pageScrolleFromLeft=$(window).scrollLeft();

      return { x: xF+pageScrolleFromLeft, y: yF+pageScrolleFromTop };
    }

    function tagButtonInSimpleMode(categoryid,categoryTag,coords){
      var userChosenAttributesAndValues=[['mode',0]];
      var selection = window.getSelection();
      var TempT=medium.returnOffset();
      focusOffset=TempT[0];
      focusNode=TempT[1];
      anchorOffset=TempT[2];
      anchorNode=TempT[3];

      //[focusOffset,focusNode,anchorOffset,anchorNode]=medium.returnOffset();
      var notCollapsedArgsTable=[anchorNode,anchorOffset];

      //If the category has types
      if(categoryid in categoryTypesHash){
        if(selection.isCollapsed){
          //userChosenAttributesAndValues=[];
          var categoryTable=categoriesInfo[categoryid];
          getNextCollapsed(userChosenAttributesAndValues, categoryTag,0, categoryTable,focusOffset,focusNode, notCollapsedArgsTable,coords,true);
        }else{
          tagSelectionWithType(userChosenAttributesAndValues,categoryid, categoriesInfo, medium, categoryTag, focusOffset, focusNode, [anchorNode, anchorOffset], coords,true);
        }
      }else{ //If the category doesn't have types
        if(selection.isCollapsed){
          addCategoryWithTypeS (medium, categoryTag, userChosenAttributesAndValues, focusOffset,focusNode,true);
          //collapsedNoAttributesInsertTag(userChosenAttributesAndValues,categoryTag,focusOffset,focusNode);
        }else{
          medium.tagSelection3(categoryTag, userChosenAttributesAndValues, anchorNode,focusNode,anchorOffset, focusOffset);
        }
      }
      //return false;
    }

    function tagButtonInAdvancedMode(categoryid,categoryTag,coords){
      var userChosenAttributesAndValues=[['mode',1]];
      var selection = window.getSelection();
      var TempTa=medium.returnOffset();
      focusOffset=TempTa[0];
      focusNode=TempTa[1];
      anchorOffset=TempTa[2];
      anchorNode=TempTa[3];

      var notCollapsedArgsTable=[anchorNode,anchorOffset];

      if(selection.isCollapsed){
        //If the category has types
        if(categoryid in categoryTypesHashAdv){

          var categorySeqHash=categoryTypesHashAdv[categoryid];
          var thisCategoryInitialAttrIds=[];
          if(initialAttrIds.hasOwnProperty(categoryid)){
            thisCategoryInitialAttrIds=initialAttrIds[categoryid];
          }else{
            thisCategoryInitialAttrIds=[];
          }

          tagSeqsInitial(userChosenAttributesAndValues,categoryTag,0, thisCategoryInitialAttrIds, categorySeqHash,focusOffset,focusNode, notCollapsedArgsTable,coords,true,false);
                
        }else{ //If the category doesn't have types
          addCategoryWithTypeS (medium, categoryTag, userChosenAttributesAndValues, focusOffset,focusNode,true);

        }
      }else{ //If the selection is not collapsed
        //If the category has types
        if(categoryid in categoryTypesHashAdv){

          var categorySeqHash=categoryTypesHashAdv[categoryid];
          var thisCategoryInitialAttrIds=[];
          if(initialAttrIds.hasOwnProperty(categoryid)){
            thisCategoryInitialAttrIds=initialAttrIds[categoryid];
          }else{
            thisCategoryInitialAttrIds=[];
          }

          tagSeqsInitial(userChosenAttributesAndValues,categoryTag,0, thisCategoryInitialAttrIds, categorySeqHash,focusOffset,focusNode, notCollapsedArgsTable,coords,true,true);
                  
        }else{ //If the category doesn't have types
          medium.tagSelection3(categoryTag, userChosenAttributesAndValues, anchorNode,focusNode,anchorOffset, focusOffset);

          return false;
        }
      }
    }

    function tagInAdvancedMode(){
      var userChosenAttributesAndValues=[['mode',1]];
      coords = getSelectionCoords();

      var TempTab=medium.returnOffset();
      focusOffset=TempTab[0];
      focusNode=TempTab[1];
      anchorOffset=TempTab[2];
      anchorNode=TempTab[3];

      var notCollapsedArgsTable=[anchorNode,anchorOffset];
      var selection = window.getSelection();

      //If the cursor is in the medium, but nothing has been selected
      if(selection.isCollapsed){
        $(".popupBodyAdv").css({'top':coords.y,'left':coords.x});
        $(".popupBodyAdv").show();
        $(".chosen-adv").trigger('chosen:activate');        

        $(".chosen-adv").chosen().change(function(event){
          if(event.target == this){
            var tag=$(this).val();
            if(tag!= null && tag!=''){
              var varTag=tag;
              tag='';
              var options = $( ".chosen-adv option:selected" );
              var categoryid=options[0].attributes[1].value;
              chosenReset(".chosen-adv");

              $(".popupBodyAdv").hide();
              $(".popupBodyAdv").css({'top':0,'left':0});
              document.getElementById('select_a_tag').innerHTML = "";

              //If the category has types
              if(categoryid in categoryTypesHashAdv){

                var categorySeqHash=categoryTypesHashAdv[categoryid];
                var thisCategoryInitialAttrIds=[];
                if(initialAttrIds.hasOwnProperty(categoryid)){
                  thisCategoryInitialAttrIds=initialAttrIds[categoryid];
                }else{
                  thisCategoryInitialAttrIds=[];
                }

                tagSeqsInitial(userChosenAttributesAndValues,varTag,0, thisCategoryInitialAttrIds, categorySeqHash,focusOffset,focusNode, notCollapsedArgsTable,coords,false,false);
                
              }else{ //If the category doesn't have types
                addCategoryWithTypeS (medium, varTag, userChosenAttributesAndValues, focusOffset,focusNode);

              }
            }
            return false;
          }
          return false;
        });

      }else{ //If selection is not collapsed: if something has been selected
        $(".popupBodyAdv2").css({'top':coords.y,'left':coords.x});
        $(".popupBodyAdv2").show();

        $(".chosen-adv2").trigger('chosen:activate');
          

        $(".chosen-adv2").chosen().change(function(event4){
          if(event4.target == this){
            var tag2=$(this).val();
            if(tag2!= null && tag2!=''){
              var varTag=tag2;
              tag2='';
              var options = $( ".chosen-adv2 option:selected" );
              var categoryid=options[0].attributes[1].value;
              chosenReset(".chosen-adv2");
              //$('.chosen-adv2').chosen_reset(config);
              $(".popupBodyAdv2").hide();
              $(".popupBodyAdv2").css({'top':0,'left':0});
              document.getElementById('select_a_tag').innerHTML = "";

              //If the category has types
              if(categoryid in categoryTypesHashAdv){
                userChosenAttributesAndValues=[['mode',1]];
                //userChosenAttributesAndValues=[];

                var categorySeqHash=categoryTypesHashAdv[categoryid];

                var thisCategoryInitialAttrIds=[];
                if(initialAttrIds.hasOwnProperty(categoryid)){
                  thisCategoryInitialAttrIds=initialAttrIds[categoryid];
                }else{
                  thisCategoryInitialAttrIds=[];
                }

                tagSeqsInitial(userChosenAttributesAndValues,varTag,0, thisCategoryInitialAttrIds, categorySeqHash,focusOffset,focusNode, notCollapsedArgsTable,coords,false,true);
                  
              }else{ //If the category doesn't have types

                medium.tagSelection3(varTag, [], anchorNode,focusNode,anchorOffset, focusOffset);

                return false;
              }
            }
            return false;
          }
          return false;
        });
      }

    }
    
    //Add tag in simplemode
    function tagInSimpleMode() {
      var varTag,
        tag,
        tag2,
        options,
        categoryid;

      var userChosenAttributesAndValues=[['mode',0]];
      coords = getSelectionCoords();
      
      var TempTabb=medium.returnOffset();
      focusOffset=TempTabb[0];
      focusNode=TempTabb[1];
      anchorOffset=TempTabb[2];
      anchorNode=TempTabb[3];

      var notCollapsedArgsTable=[anchorNode,anchorOffset];
      var selection = window.getSelection();

      //If the cursor is in the medium, but nothing has been selected
      if(selection.isCollapsed){
        $(".popupBody").css({'top':coords.y,'left':coords.x});
        $(".popupBody").show();
        $("#hidePopupBody").show();
        

        $(".chosen-select-no-results").trigger('chosen:activate');

        $(".chosen-select-no-results").chosen().change(function(event){
          if(event.target == this){
            tag=$(this).val();
            if(tag!= null && tag!=''){
              var varTag=tag;
              var tag='';
              var options = $( ".chosen-select-no-results option:selected" );
              var categoryid=options[0].attributes[1].value;

              chosenReset(".chosen-select-no-results");

              $(".popupBody").hide();
              $(".popupBody").css({'top':0,'left':0});
              document.getElementById('select_a_tag').innerHTML = "";

              //If the category has types
              if(categoryid in categoriesInfo){
                var categoryTable=categoriesInfo[categoryid];                
                getNextCollapsed(userChosenAttributesAndValues,varTag,0, categoryTable,focusOffset,focusNode, notCollapsedArgsTable,coords,false);
                
              }else{ //If the category doesn't have types
                addCategoryWithTypeS (medium, varTag, userChosenAttributesAndValues, focusOffset,focusNode);
              }
            }
            return false;
          }
          return false;
        });

      }else{ //If selection is not collapsed: if something has been selected
        $(".popupBody2").css({'top':coords.y,'left':coords.x});
        $(".popupBody2").show();

        $(".chosen-select-no-results2").trigger('chosen:activate');
          

        $(".chosen-select-no-results2").chosen().change(function(event4){
          if(event4.target == this){
            var tag2=$(this).val();
            if(tag2!= null && tag2!=''){
              var varTag=tag2;
              var tag2='';
              var options = $( ".chosen-select-no-results2 option:selected" );
              var categoryid=options[0].attributes[1].value;
              chosenReset(".chosen-select-no-results2");
              //$('.chosen-select-no-results2').chosen_reset(config);
              $(".popupBody2").hide();
              $(".popupBody2").css({'top':0,'left':0});
              document.getElementById('select_a_tag').innerHTML = "";

              //If the category has types
              if(categoryid in categoryTypesHash){
                tagSelectionWithType(userChosenAttributesAndValues,categoryid, categoriesInfo, medium, varTag, focusOffset,focusNode, notCollapsedArgsTable, coords, false);
                  
              }else{ //If the category doesn't have types
                medium.tagSelection3(varTag, userChosenAttributesAndValues, anchorNode,focusNode,anchorOffset, focusOffset);
                return false;
              }
            }
            return false;
          }
          return false;
        });

      } // End if selection.isCollapsed

      //return false;
    };

    function findParents(){
      var TempTabl=medium.returnOffset();
      focusOffset=TempTabl[0];
      focusNode=TempTabl[1];
      anchorOffset=TempTabl[2];
      anchorNode=TempTabl[3];
      //[focusOffset,focusNode,anchorOffset,anchorNode]=medium.returnOffset();
      var els = [];
      var a=anchorNode;
      var inContenteditable=false;

      //Find all the parents of the anchorNode (the node where the cursor or the beginning of the selection is)
      while (a!=null) {
        a = a.parentNode;
        if(a!=null){
          if(a.id=="page_source_text"){
            inContenteditable=true;
            break;
          }
          if(a.tagName!="DIV"){
            els.unshift(a);
          }
        }
      }
      //If the cursor is in the contenteditable, we return the parents of the tag where the cursor is
      if(inContenteditable){
        return els;
      }else{ //If the cursor is not in the tag, we return an empty array
        return [];
      }
    }

    //Change a tag
    function changeTag(coords,onButton){
      if ( $("#change_div").css('display') == 'none' ){

      var els = findParents();

      //If the node has parent nodes (=tags)
      if(els.length>0){

        var i,
          name,
          nameTag,
          menuDiv=document.getElementById("change_div"),
          radio,
          label,
          button,
          hideDivButton=document.createElement('button');

          hideDivButton.className="hide_popup_button";
          hideDivButton.title=localStorage['hide_popup'] || 'Alt+R';
          hideDivButton.appendChild(document.createTextNode("\u26cc"));
          hideDivButton.onclick=function(){
            hideChangePopup(); 
          };
          menuDiv.appendChild(hideDivButton);

          var titlediv = document.createElement("div");
          titlediv.appendChild(document.createTextNode("Choose the tag to modify:"));
          titlediv.className="popup_title_div";
          menuDiv.appendChild(titlediv);


        //Create a menu
        for(i=0; i<els.length; i++){
          nameTag=els[i].nodeName;
          name=nameTag.replace(/_ID\d+$/g, "");
          radio = document.createElement('input');
          radio.type = "radio";
          radio.name = "change_tag_radio";
          radio.value = els[i].getAttribute('tagcode');
          radio.id = "change_radio_"+nameTag;
          label = document.createElement('label');
          label.htmlFor = "change_radio_"+nameTag;
          label.className=("medium-"+nameTag).toLowerCase();
          label.appendChild(document.createTextNode(name));
          menuDiv.appendChild(radio);
          menuDiv.appendChild(label);
          menuDiv.appendChild(document.createElement('br'));        
        }

        button = document.createElement('button');
        button.onclick = function(){
          changeSelectedTag(coords,onButton);
        };

        button.id="change_tag_confirm_button";
        button.appendChild(document.createTextNode("Change the chosen tag"));
        menuDiv.appendChild(button);
        if(onButton==true){
          $("#change_div").css({'top':coords.y+20,'left':'','right':'4vw', 'position':'absolute'});
        }else{
          $("#change_div").css({'top':coords.y+20,'left':coords.x, 'right':'', 'position':'absolute'});
        }
        
        $("#change_div").show();
      }
      }
    }

    //Get all attributes of a node
    function getAttributes ($node) {
      var attrs = {};
      $.each( $node[0].attributes, function ( index, attribute ) {
        attrs[attribute.name] = attribute.value;
      } );

      return attrs;
    }

    function updateCorrespondingInput(inputId,newvalue){
      $("#"+inputId).val(newvalue);
    }

    //Functions that calls medium.js in order to remove the tags chosen via the popup menu checkboxes
    function changeSelectedTag(coords,onButton){
      //Get the checked tagcode
      var tagCodeToChange = $("input[name=change_tag_radio]:checked").val();

      //Delete the radios from the menu div      
      hideChangePopup();

      var attrs=getAttributes($("[tagcode="+tagCodeToChange+"]"));
      var tagName=$("[tagcode="+tagCodeToChange+"]").prop("tagName");
      var catId=tagName.match(/_ID(\d+)$/)[1];

      var div = document.getElementById("change_selected_div"),
          input,
          label,
          attrName,
          button,
          numberOfChangableAttrs=0,
          i,
          option,
          hideDivButton=document.createElement('button');


      hideDivButton.className="hide_popup_button";
      hideDivButton.title=localStorage['hide_popup'] || 'Alt+R';
      hideDivButton.appendChild(document.createTextNode("\u26cc"));
      hideDivButton.onclick=function(){
        hideChangeAttributesPopup(); 
      };
      div.appendChild(hideDivButton);

      var titlediv = document.createElement("div");
      var span=document.createElement("span");
      span.className=("medium-"+tagName).toLowerCase();
      span.appendChild(document.createTextNode(tagName.match(/^(.+)_ID\d+$/)[1]));
          
      titlediv.appendChild(document.createTextNode("Modify attribute values of the "));
      titlediv.appendChild(span);
      titlediv.appendChild(document.createTextNode(" tag:"));
      titlediv.className="popup_title_div";
      div.appendChild(titlediv);

      var attrsHashBefore={};
      var attrsHash={};

      //If the element was added in the advanced mode, we look for its attributes in the advanced mode hash. Otherwise we look for its attributes in the simple mode hash.
      if(attrs["mode"]=="1"){
        attrsHashBefore=categoryTypesHashAdv[parseInt(catId)];
        var key;
        for(key in attrsHashBefore){
          attrsHash[attrsHashBefore[key].name]={'allow_user_input':attrsHashBefore[key].allow_user_input,'values':Object.keys(attrsHashBefore[key].values)};
        }
      }else{
        attrsHash=categoryTypesHash[parseInt(catId)];
      }

      //Loop through all attributes of the chosen category
      for (attrName in attrs){
        if(attrName!='class' && attrName!='tagcode' && attrName!='mode'){
          //If the attribute is in the hash of attributes for this category (in case it had been deleted by the collection owner)
          if(attrsHash[attrName]!=null){
            label = document.createElement('label');
            label.setAttribute("for","value_"+attrName);
            label.setAttribute("class","popup_attribute_label");
            label.innerHTML = attrName;
            div.appendChild(label);
            numberOfChangableAttrs+=1;

            //If the user is allowed to type attribute values
            if(attrsHash[attrName]['allow_user_input']==1){
              input = document.createElement("input");
              input.type = "text";
              input.id = "value_"+attrName;
              input.value = attrs[attrName];
              input.name=tagCodeToChange;
              input.setAttribute('data-only', attrsHash[attrName]['only']);
              input.setAttribute('data-max_len', attrsHash[attrName]['max_len']);
              //input.data-only=attrsHash[attrName]['only'];
              //input.data-max_len=attrsHash[attrName]['max_len'];
              input.className="input_attribute_value_transcribe";
              div.appendChild(input);
            }

            //If there are predefined attributes
            if(attrsHash[attrName]['values'].length>0){
              //Create a dropdown to let the user select an attribute value from the list
              var select = document.createElement("select");
              select.className="input_attribute_value_transcribe";
              select.id = "value_"+attrName;
              select.name='select_'+tagCodeToChange;
              select.onchange=function(){
                updateCorrespondingInput(this.id,this.value);
              };

              option = document.createElement("option");
              option.value="";
              option.selected="checked";
              option.innerHTML="";
              select.appendChild(option);

              for (i=0; i<attrsHash[attrName]['values'].length; i++){
                option = document.createElement("option");
                option.value=attrsHash[attrName]['values'][i];
                if(attrsHash[attrName]['values'][i]==attrs[attrName]){
                  option.selected="checked";
                }else{
                  option.selected="";
                }
                option.innerHTML=attrsHash[attrName]['values'][i];

                select.appendChild(option);
              }

              div.appendChild(select);
            }
          }
        }
      }


      if(numberOfChangableAttrs>0){
        button = document.createElement('button');
        button.onclick = function(){
          saveChangesInAttributeValues(tagCodeToChange);
        };

        button.id="change_tag_confirm_button";
        button.appendChild(document.createTextNode("Save changes"));
        div.appendChild(button);
        
        if(onButton==true){
          $("#change_selected_div").css({'top':coords.y+20,'left':'','right':'4vw', 'position':'absolute'});
        }else{
          $("#change_selected_div").css({'top':coords.y+20,'left':coords.x,'right':'', 'position':'absolute'});
        }
        
        $("#change_selected_div").show();
      }else{
        hideChangeAttributesPopup();
        alert("The tag "+tagName.match(/^(.+)_ID\d+$/)[1]+" has no attributes.");
      }
            
    }

    function removeOptions(selectbox){
      var i;
      for(i = selectbox.options.length - 1 ; i >= 0 ; i--){
        selectbox.remove(i);
      }
    }

    //Save changes the user made in the values of attributes of the chosen tag
    function saveChangesInAttributeValues(tagCode){
      //Get new values
      var el,
        nodeList=document.getElementsByName(tagCode),
        nodeListSelect=document.getElementsByName('select_'+tagCode),
        newAttrsValuesTable={},
        id;

      //Create a hash with attribute names and their new values
      //First put inside values from the drop down select
      if(nodeListSelect.length>0){

      for (el=0; el<nodeListSelect.length; el++){
        id=nodeListSelect[el].id.substring(6);
        newAttrsValuesTable[id]=nodeListSelect[el].value;

        if(el==(nodeListSelect.length-1)){
          $('.select_'+tagCode).empty();

          if(nodeList.length>0){
          //Next put inside values from the input fields
          for (el=0; el<nodeList.length; el++){
            id=nodeList[el].id.substring(6);
            newAttrsValuesTable[id]=cleanAttrValue(nodeList[el].value);

            if(el==(nodeList.length-1)){
              hideChangeAttributesPopup();
              medium.changeSelectedTag(tagCode,newAttrsValuesTable);
              return false;
            }
          }
          }else{
            hideChangeAttributesPopup();
            medium.changeSelectedTag(tagCode,newAttrsValuesTable);
            return false;
          }
        }
      }
      }else{
        //Next put inside values from the input fields
          for (el=0; el<nodeList.length; el++){
            id=nodeList[el].id.substring(6);

            var cleanedValue=cleanAttrValueForChangeMenu(nodeList[el].id.substring(6,nodeList[el].id.length),nodeList[el].value,nodeList[el].getAttribute('data-only'),nodeList[el].getAttribute('data-max_len'));
            if (cleanedValue.length>0){
              //newAttrsValuesTable[id]=cleanAttrValue(nodeList[el].value);
              newAttrsValuesTable[id]=cleanedValue;

              if(el==(nodeList.length-1)){
                hideChangeAttributesPopup();
                medium.changeSelectedTag(tagCode,newAttrsValuesTable);
                return false;
            }
          }else{
            break;
          }
        }
      }
    }

    //Delete a tag
    function deleteTag(coords,onButton){
      if ( $("#deletion_div").css('display') == 'none' ){

      var els = findParents();

      //If the node has parent nodes (=tags)
      if(els.length>0){
        var i,
          name,
          nameTag,
          menuDiv=document.getElementById("deletion_div"),
          checkbox,
          label,
          button,
          hideDivButton=document.createElement('button');

          hideDivButton.className="hide_popup_button";
          hideDivButton.title=localStorage['hide_popup'] || 'Alt+R';
          hideDivButton.appendChild(document.createTextNode("\u26cc"));
          hideDivButton.onclick=function(){
            hideDeletionPopup(); 
          };
          menuDiv.appendChild(hideDivButton);

          var titlediv = document.createElement("div");
          titlediv.appendChild(document.createTextNode("Choose tag(s) to delete:"));
          titlediv.className="popup_title_div";
          menuDiv.appendChild(titlediv);


        //Create a menu
        for(i=0; i<els.length; i++){
          nameTag=els[i].nodeName;
          name=nameTag.replace(/_ID\d+$/g, "");
          checkbox = document.createElement('input');
          checkbox.type = "checkbox";
          checkbox.name = "delete_tag_checkbox";
          checkbox.value = els[i].getAttribute('tagcode');
          checkbox.id = "delete_checkbox_"+nameTag;
          label = document.createElement('label');
          label.htmlFor = "delete_checkbox_"+nameTag;
          label.className = "medium-"+nameTag.toLowerCase();
          label.appendChild(document.createTextNode(name));
          menuDiv.appendChild(checkbox);
          menuDiv.appendChild(label);
          menuDiv.appendChild(document.createElement('br'));        
        }

        button = document.createElement('button');
        button.onclick = function(){
          removeTag();
        };

        button.id="delete_tag_confirm_button";
        button.appendChild(document.createTextNode("Delete the chosen tag(s)"));
        menuDiv.appendChild(button);

        if(onButton==true){
          $("#deletion_div").css({'top':coords.y+20,'left':'','right':'4vw', 'position':'absolute'});
        }else{
          $("#deletion_div").css({'top':coords.y+20,'left':coords.x,'right':'', 'position':'absolute'});
        }
        $("#deletion_div").show();
      }
      }
    }

    // Pass the checkbox name to the function
    function getCheckedBoxes(chkboxName) {
      var checkboxes = document.getElementsByName(chkboxName);
      var checkboxesChecked = [];
      // loop over them all
      for (var i=0; i<checkboxes.length; i++) {
        // And stick the checked ones onto an array...
        if (checkboxes[i].checked) {
          checkboxesChecked.push(checkboxes[i].value);
        }
      }
      // Return the array if it is non-empty, or null
      return checkboxesChecked.length > 0 ? checkboxesChecked : null;
    }

    //Functions that calls medium.js in order to remove the tags chosen via the popup menu checkboxes
    function removeTag(){
      //Get the checked options
      var checkedTagcodes = getCheckedBoxes("delete_tag_checkbox");
      //Delete the checkboxes from the menu div
      hideDeletionPopup();
      if(checkedTagcodes!=null && checkedTagcodes.length>0){
        medium.removeTags(checkedTagcodes);
      } 
    }

    //Check if a string contains valid XML
    function isXML(xml){
      try {
        var xmlDoc = $.parseXML(xml); //is valid XML
        return true;
      } catch (err) {
        // was not XML
        return false;
      }
    }
   
   //Fires when the user presses the "Transcription finished" button
   function transcriptionFinishedFunction(){
    document.getElementsByName("page[finished]")[0].value=1;
    //Check if all the header categories values have been filled
    var missedCategories=checkIfAllHeadersAreFilled();
    if (missedCategories.length>0){
      alert("You have to fill in all the header fields before submitting the transcription. You forgot "+missedCategories.slice(0, -2)+".");
    }else{
      var ok=checkIfHeadCategoriesTextValuesCorrespondToFormat();
      //document.getElementsByName("page[header_text]")[0].value=header;
      if (ok==true){
        submitTranscription();
      }
    }
    
   }


   //Check if all the header categories values with free user input have values corresponding to restrictions. The function is called when the transcriber pushes the "Transcription finished" button.
   function checkIfHeadCategoriesTextValuesCorrespondToFormat(){      
      //We take the values from the user input fields of header categories
      var headerCatInputsArray2=document.getElementsByClassName("inputHeaderCatInp");    
      var hcIALength2=headerCatInputsArray2.length;
      var trueOrFalseForAllHeaderCategoriesArray=[];

      var i;
      for (i=0; i<hcIALength2; i++) {
        var value=headerCatInputsArray2[i].value;
        
        var only=headerCatInputsArray2[i].getAttribute("data-only");
        var length=headerCatInputsArray2[i].getAttribute("data-length");
        
        if (length!=0 && value.length!=length){
          var trueOrFalse=checkIfInputValueCorrespondsToRestrictionsLength(only,value, headerCatInputsArray2[i].name, length);
          trueOrFalseForAllHeaderCategoriesArray.push(trueOrFalse);

        }else if(only!=0){
          var trueOrFalse=checkIfInputValueCorrespondsToRestrictions(only,value, headerCatInputsArray2[i].name, length);
          trueOrFalseForAllHeaderCategoriesArray.push(trueOrFalse);

        }else{
            trueOrFalseForAllHeaderCategoriesArray.push(true);
        }

        if(i==(hcIALength2-1) && trueOrFalseForAllHeaderCategoriesArray.length==hcIALength2){
          if(trueOrFalseForAllHeaderCategoriesArray.includes(false)){
            return false;
          }else{
            return true;
          }
        }
      }
   }

   /*
   If the length of the headercategory value is certainly incorrect, it's useless to check the content. But we give a precise message for each case.
   */
   function checkIfInputValueCorrespondsToRestrictionsLength(only,value, name, length){
    var returnValue;

    switch(only) {
      case "0":
            return true;
            break;
      case "1":
            alert("The value of "+name+" must contain "+length+" numbers.");
            returnValue=false;
            break;
      case "2":
          alert("The value of "+name+" must contain "+length+" letters.");
          returnValue=false;
          break;
      case "3":
            alert("The value of "+name+" must contain no numbers and be "+length+" characters long.");
            returnValue=false;
            break;
      case "4":
            alert("The value of "+name+" must contain no letters and be "+length+" characters long.");
            returnValue=false;
            break;
    } 

    if (returnValue!=null){
      return returnValue;
    }
    
   }

   /*
   If the length of the headercategory value is correct (or can be of any length), we need to check if the content corresponds to the restriction.
   */
   function checkIfInputValueCorrespondsToRestrictions(only,value, name, length){   

    var returnValue;
    var unicodeLetterRegex=/^[\u0041-\u005A\u0061-\u007A\u00C0-\u01BF\u01C4-\u02B8\u0373\u0376\u0377\u037F\u0386\u0388\u0389\u038A\u038C\u038E-\u03A1\u03A3-\u0481\u048A-\u052F\u0531-\u0556\u0561-\u0587\u05C6\u05D0-\u05EA\u05F0-\u05F2\u060E-\u060F\u0620-\u064A\u066E\u066F\u0676-\u06D3\u06EE-\u06FF\u0710-\u072F\u074D-\u07B1]+$/;
    var unicodeLetterRegex2=/[\u0041-\u005A\u0061-\u007A\u00C0-\u01BF\u01C4-\u02B8\u0373\u0376\u0377\u037F\u0386\u0388\u0389\u038A\u038C\u038E-\u03A1\u03A3-\u0481\u048A-\u052F\u0531-\u0556\u0561-\u0587\u05C6\u05D0-\u05EA\u05F0-\u05F2\u060E-\u060F\u0620-\u064A\u066E\u066F\u0676-\u06D3\u06EE-\u06FF\u0710-\u072F\u074D-\u07B1]/;
    var noUnicodeLetterRegex=/^[^\u0041-\u005A\u0061-\u007A\u00C0-\u01BF\u01C4-\u02B8\u0373\u0376\u0377\u037F\u0386\u0388\u0389\u038A\u038C\u038E-\u03A1\u03A3-\u0481\u048A-\u052F\u0531-\u0556\u0561-\u0587\u05C6\u05D0-\u05EA\u05F0-\u05F2\u060E-\u060F\u0620-\u064A\u066E\u066F\u0676-\u06D3\u06EE-\u06FF\u0710-\u072F\u074D-\u07B1]+$/;
    var digitsRegex=/^\d+$/;

    /*
    console.log("value.match(unicodeLetterRegex2):");
    console.log(value.match(unicodeLetterRegex2));
    console.log("unicodeLetterRegex2.test(value):");
    console.log(unicodeLetterRegex2.test(value));
    */

    switch(only) {
      case "0":
        return true;
        break;
      case "1":
        var regex=/^\d+$/;
        if (value.match(regex)==null){
          if (length!=0){
            alert("The value of "+name+" must contain "+length+" numbers.");
            returnValue=false;
          }
          else{
            alert("The value of "+name+" must contain only numbers.");
            returnValue=false;
          }
        }else{
          return true;
        }
        break;
      case "2":
        if (value.match(unicodeLetterRegex)==null){
          if (length!=0){
            alert("The value of "+name+" must contain "+length+" letters.");
            returnValue=false;
          }else{
            alert("The value of "+name+" must contain only letters.");
            returnValue=false;
          }
        }else{
          return true;
        }
        break;
      case "3":
        var regex=/^\D+$/;
        if (value.match(regex)==null){
          if (length!=0){
            alert("The value of "+name+" must contain no numbers and be "+length+" characters long.");
            returnValue=false;;
          }else{
            alert("The value of "+name+" must contain no numbers.");
            returnValue=false;
          }
        }else{
          return true;
        }
        break;
      case "4":
        //if (value.match(unicodeLetterRegex2).length!=null && value.match(unicodeLetterRegex2).length!=0 && value.match(unicodeLetterRegex2)[0].length!=0){
        //if (unicodeLetterRegex2.test(value)==true && value.match(digitsRegex)==null){
        if (unicodeLetterRegex2.test(value)==true){
        //if (value.match(noUnicodeLetterRegex)==null){
          if (length!=0){
            alert("The value of "+name+" must contain no letters and be "+length+" characters long.");
            returnValue=false;
          }else{
            alert("The value of "+name+" must contain no letters.");
            returnValue=false;
          }
        }else{
          return true;
        }
        break;
    }

    if (returnValue!=null){
      return returnValue;
    }
    
   }

    //Check if the transcriber has filled all the header categories values. The function is called when the transcriber pushes the "Transcription finished" button.
   function checkIfAllHeadersAreFilled(){
     var headerHash={};
      var i=0;
      //First we take the values chosen from the dropdown lists
      var headerCatInputsArray=document.getElementsByClassName("inputHeaderCatOpt");    
      var hcIALength=headerCatInputsArray.length;
      for (i=0; i<hcIALength; i++) {
        if (!(headerCatInputsArray[i].parentElement.id in headerHash)){
          headerHash[headerCatInputsArray[i].parentElement.id]=false;
        }
        if (headerCatInputsArray[i].value.replace(/\s/g, '').length>0){
          if(headerCatInputsArray[i].selected==true){
            headerHash[headerCatInputsArray[i].parentElement.id]=true;
          }
        }      
      }

      //Then we take the values from the user input fields
      var headerCatInputsArray2=document.getElementsByClassName("inputHeaderCatInp");    
      var hcIALength2=headerCatInputsArray2.length;
      for (i=0; i<hcIALength2; i++) {
        if (!(headerCatInputsArray2[i].name in headerHash)){
          headerHash[headerCatInputsArray2[i].name]=false;
        }
        if (headerCatInputsArray2[i].value.replace(/\s/g, '').length>0){
          headerHash[headerCatInputsArray2[i].name]=true;
        }      
      }

      var missedCategories=""; //Will contain names of header categories which don't have values

      for(i in headerHash) {
        if (headerHash.hasOwnProperty(i)) {
          if (!headerHash[i]){
            missedCategories+=i+", ";
          }
        }
      }

      return missedCategories;
   }


   //Assembles the values of the header categories into an XML text
   function getHeaderCategoriesValues(){
    var headerHash={};
    var i=0;
    //First we take the values chosen from the dropdown lists
    var headerCatInputsArray=document.getElementsByClassName("inputHeaderCatOpt");    
    var hcIALength=headerCatInputsArray.length;
    for (i=0; i<hcIALength; i++) {
      if (headerCatInputsArray[i].value.replace(/\s/g, '').length>0){
        if(headerCatInputsArray[i].selected==true){
          headerHash[headerCatInputsArray[i].parentElement.id]=headerCatInputsArray[i].value;
        }
      }      
    }

    //Then we take the values from the user input fields
    var headerCatInputsArray2=document.getElementsByClassName("inputHeaderCatInp");    
    var hcIALength2=headerCatInputsArray2.length;
    for (i=0; i<hcIALength2; i++) {
      if (headerCatInputsArray2[i].value.replace(/\s/g, '').length>0){
        headerHash[headerCatInputsArray2[i].name]=headerCatInputsArray2[i].value;
      }      
    }

    var text="";
    Object.keys(headerHash).forEach(function (catName) {
      text+="<"+catName+">"+headerHash[catName]+"</"+catName+">";
    })

    if (text.length<1){
      return false;
    }else{
      text="<textinfoheader>"+text+"</textinfoheader>";
      return text;
    }
    
   }


   //Takes the header category values from the transcription text header (<textinfoheader>) and places them into the html table over the transcription textarea
   function fillHeaderCategoriesValues(headerText){
    var i,j;
    //First we put them into the user input fields
    var headerCatInputsArray=document.getElementsByClassName("inputHeaderCatInp");
    var hcIALength=headerCatInputsArray.length;
    for (i=0; i<hcIALength; i++) {      
      var str = headerText.match("<"+headerCatInputsArray[i].name+">(.*?)</"+headerCatInputsArray[i].name+">");
      if (str != null) {
        document.getElementById(headerCatInputsArray[i].id).value=str[1];
      }
    }

    //Then we select the right items from the dropdown lists
    var headerCatInputsArray2=document.getElementsByClassName("inputHeaderCatOpt");
    var hcIALength2=headerCatInputsArray2.length;
    var str;

    for (j=0; j<hcIALength2; j++) {
      str = headerText.match("<"+headerCatInputsArray2[j].parentElement.id+">(.*?)</"+headerCatInputsArray2[j].parentElement.id+">");
      if(str){
        selectItemByValue(document.getElementById(headerCatInputsArray2[j].parentElement.id),str[1]);
      }
    }
    return;
   }

   /*
   Selects the item of a dropdown select list corresponding to the given value
   Arguments:
   - elmnt : the select element
   - value : the value to select
   */
   function selectItemByValue(elmnt, value){
    for(var i=0; i < elmnt.options.length; i++){
      if(elmnt.options[i].value === value) {
        elmnt.selectedIndex = i;
        //break;
        return;
      }
    }
  }
    
    //Add the transcription text to the form before sending it to the server
    function AddMediumValue(callback) {
      var mediumValue = medium.value();

      mediumValue = mediumValue.replace(/<br>/g, "<br></br>");

      mediumValue = mediumValue.replace(/\u200B/g, ""); //Delete invisible caracters inserted for +h and +c actions, because otherwise didn't work in webkit (chrome, safari)

      //Delete pipes around words, inserted in order to make new tags visible, taking into account pipes that are part of the text
      mediumValue = mediumValue.replace(/(\>)[\u200C]\|(\|*[^|<\u200C]+)/g, "$1$2"); 
      mediumValue = mediumValue.replace(/([^>|\u200C]+\|*)\|[\u200C](\<)/g, "$1$2"); 

      mediumValue = mediumValue.replace(/&nbsp;/g, " "); // &nbsp; is not valid XML

      if(mediumValue.match(/^<div id=\"bigDiv\">/)==null){
        mediumValue = "<div id=\"bigDiv\">"+mediumValue+"<\/div>";
      }

      if(isXML(mediumValue)){
        mediumValue = mediumValue.replace(/^<div id=\"bigDiv\">/, '');
        mediumValue = mediumValue.replace(/<\/div>$/, '');

        var header=getHeaderCategoriesValues();

        if (header!=false){
          document.getElementsByName("page[source_text]")[0].value=header+mediumValue;
        }else{
          document.getElementsByName("page[source_text]")[0].value=mediumValue;
        }
        
      }else{
        alert("The transcription contains tagging errors. Please, verify the work you've done during the last 3 minutes:\n"+mediumValue);
      }

      if(callback){
        callback();
      }
    }
    
}());