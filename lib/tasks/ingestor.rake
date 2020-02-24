require 'image_helper'
require 'open-uri' # TODO: Move elsewhere
require 'uri'

namespace :fromthepage do

  desc "Resize image file or directories of image files"
  task :compress_images, [:pathname] => :environment  do  |t,args|
    pathname = args.pathname
    p "compressing #{pathname}"
    
    if Dir.exist? pathname
      ImageHelper.compress_files_in_dir(pathname)
    else
      # this is a single file
      ImageHelper.compress_file(pathname)
    end
  end
  IMAGE_FILE_EXTENSIONS = ['jpg', 'JPG', 'jpeg', 'JPEG', 'png', 'PNG']
  IMAGE_FILE_EXTENSIONS_PATTERN = /jpg|JPG|jpeg|JPEG|png|PNG/

  TEXT_FILE_EXTENSIONS = ['txt', 'TXT']
  TEXT_FILE_EXTENSIONS_PATTERN = /txt|TXT/

  desc "Process a document upload"
  task :process_document_upload, [:document_upload_id] => :environment do |t,args|
    document_upload_id = args.document_upload_id
    #print "fetching upload with ID=#{document_upload_id}\n"
    document_upload = DocumentUpload.find document_upload_id
     
    document_upload.status = DocumentUpload::Status::PROCESSING
    document_upload.save
    
    process_batch(document_upload, File.dirname(document_upload.file.path), document_upload.id.to_s)

    document_upload.status = DocumentUpload::Status::FINISHED
    document_upload.save

    #if the upload processes correctly,
    #remove the uploaded file to prevent filling up the disk
    if document_upload.status = DocumentUpload::Status::FINISHED
      document_upload.remove_file!
      document_upload.save
    end

    if SMTP_ENABLED    
        SystemMailer.upload_succeeded(document_upload).deliver!
        UserMailer.upload_finished(document_upload).deliver!
    end

  end

  desc "Process a text upload"
  task :process_text_upload, [:document_upload_id] => :environment do |t,args|
    document_upload_id = args.document_upload_id
    document_upload = DocumentUpload.find document_upload_id
    
    document_upload.status = DocumentUpload::Status::PROCESSING
    document_upload.save
    
    process_batch_text(document_upload, File.dirname(document_upload.file.path), document_upload.id.to_s)

    document_upload.status = DocumentUpload::Status::FINISHED
    document_upload.save

    #if the upload processes correctly,
    #remove the uploaded file to prevent filling up the disk
    if document_upload.status = DocumentUpload::Status::FINISHED
      document_upload.remove_file!
      document_upload.save
    end

    if SMTP_ENABLED    
        SystemMailer.upload_succeeded(document_upload).deliver!
        UserMailer.upload_finished(document_upload).deliver!
    end

  end

  desc "Process document downloaded"
  task :process_document_downloaded, [:document_upload_id] => :environment do |t,args|
    document_upload_id = args.document_upload_id
    document_upload = DocumentUpload.find document_upload_id
    
    
    document_upload.status = DocumentUpload::Status::PROCESSING
    document_upload.save
    
    process_batch_downloaded(document_upload, File.dirname(document_upload.file.path), document_upload.id.to_s)

    document_upload.status = DocumentUpload::Status::FINISHED
    document_upload.save

    #if the upload processes correctly,
    #remove the uploaded file to prevent filling up the disk
    if document_upload.status = DocumentUpload::Status::FINISHED
      document_upload.remove_file!
      document_upload.save
    end

    if SMTP_ENABLED    
        SystemMailer.upload_succeeded(document_upload).deliver!
        UserMailer.upload_finished(document_upload).deliver!
    end

  end

  def process_batch(document_upload, path, temp_dir_seed)
    # copy to temp dir
    temp_dir = temp_dir_path(temp_dir_seed)
    copy_to_temp_dir(path, temp_dir)

    # unzip everything
    unzip_tree(temp_dir)
    # extract any pdfs
    unpdf_tree(temp_dir)
    # resize files
    compress_tree(temp_dir)
    # ingest
    ingest_tree(document_upload, temp_dir)
    # clean
    clean_tmp_dir(temp_dir)
  end

  def process_batch_text(document_upload, path, temp_dir_seed)
    # copy to temp dir
    temp_dir = temp_dir_path(temp_dir_seed)
    copy_to_temp_dir(path, temp_dir)

    # unzip everything
    unzip_tree(temp_dir)
    # extract any pdfs
    unpdf_tree(temp_dir)
    # resize files
    compress_tree(temp_dir)
    # ingest
    ingest_tree_text(document_upload, temp_dir)
    # clean
    clean_tmp_dir(temp_dir)
  end

  def process_batch_downloaded(document_upload, path, temp_dir_seed)
    # copy to temp dir
    temp_dir = temp_dir_path(temp_dir_seed)
    copy_to_temp_dir(path, temp_dir)

    # unzip everything
    unzip_tree(temp_dir)
    # extract any pdfs
    unpdf_tree(temp_dir)
    # resize files
    compress_tree(temp_dir)
    # ingest
    ingest_tree_downloaded(document_upload, temp_dir)
    # clean
    clean_tmp_dir(temp_dir)
  end
  
  def clean_tmp_dir(temp_dir)
    FileUtils::rm_r(temp_dir)
  end
  
  def unzip_tree(temp_dir)
    ls = Dir.glob(File.join(temp_dir, "*"))
    ls.each do |path|
      if Dir.exist? path
        unzip_tree(path) #recurse
      else
        if File.extname(path) == '.ZIP' || File.extname(path) == '.zip'
          #unzip and recur
          destination = File.join(File.dirname(path), File.basename(path).sub(File.extname(path),''))
          ImageHelper.unzip_file(path, destination)
          unzip_tree(destination)  # recurse
        end
      end
    end
  end
  
  def unpdf_tree(temp_dir)
    ls = Dir.glob(File.join(temp_dir, "*"))
    ls.each do |path|
      if Dir.exist? path
        unpdf_tree(path) #recurse
      else
        if File.extname(path) == '.PDF' || File.extname(path) == '.pdf'
          #extract 
          destination = ImageHelper.extract_pdf(path)
        end
      end
    end
  end
  def compress_tree(temp_dir)
    ls = Dir.glob(File.join(temp_dir, "*")).sort
    ls.each do |path|
      if Dir.exist? path
        compress_tree(path) #recurse
      else
        if File.extname(path).match IMAGE_FILE_EXTENSIONS_PATTERN
          destination = ImageHelper.compress_image(path)
        end
      end
    end    
  end
  
  def ingest_tree(document_upload, temp_dir) 
    # first process all sub-directories
    ls = Dir.glob(File.join(temp_dir, "*")).sort
    ls.each do |path|
      if Dir.exist? path
        ingest_tree(document_upload, path) #recurse
      end
    end    
    # now process this directory if it contains image files
    image_files = Dir.glob(File.join(temp_dir, "*.{"+IMAGE_FILE_EXTENSIONS.join(',')+"}"))
    if image_files.length > 0
      convert_to_work(document_upload, temp_dir)
    end
    
  end

  def ingest_tree_text(document_upload, temp_dir) 
    # first process all sub-directories
    ls = Dir.glob(File.join(temp_dir, "*")).sort
    ls.each do |path|
      if Dir.exist? path
        ingest_tree_text(document_upload, path) #recurse
      end
    end    
    # now process this directory if it contains image files
    image_files = Dir.glob(File.join(temp_dir, "*.{"+IMAGE_FILE_EXTENSIONS.join(',')+"}"))
    text_files = Dir.glob(File.join(temp_dir, "*.{"+TEXT_FILE_EXTENSIONS.join(',')+"}"))

    #if image_files.length > 0 and text_files.length > 0
    if image_files.length > 0
      convert_to_work_text(document_upload, temp_dir)
    end
    
  end

  def ingest_tree_downloaded(document_upload, temp_dir) 
    # first process all sub-directories
    ls = Dir.glob(File.join(temp_dir, "*")).sort
    ls.each do |path|
      if Dir.exist? path
        ingest_tree_downloaded(document_upload, path) #recurse
      end
    end    
    # now process this directory if it contains image files
    image_files = Dir.glob(File.join(temp_dir, "*.{"+IMAGE_FILE_EXTENSIONS.join(',')+"}"))
    text_files = Dir.glob(File.join(temp_dir, "*.{"+TEXT_FILE_EXTENSIONS.join(',')+"}"))

    #if image_files.length > 0 and text_files.length > 0
    if image_files.length > 0
      convert_to_work_downloaded(document_upload, temp_dir)
    end
    
  end

  def convert_to_work_downloaded(document_upload, path)

    path_array = path.split(File::SEPARATOR)
    work_name = path_array[-2]

