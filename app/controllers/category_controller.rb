class CategoryController < ApplicationController
  public :render_to_string
  protect_from_forgery

  # no layout if xhr request
  layout Proc.new { |controller| controller.request.xhr? ? false : nil }, :only => [:edit, :add_new, :update, :create, :define_style, :define_attributes, :define_attribute_values, :assign_category_scope, :define_attribute_sequences]

  def edit
  end

  def update
    if @category.update_attributes(params[:category])
      flash[:notice] = "Category has been updated"
      ajax_redirect_to "#{request.env['HTTP_REFERER']}#category-#{@category.id}"
    else
      render :action => 'edit'
    end
  end

  def add_new
    @new_category = Category.new({ :collection_id => @collection.id })
    @new_category.parent = @category if @category.present?
  end

  def create
    @new_category = Category.new(params[:category])

    #I added this line: assign a default scope for the new category: by default, the new category can be used in both modes: simple and advanced
    Categoryscope.new(category_id: @new_category.id, mode: 2)

    @new_category.parent = Category.find(params[:category][:parent_id]) if params[:category][:parent_id].present?
    if @new_category.save
      flash[:notice] = "Category has been created"
      ajax_redirect_to "#{request.env['HTTP_REFERER']}#category-#{@new_category.id}"
    else
      render :action => 'add_new'
    end
  end

  def define_attribute_sequences
    connection = ActiveRecord::Base.connection
    #define_attribute_values
    @categoryattributes=[]
    sqlAt="SELECT categoryattributes.id, attributecats.name, categoryattributes.allow_user_input, categoryattributes.initial FROM categoryattributes INNER JOIN attributecats ON attributecats.id=categoryattributes.attributecat_id where categoryattributes.mode!=0 and `categoryattributes`.`category_id`="+params[:category_id]
    resAt=connection.execute(sqlAt)
    resAt.each do |r|
      puts "r\n"
      print r.inspect
      puts "\n"
      @categoryattributes.push([r[0],r[1],r[2],r[3]])
    end

    @attributeValuesHash={}
    sqlS="SELECT categoryattributes.id, attributecats.name, attributevalues.id, attributevalues.value, categoryattributes.mode FROM `attributevalues` INNER JOIN attributes_to_values on attributes_to_values.attributevalue_id=attributevalues.id INNER JOIN `categoryattributes` ON `categoryattributes`.`id` = `attributes_to_values`.`categoryattribute_id` INNER JOIN attributecats ON attributecats.id=categoryattributes.attributecat_id where `categoryattributes`.`category_id`="+params[:category_id]
    res=connection.execute(sqlS)

    res.each do |r|
      if @attributeValuesHash.key?(r[0].to_s)
        @attributeValuesHash[r[0].to_s].push({'valueid':r[2], 'value':r[3]})
      else
        @attributeValuesHash[r[0].to_s]=[{'valueid':r[2], 'value':r[3]}]
      end
    end

    #Select sequences for the values of each attribute of this category
    sql="SELECT attributevalues.id, attributevalues.value, valuestoattributesrelations.consequent_attr_name, valuestoattributesrelations.id FROM attributevalues INNER JOIN valuestoattributesrelations on attributevalues.id=valuestoattributesrelations.attributevalue_id INNER JOIN attributes_to_values ON valuestoattributesrelations.id=attributes_to_values.valuestoattributesrelation_id INNER JOIN categoryattributes ON categoryattributes.id = attributes_to_values.categoryattribute_id where categoryattributes.mode!=0 and categoryattributes.category_id="+params[:category_id]
    connection = ActiveRecord::Base.connection
    already_relations=connection.execute(sql)

    excludeFromPossibleRelationsIds={}

    #Relations defined for each attribute value of each attribute of this category
    @alreadyRelsHash={}
    already_relations.each do |already_rel|
      if @alreadyRelsHash.key?(already_rel[0])
        @alreadyRelsHash[already_rel[0]].push([already_rel[2],already_rel[3]])
        excludeFromPossibleRelationsIds[already_rel[3]]=0
      else
        @alreadyRelsHash[already_rel[0]]=[[already_rel[2],already_rel[3]]]
        excludeFromPossibleRelationsIds[already_rel[3]]=0
      end
    end

    #All the possible consequent attributes of each value, if these attributes can belong to this category
    #sqlS="SELECT valuestoattributesrelations.id, attributevalues.value, valuestoattributesrelations.consequent_attr_name FROM valuestoattributesrelations inner join attributevalues on valuestoattributesrelations.attributevalue_id=attributevalues.id INNER JOIN categoryattributes on categoryattributes.name=valuestoattributesrelations.consequent_attr_name INNER JOIN attributes_to_values ON attributevalues.id=attributes_to_values.value_id INNER JOIN categoryattributes ON categoryattributes.id=attributes_to_values.attribute_id where categoryattributes.category_id="+params[:category_id];
    
    sqlS="SELECT valuestoattributesrelations.id, attributevalues.value, valuestoattributesrelations.consequent_attr_name FROM valuestoattributesrelations INNER JOIN attributevalues ON valuestoattributesrelations.attributevalue_id=attributevalues.id INNER JOIN attributes_to_values ON attributes_to_values.attributevalue_id=attributevalues.id INNER JOIN categoryattributes ON categoryattributes.id=attributes_to_values.categoryattribute_id WHERE category_id="+params[:category_id]
    possible_relations=connection.execute(sqlS)

    #All the possible consequent attributes of each value. Key: attribute_value, value: array of consequent attributes
    @possibleRelationsHash={} 
    possible_relations.each do |pr|
      unless excludeFromPossibleRelationsIds.key?(pr[0])
        if @possibleRelationsHash.key?(pr[1])
          @possibleRelationsHash[pr[1]].push(pr[2])
        else
          @possibleRelationsHash[pr[1]]=[pr[2]]
        end
      end
    end

  end

  def define_attribute_sequences2
    giveNotice=false

    #Update the initial column: set and unset initial attributes
    sql="update categoryattributes set initial=false where category_id="+params[:category_id]
    connection = ActiveRecord::Base.connection
    connection.execute(sql)

    if params[:initial]!=nil
      giveNotice=true
      forSql=""
      params[:initial].each do |attrid|
        if attrid!=nil && attrid!=""
          giveNotice=true
          forSql+=attrid+", "
        end
      end
      if forSql!=""
        sql="update categoryattributes set initial=true where id in ("+forSql[0..-3]+");"
        connection.execute(sql)
      end
    end

    #Update the sequences
    if params[:seq]!=nil
      giveNotice=true
      forSql=""
      params[:seq].each do |valueIdandName, attrsArray|
        arrayIdName=valueIdandName.split("*#*")
        activeAttrId=arrayIdName[0]
        valueId=arrayIdName[1]
        valueName=arrayIdName[2]
        puts "\nactiveAttrId\n"
        print activeAttrId.inspect
        puts "\nvalueId\n"
        print valueId.inspect
        puts "\nvalueName\n"
        print valueName.inspect
        #sql="select id, consequent_attr_name from valuestoattributesrelations where attributevalue_id=\""+valueId+"\"";
        #reply=connection.execute(sql)
        #if reply.any?
        attrsArray.each do |attr|
          rel = Valuestoattributesrelation.find_or_create_by(attributevalue_id: valueId, consequent_attr_name: attr)
          attr_to_value=AttributesToValue.where(categoryattribute_id: activeAttrId, attributevalue_id: valueId).update_all(valuestoattributesrelation_id: rel.id)
          puts "\nrel.id\n"
          puts rel.id
          puts "\n"
          #attr_to_value.value_to_attr_relation_id=rel.id
          #attr_to_value.save
          #AttributesToValue.find_or_create_by(attribute_id: ,value_id:valueId,value_to_attr_relation_id:rel.id)
        end
        #else
          #arrayValueAttr=[]
          #attrsArray.each do |attr|
            #rel = Valuestoattributesrelation.create(attributevalue_id: valueId, consequent_attr_name: attr)
            #Attributevaluestorelation.create(attributevalue_id:valueId,relation_id:rel.id)
          #end
       # end
      end
    end

    #Delete already existing sequences
    if params[:seqdelete]!=nil
      giveNotice=true
      params[:seqdelete].each do |valueIdandName, relsArray|
        arrayIdName=valueIdandName.split("*#*")
        activeAttrId=arrayIdName[0]
        valueId=arrayIdName[1]
        valueName=arrayIdName[2]
        puts "relsArray\n"
        print relsArray.inspect
        puts "\n"
        #Array of relation ids
        #relsArray=attrsArray.map{ |e| "'" + e + "'" }
        attr_to_value=AttributesToValue.where(categoryattribute_id: activeAttrId, attributevalue_id: valueId, value_to_attr_relation_id:relsArray).update_all(value_to_attr_relation_id: nil)
        #sql2="DELETE FROM valuestoattributesrelations WHERE valuestoattributesrelations.id NOT IN (SELECT attributes_to_values.value_to_attr_relation_id FROM attributes_to_values)"
        sql2="DELETE valuestoattributesrelations FROM valuestoattributesrelations LEFT JOIN attributes_to_values ON valuestoattributesrelations.id=attributes_to_values.valuestoattributesrelation_id WHERE attributes_to_values.valuestoattributesrelation_id IS NULL"
        connection.execute(sql2)
        #sql="update attributes_to_values set value_to_attr_relation_id=null where attribute_id="+activeAttrId+" and value_id="+valueId+" 
        #connection.execute(sql)
      end
    end

    if giveNotice==true
      flash[:notice] = "Attribute sequences have been defined."
    end
    ajax_redirect_to "#{request.env['HTTP_REFERER']}#category-#{@category.id}"
  end

  def assign_category_scope
    scope=Categoryscope.where(category_id: params[:category_id])
    
    @scopehash={0=>false,1=>false,2=>false}
    unless scope.empty?
      scope.each do |s|
        @scopehash[s.mode]=true
      end
    end
  end

  def assign_category_scope2
    scope=Categoryscope.find_or_create_by(category_id: params[:category_id])
    scope.mode=params[:category][:category_scope].to_i

    if scope.save
      flash[:notice] = "Category scope has been assigned."
      ajax_redirect_to "#{request.env['HTTP_REFERER']}#category-#{@category.id}"
    else
      render :action => 'assign_category_scope'
    end
  end

  def define_style
  end

  def define_attribute_values
    connection = ActiveRecord::Base.connection

    #@categoryattributes=Categoryattribute.where(category_id: params[:category_id])

    #All the existing values of the attributes of this category
    @categoryattributes=[]
    sqlAt="SELECT categoryattributes.id, attributecats.name, categoryattributes.allow_user_input, categoryattributes.initial FROM categoryattributes INNER JOIN attributecats ON attributecats.id=categoryattributes.attributecat_id where `categoryattributes`.`category_id`="+params[:category_id]
    resAt=connection.execute(sqlAt)
    resAt.each do |r|
      puts "r\n"
      print r.inspect
      puts "\n"
      @categoryattributes.push([r[0],r[1],r[2],r[3]])
    end

    @attributeValuesHash={}
    sqlS="SELECT categoryattributes.id, attributecats.name, attributevalues.id, attributevalues.value, categoryattributes.mode FROM `attributevalues` INNER JOIN attributes_to_values on attributes_to_values.attributevalue_id=attributevalues.id INNER JOIN `categoryattributes` ON `categoryattributes`.`id` = `attributes_to_values`.`categoryattribute_id` INNER JOIN attributecats ON attributecats.id=categoryattributes.attributecat_id where `categoryattributes`.`category_id`="+params[:category_id]
    res=connection.execute(sqlS)

    res.each do |r|
      if @attributeValuesHash.key?(r[0].to_s)
        @attributeValuesHash[r[0].to_s].push({'valueid':r[2], 'value':r[3]})
      else
        @attributeValuesHash[r[0].to_s]=[{'valueid':r[2], 'value':r[3]}]
      end
    end

    #All the possible values of the attributes of this category (maybe defined in other categories)
    sql="SELECT attributecats.name, attributevalues.id, attributevalues.value FROM attributevalues INNER JOIN attributes_to_values ON attributes_to_values.attributevalue_id=attributevalues.id INNER JOIN categoryattributes ON categoryattributes.id=attributes_to_values.categoryattribute_id INNER JOIN attributecats ON attributecats.id=categoryattributes.attributecat_id where attributecats.name in (SELECT attributecats.name FROM attributecats INNER JOIN categoryattributes ON attributecats.id=categoryattributes.attributecat_id where category_id="+params[:category_id]+") and attributevalues.value not in (SELECT attributevalues.value FROM `attributevalues` INNER JOIN attributes_to_values on attributes_to_values.attributevalue_id=attributevalues.id INNER JOIN `categoryattributes` ON `categoryattributes`.`id` = `attributes_to_values`.`categoryattribute_id` where `categoryattributes`.`category_id`="+params[:category_id]+")"
    res=connection.execute(sql)
    puts "res\n"
    print res.inspect
    @possibleValuesForEachAttribute={}
    res.each do |r|
      if @possibleValuesForEachAttribute.key?(r[0])
        @possibleValuesForEachAttribute[r[0]].push([r[1],r[2]])
      else
        @possibleValuesForEachAttribute[r[0]]=[[r[1],r[2]]]
      end
    end
    puts "@possibleValuesForEachAttribute\n"
    print @possibleValuesForEachAttribute.inspect
    puts "\n"
    puts "@categoryattributes\n"
    print @categoryattributes.inspect
    puts "\n"

  end

  def define_attribute_values2
    connection = ActiveRecord::Base.connection
    @category.id=params[:category_id]
    giveNotice=false

    if params[:delete_attribute_value]!=nil
      forSql=""
      params[:delete_attribute_value].each do |attrId, valueIDs|
        valueIDs.each do |valueid|
          #forSql+=valueid+", "
          sql="delete from attributes_to_values where value_id="+valueid+" and attribute_id="+attrId
          connection.execute(sql)
          giveNotice=true
          #Delete from attributevalues if no attribute has this value
          sql2="DELETE FROM attributevalues WHERE attributevalues.id not in (SELECT attributes_to_values.attributevalue_id FROM attributes_to_values)"
          connection.execute(sql2)
        end
      end
    end

    sql="update categoryattributes set allow_user_input=false where category_id="+params[:category_id]+";"
    connection.execute(sql)

    if params[:allow_user_input]!=nil
      forSql=""
      params[:allow_user_input].each do |attrid|
        if attrid!=nil && attrid!=""
          giveNotice=true
          forSql+=attrid+", "
        end
      end
      if forSql!=""
        sql="update categoryattributes set allow_user_input=true where id in ("+forSql[0..-3]+");"
        connection.execute(sql)
      end
    end

    if params[:add_attribute_value]!=nil
      forSql=""
      params[:add_attribute_value].each do |attrid, attrValues|
        attrValues.each do |attrValue|
          if attrValue.length>0
            #forSql+='("'+attrValue+'"), '
            puts "attrValue\n"
            puts attrValue+"\n"
            #sql="INSERT INTO attributevalues (value) VALUES ('"+attrValue+"')"
            res=Attributevalue.find_or_create_by(value: attrValue)
            #res=connection.execute(sql)
            AttributesToValue.create(categoryattribute_id: attrid, attributevalue_id: res.id)
            #sql2="INSERT INTO attributes_to_values (attribute_id,value_id) VALUES ("+attrid+","+res.id+")"
            #res=connection.execute(sql2)
          end
        end
      end
      #if forSql!=""
        #sql="INSERT INTO attributevalues (value) VALUES "
        #sql+=forSql[0..-3]
        #connection = ActiveRecord::Base.connection
        #connection.execute(sql)
      #end 
    end

    if params[:val_from_possible]!=nil
      params[:val_from_possible].each do |attrid, valueIds|
        valueIds.each do |valueId|
          if valueId.length>0
            AttributesToValue.create(categoryattribute_id: attrid, attributevalue_id: valueId)
          end
        end
      end
    end

    if giveNotice==true
      flash[:notice] = "Category attributes have been defined."
    end
    ajax_redirect_to "#{request.env['HTTP_REFERER']}#category-#{@category.id}"
  end

  def define_attributes
    connection = ActiveRecord::Base.connection
    scope=Categoryscope.where(category_id: params[:category_id])
    @categoryScope=2
    unless scope.empty?
      scope.each do |s|
        @categoryScope=s.mode
      end
    end

    @disableScopeChoice=""
    #If the category scope is restricted, there is no use to choose its attributes' scope: it will be the same
    if @categoryScope==0 || @categoryScope==1
      @disableScopeChoice='display:none;'
    end

    #@categoryattributes=Categoryattribute.joins("join attributecats on categoryattributes.attributecat_id=attributecats.id").where(category_id: params[:category_id])
    sql="SELECT categoryattributes.id, categoryattributes.allow_user_input, categoryattributes.mode, categoryattributes.initial, attributecats.name FROM categoryattributes INNER JOIN attributecats ON categoryattributes.attributecat_id=attributecats.id WHERE category_id="+params[:category_id]
    catattrs=connection.execute(sql)
    puts "\n@catattrs\n"
    print catattrs.inspect
    puts "\n"

    #Select all the attributes defined in this collection
    sqlA="SELECT attributecats.id, attributecats.name FROM attributecats INNER JOIN categoryattributes ON attributecats.id=categoryattributes.attributecat_id INNER JOIN categories ON categoryattributes.category_id=categories.id WHERE collection_id="+params[:collection_id]+" AND attributecats.id NOT IN (SELECT categoryattributes.attributecat_id from categoryattributes WHERE category_id="+params[:category_id]+")"
    @possibleAttrs=connection.execute(sqlA)

    @attrscopehash={}
    @categoryattributes=[]
    catattrs.each do |r|
      puts "\nr\n"
      print r.inspect
      puts "\n"
      @categoryattributes.push([r[0],r[4]])

      @attrscopehash[r[0]]={0=>false,1=>false,2=>false}
      @attrscopehash[r[0]][r[2]]=true
    end
    puts "\n@attrscopehash\n"
    print @attrscopehash.inspect
    puts "\n"
    puts "\n@categoryattributes\n"
    print @categoryattributes.inspect
    puts "\n"
  end

  def define_attributes2
    connection = ActiveRecord::Base.connection
    @category.id=params[:category_id]
    giveNotice=false
    if params[:delete_attribute]!=nil
      forSql=""
      params[:delete_attribute].each do |type|
        if type!=nil && type!=""
          giveNotice=true
          forSql+=type+", "
        end
      end
      if forSql!=""
        sql="delete from categoryattributes where id in ("+forSql[0..-3]+");"
        connection.execute(sql)
      end
      #Delete attributes that no longer have categories associated to them
      sqlD="DELETE attributecats FROM attributecats LEFT JOIN categoryattributes ON attributecats.id=categoryattributes.attributecat_id WHERE categoryattributes.attributecat_id IS NULL"
      connection.execute(sqlD)
    end
    if params[:attribute]!=nil
      #forSql=""
      numberNews=0
      params[:attribute].each do |type|
        if type!=nil && type!=""
          if params[:category_scope]!=2
            mode=params[:category_scope]
          else
            mode=params[:new_attr_scope][numberNews.to_s]
          end
          giveNotice=true
          #insertAttributeName="INSERT INTO attributecats (name) values ('"+type+"')"
          #attribute=connection.execute(insertAttributeName)
          puts "\ntype\n"
          print type
          puts "\n"
          attribute=Attributecat.find_or_create_by(name: type)
          puts "\nattribute\n"
          print attribute.inspect
          puts "\n"
          Categoryattribute.create(attributecat_id: attribute.id, mode: mode, category_id: params[:category_id], allow_user_input: false, initial: false)

          #sql="INSERT INTO categoryattributes (attributecat_id, mode, category_id, allow_user_input, initial) VALUES ("+attribute.id+","+mode+","+params[:category_id]+", false, false)"
          #connection.execute(sql)
          #forSql+="( '"+type+"', "+mode+", "+params[:category_id]+", false, false), "
          numberNews+=1
        end
      end
      #if forSql!=""
        #begin
          #sql="INSERT INTO categoryattributes (name, mode, category_id, allow_user_input, initial) VALUES "
          #sql+=forSql[0..-3]
          #connection.execute(sql)
        #end
      #end
    end
    #Apply scopes of attributes
    if params[:category]!=nil
      forSql=""
      ids=""
      if params[:category_scope]=="2"
        params[:category].each do |scope|
          if scope!=nil && scope!=""
            giveNotice=true
            forSql+="WHEN id="+scope[0]+" THEN "+scope[1]+" "
            ids+=scope[0]+", "
          end
        end
      else
        params[:category].each do |scope|
          if scope!=nil && scope!=""
            giveNotice=true
            forSql+="WHEN id="+scope[0]+" THEN "+params[:category_scope]+" "
            ids+=scope[0]+", "
          end
        end
      end
      if forSql!=""
        sql="update categoryattributes set mode=CASE "
        sql+=forSql
        sql+="end where id in ("+ids[0..-3]+");"
        connection.execute(sql)
      end
    end
    if giveNotice==true
      flash[:notice] = "Category attributes have been defined."
    end
    ajax_redirect_to "#{request.env['HTTP_REFERER']}#category-#{@category.id}"
  end

  def define_style2
    style=Categorystyle.find_or_create_by(category_id: params[:category_id])

    if params[:tag_color]!=nil
      style.colour=params[:tag_color]
    end

    if params[:tag_decoration]!=nil
      style.textdecoration=params[:tag_decoration]
    end

    if params[:tag_font_style]!=nil
      style.fontstyle=params[:tag_font_style]
    end
    
    if style.save
      flash[:notice] = "Category style is ready to be applied."
      ajax_redirect_to "#{request.env['HTTP_REFERER']}#category-#{@category.id}"
    else
      render :action => 'define_style'
    end
  end


  def apply_all_styles
    sqlS="SELECT categories.title, categorystyles.colour, categorystyles.textdecoration, categorystyles.fontstyle, categories.id FROM `categorystyles` INNER JOIN `categories` ON `categories`.`id` = `categorystyles`.`category_id`"
    connection = ActiveRecord::Base.connection
    res=connection.execute(sqlS)
    styleInstructions=""
    mediumOnmouseoverFunctions="$(document).ready(function($) {\nvar da;\n"
    res.each do |r|
      if r[1]!=nil
        color = 'color:'+r[1]+';'
      else
        color = ''
      end

      if r[2]!=nil
        textdecoration = r[2]
      else
        textdecoration =''
      end

      if r[3]!=nil
        fontstyle = r[3]
      else
        fontstyle = ''
      end

      id=r[4].to_s

      style = color+textdecoration+fontstyle
      title=r[0]
      styleInstructions+="\n.medium-"+title+'_id'+id+"{"+style+"}"
      styleInstructions+="\n.button-"+title+'_id'+id+"{"+style+"}"
      mediumOnmouseoverFunctions+='$( ".button-'+title+'_id'+id+'" ).mousedown(function() {'+"\n"+
                                  'da = new Date();'+"\n"+
                                  'selection = window.getSelection();'+"\n"+
                                  'categoryid=$(this).attr("data-categoryid");'+"\n"+
                                  '[focusOffset,focusNode,anchorOffset,anchorNode]=medium.returnOffset();'+"\n"+
                                  'if(categoryid in categoryTypesHash){'+"\n"+                                  
                                  'position = $(this).offset();'+"\n"+
                                  'var coords = {x:position.left, y:position.top};'+"\n"+
                                  'if(selection.isCollapsed){'+"\n"+
                                  'userChosenAttributesAndValues=[];'+"\n"+
                                  'var categoryTable=categoriesInfo[categoryid];'+"\n"+
                                  'getNextCollapsed(\''+title+'_id'+id+'\',0, categoryTable,focusOffset,focusNode, notCollapsedArgsTable,coords,true);'+"\n"+
                                  '}else{'+"\n"+
                                  'tagSelectionWithType(categoryid, categoriesInfo, medium, \''+title+'_id'+id+'\', focusOffset, focusNode, [anchorNode, anchorOffset], coords,true);'+"\n"+
                                  '}'+"\n"+
                                  '}else{'+"\n"+
                                  'if(selection.isCollapsed){'+"\n"+
                                  'collapsedNoAttributesInsertTag(\''+title+'_id'+id+'\',focusOffset,focusNode);'+"\n"+
                                  '}else{'+"\n"+
                                  'medium.tagSelection3(\''+title+'_id'+id+'\', [], anchorNode,focusNode,anchorOffset, focusOffset);'+"\n"+
                                  '}'+"\n"+
                                  '}'+"\n"+
                                  'return false;'+"\n"+
                                  '});'+"\n"
    end
    mediumOnmouseoverFunctions+="});"
    File.write('app/assets/stylesheets/sections/_medium-tag-styles.scss', styleInstructions)
    File.write('public/my-medium-onmousedown-functions.js', mediumOnmouseoverFunctions)
    flash[:notice] = "Category changes have been applied."
    anchor = "#category-#{@category.id}"
    redirect_to "#{request.env['HTTP_REFERER']}#{anchor}"
  end

  def discard_all_styles
    Categorystyle.delete_all()
    File.write('app/assets/stylesheets/sections/_medium-tag-styles.scss', '')
    flash[:notice] = "Category styles have been discarded."
    anchor = "#category-#{@category.id}"
    redirect_to "#{request.env['HTTP_REFERER']}#{anchor}"
  end

  def delete
    connection = ActiveRecord::Base.connection
    anchor = @category.parent_id.present? ? "#category-#{@category.parent_id}" : nil
    Categorystyle.destroy_all(category_id: @category.id)
    Categoryattribute.destroy_all(category_id: @category.id)
    #Delete attributes that no longer have categories associated to them
    sqlD="DELETE attributecats FROM attributecats LEFT JOIN categoryattributes ON attributecats.id=categoryattributes.attributecat_id WHERE categoryattributes.attributecat_id IS NULL"
    connection.execute(sqlD)
    @category.destroy #_but_attach_children_to_parent
    #Delete attribute values that no longer have attributes associated to them
    sql="DELETE attributevalues FROM attributevalues LEFT JOIN attributes_to_values ON attributevalues.id=attributes_to_values.attributevalue_id WHERE attributes_to_values.attributevalue_id IS NULL"
    connection.execute(sql)
    sql2="DELETE valuestoattributesrelations FROM valuestoattributesrelations LEFT JOIN attributes_to_values ON valuestoattributesrelations.id=attributes_to_values.valuestoattributesrelation_id WHERE attributes_to_values.valuestoattributesrelation_id IS NULL"
    connection.execute(sql2)

    flash[:notice] = "Category has been deleted"
    redirect_to "#{request.env['HTTP_REFERER']}#{anchor}"
  end

end