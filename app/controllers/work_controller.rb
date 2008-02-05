# handles administrative tasks for the work object
class WorkController < ApplicationController
  require 'ftools'

  in_place_edit_for :work, :title
  in_place_edit_for :work, :description
  in_place_edit_for :work, :physical_description #binding, condition
  in_place_edit_for :work, :document_history #provenance, acquisition, origin
  in_place_edit_for :work, :permission_description #what permission was given for this to be transcribed?
    # what permission is given for the transription to be shared?
  in_place_edit_for :work, :location_of_composition
  in_place_edit_for :work, :author
  in_place_edit_for :work, :transcription_conventions

  before_filter :authorized?, :only => [:edit, :pages_tab, :delete, :new, :create]

  def authorized?
    if logged_in? && current_user.owner
      if @work
        return @work.owner == current_user
      end
    else
      return false
    end
  end


  # TODO: refactor author to include docbook elements like fn, ln, on, hon, lin
  def create_pdf
    # render to string
    string = render_to_string :file => "#{RAILS_ROOT}/app/views/work/work.docbook"
#    # spew string to docbook tempfile

    File.open(doc_tmp_path, "w") { |f| f.write(string) }
    if $? 
      render(:text => "file write failed")
      return
    end

    
    dp_cmd = "/usr/bin/docbook2pdf #{doc_tmp_path} -o #{tmp_path} > #{tmp_path}/d2p.out 2> #{tmp_path}/d2p.err"
    logger.debug("DEBUG #{dp_cmd}")
    #IO.popen(dp_cmd)
    
    if !system(dp_cmd) 
      render_docbook_error
      return
    end
    if !File.exists?(pdf_tmp_path)
      render(:text => "#{dp_cmd} did not generate #{pdf_tmp_path}")
      return
    end

    if !File.copy(pdf_tmp_path, pdf_pub_path)
      render(:text => "could not copy pdf file to public/docs")
      return
    end
    @pdf_file = pdf_pub_path
  end

  def delete
    @work.destroy
    redirect_to :controller => 'dashboard'
  end

  def new
    @work = Work.new
  end

  def versions
    @page_versions = 
      PageVersion.find(:all, 
                       :conditions => ['page_id IN (SELECT page_id FROM pages WHERE work_id = ?)',
                                       @work.id],
                       :order => "work_version desc")
  end
  
  def scribes_tab
    @scribes = @work.scribes
    @nonscribes = User.find(:all) - @scribes
  end

  def add_scribe
    @work.scribes << @user
    redirect_to :action => 'scribes_tab', :work_id => @work.id
  end

  def remove_scribe
    @work.scribes.delete(@user)
    redirect_to :action => 'scribes_tab', :work_id => @work.id
  end

  def update_work
    @work.update_attributes(params[:work])
    redirect_to :action => 'scribes_tab', :work_id => @work.id
  end
  
  def create
    work = Work.new(params[:work])
    work.owner = current_user
    work.save!
    redirect_to :controller => 'dashboard'
  end

private
  def print_fn_stub
    @stub ||= DateTime.now.strftime("w#{@work.id}v#{@work.transcription_version}d%Y%m%dt%H%M%S")
  end
  
  def doc_fn
    "#{print_fn_stub}.docbook"
  end
  
  def pdf_fn
    "#{print_fn_stub}.pdf"
  end

  def tmp_path
    "#{RAILS_ROOT}/tmp"
  end
  
  def pub_path
    "#{RAILS_ROOT}/public/docs"
  end
  
  def pdf_tmp_path
    "#{tmp_path}/#{pdf_fn}"  
  end  

  def pdf_pub_path
    "#{pub_path}/#{pdf_fn}"  
  end  

  def doc_tmp_path
    "#{tmp_path}/#{doc_fn}"
  end

  def render_docbook_error
    msg = "docbook2pdf failure: <br /><br /> " +
      "stdout:<br />"
    File.new("#{tmp_path}/d2p.out").each { |l| msg+= l + "<br />"}
    msg += "<br />stderr:<br />"
    File.new("#{tmp_path}/d2p.err").each { |l| msg+= l + "<br />"}
    render(:text => msg )
  end
end