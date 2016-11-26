var fileUpload= function (options) {

	var required=['input','uploadTrigger','uploadHeaders','uploadUrl','success','error'];

	if(!options.hasOwnProperty('input') || !options.hasOwnProperty('uploadTrigger') || !options.hasOwnProperty('uploadUrl') || !options.hasOwnProperty('uploadHeaders') || !options.hasOwnProperty('uploadHeaders') || !options.hasOwnProperty('succes') || !options.hasOwnProperty('error'))
		throw {msg:'Required properties'+required.join(',') +' not found.'};

	$(options.input).addClass('no-file-added');

	var Upload = {

		inputChangeHandle: function (ctx,next) {
			$(options.input).on('change',function (val) {
				$(options.input).removeClass('no-file-added');
			});

			next();
		},

		uploadFile: function (val) {
			return $.ajax({
			    url: options.uploadUrl,
			    type:'post',
			    data: val,
			    // THIS MUST BE DONE FOR FILE UPLOADING
			    contentType: false,
			    processData: false,
			    headers: options.uploadHeaders
			    // ... Other options like success and etc
			}).promise();
		},

		uploadHandler: function (ctx,next) {
			var uploadButtonPressed= false;

			//Upload Trigger Button Click Handler
			$(options.uploadTrigger).click(function () {
				new Promise(function (resolve,reject) {
					if($(options.input).hasClass('no-file-added'))
						return resolve(false);
					else
					{
						return resolve(true);
					}
				})
				.then(function (val) {
					if(uploadButtonPressed === false && val)
					{
						var formData = new FormData();
						formData.append('file', $(options.input)[0].files[0]);
						return resolve(formData);
					}
					else
						return null;
				})
				.then(function (val) {
					if(uploadButtonPressed === false && val)
					{
						uploadButtonPressed= true;
						return Upload.uploadFile(val);
					}
					else
						return null;
				})
				.then(function (val) {
					if(val)
					{
						options.success(val);
						uploadButtonPressed= false;
					}
				})
				.catch(function (err) {
					options.error(err);
					uploadButtonPressed= false;
				});
			});

			next();
		}
	};


	return [
		Upload.inputChangeHandle,
		Upload.uploadHandler
	];
};

module.exports = fileUpload;