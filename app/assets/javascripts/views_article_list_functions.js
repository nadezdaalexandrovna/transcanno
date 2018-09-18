  var numberOfAddedAttributes=0;
  var previousAttrId=null;
  var previousSeqAttrId=null;
  var activeValueId=null;
  var activeValuename=null;
  var previousvalueId=null;
  var previousValuename=null;
  var activeAttributeId=null;
  var previousActiveAttributeId=null;



  function addToDefaultValues(attr_id,value_id){

    var html = "<input type='hidden' name='default_attr_vals["+attr_id+"][]' id='default_"+attr_id+"_"+value_id+"' value='"+value_id+"'>";
    $('#default_attribute_values').append(html);
  }

 
    //Functions for the attributes menu
    function addHeaderValueField(style) {      
      numberOfAddedAttributes+=1;
      var html = "<input name='header_value[]' class='header_value_input_field' type='text'><br>";
      html+='</div>';
      $('#fieldsHeader').append(html);      
    }

    function deleteHeaderValue(headerValueId){
      var html = "<input type='hidden' name='delete_header_value[]' value='"+headerValueId+"'>";
      $('#hiddenHeaderValue').append(html);
      document.getElementById("delete_header_value_"+headerValueId).disabled=true;

    }

    function renameHeaderValue(valueId){
      $("#rename_header_value"+valueId).show();
    }


    //Functions for the attributes menu
    function addField(style) {
      
      numberOfAddedAttributes+=1;
      var html = "<input name='attribute[]' class='attribute_input_field' type='text'><br>";
      html+='<div style="'+style+'">';
      html+='<input id="category_new_attr_scope_0" name="new_attr_scope['+numberOfAddedAttributes+']" value="0" type="radio">simple<br>';
      html+='<input id="category_new_attr_scope_1" name="new_attr_scope['+numberOfAddedAttributes+']" value="1" type="radio">advanced<br>';
      html+='<input id="category_new_attr_scope_2" name="new_attr_scope['+numberOfAddedAttributes+']" value="2" type="radio" checked>both<br>';
      html+='</div>';
      $('#fields').append(html);
      
    }

    //Delete an attribute
    function deleteField(id) {
      var html = "<input type='hidden' name='delete_attribute[]' value='"+id+"'>";
      $('#fields').append(html);
      document.getElementById("delete_attribute_"+id).disabled=true;
    }

    //Function for the category creation menu normalising the category name
    function verifyValue(){
      var value=document.getElementById('category_title').value;
      value=$( $.parseHTML(value) ).text(); //Against malicious user input (a script in an input field)
      value=value.replace(/[ ]+/g, "_");
      value=value.replace(/[\-]+/g, "_"); //Hyphen is allowed but not accepted by all the parsers

      if(value.match(/^[^a-zA-Z_]+(.+)$/)!=null){
        value=value.match(/^[^a-zA-Z_]+(.+)$/)[1]; //An attribute name can only begin with a letter or an underscore
      }else if(value.match(/^[^a-zA-Z_]+$/)!=null){
        value="category_"+value;
      }

      value=value.replace(/[^a-zA-Z0-9_]+/g, "");
      //The values can't be longer than 255
      if(value.length>250){
        value=value.substr(0,250);
      }
      document.getElementById('category_title').value=value;
      return value;
    }

    function correctValue(elms){
      var val, i;

      for (i = 0; i < elms.length; i++) {
        val=elms[i].value;
        val=$( $.parseHTML(val) ).text(); //Against malicious user input (a script in an input field)
        val=val.replace(/[ ]+/g, "_");
        val=val.replace(/[\-]+/g, "_"); //Hyphen is allowed but not accepted by all the parsers

        if(val.match(/^[^a-zA-Z_]/)!=null){
          val="_"+val; //An attribute name can only begin with a letter or an underscore
        }

        val=val.replace(/[^a-zA-Z0-9_\.]+/g, "");

        //The values can't be longer than 255
        if(val.length>250){
          val=val.substr(0,250);
        }

        elms[i].value = val; 
      }
    }

    //Function for the attribute creation menu normalising the attribute name
    function verifyValueType(categoryTitle){
      
      var elms=document.getElementsByClassName('attribute_input_field');
      correctValue(elms);

      var elms2=document.getElementsByClassName('attribute_rename_field');
      correctValue(elms2);

    }

    //Function for the attribute values creation menu normalising the values names
    function verifyValueType2(){
      var val, i;
      var elms=document.getElementsByClassName('attribute_value_input_field');

      for (i = 0; i < elms.length; i++) {
        val=elms[i].value;
        val=$( $.parseHTML(val) ).text(); //Against malicious user input (a script in an input field)
        elms[i].value = val.replace(/[<&"'>]+/g, "_");
      }

      return;
    }


    //Functions for the attribute values menu


    //Show the menu for the chosen attribute in the attributes values popup
    function showAttributeValues(attributeId){
      if(previousAttrId!=null){
        $("#show_attribute_values"+previousAttrId).removeClass('show_attribute_values_active');
        $("#show_attribute_values"+previousAttrId).addClass('show_attribute_values');
        $("#one_attribute_div_"+previousAttrId).hide();
        $("#big_new_values_div_"+previousAttrId).hide();
        $("#big_suggestions_values_div_"+previousAttrId).hide();
        $("#allow_input_div_"+previousAttrId).hide();
      }
      previousAttrId=attributeId;
      $("#show_attribute_values"+previousAttrId).removeClass('show_attribute_values');
      $("#show_attribute_values"+attributeId).addClass('show_attribute_values_active');
      $("#one_attribute_div_"+attributeId).show();
      $("#big_new_values_div_"+attributeId).show();
      $("#big_suggestions_values_div_"+attributeId).show();
      $("#allow_input_div_"+attributeId).show();

      return false;
    }

    //For is_header_category.html.slim
    function showRadioButtons(cb){
      
      if(cb.checked){
        $("#only_radio_buttons").show();
        $("#only_radio_buttons").setAttribute("style","");
      }else{
        $("#only_radio_buttons").hide();
        $("#only_radio_buttons").setAttribute("style","display:none;");
      }
      
    }

    function showRadioButtonsAttributeValues(cb, attr_id){
      
      if(cb.checked){
        
        $("#only_radio_buttons_attr_values_"+attr_id).show();
        $("#only_radio_buttons_attr_values_"+attr_id).setAttribute("style","");

        $("#only_"+attr_id+"_0").setAttribute("checked",true);
        $("#only_"+attr_id+"_1").setAttribute("checked",false);
        $("#only_"+attr_id+"_2").setAttribute("checked",false);
        $("#only_"+attr_id+"_3").setAttribute("checked",false);
        $("#only_"+attr_id+"_4").setAttribute("checked",false);
        $("#max_len["+attr_id+"]").setAttribute("value","");
        
      }else{

        $("#only_radio_buttons_attr_values_"+attr_id).hide();
        $("#only_radio_buttons_attr_values_"+attr_id).setAttribute("style","display:none;");
        
        $("#only_"+attr_id+"_0").setAttribute("checked",true);
        $("#only_"+attr_id+"_1").setAttribute("checked",false);
        $("#only_"+attr_id+"_2").setAttribute("checked",false);
        $("#only_"+attr_id+"_3").setAttribute("checked",false);
        $("#only_"+attr_id+"_4").setAttribute("checked",false);
        $("#max_len["+attr_id+"]").setAttribute("value","");
      }
      
    }

    //Show possible values of the chosen attribute in the sequences menu
    function showSeqAttrValues(attributeId){
      if(previousSeqAttrId!=null){
        $("#set_initial_div_"+previousSeqAttrId).hide();
        $("#attr_name_button"+previousSeqAttrId).removeClass('seq_attr_name_button_active');
        $("#attr_name_button"+previousSeqAttrId).addClass('seq_attr_name_button');
        $("#seq_one_attribute_div_"+previousSeqAttrId).hide();
        $(".possible_sequences_of_value").hide();
        $("#sequences_of_value_"+previousActiveAttributeId+"_"+previousvalueId).hide();
        $("#title_of_value_"+previousvalueId).hide();
        $("#title_of_possible_seqs_"+previousvalueId).hide();                
      }
      previousSeqAttrId=attributeId;

      //Activate consequence buttons
      $(".button_possible").removeAttr('disabled');
      $(".seq_attr_name_button").removeAttr('disabled');

      $("#set_initial_div_"+attributeId).show();

      $("#attr_name_button"+previousSeqAttrId).removeClass('seq_attr_name_button');
      $("#attr_name_button"+previousSeqAttrId).addClass('seq_attr_name_button_active');
      $("#seq_one_attribute_div_"+attributeId).show();

      $("#possible_consequent_attrs_div").hide();
      activeValueId=null;
      activeValuename=null;

      return false;
    }

    //Delete an existing value of the chosen attribute
    function deleteAttributeValue(attributeValueid,attributeId){
      var html = "<input type='hidden' name='delete_attribute_value["+attributeId+"][]' value='"+attributeValueid+"'>";
      $('#one_attribute_div_'+attributeId).append(html);
      document.getElementById("delete_attribute_value_"+attributeValueid).disabled=true;

    }

    //Create a new value of the chosen attribute
    function addAttributeValue(attributeId){
      var html = '<input name="add_attribute_value['+attributeId+'][]" class="attribute_value_input_field" type="text"><br>';
      $('#new_values_div_'+attributeId).append(html);
    }

    //Add a new value for the chosen attribute from the suggested possible values
    function addFromPossibleValues(attributeId, valueId, valueName){
      var html = "<input type='hidden' name='val_from_possible["+attributeId+"][]' id='val_from_possible_"+attributeId+"_"+valueId+"' value='"+valueId+"'>";
      $('#hidden').append(html);
      document.getElementById('button_value_suggestion_'+attributeId+'_'+valueId).disabled=true;

      var newButton=document.createElement("button");
      newButton.id='button_'+attributeId+'_'+valueId;
      newButton.type="button";
      newButton.appendChild(document.createTextNode(valueName));
      newButton.onclick=function(){
        deletePossibleFromAttrValue(attributeId,valueId);
      };
      $("#from_possible_values_div_"+attributeId).append(newButton);
    }

    function deletePossibleFromAttrValue(attributeId,valueId){

      //Delete the attribute value from the hidden input field of the form
      var element=document.getElementById("val_from_possible_"+attributeId+"_"+valueId);
      
      if(element!=null){
        element.parentNode.removeChild(element);
      }

      //Delete the button
      var button=document.getElementById("button_"+attributeId+"_"+valueId);
      
      if(button!=null){
        button.parentNode.removeChild(button);
      }
      document.getElementById('button_value_suggestion_'+attributeId+'_'+valueId).disabled=false;
    }
    
    function deleteAttribute(attributeId){
      var html = "<input type='hidden' name='delete_attribute[]' value='"+attributeId+"'>";
      $('#hidden').append(html);
      document.getElementById("delete_attribute_"+attributeId).disabled=true;

    }

        
    //Sequences functions
    function activateSequence(activeAttributeIdFrom,valueId,valueName,activeAttributeName){

      activeAttributeId=activeAttributeIdFrom;
      if (previousvalueId!=null){
        $("#sequences_of_value_"+previousActiveAttributeId+"_"+previousvalueId).hide();
        $("#possible_sequences_of_value_"+previousvalueId).hide();
        $("#title_of_value_"+previousvalueId).hide();
        $("#title_of_possible_seqs_"+previousvalueId).hide();        
      }
      $("#title_of_value_"+valueId).show();
      $("#title_of_possible_seqs_"+valueId).show();
      $("#sequences_of_value_"+activeAttributeId+"_"+valueId).show();
      $("#possible_sequences_of_value_"+valueId).show();
      $("#possible_consequent_attrs_div").show();
      activeValueId=valueId;
      previousActiveAttributeId=activeAttributeIdFrom;
      activeValuename=valueName;
      previousvalueId=valueId;
      previousValuename=valueName;


      //Activate consequence buttons
      $(".button_possible").removeAttr('disabled');
      $(".seq_attr_name_button").removeAttr('disabled');

      //Disable the button corresponding to the current attribute
      if(document.getElementById("seq_attr_name_button"+activeAttributeName)!=null){
        document.getElementById("seq_attr_name_button"+activeAttributeName).disabled = 'true';
      }

      //Already selected consequent attributes for this value => we have to disable the corresponding buttons
      var alreadySelectedConsequences=$("#sequences_of_value_"+activeAttributeId+"_"+valueId).children();
      var i,
          consEl,
          consElId,
          res;
      for (i=0; i<alreadySelectedConsequences.length; i++){
        consEl=alreadySelectedConsequences[i];
        consElId=consEl.id;
        res = consElId.match(/^button_\d_(.+)$/)[1];
        if(document.getElementById("button_possible_"+res)!=null){
          document.getElementById("button_possible_"+res).disabled = 'true';
        }
        if(document.getElementById("seq_attr_name_button"+res)!=null){
          document.getElementById("seq_attr_name_button"+res).disabled = 'true';
        }
      }

      return false;
    }


    function addToValueSequences(comsequentAttributeName){

      //Disable the button that has just been pushed
      if(document.getElementById("button_possible_"+comsequentAttributeName)!=null){
        document.getElementById("button_possible_"+comsequentAttributeName).disabled = 'true';
      }
      //Disable the button of the posible consequent attributes at the bottom of the window
      if(document.getElementById("seq_attr_name_button"+comsequentAttributeName)!=null){
        document.getElementById("seq_attr_name_button"+comsequentAttributeName).disabled = 'true';
      }
      
      var sequenceButton=document.createElement('button');
      sequenceButton.id='button_'+activeValueId+'_'+comsequentAttributeName;
      sequenceButton.type="button";
      sequenceButton.appendChild(document.createTextNode(comsequentAttributeName));
      sequenceButton.onclick=function(){
        deleteSequenceFromAttrValue(activeAttributeId,activeValueId,comsequentAttributeName, 0);
      };

      //Add the values to a hidden input form field
      var newInput='<input type="hidden" id="seq_'+activeAttributeId+'_'+activeValueId+'_'+comsequentAttributeName+'" name="seq['+activeAttributeId+'*#*'+activeValueId+'*#*'+activeValuename+'][]" value="'+comsequentAttributeName+'"/>';
      $("#sequences").append(newInput);

      $("#sequences_of_value_"+activeAttributeId+'_'+activeValueId).append(sequenceButton);
      $("#sequences_of_value_"+activeAttributeId+'_'+activeValueId).show();
      return false;
    }


    //Delete the values from the hidden input form field
    function deleteSequenceFromAttrValue(activeAttributeId,activeValueId,attributeName, consequentRelationId){
      //Enable consequent attributes buttons
      if(document.getElementById("button_possible_"+attributeName)!=null){
        $("#button_possible_"+attributeName).removeAttr('disabled');
      }
      if(document.getElementById("seq_attr_name_button"+attributeName)!=null){
        $("#seq_attr_name_button"+attributeName).removeAttr('disabled');
      }

      var element=document.getElementById("seq_"+activeAttributeId+'_'+activeValueId+"_"+attributeName);
      //If this consequent attribute has just been added in this same menu, we delete it from the hidden input field of the form
      if(element!=null){
        element.parentNode.removeChild(element);
        
      }else{ //If the consequent attribute is already present in the database, we add it to the hidden field of the form
        //Add the values to a hidden input form field
        var newInputDelete='<input type="hidden" id="seqdelete_'+activeAttributeId+'_'+activeValueId+'_'+attributeName+'" name="seqdelete['+activeAttributeId+'*#*'+activeValueId+'*#*'+activeValuename+'][]" value="'+consequentRelationId+'"/>';
        $("#sequences").append(newInputDelete);
      }

      var button=document.getElementById("button_"+activeValueId+"_"+attributeName);
      var para=button.parentNode;
      para.removeChild(button);

      return false;
    }

    function addPossibleAttr(attrId,attrName){
      //Add a new button that will allow to delete the added attribute
      var div=document.getElementById("from_possible_attributes");
      var newButton=document.createElement("button");
      newButton.id='button_possible_attribute_'+attrId;
      newButton.type="button";
      newButton.appendChild(document.createTextNode(attrName));
      newButton.onclick=function(){
        deletePossibleAttribute(attrId,attrName);
      };
      div.appendChild(newButton);

      var newInput='<input name="attribute[]" class="attribute_input_field" type="hidden" id="new_from_possible_attr_hidden_'+attrId+'" value="'+attrName+'">';
      $("#hidden").append(newInput);

      //Desactivate the button
      $("add_possible_attr_"+attrId).disabled=true;
    }

    function deletePossibleAttribute(attrId,attrName){
      //Delete the button allowing to delete the attribute
      var buttonToDelete=document.getElementById("button_possible_attribute_"+attrId);
      buttonToDelete.parentNode.removeChild(buttonToDelete);

      //Delete the input
      var inputToDelete=document.getElementById("new_from_possible_attr_hidden_"+attrId);
      inputToDelete.parentNode.removeChild(inputToDelete);

      //Reactivate the button
      $("add_possible_attr_"+attrId).disabled=false;
    }

    function renameAttribute(attrId){
      $("#rename_attribute_input"+attrId).show();
    }
