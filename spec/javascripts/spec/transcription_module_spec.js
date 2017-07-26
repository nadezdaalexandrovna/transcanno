//require('../../../public/transcription_module.js');
var sinon = require('sinon');
require('jasmine-sinon');

describe('transcription_module.js', function() {

	var fakeCookie = {
    cookies: [],
    set: function (k, v) {
        this.cookies[k] = v;
    },
    get: function (k) {
        return this.cookies[k];
    },
    reset: function () {
        this.cookies = [];
    }
};

beforeEach(function() {
	//spyOn( myObj, 'populateData' ).andReturn( 'foobar' );

    var cookieStub = sinon.stub(jQuery, "cookie", function() {
        if (arguments.length > 1) {
            fakeCookie.set(arguments[0], arguments[1]);
        }
        else {
            return fakeCookie.get(arguments[0]);
        }
    });
});

	var jsonStringAdv="{\"2\":{\"1\":{\"allow_user_input\":0,\"name\":\"tense\",\"values\":{\"present ind\":[[2,\"person\"]],\"past ind\":[],\"present perfect\":[],\"past perfect\":[]}},\"2\":{\"allow_user_input\":0,\"name\":\"person\",\"values\":{\"1\":[[3,\"number\"]],\"2\":[],\"3\":[]}},\"3\":{\"allow_user_input\":0,\"name\":\"number\",\"values\":{\"sg\":[],\"pl\":[]}}}}";
	$('<div class="categoryTypesDivAdv">'+jsonStringAdv+'</div>').appendTo('body');

	Cookies.set("use_advanced_mode", 1, { expires: 365 });

	var transcriptionModule = Object.create(TranscriptionModule);
	transcriptionModule.init();

  //what it should do
  it ( 'buttonFunction', function(){      
      //expect something 
      expect(buttonFunction()).toEqual(0);
  });
});