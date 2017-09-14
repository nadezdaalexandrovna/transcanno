function setUpHTMLFixture() {
	setFixtures('<div id="page_source_text"></div>'+
		'<div class="popupBody" id="popupBody" style="display:none;">'+
		'<button type="button" class="hide_popup_small" id="hidePopupBody">&#9932;</button>'+
		'<select class="chosen-select-no-results" data-placeholder="Choose a category">'+
  		'<option value=""></option>'+
  	 		'<option value="phrasal_verb_id5" data-categoryid="5">phrasal_verb</option>'+
  			'<option value="infinitive_id6" data-categoryid="6">infinitive</option>'+
		'</select>'+
		'</div>'+

'<div class="popupBody2" id="popupBody2" style="display:none;">'+
'<button type="button" class="hide_popup_small" id="hidePopupBody2">&#9932;</button>'+
'<select class="chosen-select-no-results2" data-placeholder="Choose a category">'+
  '<option value=""></option>'+
  '<option value="phrasal_verb_id5" data-categoryid="5">phrasal_verb</option>'+
  '<option value="infinitive_id6" data-categoryid="6">infinitive</option>'+
'</select>'+
'</div>'+


'<div class="popupBodyAdv" id="popupBodyAdv" style="display:none;">'+
'<button type="button" class="hide_popup_small" title="Alt+R" id="hidePopupBodyAdv">&#9932;</button>'+
'<select class="chosen-adv" data-placeholder="Choose a category">'+
  '<option value=""></option>'+
  '<option value="phrasal_verb_id5" data-categoryid="5">phrasal_verb</option>'+
  '<option value="infinitive_id6" data-categoryid="6">infinitive</option>'+
'</select>'+
'</div>'+

'<div class="popupBodyAdv2" id="popupBodyAdv2" style="display:none;">'+
'<button type="button" class="hide_popup_small" title="" id="hidePopupBodyAdv2">&#9932;</button>'+
'<select class="chosen-adv2" data-placeholder="Choose a category">'+
  '<option value=""></option>'+
  '<option value="phrasal_verb_id5" data-categoryid="5">phrasal_verb</option>'+
  '<option value="infinitive_id6" data-categoryid="6">infinitive</option>'+
'</select>'+
'</div>'+

'<div id="newDropdownDiv" style="display:none;">'+
  '<button type="button" class="hide_popup_new" title="" id="hideNewDropdownDiv">&#9932;</button>'+
  '<div class="select_a_tag" id="select_a_tag"></div>'+
  '<input id="user-type-input" type="text" placeholder="Type the new value" style="display:none;"></input>'+
  '<input id="select-type-input" type="text"></input>'+
  '<select id="chosen-select-type">'+
  '</select>'+
'</div>'+

'<div id="deletion_div" style="display:none;">'+
'</div>'+

'<div id="change_div" style="display:none;">'+
'</div>'+

'<div id="change_selected_div" style="display:none;">'+
'</div>'+

'<div id="final_button_div">'+
  '<button type="button" id="transcription_finished">Transcription finished</button>'+
'</div>'+

'<div id="use_advanced_mode_div">'+
  '<label for="use_advanced_mode" id="use_advanced_mode_label">Use advanced mode</label>'+
  '<input checked="checked" id="use_advanced_mode" name="use_advanced_mode" type="checkbox" value="0" />'+
'</div>'+

'<div id="changeHotkeysMenu" style="display:none;">'+
  '<button type="button" class="hide_popup_changekeys">&#9932;</button>'+
  '<div id="changeHotkeysTitle">Change hot keys</div>'+ 
  '<div id="changeHotKeysInternal"></div>'+
  '<button type="button" id="changeHotKeys">Change hot keys</button>'+
'</div>'+

'<div id="changeSavingTimeMenu" style="display:none;">'+
  '<button type="button" id="hide_popup_changetime">&#9932;</button>'+
  '<div id="changeTimeTitle">Change transcription saving frequency</div>'+ 
  '<div id="changeSavingTimeInternal">'+
    '<input type="text" id="input_time" class="savingTimeInput" maxlength="2"></input>minutes'+
  '</div>'+
  '<button type="button" id="changeSavingTimeButton">Change</button>'+
'</div>'+

'<div id="verticalMediumClickableSpans">'+
  '<table>'+
    '<tr>'+
      '<td class="overMediumButtonTD">'+
        '<span title="undo" class="undo">&#8630;</span>'+
      '</td>'+
    '</tr>'+
    '<tr>'+
      '<td class="overMediumButtonTD">'+
        '<span  title="delete tag(s) at cursor position: " class="delete_tag">&#9932;</span>'+
      '</td>'+
    '</tr>'+
    '<tr>'+
      '<td class="overMediumButtonTD">'+
        '<span  title="change tag(s) at cursor position: " class="change_tag">&#11156;</span>'+
      '</td>'+
    '</tr>'+
    '<tr>'+
      '<td class="overMediumButtonTD">'+
        '<span class="button-phrasal_verb_id5 category_button" data-categoryid="5">phrasal_verb</span>'+
      '</td>'+
    '</tr>'+
    '<tr>'+
      '<td class="overMediumButtonTD">'+
        '<span class="button-infinitive_id6 category_button" data-categoryid="6">infinitive</span>'+
      '</td>'+
    '</tr>'+
    '<tr>'+
      '<td class="overMediumButtonTD">'+
        '<span title="change hot keys" class="show_change_hotkeys">&#9911;</span>'+
      '</td>'+
    '</tr>'+
  '</table>'+
'</div>'+
'<div id="verticalMediumClickableSpansAdv">'+
  '<table>'+
    '<tr>'+
      '<td class="overMediumButtonTD">'+
        '<span title="undo" class="undo">&#8630;</span>'+
      '</td>'+
    '</tr>'+
    '<tr>'+
      '<td class="overMediumButtonTD">'+
        '<span  title="delete tag(s) at cursor position: " class="delete_tag">&#9932;</span>'+
      '</td>'+
    '</tr>'+
    '<tr>'+
      '<td class="overMediumButtonTD">'+
        '<span  title="change tag(s) at cursor position: " class="change_tag">&#11156;</span>'+
      '</td>'+
    '</tr>'+
    '<tr>'+
      '<td class="overMediumButtonTD">'+
        '<span class="button-phrasal_verb_id5 category_button" data-categoryid="5">phrasal_verb</span>'+
      '</td>'+
    '</tr>'+
    '<tr>'+
      '<td class="overMediumButtonTD">'+
        '<span class="button-infinitive_id6 category_button" data-categoryid="6">infinitive</span>'+
      '</td>'+
    '</tr>'+
    '<tr>'+
      '<td class="overMediumButtonTD">'+
        '<span title="change hot keys" class="show_change_hotkeys">&#9911;</span>'+
      '</td>'+
    '</tr>'+
    '<tr>'+
      '<td class="overMediumButtonTD">'+
        '<span title="change transcription saving frequency" class="show_saving_time">&#8987;</span>'+
      '</td>'+
    '</tr>'+
  '</table>'+
'</div>'+
'<div class="categoryTypesDiv" id="categoryTypesDiv" data="{}"></div>'+
'<div class="categoryTypesDivAdv" id="categoryTypesDivAdv" data="{}"></div>'+
'<div class="initialAttrIds" id="initialAttrIds" data="{}"></div>'
);
}

