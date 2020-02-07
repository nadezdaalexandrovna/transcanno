class TranscribeController  < ApplicationController

  include AbstractXmlController
  include DisplayHelper

  require 'rexml/document'
  include Magick
  before_filter :authorized?, :except => [:zoom, :guest]
  protect_from_forgery :except => [:zoom, :unzoom]

  def authorized?
    unless user_signed_in? && current_user.can_transcribe?(@work)
      redirect_to new_user_session_path
    end
  end

  def display_page
    #CollectionController.updateStylesIfCollectionIdNotInCookies(cookies, @collection)
    connection = ActiveRecord::Base.connection
    @auto_fullscreen = cookies[:auto_fullscreen] || 'no';
    @layout_mode = cookies[:transcribe_layout_mode] || 'ltr';

    @use_advanced_mode = cookies[:use_advanced_mode] || 0;

    #For the simple mode
    #First we only select categories, because maybe they don't have attributes
    @categories = Category.select(:title,:id).joins('inner join works on categories.collection_id=works.collection_id').joins('inner join pages on pages.work_id=works.id').where('pages.id=?',params[:page_id]).joins('left join categoryscopes on categoryscopes.category_id=categories.id').where('categoryscopes.mode!=1 OR categoryscopes.category_id IS NULL').joins('left join headercategories on headercategories.category_id=categories.id').where('headercategories.is_header_category=0 OR headercategories.is_header_category IS NULL')

    #Then we select categories' attributes
    sqlS="SELECT categoryattributes.category_id, attributecats.name, categoryattributes.allow_user_input, categoryattributes.only, categoryattributes.max_len FROM attributecats INNER JOIN `categoryattributes` ON attributecats.id=categoryattributes.attributecat_id INNER JOIN categories on categories.id=categoryattributes.category_id inner join works on categories.collection_id=works.collection_id inner join pages on pages.work_id=works.id where categoryattributes.mode!=1 and pages.id="+params[:page_id];
    
    categorytypes=connection.execute(sqlS)

    @categoryTypesHash=Hash.new()
    categorytypes.each do |row|
      if @categoryTypesHash.key?(row[0]) #If this category is already in the hash
          @categoryTypesHash[row[0]][row[1]]={'allow_user_input'=>row[2],'values'=>[], 'default'=>'', 'only'=>row[3], 'max_len'=>row[4]}
      else #If this category is not yet in the hash
        @categoryTypesHash[row[0]]={row[1]=>{'allow_user_input'=>row[2], 'values'=>[], 'default'=>'', 'only'=>row[3], 'max_len'=>row[4]}}
      end
    end

    #Then we select attribute values, because some attributes don't have values and have allow_user_input=true
    sqlS="SELECT DISTINCT categoryattributes.category_id, attributecats.name, attributevalues.value, attributes_to_values.is_default FROM attributecats INNER JOIN `categoryattributes` ON attributecats.id=categoryattributes.attributecat_id INNER JOIN attributes_to_values ON `categoryattributes`.`id` = `attributes_to_values`.`categoryattribute_id` INNER JOIN attributevalues ON attributevalues.id=attributes_to_values.attributevalue_id inner join categories on categories.id=categoryattributes.category_id inner join works on categories.collection_id=works.collection_id inner join pages on pages.work_id=works.id where categoryattributes.mode!=1 and pages.id="+params[:page_id];
    typesAttributes=connection.execute(sqlS)

    #categorytypes=Categoryattribute.joins(:category).joins('inner join attributevalues on categoryattributes.id=attributevalues.categoryattribute_id').where.not(mode: 1)
    
    typesAttributes.each do |row|
      @categoryTypesHash[row[0]][row[1]]['values'].push(row[2])
      if row[3]==1
        @categoryTypesHash[row[0]][row[1]]['default']=row[2]
      end
    end

    @categoryTypesHash=@categoryTypesHash.to_json

    #For the advanced mode
    #First we only select categories, because maybe they don't have attributes
    @categoriesAdv = Category.select(:title,:id).joins('inner join works on categories.collection_id=works.collection_id').joins('inner join pages on pages.work_id=works.id').where('pages.id=?',params[:page_id]).joins('left join categoryscopes on categoryscopes.category_id=categories.id').where('categoryscopes.mode!=0 OR categoryscopes.category_id IS NULL').joins('left join headercategories on headercategories.category_id=categories.id').where('headercategories.is_header_category=0 OR headercategories.is_header_category IS NULL')

    #Then we select categories' attributes
    sqlAdv="SELECT categoryattributes.category_id,  categoryattributes.id, attributecats.name, categoryattributes.allow_user_input, categoryattributes.only, categoryattributes.max_len FROM attributecats INNER JOIN `categoryattributes` ON attributecats.id=categoryattributes.attributecat_id INNER JOIN categories on categories.id=categoryattributes.category_id inner join works on categories.collection_id=works.collection_id inner join pages on pages.work_id=works.id where categoryattributes.mode!=0 and pages.id="+params[:page_id];
    categorytypesAdv=connection.execute(sqlAdv)

    @categoryTypesHashAdv=Hash.new()
    categorytypesAdv.each do |row|
      if @categoryTypesHashAdv.key?(row[0]) #If this category is already in the hash
          @categoryTypesHashAdv[row[0]][row[1]]={'allow_user_input'=>row[3],'name'=>row[2],'values'=>{}, 'default'=>'', 'only'=>row[4], 'max_len'=>row[5]}
      else #If this category is not yet in the hash
        @categoryTypesHashAdv[row[0]]={row[1]=>{'allow_user_input'=>row[3], 'name'=>row[2], 'values'=>{}, 'default'=>'', 'only'=>row[4], 'max_len'=>row[5]}}
      end
    end

    #Then we select attribute values, because some attributes don't have values and have allow_user_input=true
    sqlAdvS="SELECT categoryattributes.category_id, categoryattributes.id, attributevalues.value, attributes_to_values.is_default FROM categoryattributes INNER JOIN attributes_to_values ON `categoryattributes`.`id` = `attributes_to_values`.`categoryattribute_id` INNER JOIN attributevalues ON attributevalues.id=attributes_to_values.attributevalue_id inner join categories on categories.id=categoryattributes.category_id inner join works on categories.collection_id=works.collection_id inner join pages on pages.work_id=works.id where categoryattributes.mode!=0 and pages.id="+params[:page_id];
    typesAttributesAdv=connection.execute(sqlAdvS)

    #categorytypes=Categoryattribute.joins(:category).joins('inner join attributevalues on categoryattributes.id=attributevalues.categoryattribute_id').where.not(mode: 1)
    
    typesAttributesAdv.each do |row|
      @categoryTypesHashAdv[row[0]][row[1]]['values'][row[2]]=[]
      if row[3]==1
        @categoryTypesHashAdv[row[0]][row[1]]['default']=row[2]
      end
    end

    #At last, we select consequences: when a certain attribute value is selected, certain other attributes should be given values
    sqlSeq="SELECT categoryattributes.category_id, categoryattributes.id, attributevalues.value, attributecats.name, categoryattributesSeq.id from attributevalues INNER JOIN valuestoattributesrelations ON attributevalues.id=valuestoattributesrelations.attributevalue_id INNER JOIN attributecats ON attributecats.id=valuestoattributesrelations.consequent_attr_id INNER JOIN categoryattributes categoryattributesSeq ON categoryattributesSeq.attributecat_id=attributecats.id INNER JOIN attributes_to_values ON attributes_to_values.valuestoattributesrelation_id=valuestoattributesrelations.id INNER JOIN categoryattributes ON categoryattributes.id=attributes_to_values.categoryattribute_id INNER JOIN categories ON categories.id=categoryattributes.category_id inner join works on categories.collection_id=works.collection_id INNER JOIN pages ON pages.work_id=works.id WHERE categoryattributesSeq.id  IN (SELECT catattrs2.id FROM categoryattributes catattrs2 WHERE catattrs2.category_id=categoryattributes.category_id) AND pages.id="+params[:page_id];
    sequences=connection.execute(sqlSeq)

    sequences.each do |row|
      if @categoryTypesHashAdv[row[0]][row[1]]['values'].key?(row[2])
        @categoryTypesHashAdv[row[0]][row[1]]['values'][row[2]].push([row[4],row[3]])
      else
        @categoryTypesHashAdv[row[0]][row[1]]['values']={row[2]=>[[row[4],row[3]]]}
      end
    end

    @categoryTypesHashAdv=@categoryTypesHashAdv.to_json

    sqlInitial="SELECT categoryattributes.category_id, categoryattributes.id FROM categoryattributes INNER JOIN categories on categories.id=categoryattributes.category_id inner join works on categories.collection_id=works.collection_id inner join pages on pages.work_id=works.id where categoryattributes.mode!=0 and pages.id="+params[:page_id]+" AND categoryattributes.initial=1"
    initialAttrs=connection.execute(sqlInitial)

    @initialAttrIds={}
    initialAttrs.each do |iA|
      if @initialAttrIds.key?(iA[0])
        @initialAttrIds[iA[0]].push(iA[1])
      else
        @initialAttrIds[iA[0]]=[iA[1]]
      end
    end
    @initialAttrIds=@initialAttrIds.to_json


    #Information for javascript button functions    
    sqlS="SELECT categories.title, categorystyles.colour, categorystyles.textdecoration, categorystyles.fontstyle, categories.id FROM `categorystyles` INNER JOIN `categories` ON `categories`.`id` = `categorystyles`.`category_id`"
    res=connection.execute(sqlS)
    styleInstructions=""
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
    end

  @buttonsStyles=styleInstructions


  #Get the header categories
  #headerCategories = Category.select(:id, :title, :allow_user_input).joins('inner join works on categories.collection_id=works.collection_id').joins('inner join pages on pages.work_id=works.id').where('pages.id=?',params[:page_id]).joins('left join headercategories on headercategories.category_id=categories.id').where('headercategories.is_header_category=1')

  sqlHC="select categories.id, categories.title, headercategories.allow_user_input, headercategories.only, headercategories.max_len from categories inner join headercategories on headercategories.category_id=categories.id inner join works on categories.collection_id=works.collection_id inner join pages on pages.work_id=works.id where headercategories.is_header_category=1 and pages.id="+params[:page_id];
  headerCategories=connection.execute(sqlHC)

  #Get the header categories values
  sqlH="select categories.id, categories.title, headercategories.allow_user_input, headervalues.id, headervalues.value, headervalues.is_default, headercategories.only, headercategories.max_len from headervalues inner join categories on headervalues.category_id=categories.id inner join headercategories on headercategories.category_id=categories.id inner join works on categories.collection_id=works.collection_id inner join pages on pages.work_id=works.id where headercategories.is_header_category=1 and pages.id="+params[:page_id];
  headerCategoriesValues=connection.execute(sqlH)

  @headerCatsHash={}

  headerCatExistsDefault={}

  headerCategoriesValues.each do |row|
    if row[5].to_i==1
      headerCatExistsDefault[row[0]]=1
    end
    if @headerCatsHash.key?(row[0])
      @headerCatsHash[row[0]][3][row[3]]=[row[4],row[5]]
    else
      @headerCatsHash[row[0]]=[row[1], row[2], 0, row[6], row[7], {row[3]=>[row[4],row[5]]}]
    end
  end

  #Add categories that don't have predefined values
  headerCategories.each do |row|
    if !@headerCatsHash.key?(row[0])
      @headerCatsHash[row[0]]=[row[1], row[2], 0, row[3], row[4]]
    end
  end

  #Set exists_default to true for categories that have default values
  headerCatExistsDefault.each do |catId, one|
    @headerCatsHash[catId][2]=1
  end


  end



  def guest
  end

  def mark_page_blank
    if params[:mark_blank] == 'yes'
      @page.status = Page::STATUS_BLANK
      @page.translation_status = Page::STATUS_BLANK
      @page.save
      @work.work_statistic.recalculate if @work.work_statistic
      redirect_to :controller => 'display', :action => 'display_page', :page_id => @page.id
    elsif params[:mark_blank] == 'no'
      @page.status = nil
      @page.translation_status = nil
      @page.save
      @work.work_statistic.recalculate if @work.work_statistic
      redirect_to :controller => 'transcribe', :action => 'display_page', :page_id => @page.id
    else
      redirect_to :controller => 'transcribe', :action => 'display_page', :page_id => @page.id
    end
  end

  def needs_review
    if params[:type] == 'translation'
      if params[:page]['needs_review'] == '1'
        @page.translation_status = Page::STATUS_NEEDS_REVIEW
        record_translation_review_deed
      else
        @page.translation_status = nil
      end
    else
      if params[:page]['needs_review'] == '1'
        @page.status = Page::STATUS_NEEDS_REVIEW
        record_review_deed
      else
        @page.status = nil
      end
    end
  end


  def save_transcription
    #If the transcriber pushed the button "Transcription finished", all the previous version of the page are deleted from the database
    if params[:page][:finished]=="1"
      @page.page_versions.destroy_all()
    end
    old_link_count = @page.page_article_links.where(text_type: 'transcription').count
    @page.attributes = params[:page]
    #if page has been marked blank, call the mark_blank code 
    #unless the page is also marked as needing review
    if params['mark_blank'].present?
      unless params[:page]['needs_review'] == '1'
        mark_page_blank
        return
      end
    end

    #check to see if the page needs to be marked as needing review
    needs_review

    if params['save']
      log_transcript_attempt
      #leave the status alone if it's needs review, but otherwise set it to transcribed
      unless @page.status == Page::STATUS_NEEDS_REVIEW
        @page.status = Page::STATUS_TRANSCRIBED
      end
      begin
        if @page.save
          log_transcript_success
          if @page.work.ocr_correction
            record_correction_deed
          else
            record_deed
          end
          # use the new links to blank the graphs
          @page.clear_article_graphs

          new_link_count = @page.page_article_links.where(text_type: 'transcription').count
          logger.debug("DEBUG old_link_count=#{old_link_count}, new_link_count=#{new_link_count}")
          if old_link_count == 0 && new_link_count > 0
            record_index_deed
          end
          if new_link_count > 0 && @page.status != Page::STATUS_NEEDS_REVIEW
            @page.update_columns(status: Page::STATUS_INDEXED)
          end
          @work.work_statistic.recalculate if @work.work_statistic
          @page.submit_background_processes
      
          #if this is a guest user, force them to sign up after three saves
          if current_user.guest?
            deeds = Deed.where(user_id: current_user.id).count
            if deeds < 3
              flash[:notice] = "You may save up to three transcriptions as a guest."
            else
              redirect_to new_user_registration_path, :resource => current_user
              return
            end
          end

          redirect_to :action => 'assign_categories', :page_id => @page.id
        else
          log_transcript_error
          render :action => 'display_page'
        end
      rescue REXML::ParseException => ex
        log_transcript_exception(ex)
        flash[:error] =
          "There was an error parsing the mark-up in your transcript.
           This kind of error often occurs if an angle bracket is missing or if an HTML tag is left open.
           Check any instances of < or > symbols in your text.  (The parser error was: #{ex.message})"
        logger.fatal "\n\n#{ex.class} (#{ex.message}):\n"
        render :action => 'display_page'
        flash.clear
        # raise ex
      rescue  => ex
        log_transcript_exception(ex)
        flash[:error] = ex.message
        logger.fatal "\n\n#{ex.class} (#{ex.message}):\n"
        render :action => 'display_page'
        flash.clear
        # raise ex
      end
    elsif params['preview']
      @preview_xml = @page.wiki_to_xml(@page.source_text, "transcription")

#      @preview_xml = @page.generate_preview("transcription")
      render :action => 'display_page'
    elsif params['edit']
      render :action => 'display_page'
    elsif params['autolink']
      @page.source_text = autolink(@page.source_text)
      render :action => 'display_page'
    end
  end

  def assign_categories
        
    @translation = params[:translation]
    # look for uncategorized articles
    for article in @page.articles
      if article.categories.length == 0
        render :action => 'assign_categories'
        return
      end
    end
    # no uncategorized articles found, skip to display
    if @translation
      redirect_to  :action => 'display_page', :page_id => @page.id, :controller => 'display', :translation => true
    else
      redirect_to  :action => 'display_page', :page_id => @page.id, :controller => 'display'
    end
  end

  def translate
  end

  def save_translation
    old_link_count = @page.page_article_links.where(text_type: 'translation').count
    @page.attributes=params[:page]

    if params['mark_blank'].present?
      mark_page_blank
      return
    end

    #check to see if the page needs review
    needs_review

    if params['save']
      log_translation_attempt
      #leave the status alone if it's needs review, but otherwise set it to translated
      unless @page.translation_status == Page::STATUS_NEEDS_REVIEW
        @page.translation_status = Page::STATUS_TRANSLATED
      end

      begin
        if @page.save
          log_translation_success
          record_translation_deed

          new_link_count = @page.page_article_links.where(text_type: 'translation').count
          logger.debug("DEBUG old_link_count=#{old_link_count}, new_link_count=#{new_link_count}")
          if old_link_count == 0 && new_link_count > 0
            record_translation_index_deed
          end
          if new_link_count > 0 && @page.translation_status != Page::STATUS_NEEDS_REVIEW
            @page.update_columns(translation_status: Page::STATUS_INDEXED)
          end

          @work.work_statistic.recalculate if @work.work_statistic
          @page.submit_background_processes

          #if this is a guest user, force them to sign up after three saves
          if current_user.guest?
            deeds = Deed.where(user_id: current_user.id).count
            if deeds < 3
              flash[:notice] = "You may save up to three transcriptions as a guest."
            else
              redirect_to new_user_registration_path, :resource => current_user
              return
            end
          end
          
          redirect_to :action => 'assign_categories', :page_id => @page.id, :translation => true
        else
          log_translation_error
          render :action => 'translate'
        end
      rescue REXML::ParseException => ex
        log_translation_exception(ex)
        flash[:error] =
          "There was an error parsing the mark-up in your translation.
           This kind of error often occurs if an angle bracket is missing or if an HTML tag is left open.
           Check any instances of < or > symbols in your text.  (The parser error was: #{ex.message})"
        logger.fatal "\n\n#{ex.class} (#{ex.message}):\n"
        render :action => 'translate'
        flash.clear
        # raise ex
      rescue  => ex
        log_translation_exception(ex)
        flash[:error] = ex.message
        logger.fatal "\n\n#{ex.class} (#{ex.message}):\n"
        render :action => 'translate'
        flash.clear
        # raise ex
      end
    elsif params['preview']
      @preview_xml = @page.wiki_to_xml(@page.source_translation, "translation")
      render :action => 'translate'
    elsif params['edit']
      render :action => 'translate'
    elsif params['autolink']
      @page.source_translation = autolink(@page.source_translation)
      render :action => 'translate'

    end
  end

protected

  TRANSLATION="TRANSLATION"
  TRANSCRIPTION="TRANSCRIPTION"

  def log_attempt(attempt_type, source_text)
    # we have access to @page, @user, and params
    @transcript_date = Time.now
    log_message = "#{attempt_type}\t#{@transcript_date}\n"
    log_message << "#{attempt_type}\tUser\tID: #{current_user.id}\tEmail: #{current_user.email}\tDisplay Name: #{current_user.display_name}\n"
    log_message << "#{attempt_type}\tCollection\tID: #{@collection.id}\tTitle:#{@collection.title}\tOwner Email: #{@collection.owner.email}\n"
    log_message << "#{attempt_type}\tWork\tID: #{@work.id}\tTitle: #{@work.title}\n"
    log_message << "#{attempt_type}\tPage\tID: #{@page.id}\tPosition: #{@page.position}\tTitle:#{@page.title}\n"
    log_message << "#{attempt_type}\tSource Text:\nBEGIN_SOURCE_TEXT\n#{source_text}\nEND_SOURCE_TEXT\n\n"

    logger.info(log_message)
  end

  def log_exception(attempt_type, ex)
    log_message = "#{attempt_type}\t#{@transcript_date}\tERROR\tEXCEPTION\t"
    logger.error(log_message + ex.message)
    logger.error(ex.backtrace.join("\n"))
  end

  def log_error(attempt_type)
    log_message = "#{attempt_type}\t#{@transcript_date}\tERROR\t"
    logger.info(@page.errors[:base].join("\t#{log_message}"))
  end

  def log_success(attempt_type)
    log_message = "#{attempt_type}\t#{@transcript_date}\tSUCCESS\t"
    logger.info(log_message)
  end


  def log_transcript_attempt
    # we have access to @page, @user, and params
    log_attempt(TRANSCRIPTION, params[:page][:source_text])
  end

  def log_transcript_exception(ex)
    log_exception(TRANSCRIPTION, ex)
  end

  def log_transcript_error
    log_error(TRANSCRIPTION)
  end

  def log_transcript_success
    log_success(TRANSCRIPTION)
  end

  def log_translation_attempt
    # we have access to @page, @user, and params
    log_attempt(TRANSLATION, params[:page][:source_translation])
  end

  def log_translation_exception(ex)
    log_exception(TRANSLATION, ex)
  end

  def log_translation_error
    log_error(TRANSLATION)
  end

  def log_translation_success
    log_success(TRANSLATION)
  end


  def record_deed
    deed = stub_deed
    current_version = @page.page_versions[0]
    if current_version.page_version > 1
      deed.deed_type = Deed::PAGE_EDIT
    else
      deed.deed_type = Deed::PAGE_TRANSCRIPTION
    end
    deed.save!
  end

  def stub_deed
    deed = Deed.new
    deed.note = @note
    deed.page = @page
    deed.work = @work
    deed.collection = @collection
    deed.user = current_user

    deed
  end

  def record_correction_deed
    deed = stub_deed
    deed.deed_type = Deed::OCR_CORRECTED
    deed.save!
  end

  def record_index_deed
    deed = stub_deed
    deed.deed_type = Deed::PAGE_INDEXED
    deed.save!
  end

  def record_review_deed
    deed = stub_deed
    deed.deed_type = Deed::NEEDS_REVIEW
    deed.save!
  end

  def record_translation_deed
    deed = stub_deed
    if @page.page_versions.size < 2 || @page.page_versions.second.source_translation.blank?
      deed.deed_type = Deed::PAGE_TRANSLATED
    else
      deed.deed_type = Deed::PAGE_TRANSLATION_EDIT
    end
    deed.save!
  end

  def record_translation_review_deed
    deed = stub_deed
    deed.deed_type = Deed::TRANSLATION_REVIEW
    deed.save!
  end

  def record_translation_index_deed
    deed = stub_deed
    deed.deed_type = Deed::TRANSLATION_INDEXED
    deed.save!
  end



end