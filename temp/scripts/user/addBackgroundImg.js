const {post} = require("../config");
module.exports = async (file) => {
  try {
    const data = await post({
      url: "/users/me/profilePicture",
      data: file,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return data;
  } catch (error) {
    console.log(error);
  }
};

//THE response of addBackgroundImg is nothing
// otherwise u get an error !!

/*
//-----THE JS CODE to upload background pcture

document.addEventListener('submit', async (e) => {
        e.preventDefault();
        let formData = new FormData();
        let imagefile = document.querySelector('#file');
        formData.append("backgroundPicture", imagefile.files[0]);
        try {
            await addImg(formData);
            let data = await getOwnProfile();
            document.querySelector('#image').src = data.imgUrl;
        } catch (error) { console.log(error) }
    })

//-----THE HTML CODE to upload profile pcture
<form id="uploadForm" action='upload_file' role="form" method="post" enctype=multipart/form-data>
        <input type="file" id="file" name="profilePicture">
        <input type=submit value=Upload>
</form>
*/
