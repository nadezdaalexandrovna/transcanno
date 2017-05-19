class CategoryController < ApplicationController
  public :render_to_string
  protect_from_forgery

  # no layout if xhr request
  layout Proc.new { |controller| controller.request.xhr? ? false : nil }, :only => [:edit, :add_new, :update, :create, :define_style, :define_types]

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

  def define_style
  end

  def define_types
    @categorytypes=Categorytype.joins(:category).where(category_id: params[:category_id])
  end

  def define_types2
    @category.id=params[:category_id]
    giveNotice=false
    if params[:delete_type]!=nil
      forSql=""
      params[:delete_type].each do |type|
        if type!=nil && type!=""
          giveNotice=true
          forSql+=type+", "
        end
      end
      if forSql!=""
        sql="delete from categorytypes where id in ("+forSql[0..-3]+");"
        connection = ActiveRecord::Base.connection
        connection.execute(sql)
      end
    end
    if params[:type]!=nil
      forSql=""
      params[:type].each do |type|
        if type!=nil && type!=""
          giveNotice=true
          forSql+="( '"+type+"', "+params[:category_id]+"), "
        end
      end
      if forSql!=""
        sql="INSERT INTO categorytypes (categorytype, category_id) VALUES "
        sql+=forSql[0..-3]
        connection = ActiveRecord::Base.connection
        connection.execute(sql)
      end
    end
    if giveNotice==true
      flash[:notice] = "Category types have been defined."
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
    sqlS="SELECT categories.title, categorystyles.colour, categorystyles.textdecoration, categorystyles.fontstyle FROM `categorystyles` INNER JOIN `categories` ON `categories`.`id` = `categorystyles`.`category_id`"
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
        textdecoration = 'text-decoration:'+r[2]+';'
      else
        textdecoration =''
      end

      if r[3]!=nil
        fontstyle = r[3]
      else
        fontstyle = ''
      end

      style = color+textdecoration+fontstyle
      title=r[0]
      styleInstructions+="\n.medium-"+title+"{"+style+"}"
      styleInstructions+="\n.button-"+title+"{"+style+"}"
      mediumOnmouseoverFunctions+='$( ".button-'+title+'" ).mousedown(function() {'+"\n"+
                                  'da = new Date();'+"\n"+
                                  'var categoryid=$(this).attr("data-categoryid");'+"\n"+
                                  'if(categoryid in categoryTypesHash){'+"\n"+
                                  '[focusOffset,focusNode,anchorOffset,anchorNode]=medium.returnOffset();'+"\n"+
                                  'tagSelectionWithType(categoryid, categoryTypesHash, medium, \''+title+'\', focusOffset, focusNode, [anchorNode, anchorOffset]);'+"\n"+
                                  '}else{'+"\n"+
                                  'article.highlight();'+"\n"+
                                  'medium.invokeElement(\''+title+'\', {'+"\n"+
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