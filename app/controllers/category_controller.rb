class CategoryController < ApplicationController
  public :render_to_string
  protect_from_forgery

  # no layout if xhr request
  layout Proc.new { |controller| controller.request.xhr? ? false : nil }, :only => [:edit, :add_new, :update, :create, :define_style, :define_attributes, :define_attribute_values, :assing_category_scope]

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
    @new_category.parent = Category.find(params[:category][:parent_id]) if params[:category][:parent_id].present?
    if @new_category.save
      flash[:notice] = "Category has been created"
      ajax_redirect_to "#{request.env['HTTP_REFERER']}#category-#{@new_category.id}"
    else
      render :action => 'add_new'
    end
  end

  def assing_category_scope
    scope=Categoryscope.where(category_id: params[:category_id])
    print "scope: \n"
    puts scope.inspect
    
    @scopehash={0=>'',1=>'',2=>''}
    unless scope.empty?
      scope.each do |s|
        @scopehash[s.mode]='checked'
      end
    end
    
    print "@scopehash: \n"
    puts @scopehash.inspect
  end

  def assing_category_scope2
    scope=Categoryscope.find_or_create_by(category_id: params[:category_id])
    scope.mode=params[:category_scope].to_i
    #Categoryscope.mode(params[:category_scope].to_i).where(category_id:params[:category_id])
    #Categoryscope.save()
    if scope.save
      flash[:notice] = "Category scope has been assigned."
      ajax_redirect_to "#{request.env['HTTP_REFERER']}#category-#{@category.id}"
    else
      render :action => 'assing_category_scope'
    end
  end

  def define_style
  end

  def define_attribute_values
    @categoryattributes=Categoryattribute.where(category_id: params[:category_id])
    @attributeValuesHash={}
    sqlS="SELECT categoryattributes.id, categoryattributes.name, attributevalues.id, attributevalues.value FROM `attributevalues` INNER JOIN `categoryattributes` ON `categoryattributes`.`id` = `attributevalues`.`categoryattribute_id` where `categoryattributes`.`category_id`="+params[:category_id];
    connection = ActiveRecord::Base.connection
    res=connection.execute(sqlS)
    res.each do |r|
      if @attributeValuesHash.key?(r[0].to_s)
        @attributeValuesHash[r[0].to_s].push({'valueid':r[2], 'value':r[3]})
      else
        @attributeValuesHash[r[0].to_s]=[{'valueid':r[2], 'value':r[3]}]
      end
    end
  end

  def define_attribute_values2
    @category.id=params[:category_id]
    giveNotice=false

    if params[:delete_attribute_value]!=nil
      forSql=""
      params[:delete_attribute_value].each do |valueid|
        if valueid!=nil && valueid!=""
          giveNotice=true
          forSql+=valueid+", "
        end
      end
      if forSql!=""
        sql="delete from attributevalues where id in ("+forSql[0..-3]+");"
        connection = ActiveRecord::Base.connection
        connection.execute(sql)
      end
    end

    sql="update categoryattributes set allow_user_input=false;"
    connection = ActiveRecord::Base.connection
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
        connection = ActiveRecord::Base.connection
        connection.execute(sql)
      end
    end

    if params[:add_attribute_value]!=nil
      forSql=""
      params[:add_attribute_value].each do |attrid|
        attrid[1].each do |attrValue|
          if attrValue.length>0
            forSql+='("'+attrid[0]+'","'+attrValue+'"), '
          end
        end
      end
      if forSql!=""
        sql="INSERT INTO attributevalues (categoryattribute_id, value) VALUES "
        sql+=forSql[0..-3]
        connection = ActiveRecord::Base.connection
        connection.execute(sql)
      end 
    end

    if giveNotice==true
      flash[:notice] = "Category attributes have been defined."
    end
    ajax_redirect_to "#{request.env['HTTP_REFERER']}#category-#{@category.id}"
  end

  def define_attributes
    #@categorytypes=Categorytype.joins(:category).where(category_id: params[:category_id])
    @categoryattributes=Categoryattribute.where(category_id: params[:category_id])
  end

  def define_attributes2
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
        connection = ActiveRecord::Base.connection
        connection.execute(sql)
      end
    end
    if params[:attribute]!=nil
      forSql=""
      params[:attribute].each do |type|
        if type!=nil && type!=""
          giveNotice=true
          forSql+="( '"+type+"', "+params[:category_id]+"), "
        end
      end
      if forSql!=""
        #sql="INSERT INTO categorytypes (categorytype, category_id) VALUES "
        sql="INSERT INTO categoryattributes (name, category_id) VALUES "
        sql+=forSql[0..-3]
        connection = ActiveRecord::Base.connection
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
      styleInstructions+="\n.medium-"+title+'-id'+id+"{"+style+"}"
      styleInstructions+="\n.button-"+title+'-id'+id+"{"+style+"}"
      mediumOnmouseoverFunctions+='$( ".button-'+title+'-id'+id+'" ).mousedown(function() {'+"\n"+
                                  'da = new Date();'+"\n"+
                                  'categoryid=$(this).attr("data-categoryid");'+"\n"+
                                  'if(categoryid in categoryTypesHash){'+"\n"+
                                  '[focusOffset,focusNode,anchorOffset,anchorNode]=medium.returnOffset();'+"\n"+
                                  'position = $(this).offset();'+"\n"+
                                  'nowX=position.left;'+"\n"+
                                  'nowY=position.top;'+"\n"+
                                  'tagSelectionWithType(categoryid, categoryTypesHash, medium, \''+title+'-id'+id+'\', focusOffset, focusNode, [anchorNode, anchorOffset]);'+"\n"+
                                  '}else{'+"\n"+
                                  'article.highlight();'+"\n"+
                                  'medium.invokeElement(\''+title+'-id'+id+'\', {'+"\n"+
                                  'tagcode: da.getTime().toString()'+"\n"+
                                  '});'+"\n"+
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
    anchor = @category.parent_id.present? ? "#category-#{@category.parent_id}" : nil
    Categorystyle.destroy_all(category_id: @category.id)
    Categorytype.destroy_all(category_id: @category.id)
    @category.destroy #_but_attach_children_to_parent
    flash[:notice] = "Category has been deleted"
    redirect_to "#{request.env['HTTP_REFERER']}#{anchor}"
  end

end