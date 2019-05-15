let net;
async function init() {
    console.log('Loading mobilenet...');
    // Load the model.
    net = await mobilenet.load();
    console.log('Loaded model');
}

init();


let addClassButton = document.getElementById("addClass")
let numClasses = 0;
addClassButton.addEventListener("click", ()=>{
    var tbl = document.getElementById('trainingData'); // table reference
    // open loop for each row and append cell
    numClasses++;
    createCell(tbl.rows[0].insertCell(tbl.rows[0].cells.length), 'col');
});

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

let train_button = document.getElementById("train_button");
let transferNet;
train_button.addEventListener("click", ()=>{
    transferNet = tf.sequential({
        layers: [
            tf.layers.dense({inputShape: [1024], units: 32, activation: 'relu'}),
            tf.layers.dense({units: numClasses + 1, activation: 'softmax'})
        ]
    });
    console.log('Training...')
    console.log('Adding examples...')
    let xArray = [];
    let yArray = [];
    for (let i = 0; i <= numClasses; i++) {
        for (let j of document.getElementById("list"+parseInt(i)).children) {
            const activation = net.infer(j.children[0], 'conv_preds');
            xArray.push(activation);
            yArray.push(i);
        }
    }
    const xDataset = tf.data.array(xArray);
    const yDataset = tf.data.array(yArray);
    const xyDataset = tf.data.zip({xs: xDataset, ys: yDataset});//.batch(4).shuffle(4);
    console.log('Added examples');
    transferNet.compile({optimizer: 'sgd', loss: 'meanSquaredError'});
    const history = transferNet.fitDataset(xyDataset, {
      epochs: 4,
      callbacks: {onEpochEnd: (epoch, logs) => console.log(logs.loss)}
    });
    //     .then(() => {
    //     console.log('Done Training');
    // });
});