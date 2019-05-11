let predict = document.getElementById("predict");
let predict_button = document.getElementById("pred_button")

let net;

async function app() {
  console.log('Loading mobilenet..');

  // Load the model.
  net = await mobilenet.load();
  console.log('Sucessfully loaded model');
}

app();

///////////////////////////////////////////////////////////////////////////////
//                                  TRAIN                                    //
///////////////////////////////////////////////////////////////////////////////

train_button.addEventListener("click", ()=>{
    document.getElementById('train').click();
});

train.addEventListener("change", ()=>{
    var zip = new JSZip();
    // read zip file
    zip.loadAsync( document.querySelector('input[type=file]').files[0] /* = file blob */)
       .then(function(zip) {
           // process ZIP file content here

           // iterate through
           console.log(zip.files)

           // alert("OK")
       }, function() {alert("Not a valid zip file")});
});

///////////////////////////////////////////////////////////////////////////////
//                                 PREDICT                                   //
///////////////////////////////////////////////////////////////////////////////

predict_button.addEventListener("click", ()=>{
    document.getElementById('predict').click();
});

predict.addEventListener("change", ()=>{
    // var file = document.querySelector('input[type=file]').files[0];

    // var zip = new JSZip();
    //   zip.loadAsync( document.querySelector('input[type=file]').files[0] /* = file blob */)
    //      .then(function(zip) {
    //          // process ZIP file content here
    //          alert("OK")
    //      }, function() {alert("Not a valid zip file")});
    //
    // console.log(zip)
    // console.log(typeof zip)

    var reader  = new FileReader();
    var img = document.getElementById('predict_image');

    if (file) {
        reader.readAsDataURL(file); //reads the data as a URL
    }

    reader.onloadend = function () {
        img.src = reader.result;
        // Load the model.
        net.classify(img).then(predictions => {
        console.log('Predictions: ');
        console.log(predictions);
        pred = "";
        for(let pred of predictions){
            let p = document.createElement('p');
            p.innerHTML = pred.className + " " + pred.probability;
            document.getElementById("pred_output").appendChild(p);
        }

        });

    }



});
