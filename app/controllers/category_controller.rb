class CategoryController < ApplicationController
  public :render_to_string
  protect_from_forgery

  # no layout if xhr request
  layout Proc.new { |controller| controller.request.xhr? ? false : nil }, :only => [:edit, :add_new, :update, :create]

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
    print @category.title
  end

  def define_style2
    params[:tag_color]==nil ? tag_color="auto" : tag_color=params[:tag_color]
    params[:tag_decoration]==nil ? tag_decoration="auto" : tag_decoration=params[:tag_decoration]
    @category.style='color:'+tag_color+'; '+'text-decoration:'+tag_decoration+';'
    if @category.save
    #if @category.update_attributes(params[:category])
      flash[:notice] = "Category style has been updated"
      ajax_redirect_to "#{request.env['HTTP_REFERER']}#category-#{@category.id}"
    else
      render :action => 'define_style'
    end
  end

  def apply_all_styles
    @result=Category.select("title, style")
    print "@result\n"
    puts @result.inspect
    styleInstructions=""
    mediumOnmouseoverFunctions="$(document).ready(function($) {\nvar da;\n"
    @result.each do |r|
      (r.style==nil || r.style=="") ? style="color: auto; text-decoration: none;" : style=r.style 
      styleInstructions+="\n.medium-"+r.title+"{"+style+"}"
      styleInstructions+="\n.button-"+r.title+"{"+style+"}"
      mediumOnmouseoverFunctions+='$( ".button-'+r.title+'" ).mousedown(function() {'+"\n"+
                                  'da = new Date();'+"\n"+
                                  'article.highlight();'+"\n"+
                                  'medium.invokeElement(\''+r.title+'\', {'+"\n"+
                                  'tagcode: da.getTime().toString()'+"\n"+
                                  '});'+"\n"+
                                  'return false;'+"\n"+
                                  '});'+"\n"
    end
    mediumOnmouseoverFunctions+="});"
    print "styleInstructions : \n"
    print styleInstructions
    File.write('app/assets/stylesheets/sections/_medium-tag-styles.scss', styleInstructions)
    File.write('public/my-medium-onmousedown-functions.js', mediumOnmouseoverFunctions)
    anchor = "#category-#{@category.id}"
    redirect_to "#{request.env['HTTP_REFERER']}#{anchor}"
  end

  def discard_all_styles
    Category.update_all(style: "")
    @result=Category.select("title")
    print "@result\n"
    puts @result.inspect
    styleInstructions=""
    @result.each do |r|
      style="color: auto; text-decoration: none;"
      styleInstructions+="\n.medium-"+r.title+"{"+style+"}"
    end
    print "styleInstructions : \n"
    print styleInstructions
    File.write('app/assets/stylesheets/sections/_medium-tag-styles.scss', styleInstructions)
    anchor = "#category-#{@category.id}"
    redirect_to "#{request.env['HTTP_REFERER']}#{anchor}"
  end

  def delete
    anchor = @category.parent_id.present? ? "#category-#{@category.parent_id}" : nil
    @category.destroy #_but_attach_children_to_parent
    flash[:notice] = "Category has been deleted"
    redirect_to "#{request.env['HTTP_REFERER']}#{anchor}"
  end

end