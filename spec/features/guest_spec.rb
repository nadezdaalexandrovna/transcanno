require 'spec_helper'

describe "guest user actions" do

  before :all do
    @collections = Collection.all
    @collection = @collections.last
    @work = @collection.works.last
    @page = @work.pages.last
  end

  it "tests guest account creation and migration" do
    visit "/display/display_page?page_id=#{@page.id}"
    page.find('.tabs').click_link("Transcribe")
    expect(page).to have_content("Sign In")
    expect(page).not_to have_content("Signed In As")
    expect(page).to have_button("Transcribe as guest")
    click_button("Transcribe as guest")
    expect(page).to have_content("Signed In As")
    expect(page).to have_button("Save Changes")
    @guest = User.last
    expect(@guest.guest).to be true
    expect(page).to have_link("Sign Up")
    click_link("Sign Up")
    expect(page.current_path).to eq new_user_registration_path

 end


end
