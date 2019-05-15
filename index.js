let net;
async function init() {
    console.log('Loading mobilenet...');
    // Load the model.
    net = await mobilenet.load();
    var elem = document.getElementById("loading_screen");
    elem.parentNode.removeChild(elem);
}

init();


let addClassButton = document.getElementById("addClass")
let numClasses = 0;
addClassButton.addEventListener("click", ()=>{
    var tbl = document.getElementById('trainingData'); // table reference
    // open loop for each row and append cell
    numClasses++;
    createCell(tbl.rows[0].insertCell(tbl.rows[0].cells.length), 'col');
    createCell2(tbl.rows[1].insertCell(tbl.rows[1].cells.length), 'col');
});

// create DIV element and append to the table cell
function createCell2(cell, style) {
    var div = document.createElement('div'); // create DIV element
    div.addEventListener('change', handleFileSelect, false);
    div.setAttribute('id', 'predict-'+numClasses.toString()); 
    div.setAttribute('class', style);        // set DIV class attribute
    div.setAttribute('className', style);    // set DIV class attribute for IE (?!)
    cell.appendChild(div);                   // append DIV to the table cell
}


// '<input type="file" id="files" name="files[]" multiple /><output id="list"></output>'

// create DIV element and append to the table cell
function createCell(cell, style) {
    var div = document.createElement('div'); // create DIV element
    //div.textContent = i;
    div.innerHTML = '<input type="file" id="files-'+numClasses.toString()+'" name="files[]" multiple /><output id="list'+numClasses.toString()+'"></output>';
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
          document.getElementById(id).insertBefore(span, null);
        };
      })(f);

      // Read in the image file as a data URL.
      var img = reader.readAsDataURL(f);
    }
}

let predictedClass;
let pred_class;
async function predictHandle(){
    let c = transferNet.predict(net.infer(document.getElementById('predict_image'), 'conv_preds'));
    pred_class = c.argMax(1);
    predictedClass = await pred_class.array();
    //let pp = document.createElement('p');
    //pp.innerHTML = pred_class.toString() + " " + c.toString();
    //document.getElementById("pred_output").appendChild(pp);

    if(document.getElementById('loaded_pred').children[1].style.visibility != 'hidden'){
        let cell_pred_out = document.getElementById("predict-" + predictedClass);
        console.log(cell_pred_out);
        var img = document.createElement("img");
        img.width = 100;
        img.height = 100;
        img.src = document.getElementById('loaded_pred').children[1].src;
        cell_pred_out.appendChild(img);
    
        document.getElementById('loaded_pred').children[1].src = "";
        document.getElementById('loaded_pred').children[1].style.visibility = 'hidden';
    }

}

function loadHandle(evt){
  var file    = evt.target.files[0];
  var reader  = new FileReader();
  var img = document.getElementById('predict_image');

  reader.onloadend = function () {
      console.log("loaded");
      img.id = "predict_image";
      img.src = reader.result;
      img.width = 100;
      img.height = 100;
      img.style.visibility = 'visible';

  }

  if (file) {
      reader.readAsDataURL(file); //reads the data as a URL
  }
}


document.getElementById('files-0').addEventListener('change', handleFileSelect, false);

let predict_button = document.getElementById("pred_button");
predict_button.addEventListener("click", predictHandle, false);

let predict = document.getElementById("predict");
predict.addEventListener('change', loadHandle, false);

let load_button = document.getElementById("load_model");
load_button.addEventListener("click", ()=>{
    document.getElementById('predict').click();
});

let train_button = document.getElementById("train_button");
let transferNet;
let kClassifier;
train_button.addEventListener("click", ()=>{
    console.log('Training...')
    console.log('Adding examples...')
    let xArray = [];
    let yArray = [];
    kClassifier = knnClassifier.create();
    for (let i = 0; i <= numClasses; i++) {
        for (let j of document.getElementById("list"+parseInt(i)).children) {
            const activation = net.infer(j.children[0], 'conv_preds');
            xArray.push(activation);
            yArray.push(i);
            kClassifier.addExample(activation, i);
        }
    }
    const xDataset = tf.data.array(xArray);
    const yDataset = tf.data.array(yArray);
    const xyDataset = tf.data.zip({xs: xDataset, ys: yDataset}).batch(3);
    console.log('Added examples');

    transferNet = tf.sequential({
        layers: [
            tf.layers.dense({inputShape: [1024], units: 64, activation: 'relu'}),
            tf.layers.dense({units: 32, activation: 'relu'}),
            tf.layers.dense({units: numClasses + 1, activation: 'softmax'})
        ]
    });
    transferNet.compile({optimizer: tf.train.adam(0.001), loss: 'sparseCategoricalCrossentropy'});
    const history = transferNet.fitDataset(xyDataset, {
      epochs: 10,
      callbacks: {onEpochEnd: (epoch, logs) => console.log(logs.loss)}
    });
});
