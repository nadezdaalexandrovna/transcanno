class CategoryController < ApplicationController
  public :render_to_string
  protect_from_forgery
  
  # no layout if xhr request
  layout Proc.new { |controller| controller.request.xhr? ? false : nil }, :only => [:edit, :add_new, :import_all, :update, :create, :define_style, :define_description, :define_attributes, :define_attribute_values, :assign_category_scope, :define_attribute_sequences, :delete_all_categories, :is_header_category, :define_header_values]

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
    #By default the created category is not a header category
    @isheader=false
  end

  def import_all
    @new_collection = Collection.find_by_id(@collection.id)
    @new_collection_id = @collection.id
    
    connection = ActiveRecord::Base.connection
    sqlA="SELECT DISTINCT collections.title, collections.id from collections where collections.id !=" + @new_collection_id.to_s
    @possibleColls=connection.execute(sqlA)
  end

  #Imports all categories and their attributes and values from another collection
  def import2
    @new_collection_id = params[:new_collection_id]
    import_from_coll_id = params[:import_from_coll_id]

    connection = ActiveRecord::Base.connection

    categories_to_import = Category.where(collection_id:import_from_coll_id)

    categories_to_import.each do |cat|
      new_cat = Category.create(:title => cat.title, :collection_id => @new_collection_id)

      hashCorrespOldNewAttributecatIds = Hash.new # old_attr_id => new_attr_id
      hashCorrespOldNewAttributeValueIds = Hash.new # old_value_id => new_value_id

      if cat.categoryattributes
        cat.categoryattributes.each do |catattr|
          new_attributecat = Attributecat.create(:name => catattr.attributecat.name)
          hashCorrespOldNewAttributecatIds[catattr.attributecat.id] = new_attributecat.id

          new_catattr = Categoryattribute.create(:category_id => new_cat.id, :attributecat_id => new_attributecat.id, :allow_user_input => catattr.allow_user_input, :mode => catattr.mode, :initial => catattr.initial, :only => catattr.only, :max_len => catattr.max_len)
          
          if catattr.attributes_to_values
            catattr.attributes_to_values.each do |attr_to_val|
              
              sqlA="SELECT attributevalues.value from attributevalues where attributevalues.id =" + attr_to_val.attributevalue_id.to_s
              attrvalValues=connection.execute(sqlA)
              attrvalValues.each do |attrvalVal|
                new_attribute_value = Attributevalue.create(:value => attrvalVal[0])

                hashCorrespOldNewAttributeValueIds[attr_to_val.attributevalue_id] = new_attribute_value.id
                #I am NOT copying valuestoattributesrelations, because consequent attributes may not have been created yet
                sqlB="INSERT into attributes_to_values (categoryattribute_id, attributevalue_id, valuestoattributesrelation_id, is_default) VALUES (" + new_attributecat.id.to_s + "," + new_attribute_value.id.to_s + ", NULL, " + attr_to_val.is_default.to_s + ")"
                new_attr_to_val=connection.execute(sqlB)
             
              end
            end
          end
        end
      end

      #Now that all the attributes of this category have been created, as well as their values, we can add valuestoattributesrelations
      if cat.categoryattributes
        cat.categoryattributes.each do |catattr|
          if catattr.attributes_to_values
            catattr.attributes_to_values.each do |attr_to_val|
              
              sqlC="SELECT attributevalues.id from attributevalues where attributevalues.id =" + attr_to_val.attributevalue_id.to_s
              attrvalValues=connection.execute(sqlC)
              attrvalValues.each do |attrvalId|
                sqlD="SELECT valuestoattributesrelations.consequent_attr_id FROM valuestoattributesrelations where valuestoattributesrelations.attributevalue_id="+attrvalId[0].to_s
                consequentAttrIds=connection.execute(sqlD)

                consequentAttrIds.each do |cai|                  
                  sqlE="INSERT IGNORE INTO valuestoattributesrelations (attributevalue_id, consequent_attr_id, collection_id) VALUES (" + hashCorrespOldNewAttributeValueIds[attrvalId[0]].to_s + "," + hashCorrespOldNewAttributecatIds[cai[0]].to_s + "," + @new_collection_id.to_s + ")"
                  consequentAttrIds=connection.execute(sqlE)
                end
              end
            end
          end
        end
      end

      if cat.headercategory
        Headercategory.create(:category_id => new_cat.id, :is_header_category => cat.headercategory.is_header_category, :allow_user_input => cat.headercategory.allow_user_input, :only => cat.headercategory.only, :max_len => cat.headercategory.max_len)
      else
        Headercategory.create(:category_id => new_cat.id, :is_header_category => 0, :allow_user_input => 0, :only => 0, :max_len => 0)
      end

      if cat.headervalues
        cat.headervalues.each do |headervalue|
          Headervalue.create(:category_id => new_cat.id, :value => headervalue.value, :is_default => headervalue.is_default)
        end
      end

      if cat.categorydescription
        Categorydescription.create(:category_id => new_cat.id, :description => cat.categorydescription.description)
      end

      if cat.categoryscope
        Categoryscope.create(:category_id => new_cat.id, :mode => cat.categoryscope.mode)
      end

      if cat.categorystyle
        Categorystyle.create(:category_id => new_cat.id, :textdecoration => cat.categorystyle.textdecoration, :fontstyle => cat.categorystyle.fontstyle, :colour => cat.categorystyle.colour)
      end

    end


    @collection = Collection.find_by_id(@new_collection_id)
    ajax_redirect_to "#{request.env['HTTP_REFERER']}#collection-#{@collection.id}"
  end

  def create
    @new_category = Category.new(params[:category])
    @new_category.save!
    #I added this line: assign a default scope for the new category: by default, the new category can be used in both modes: simple and advanced
    #Categoryscope.new(category_id: @new_category.id, mode: 2)
    connection = ActiveRecord::Base.connection
    sql="insert into categoryscopes (category_id, mode) values ("+@new_category.id.to_s+", 2)"
    connection.execute(sql)

    header=Headercategory.find_or_create_by(category_id: @new_category.id.to_s)
    header.is_header_category=params[:is_header_category].to_i
    header.save

    #By default the created category is not a header category
    #Headercategory.new(category_id: @new_category.id, is_header_category: 0)
    #sql2="insert into headercategories (category_id, is_header_category) values ("+@new_category.id.to_s+", 0)"
    #connection.execute(sql2)

    @new_category.parent = Category.find(params[:category][:parent_id]) if params[:category][:parent_id].present?
    if @new_category.save
      flash[:notice] = "Category has been created"
      ajax_redirect_to "#{request.env['HTTP_REFERER']}#category-#{@new_category.id}"
    else
      render :action => 'add_new'
    end
  end

  def define_attribute_sequences
    #Checking for sql injection: the category_id and the collection_id should only contain numbers
    if params[:category_id].scan(/\D/).empty? && params[:collection_id].scan(/\D/).empty?
      connection = ActiveRecord::Base.connection
      #define_attribute_values
      @categoryattributes=[]
      sqlAt="SELECT DISTINCT categoryattributes.id, attributecats.name, categoryattributes.allow_user_input, categoryattributes.initial FROM categoryattributes INNER JOIN attributecats ON attributecats.id=categoryattributes.attributecat_id where categoryattributes.mode!=0 and `categoryattributes`.`category_id`="+params[:category_id]
      resAt=connection.execute(sqlAt)
      resAt.each do |r|
        @categoryattributes.push([r[0],r[1],r[2],r[3]])
      end

      @attributeValuesHash={}
      sqlS="SELECT DISTINCT categoryattributes.id, attributecats.name, attributevalues.id, attributevalues.value, categoryattributes.mode FROM `attributevalues` INNER JOIN attributes_to_values on attributes_to_values.attributevalue_id=attributevalues.id INNER JOIN `categoryattributes` ON `categoryattributes`.`id` = `attributes_to_values`.`categoryattribute_id` INNER JOIN attributecats ON attributecats.id=categoryattributes.attributecat_id where `categoryattributes`.`category_id`="+params[:category_id]
      res=connection.execute(sqlS)

      res.each do |r|
        if @attributeValuesHash.key?(r[0].to_s)
          @attributeValuesHash[r[0].to_s].push({'valueid':r[2], 'value':r[3]})
        else
          @attributeValuesHash[r[0].to_s]=[{'valueid':r[2], 'value':r[3]}]
        end
      end

      #Select sequences for the values of each attribute of this category
      #sql="SELECT DISTINCT attributevalues.id, attributevalues.value, attributecats.name, valuestoattributesrelations.id, attributecats.id FROM attributevalues INNER JOIN valuestoattributesrelations on attributevalues.id=valuestoattributesrelations.attributevalue_id INNER JOIN attributecats ON attributecats.id=valuestoattributesrelations.consequent_attr_id INNER JOIN attributes_to_values ON valuestoattributesrelations.id=attributes_to_values.valuestoattributesrelation_id INNER JOIN categoryattributes ON categoryattributes.id = attributes_to_values.categoryattribute_id where categoryattributes.mode!=0 and categoryattributes.category_id="+params[:category_id]
      
      sql="SELECT valuestoattributesrelations.attributevalue_id, attributevalues.value, attributecats.name, valuestoattributesrelations.id, valuestoattributesrelations.consequent_attr_id, attributecats_initial.name, attributecats_initial.id FROM valuestoattributesrelations INNER JOIN attributevalues ON attributevalues.id = valuestoattributesrelations.attributevalue_id INNER JOIN attributecats ON attributecats.id=valuestoattributesrelations.consequent_attr_id INNER JOIN attributes_to_values ON attributes_to_values.attributevalue_id=attributevalues.id INNER JOIN categoryattributes ON attributes_to_values.categoryattribute_id=categoryattributes.id INNER JOIN attributecats attributecats_initial ON attributecats_initial.id=categoryattributes.attributecat_id WHERE categoryattributes.category_id="+params[:category_id]


      connection = ActiveRecord::Base.connection
      already_relations=connection.execute(sql)

      excludeFromPossibleRelationsIds={}

      #Relations defined for each attribute value of each attribute of this category
      @alreadyRelsHash={}
      already_relations.each do |already_rel|
        if @alreadyRelsHash.key?(already_rel[0])
          puts [already_rel[2],already_rel[3],already_rel[4]]
          @alreadyRelsHash[already_rel[0]].push([already_rel[2],already_rel[3],already_rel[4]]) # value id => [name of the consequent attribute, relation id, id of the consequent attribute
          excludeFromPossibleRelationsIds[already_rel[3]]=0
        else
          @alreadyRelsHash[already_rel[0]]=[[already_rel[2],already_rel[3],already_rel[4]]]
          excludeFromPossibleRelationsIds[already_rel[3]]=0
        end
      end

      #All the possible consequent attributes of each value, if these attributes can belong to this category
      sqlS="SELECT DISTINCT valuestoattributesrelations.id, attributevalues.value, attributecats.name, attributecats.id FROM valuestoattributesrelations INNER JOIN attributevalues ON valuestoattributesrelations.attributevalue_id=attributevalues.id INNER JOIN attributes_to_values ON attributes_to_values.attributevalue_id=attributevalues.id INNER JOIN attributecats ON attributecats.id=valuestoattributesrelations.consequent_attr_id INNER JOIN categoryattributes ON categoryattributes.id=attributes_to_values.categoryattribute_id WHERE valuestoattributesrelations.collection_id="+params[:collection_id]+" AND categoryattributes.category_id="+params[:category_id]
      possible_relations=connection.execute(sqlS)

      #All the possible consequent attributes of each value. Key: attribute_value, value: array of consequent attributes
      @possibleRelationsHash={} 
      possible_relations.each do |pr|
        unless excludeFromPossibleRelationsIds.key?(pr[0])
          if @possibleRelationsHash.key?(pr[1])
            @possibleRelationsHash[pr[1]].push([pr[2],pr[3]])
          else
            @possibleRelationsHash[pr[1]]=[[pr[2],pr[3]]]
          end
        end
      end

    end

  end

  def define_attribute_sequences2
    giveNotice=false

    #Checking for sql injection: the category_id and the collection_id should only contain numbers
    if params[:category_id].scan(/\D/).empty?

      category=Category.find(params[:category_id])

      #Update the initial column: set and unset initial attributes
      sql="update categoryattributes set initial=false where category_id="+params[:category_id]
      connection = ActiveRecord::Base.connection
      connection.execute(sql)

      if params[:initial]!=nil
        giveNotice=true
        forSql=""
        params[:initial].each do |attrid|
          if attrid!=nil && attrid!="" && attrid.scan(/\D/).empty?
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
          attrsArray.each do |attr|
            rel = Valuestoattributesrelation.find_or_create_by(attributevalue_id: valueId, consequent_attr_id: attr, collection_id: category.collection_id)
            #sqlCreate="INSERT INTO attributes_to_values (categoryattribute_id, attributevalue_id, valuestoattributesrelation_id) values ("+activeAttrId.to_s+", "+valueId.to_s+", "+rel.id.to_s+")"
            #connection.execute(sqlCreate)
          end
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
          attr_to_value=AttributesToValue.where(categoryattribute_id: activeAttrId, attributevalue_id: valueId, valuestoattributesrelation_id:relsArray).update_all(valuestoattributesrelation_id: nil) 
        end
        sql2="DELETE valuestoattributesrelations FROM valuestoattributesrelations LEFT JOIN attributes_to_values ON valuestoattributesrelations.id=attributes_to_values.valuestoattributesrelation_id WHERE attributes_to_values.valuestoattributesrelation_id IS NULL"
        connection.execute(sql2)
      end

    end

    if giveNotice==true
      flash[:notice] = "Attribute sequences have been defined."
    end
    ajax_redirect_to "#{request.env['HTTP_REFERER']}#category-#{@category.id}"
  end

  def assign_category_scope
    #Checking for sql injection: the category_id and the collection_id should only contain numbers
    if params[:category_id].scan(/\D/).empty?
      scope=Categoryscope.where(category_id: params[:category_id])
    
      @scopehash={0=>false,1=>false,2=>false}
      unless scope.empty?
        scope.each do |s|
          @scopehash[s.mode]=true
        end
      end
    end
  end

  def assign_category_scope2
    #Checking for sql injection: the category_id and the collection_id should only contain numbers
    if params[:category_id].scan(/\D/).empty?
      scope=Categoryscope.find_or_create_by(category_id: params[:category_id])
      newScope=params[:category][:category_scope].to_i
      scope.mode=newScope

      #Change scopes of the category's attributes if the new category scope is not "both"
      if newScope!=2
        categoryAttributes=Categoryattribute.where(category_id: params[:category_id])
        categoryAttributes.each do |cA|
          cA.mode=newScope
          cA.save
        end
      end

      if scope.save
        flash[:notice] = "Category scope has been assigned."
        ajax_redirect_to "#{request.env['HTTP_REFERER']}#category-#{@category.id}"
      else
        render :action => 'assign_category_scope'
      end
    end
  end

  def is_header_category
    #Checking for sql injection: the category_id and the collection_id should only contain numbers
    if params[:category_id].scan(/\D/).empty?
      header=Headercategory.where(category_id: params[:category_id]).first
      attributes=Categoryattribute.where(category_id: params[:category_id]).first
      @cannotBeHeader=false
      if attributes!=nil
        @cannotBeHeader=true
      end
      @display=""
      @display2=""
      if header==nil
        @isheader=false
        @allow_user_input=false
        @only=0
        @max_len=""
      else
        @isheader=header.is_header_category
        @allow_user_input=header.allow_user_input
        @only=header.only
        @max_len=header.max_len

        if @max_len==0
          @max_len=""
        end
        if @isheader==false
          @display="display:none;"
          @display2="display:none;"
        end
        if @allow_user_input==false
          @display="display:none;"
        end
      end
    end
  end

  def is_header_category2
    #Checking for sql injection: the category_id and the collection_id should only contain numbers
    if params[:category_id].scan(/\D/).empty?
      header=Headercategory.where(category_id: params[:category_id])[0]

      newHeader=0
      if params[:is_header_category]!=nil
        newHeader=params[:is_header_category].to_i
      end


      allow_user_input=0
      if params[:allow_user_input]!=nil
        allow_user_input=params[:allow_user_input].to_i
      end

      only=0
      if params[:only]!=nil
        only=params[:only].to_i        
      end

      max_len=0
      if params[:max_len]!=nil
        max_len=params[:max_len].to_i
      end

      if allow_user_input==0
        only=0
        max_len=0
      end

      connection = ActiveRecord::Base.connection

      if newHeader==0
        if header!=nil
          header.is_header_category=0
          header.allow_user_input=allow_user_input
          header.only=only
          header.max_len=max_len
          header.save
          header.update_attribute(:max_len, max_len)
        end
      elsif newHeader==1
        if header!=nil
          header.is_header_category=newHeader
          header.allow_user_input=allow_user_input
          header.only=only
          header.max_len=max_len
          header.save
          header.update_attribute(:max_len, max_len)
        else
          Headercategory.create(category_id: params[:category_id], is_header_category: is_header_category, allow_user_input: allow_user_input, only: only, max_len: max_len)
        end
      end

      if header.save
        flash[:notice] = "Category has been assigned as header category (or not)."
        ajax_redirect_to "#{request.env['HTTP_REFERER']}#category-#{@category.id}"
      else
        render :action => 'is_header_category'
      end
    end
  end

  def define_header_values
    #Checking for sql injection: the category_id and the collection_id should only contain numbers
    if params[:category_id].scan(/\D/).empty?
      connection = ActiveRecord::Base.connection      

      #Select all predefined values of this header category
      sql="SELECT DISTINCT headervalues.id, headervalues.value, headervalues.is_default from headervalues WHERE category_id="+params[:category_id]
      @headerValues=connection.execute(sql)

    end
  end

  def define_header_values2
    #Checking for sql injection: the category_id and the collection_id should only contain numbers
    if params[:category_id].scan(/\D/).empty?
      connection = ActiveRecord::Base.connection
      @category.id=params[:category_id]
      giveNotice=false

      #Deleting values
      if params[:delete_header_value]!=nil
        forSql=""
        params[:delete_header_value].each do |type|
          if type!=nil && type!="" && type.scan(/\D/).empty?
            giveNotice=true
            forSql+=type+", "
          end
        end

        if forSql!=""
          #Delete attributes that no longer have categories associated to them
          sqlDa="DELETE FROM headervalues WHERE id IN ("+forSql[0..-3]+");"
          connection.execute(sqlDa)
        end
      end

      #Adding new values
      if params[:header_value]!=nil
        numberNews=0
        is_default=0
        allow_user_input=0
        params[:header_value].each do |type|
            giveNotice=true
            #If the header value contains SQL meta-characters, we put underscores around them in order to prevent sql injection
            type.gsub!(/(\%27)|(\')|(\%3[bB])|(\;)|(\%2[aA])|\*|(\-\-)|(\%23)|(#)|(\%3C)|(\<)|(\%3D)|(\=)|(\%3E)|(\>)|(\%28)|(\()|(\%29)|(\))/i) { |m| '_'+m+'_' }

            headerValue=Headervalue.create(value: type, category_id: params[:category_id], is_default: is_default)

            numberNews+=1

        end
      end

      #Renaming existing values
      if params[:new_header_value]!=nil
        params[:new_header_value].each do |id, newValue|
          if newValue.length>0

            #If the header value contains SQL meta-characters, we put underscores around them in order to prevent sql injection
            newValue.gsub!(/(\%27)|(\')|(\%3[bB])|(\;)|(\%2[aA])|\*|(\-\-)|(\%23)|(#)|(\%3C)|(\<)|(\%3D)|(\=)|(\%3E)|(\>)|(\%28)|(\()|(\%29)|(\))/i) { |m| '_'+m+'_' }

            headerValue=Headervalue.find(id)
            headerValue.value=newValue
            headerValue.save
          end
        end
      end

      #Making default values
      if params[:default]!=nil
        defaultId=params[:default]
        if defaultId!="x"
          headerValue=Headervalue.find(defaultId)
          headerValue.is_default=1
          headerValue.save
        else
          headerValue=Headervalue.where(category_id: params[:category_id], is_default: 1)[0]
          if headerValue!=nil
            headerValue.is_default=0
            headerValue.save
          end
        end
      end

      if giveNotice==true
        flash[:notice] = "Category attributes have been defined."
      end
      ajax_redirect_to "#{request.env['HTTP_REFERER']}#category-#{@category.id}"
    end
  end

  def define_description
    #Checking for sql injection: the category_id and the collection_id should only contain numbers
    if params[:category_id].scan(/\D/).empty?
      categorydescription=Categorydescription.where(category_id: params[:category_id])

      for x in categorydescription
        @description=x.description
      end

      if @description.nil?
        @description=""
      end
    end
  end

  def define_description2
    #Checking for sql injection: the category_id and the collection_id should only contain numbers
    if params[:category_id].scan(/\D/).empty?
      description=Categorydescription.find_or_create_by(category_id: params[:category_id])
      description.description=params[:description]

      if description.save
        flash[:notice] = "Category description has been defined."
        ajax_redirect_to "#{request.env['HTTP_REFERER']}#category-#{@category.id}"
      else
        render :action => 'define_category_description'
      end
    end
  end

  def define_style
    #Checking for sql injection: the category_id and the collection_id should only contain numbers
    if params[:collection_id].scan(/\D/).empty?
      connection = ActiveRecord::Base.connection
      sql="SELECT DISTINCT categorystyles.colour, categorystyles.textdecoration, categorystyles.fontstyle from categorystyles INNER JOIN categories on categorystyles.category_id=categories.id WHERE categories.collection_id="+params[:collection_id]
      res=connection.execute(sql)
      @colours_of_this_collection=Set.new
      @decorations_of_this_collection=Set.new
      @font_styles_of_this_collection=Set.new
      res.each do |r|
        unless r[0].nil?
          @colours_of_this_collection.add?(r[0])
        end
        unless r[1].nil?
          @decorations_of_this_collection.add?(r[1])
        end
        unless r[2].nil?
          @font_styles_of_this_collection.add?(r[2])
        end
      end

      @arrayOfColours=[["#c0392b",'absent_style'],["#8e00ad",'absent_style'],["#6a6266",'absent_style'],["#0098db",'absent_style'],["#008449",'absent_style'], ["auto",'absent_style'],["#e4cc0d",'absent_style'],["#f39200",'absent_style'],["#FF0000",'absent_style'],["#ff66ff",'absent_style'],["#0901F3",'absent_style'],["#24D201",'absent_style']]
      number=1
      @arrayOfColours.each do |ac|
        if @colours_of_this_collection.include?(ac[0])
          ac[1]='present_style'
        end
        ac.push(number)
        number+=1
      end

      @arrayOfDecorations=[["text-decoration: line-through;",'absent_style'],["text-decoration: underline;",'absent_style'],["text-decoration: overline;",'absent_style'],["text-decoration: none;",'absent_style'],["text-decoration: underline; text-decoration-style: wavy;",'absent_style'],["text-decoration: underline; text-decoration-style: double;",'absent_style'], ["text-decoration: underline; text-decoration-style: dotted;",'absent_style'],["text-decoration: underline; text-decoration-style: dashed;",'absent_style'],["text-decoration: overline; text-decoration-style: wavy;",'absent_style'],["text-decoration: overline; text-decoration-style: double;",'absent_style'],["text-decoration: overline; text-decoration-style: dotted;",'absent_style'],["text-decoration: overline; text-decoration-style: dashed;",'absent_style']]
      number=1
      @arrayOfDecorations.each do |ad|
        if @decorations_of_this_collection.include?(ad[0])
          ad[1]='present_style'
        end
        ad.push(number)
        number+=1
      end

      @arrayOfFontStyles=[["font-weight: bold;",'absent_style'],["font-style: italic;",'absent_style'],["font-weight: bold; font-style: italic;",'absent_style'],["",'absent_style'],["vertical-align: super; position: relative;",'absent_style'],["vertical-align: sub; position: relative;",'absent_style'], ["vertical-align: super; position: relative; font-style: italic;",'absent_style'],["vertical-align: sub; position: relative; font-style: italic;",'absent_style']]
      number=0
      @arrayOfFontStyles.each do |af|
        if @font_styles_of_this_collection.include?(af[0])
          af[1]='present_style'
        end
        af.push(number)
        number+=1
      end
    end
  end

  def define_attribute_values
    #Checking for sql injection: the category_id and the collection_id should only contain numbers
    if params[:category_id].scan(/\D/).empty?
      connection = ActiveRecord::Base.connection

      #All the existing values of the attributes of this category
      @categoryattributes=[]
      sqlAt="SELECT DISTINCT categoryattributes.id, attributecats.name, categoryattributes.allow_user_input, categoryattributes.initial, categoryattributes.only, categoryattributes.max_len FROM categoryattributes INNER JOIN attributecats ON attributecats.id=categoryattributes.attributecat_id where `categoryattributes`.`category_id`="+params[:category_id]
      resAt=connection.execute(sqlAt)
      @display={}
      resAt.each do |r|
        @categoryattributes.push([r[0],r[1],r[2],r[3],r[4],r[5]])

        if r[2]==0
          @display[r[0]]="display:none;"
        else
          @display[r[0]]=""
        end
      end

      #Values of each attribute of this category
      @attributeValuesHash={}
      sqlS="SELECT DISTINCT categoryattributes.id, attributecats.name, attributevalues.id, attributevalues.value, categoryattributes.mode, attributes_to_values.is_default FROM `attributevalues` INNER JOIN attributes_to_values on attributes_to_values.attributevalue_id=attributevalues.id INNER JOIN `categoryattributes` ON `categoryattributes`.`id` = `attributes_to_values`.`categoryattribute_id` INNER JOIN attributecats ON attributecats.id=categoryattributes.attributecat_id where `categoryattributes`.`category_id`="+params[:category_id]
      res=connection.execute(sqlS)

      res.each do |r|
        if @attributeValuesHash.key?(r[0].to_s)
          @attributeValuesHash[r[0].to_s].push({'valueid':r[2], 'value':r[3], 'is_default':r[5]})
        else
          @attributeValuesHash[r[0].to_s]=[{'valueid':r[2], 'value':r[3], 'is_default':r[5]}]
        end
      end

      scope=Categoryscope.where(category_id: params[:category_id])
      @categoryScope=2
      unless scope.empty?
        scope.each do |s|
          @categoryScope=s.mode
        end
      end

      scopesForPossibleAttributes=""
      if @categoryScope==2
        scopesForPossibleAttributes="0,1,2"
      else
        scopesForPossibleAttributes=@categoryScope.to_s+",2"
      end

      #All the possible values of the attributes of this category (maybe defined in other categories of this collection and of this scope)
      sql="SELECT DISTINCT attributecats.name, attributevalues.id, attributevalues.value FROM attributevalues INNER JOIN attributes_to_values ON attributes_to_values.attributevalue_id=attributevalues.id INNER JOIN categoryattributes ON categoryattributes.id=attributes_to_values.categoryattribute_id INNER JOIN attributecats ON attributecats.id=categoryattributes.attributecat_id INNER JOIN categories ON categoryattributes.category_id=categories.id INNER JOIN categoryscopes ON categoryscopes.category_id=categoryattributes.category_id WHERE categories.collection_id="+params[:collection_id]+" AND categoryscopes.mode IN ("+scopesForPossibleAttributes+") AND attributecats.name in (SELECT attributecats.name FROM attributecats INNER JOIN categoryattributes ON attributecats.id=categoryattributes.attributecat_id where category_id="+params[:category_id]+") and attributevalues.value not in (SELECT attributevalues.value FROM `attributevalues` INNER JOIN attributes_to_values on attributes_to_values.attributevalue_id=attributevalues.id INNER JOIN `categoryattributes` ON `categoryattributes`.`id` = `attributes_to_values`.`categoryattribute_id` where `categoryattributes`.`category_id`="+params[:category_id]+")"
      res=connection.execute(sql)
      @possibleValuesForEachAttribute={}
      res.each do |r|
        if @possibleValuesForEachAttribute.key?(r[0])
          @possibleValuesForEachAttribute[r[0]].push([r[1],r[2]])
        else
          @possibleValuesForEachAttribute[r[0]]=[[r[1],r[2]]]
        end
      end
    end
  end

  def define_attribute_values2
    #Checking for sql injection: the category_id and the collection_id should only contain numbers
    if params[:category_id].scan(/\D/).empty?
      connection = ActiveRecord::Base.connection
      @category.id=params[:category_id]
      giveNotice=false

      if params[:delete_attribute_value]!=nil
        forSql=""
        params[:delete_attribute_value].each do |attrId, valueIDs|
          if attrId.scan(/\D/).empty?
            valueIDs.each do |valueid|
              if valueid.scan(/\D/).empty?
                sql="delete from attributes_to_values where attributevalue_id="+valueid+" and categoryattribute_id="+attrId
                connection.execute(sql)
                giveNotice=true
              end
            end
          end
        end
        #Delete from attributevalues if no attribute has this value
        sql2="DELETE FROM attributevalues WHERE attributevalues.id not in (SELECT attributes_to_values.attributevalue_id FROM attributes_to_values)"
        connection.execute(sql2)
      end

      sql="update categoryattributes set allow_user_input=false, max_len=0, only=0 where category_id="+params[:category_id]+";"
      connection.execute(sql)

      if params[:allow_user_input]!=nil
        forSql=""
        params[:allow_user_input].each do |attrid|
          if attrid!=nil && attrid!="" && attrid.scan(/\D/).empty?
            giveNotice=true
            forSql+=attrid+", "
          end
        end
        if forSql!=""
          sql="update categoryattributes set allow_user_input=true where id in ("+forSql[0..-3]+");"
          connection.execute(sql)
        end
      end

      if params[:max_len]!=nil
        forSql=""
        params[:max_len].each do |attrid, attrLength|
          if attrid.scan(/\D/).empty? and attrLength.scan(/\D/).empty?
            if  ((params.include? "allow_user_input") && !(params[:allow_user_input].include? attrid)) or !(params.include? "allow_user_input")
              attrLength="0"
            end
              sql="update categoryattributes set max_len="+attrLength+" where id="+attrid+";"
              connection.execute(sql)
          end
        end
      end

      if params[:only]!=nil
        forSql=""
        params[:only].each do |attrid, only|
          if attrid.scan(/\D/).empty? and only.scan(/\D/).empty?
            if ((params.include? "allow_user_input") && !(params[:allow_user_input].include? attrid)) or !(params.include? "allow_user_input")
              only="0"
            end
              sql="update categoryattributes set only="+only+" where id="+attrid+";"
              connection.execute(sql)
          end
        end
      end

      if params[:add_attribute_value]!=nil
        forSql=""
        params[:add_attribute_value].each do |attrid, attrValues|
          if attrid.scan(/\D/).empty?
            attrValues.each do |attrValue|
              if attrValue.length>0
                #If the attribute value contains SQL meta-characters, we put underscores around them in order to prevent sql injection
                attrValue.gsub!(/(\%27)|(\')|(\%3[bB])|(\;)|(\%2[aA])|\*|(\-\-)|(\%23)|(#)|(\%3C)|(\<)|(\%3D)|(\=)|(\%3E)|(\>)|(\%28)|(\()|(\%29)|(\))/i) { |m| '_'+m+'_' }

                res=Attributevalue.find_or_create_by(value: attrValue)
                AttributesToValue.create(categoryattribute_id: attrid, attributevalue_id: res.id)
              end
            end
          end
        end
      end

      if params[:val_from_possible]!=nil
        params[:val_from_possible].each do |attrid, valueIds|
          if attrid.scan(/\D/).empty?
            valueIds.each do |valueId|
              if valueId.length>0 && valueId.scan(/\D/).empty?
                AttributesToValue.create(categoryattribute_id: attrid, attributevalue_id: valueId)
              end
            end
          end
        end
      end

      if params[:default_attr_vals]!=nil
        params[:default_attr_vals].each do |attrid, valueIds|
          if attrid.scan(/\D/).empty?
            valueId=valueIds[-1]
            if valueId.length>0 && valueId.scan(/\D/).empty?
              attrVal=AttributesToValue.where(categoryattribute_id: attrid, attributevalue_id: valueId)[0]
              attrVal.is_default=1
              attrVal.save
            end
          end
        end
      end
      

      if giveNotice==true
        flash[:notice] = "Category attributes have been defined."
      end
      ajax_redirect_to "#{request.env['HTTP_REFERER']}#category-#{@category.id}"
    end
  end

  def define_attributes
    #Checking for sql injection: the category_id and the collection_id should only contain numbers
    if params[:category_id].scan(/\D/).empty?
      connection = ActiveRecord::Base.connection
      scope=Categoryscope.where(category_id: params[:category_id])
      @categoryScope=2
      unless scope.empty?
        scope.each do |s|
          @categoryScope=s.mode
        end
      end

      scopesForPossibleAttributes=""
      if @categoryScope==2
        scopesForPossibleAttributes="0,1,2"
      else
        scopesForPossibleAttributes=@categoryScope.to_s+",2"
      end

      @disableScopeChoice=""
      #If the category scope is restricted, there is no use to choose its attributes' scope: it will be the same
      if @categoryScope==0 || @categoryScope==1
        @disableScopeChoice='display:none;'
      end

      sql="SELECT DISTINCT categoryattributes.id, categoryattributes.allow_user_input, categoryattributes.mode, categoryattributes.initial, attributecats.name FROM categoryattributes INNER JOIN attributecats ON categoryattributes.attributecat_id=attributecats.id WHERE category_id="+params[:category_id]
      catattrs=connection.execute(sql)

      #Select all the attributes defined in this collection in this scope
      sqlA="SELECT DISTINCT attributecats.id, attributecats.name FROM attributecats INNER JOIN categoryattributes ON attributecats.id=categoryattributes.attributecat_id INNER JOIN categories ON categoryattributes.category_id=categories.id INNER JOIN categoryscopes ON categoryscopes.category_id=categoryattributes.category_id WHERE collection_id="+params[:collection_id]+" AND categoryscopes.mode IN ("+scopesForPossibleAttributes+") AND attributecats.id NOT IN (SELECT categoryattributes.attributecat_id from categoryattributes WHERE category_id="+params[:category_id]+")"
      @possibleAttrs=connection.execute(sqlA)

      @attrscopehash={}
      @categoryattributes=[]
      catattrs.each do |r|
        @categoryattributes.push([r[0],r[4]])

        @attrscopehash[r[0]]={0=>false,1=>false,2=>false}
        @attrscopehash[r[0]][r[2]]=true
      end
    end
  end

  def define_attributes2
    #Checking for sql injection: the category_id and the collection_id should only contain numbers
    if params[:category_id].scan(/\D/).empty?
      connection = ActiveRecord::Base.connection
      @category.id=params[:category_id]
      giveNotice=false
      if params[:delete_attribute]!=nil
        forSql=""
        params[:delete_attribute].each do |type|
          if type!=nil && type!="" && type.scan(/\D/).empty?
            giveNotice=true
            forSql+=type+", "
          end
        end
        if forSql!=""
          #Delete attributes that no longer have categories associated to them
          sqlDa="DELETE attributes_to_values FROM attributes_to_values WHERE attributes_to_values.categoryattribute_id IN ("+forSql[0..-3]+");"
          connection.execute(sqlDa)          

          sql="delete from categoryattributes where id in ("+forSql[0..-3]+");"
          connection.execute(sql)

          #Delete attributes that no longer have categories associated to them
          sqlD="DELETE attributecats FROM attributecats LEFT JOIN categoryattributes ON attributecats.id=categoryattributes.attributecat_id WHERE categoryattributes.id IN ("+forSql[0..-3]+");"
          connection.execute(sqlD)
        end        
        
      end
      if params[:attribute]!=nil
        numberNews=0
        mode=2
        params[:attribute].each do |type|
          if type!=nil && type!=""
            if params[:category_scope]!="2"
              mode=params[:category_scope]
            else
              mode=params[:new_attr_scope][numberNews.to_s]
            end

            giveNotice=true

            if mode.nil?
              mode=2
            end

            #If the attribute name contains SQL meta-characters, we put underscores around them in order to prevent sql injection
            type.gsub!(/(\%27)|(\')|(\%3[bB])|(\;)|(\%2[aA])|\*|(\-\-)|(\%23)|(#)|(\%3C)|(\<)|(\%3D)|(\=)|(\%3E)|(\>)|(\%28)|(\()|(\%29)|(\))/i) { |m| '_'+m+'_' }

            attribute=Attributecat.find_or_create_by(name: type)
            Categoryattribute.create(attributecat_id: attribute.id, mode: mode, category_id: params[:category_id], allow_user_input: false, initial: false)

            numberNews+=1
          end
        end
      end

      #Change attribute names
      if params[:new_attr_name]!=nil
        params[:new_attr_name].each do |attrId, newName|
          if newName!='' && newName.scan(/^[ ]+$/).empty?
            attributecat=Attributecat.find_or_create_by(name: newName)
            categoryattribute=Categoryattribute.find_by_id(attrId)
            categoryattribute.attributecat_id=attributecat.id
            categoryattribute.save
          end
        end
        #Delete attributecats that no longer have attributes associated to them
        sqlD="DELETE attributecats FROM attributecats LEFT JOIN categoryattributes ON attributecats.id=categoryattributes.attributecat_id WHERE categoryattributes.attributecat_id IS NULL"
        connection.execute(sqlD)
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
  end

  def define_style2
    #Checking for sql injection: the category_id and the collection_id should only contain numbers
    if params[:category_id].scan(/\D/).empty?
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
  end


  def discard_all_styles
    connection = ActiveRecord::Base.connection
    sql="delete categorystyles from categorystyles inner join categories on categorystyles.category_id=categories.id where categories.collection_id="+params[:collection_id]
    connection.execute(sql)
    flash[:notice] = "Category styles have been discarded."
    anchor = "#category-#{@category.id}"
    redirect_to "#{request.env['HTTP_REFERER']}#{anchor}"
  end

  def delete
    connection = ActiveRecord::Base.connection
    anchor = @category.parent_id.present? ? "#category-#{@category.parent_id}" : nil
    Categorystyle.destroy_all(category_id: @category.id)
    Categoryattribute.destroy_all(category_id: @category.id)
    Categorydescription.destroy_all(category_id: @category.id)
    Categoryscope.destroy_all(category_id: @category.id)
    Headercategory.destroy_all(category_id: @category.id)
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

  def delete_all_categories
    connection = ActiveRecord::Base.connection
    #Category.destroy_all(collection_id: @collection.id)    

    #Delete all the styles of this collection
    sqlDs="DELETE categorystyles FROM categorystyles LEFT JOIN categories ON categories.id=categorystyles.category_id WHERE categories.collection_id="+@collection.id.to_s
    connection.execute(sqlDs)

    #Delete all the category descriptions of this collection
    sqlDs="DELETE categorydescriptions FROM categorydescriptions LEFT JOIN categories ON categories.id=categorydescriptions.category_id WHERE categories.collection_id="+@collection.id.to_s
    connection.execute(sqlDs)

    #Delete attributes_to_values of this collection
    sqlDa="DELETE attributes_to_values FROM attributes_to_values INNER JOIN categoryattributes on attributes_to_values.categoryattribute_id=categoryattributes.id LEFT JOIN categories ON categories.id=categoryattributes.category_id WHERE categories.collection_id="+@collection.id.to_s
    connection.execute(sqlDa)     

    #Delete all the attributes of this collection
    sqlDa="DELETE categoryattributes FROM categoryattributes LEFT JOIN categories ON categories.id=categoryattributes.category_id WHERE categories.id IS NULL OR categories.collection_id="+@collection.id.to_s
    connection.execute(sqlDa)

    #Delete all the scopes of this collection
    sqlDa="DELETE categoryscopes FROM categoryscopes LEFT JOIN categories ON categories.id=categoryscopes.category_id WHERE categories.collection_id="+@collection.id.to_s
    connection.execute(sqlDa)

    #Delete all the scopes of this collection
    sqlH="DELETE headercategories FROM headercategories LEFT JOIN categories ON categories.id=headercategories.category_id WHERE categories.collection_id="+@collection.id.to_s
    connection.execute(sqlH)

    sqlDs="DELETE categories FROM categories WHERE categories.collection_id="+@collection.id.to_s
    connection.execute(sqlDs)

    #Delete attributecats that no longer have categories associated to them
    sqlD="DELETE attributecats FROM attributecats LEFT JOIN categoryattributes ON attributecats.id=categoryattributes.attributecat_id WHERE categoryattributes.attributecat_id IS NULL"
    connection.execute(sqlD)
    
    #Delete attribute values that no longer have attributes associated to them
    sql="DELETE attributevalues FROM attributevalues LEFT JOIN attributes_to_values ON attributevalues.id=attributes_to_values.attributevalue_id WHERE attributes_to_values.attributevalue_id IS NULL"
    connection.execute(sql)

    sql2="DELETE valuestoattributesrelations FROM valuestoattributesrelations LEFT JOIN attributes_to_values ON valuestoattributesrelations.id=attributes_to_values.valuestoattributesrelation_id WHERE attributes_to_values.valuestoattributesrelation_id IS NULL"
    connection.execute(sql2)

    anchor=nil
    flash[:notice] = "All categories of this collection have been deleted."
    redirect_to "#{request.env['HTTP_REFERER']}#{anchor}"
  end

end