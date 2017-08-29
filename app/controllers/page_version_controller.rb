class PageVersionController < ApplicationController

  before_filter :set_versions, :except => [:register_version_in_pages]

  def set_versions
    @selected_version = @page_version.present? ? @page_version : @page.page_versions.first
    @previous_version = params[:compare_version_id] ? PageVersion.find(params[:compare_version_id]) : @selected_version.prev
  end

  def list
    render 'show'
  end


  def register_version_in_pages
  	#Registers the chosen version text into the pages table so that it becomes the main version for transcription
  	page_version=PageVersion.find(params[:version_id])
  	page=Page.find(page_version.page_id)
  	page.source_text=page_version.transcription
  	page.xml_text=page_version.xml_transcription
  	page.save
  	render 'show'
  end

end