#    binding.pry if path == "/tmp/fromthepage_uploads/16/terrell-papers-jpg"
    User.current_user=document_upload.user
    
    work = Work.new
    work.owner = document_upload.user
    work.collection = document_upload.collection
    work.title = work_name
    work.save!
    
    new_dir_name = File.join(Rails.root,
                             "public",
                             "images",
                             "uploaded",
                             work.id.to_s)
                             
    FileUtils.mkdir_p(new_dir_name)
    IMAGE_FILE_EXTENSIONS.each do |ext|
      FileUtils.cp(Dir.glob(File.join(path, "*.#{ext}")), new_dir_name)    
      Dir.glob(File.join(path, "*.#{ext}")).sort.each { |fn| print "\t\t\tcp #{fn} to #{new_dir_name}\n" }      
    end    

    # at this point, the new dir should have exactly what we want-- only image files that are adequatley compressed.
    work.description = work.title
    ls = Dir.glob(File.join(new_dir_name, "*")).sort

    #Ignore thumb images
    regexp = "_thumb\.(" + IMAGE_FILE_EXTENSIONS.join('|') + ")$"
    ls = ls.select { |n| !n.to_s.match(/#{regexp}/) }

    GC.start
    ls.each_with_index do |image_fn,i|
      page = Page.new
      page.title = "#{i+1}"
      page.base_image = image_fn
      image = Magick::ImageList.new(image_fn)
      GC.start
      page.base_height = image.rows
      page.base_width = image.columns
      image = nil
      GC.start

      last_part_path = URI(path).path.split('/').last
      path_txt = File.join(path, ".." , page.title + ".txt")
      if File.exist?(path_txt)
        file_txt = File.open(path_txt)
        text_from_file = file_txt.read

        page.xml_text = text_from_file
        source_text = text_from_file.dup

        if !source_text.nil? && source_text.length!=0
          source_text = source_text.gsub(/<\?xml version='1.0' encoding='UTF-8'\?>/, " ")
          source_text = source_text.gsub(/<page>/, " ")
          source_text = source_text.gsub(/<p>/, " ")
          source_text = source_text.gsub(/<\/p>/, " ")
          source_text = source_text.gsub(/<\/page>/, " ")
        end

        page.source_text = source_text
        page.search_text = SearchTranslator.search_text_from_xml(text_from_file, "")
        page.original_text = SearchTranslator.original_text_from_xml(text_from_file)

        work.pages << page      
      end
    end
    work.save!
  end

  def convert_to_work_text(document_upload, path)

#    binding.pry if path == "/tmp/fromthepage_uploads/16/terrell-papers-jpg"
    User.current_user=document_upload.user
    
    work = Work.new
    work.owner = document_upload.user
    work.collection = document_upload.collection
    work.title = File.basename(path).ljust(3,'.')
    work.save!
    
    new_dir_name = File.join(Rails.root,
                             "public",
                             "images",
                             "uploaded",
                             work.id.to_s)
                             
    FileUtils.mkdir_p(new_dir_name)
    IMAGE_FILE_EXTENSIONS.each do |ext|
      FileUtils.cp(Dir.glob(File.join(path, "*.#{ext}")), new_dir_name)    
      Dir.glob(File.join(path, "*.#{ext}")).sort.each { |fn| print "\t\t\tcp #{fn} to #{new_dir_name}\n" }      
    end    

    # at this point, the new dir should have exactly what we want-- only image files that are adequatley compressed.
    work.description = work.title
    ls = Dir.glob(File.join(new_dir_name, "*")).sort
    GC.start
    ls.each_with_index do |image_fn,i|
      page = Page.new
      page.title = "#{i+1}"
      page.base_image = image_fn
      image = Magick::ImageList.new(image_fn)
      GC.start
      page.base_height = image.rows
      page.base_width = image.columns
      image = nil
      GC.start

      last_part_path = URI(path).path.split('/').last
      path_txt = File.join(path, ".." , page.title + ".txt")
      file_txt = File.open(path_txt)
      text_from_file = file_txt.read

      page.source_text = text_from_file
      page.search_text = text_from_file
      page.original_text = text_from_file

      page.xml_text = "<?xml version='1.0' encoding='UTF-8'?><page><p>"+text_from_file+"</p></page>"

      work.pages << page      
    end
    work.save!
  end
  
  def convert_to_work(document_upload, path)

#    binding.pry if path == "/tmp/fromthepage_uploads/16/terrell-papers-jpg"
    User.current_user=document_upload.user
    
    work = Work.new
    work.owner = document_upload.user
    work.collection = document_upload.collection
    work.title = File.basename(path).ljust(3,'.')
    work.save!
    
    new_dir_name = File.join(Rails.root,
                             "public",
                             "images",
                             "uploaded",
                             work.id.to_s)
                             
    FileUtils.mkdir_p(new_dir_name)
    IMAGE_FILE_EXTENSIONS.each do |ext|
      FileUtils.cp(Dir.glob(File.join(path, "*.#{ext}")), new_dir_name)    
      Dir.glob(File.join(path, "*.#{ext}")).sort.each { |fn| print "\t\t\tcp #{fn} to #{new_dir_name}\n" }      
    end    

    # at this point, the new dir should have exactly what we want-- only image files that are adequatley compressed.
    work.description = work.title
    ls = Dir.glob(File.join(new_dir_name, "*")).sort
    GC.start
    ls.each_with_index do |image_fn,i|
      page = Page.new
      page.title = "#{i+1}"
      page.base_image = image_fn
      image = Magick::ImageList.new(image_fn)
      GC.start
      page.base_height = image.rows
      page.base_width = image.columns
      image = nil
      GC.start
      work.pages << page      
    end
    work.save!
  end

  
  def temp_dir_path(seed)
    File.join(Dir.tmpdir, 'fromthepage_uploads', seed)    
  end
  
  def copy_to_temp_dir(path, temp_dir)
    print "creating temp directory #{temp_dir}\n"
    FileUtils.mkdir_p(temp_dir)
    print "copying #{File.join(path, '*')} to #{temp_dir}\n"
    FileUtils.cp_r(Dir.glob(File.join(path,"*")), temp_dir)
  end

  desc "Import IIIF Collection"
  task :import_iiif, [:collection_url] => :environment  do  |t,args|
      
    ScCollection.delete_all
    ScManifest.delete_all
    ScCanvas.delete_all      
      
    collection_url = args.collection_url
    p "importing #{collection_url}"
    collection_string = ""
    collection_string = open(collection_url).read    

    collection_hash = JSON.parse(collection_string)
    sc_collection = ScCollection.new
    sc_collection.context = collection_hash["@context"]
    sc_collection.save!
    
    collection_hash["manifests"].each do |manifest_item|
      sc_manifest = ScManifest.new
      sc_manifest.sc_collection = sc_collection
      sc_manifest.sc_id = manifest_item["@id"]
      sc_manifest.label = manifest_item["label"]
      
      sc_manifest.save!
      
      begin
        manifest_string = open(sc_manifest.sc_id).read
        manifest_hash = JSON.parse(manifest_string)
        
        sc_manifest.metadata = manifest_hash["metadata"].to_json if manifest_hash["metadata"]
        
        first_sequence = manifest_hash["sequences"].first
        sc_manifest.first_sequence_id = first_sequence["@id"]
        sc_manifest.first_sequence_label = first_sequence["label"]
        
        sc_manifest.save!
        
        first_sequence["canvases"].each do |canvas|
          sc_canvas = ScCanvas.new
          sc_canvas.sc_manifest = sc_manifest
          
          sc_canvas.sc_id = canvas["@id"]
          sc_canvas.sc_canvas_id = canvas["@id"]
          sc_canvas.sc_canvas_label = canvas["label"]
          sc_canvas.sc_canvas_width = canvas["width"]
          sc_canvas.sc_canvas_height = canvas["height"]
          
          first_image = canvas["images"].first
          sc_canvas.sc_image_motivation = first_image["motivation"]
          sc_canvas.sc_image_on = first_image["on"]
          
          resource = first_image["resource"]
          sc_canvas.sc_resource_id = resource["@id"]
          sc_canvas.sc_resource_type = resource["@type"]
          sc_canvas.sc_resource_format = resource["format"]
  
          service = resource["service"]
          sc_canvas.sc_service_id = service["@id"]
          sc_canvas.sc_service_context = service["@context"]
          sc_canvas.sc_service_profile = service["profile"]
          
          sc_canvas.save!
        
        end
      rescue OpenURI::HTTPError
        print "WARNING:\tHTTP error accessing manifest #{sc_manifest.sc_id}\n"
      end

    end    
  end

end