//This is test suite
describe("TranscriptionModule", function() {
	var transcriptionModule;

	//This will be called before running each spec
    beforeEach(function() {
    	setUpHTMLFixture();
        transcriptionModule = Object.create(TranscriptionModule);
		transcriptionModule.init();
    });


    //This will be called after running each spec
    afterEach(function() {
		transcriptionModule.teardown();
    });

    //The default transcription saving interval is set to 3 minutes: 180000 milliseconds
    it("getTranscriptionSavingInterval should return 180000", function() {
        expect( transcriptionModule.getTranscriptionSavingInterval() ).toEqual('180000');
    });

    //The transcription saving interval dialog box should show 3 as a default value of the transcription saving interval
    it("showSavingTimeHandler should show the pop up dialog box", function() {
    	//Open the dialog box
    	transcriptionModule.showSavingTimeHandler();
    	//The dialog box should show 
        expect( $("#changeSavingTimeMenu")).toBeVisible();
    });
    
    //The transcription saving interval dialog box should show 3 as a default value of the transcription saving interval
    it("showSavingTimeHandler should show 3 as a transcription saving frequenc value", function() {
    	//Open the dialog box
    	transcriptionModule.showSavingTimeHandler();
    	//The dialog box should show 3 as a default value of the transcription saving interval
        expect( $("#input_time").val()).toEqual('3');
    });

    

    //Test the transcription saving interval changing functionality
    it("getTranscriptionSavingInterval should return 120000 after change", function() {
    	//Change the transcription saving interval
    	$('#input_time').val(2);
    	//Apply changes
    	transcriptionModule.changeSavingTimeTimeHandler();
    	//Verify the result
        expect( transcriptionModule.getTranscriptionSavingInterval()).toEqual('120000');
    });   


    it("test addTagHandler", function() {
    	//Open the dialog box
    	transcriptionModule.addTagHandler();
    	$('#select-id').val("phrasal_verb_id5").trigger('chosen:updated');
    	//Verify the result
        expect( $("#page_source_text")).toHaveText('<phrasal_verb_id5 mode="0"');
    });


});