let net;

let transferNet;

async function app() {
  console.log('Loading mobilenet..');

  // Load the model.
  net = await mobilenet.load();
  console.log('Sucessfully loaded model');

  // const imgEl = document.getElementById('img');
  // const result = net.infer(imgEl);

    // transferNet = tf.sequential({
    //  layers: [
    //    tf.layers.dense({inputShape: [1000], units: 32, activation: 'relu'}),
    //    tf.layers.dense({units: 10, activation: 'softmax'}),
    //  ]
    // });

  // const addExample = classId => {
  //   // Get the intermediate activation of MobileNet 'conv_preds' and pass that
  //   // to the KNN classifier.
  //   const activation = net.infer(webcamElement, 'conv_preds');
  //
  //   // Pass the intermediate activation to the classifier.
  //   classifier.addExample(activation, classId);
  // };

  // Make a prediction through the model on our image.
  // console.log(result);
}

app();


let addClassButton = document.getElementById("addClass")
let iiii = 0;
addClassButton.addEventListener("click", ()=>{
    var tbl = document.getElementById('trainingData'); // table reference
    // open loop for each row and append cell
    iiii++;
    createCell(tbl.rows[0].insertCell(tbl.rows[0].cells.length), 'col');
});

// '<input type="file" id="files" name="files[]" multiple /><output id="list"></output>'

// create DIV element and append to the table cell
function createCell(cell, style) {
    var div = document.createElement('div'); // create DIV element
    //div.textContent = i;
    div.innerHTML = '<input type="file" id="files-'+iiii.toString()+'" name="files[]" multiple /><output id="list'+iiii.toString()+'"></output>';
    div.addEventListener('change', handleFileSelect, false);
    div.setAttribute('class', style);        // set DIV class attribute
    div.setAttribute('className', style);    // set DIV class attribute for IE (?!)
    cell.appendChild(div);                   // append DIV to the table cell
}

function handleFileSelect(evt) {
    var files = evt.target.files; // FileList object

    // Loop through the FileList and render image files as thumbnails.
    for (var i = 0, f; f = files[i]; i++) {

      // Only process image files.
      if (!f.type.match('image.*')) {
        continue;
      }

      var reader = new FileReader();

      // Closure to capture the file information.
      reader.onload = (function(theFile) {
        return function(e) {
          // Render thumbnail.
          var span = document.createElement('span');
          span.innerHTML = ['<img width=100px height=100px class="thumb" src="', e.target.result,
                            '" title="', escape(theFile.name), '"/>'].join('');

          let id = 'list' + evt.target.id.substring(evt.target.id.search('-') + 1, evt.target.id.length)
          console.log('id ' + id);
          document.getElementById(id).insertBefore(span, null);
        };
      })(f);

      // Read in the image file as a data URL.
      var img = reader.readAsDataURL(f);
    }
}

document.getElementById('files-0').addEventListener('change', handleFileSelect, false);

let predict = document.getElementById("predict");
let predict_button = document.getElementById("pred_button")

predict_button.addEventListener("click", ()=>{
    document.getElementById('predict').click();
});

predict.addEventListener("change", ()=>{
    var file    = document.querySelector('input[type=file]').files[0];
    var reader  = new FileReader();
    var img = document.getElementById('predict_image');

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

    if (file) {
        reader.readAsDataURL(file); //reads the data as a URL
    }

});
