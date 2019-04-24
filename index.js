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
        mobilenet.load().then(model => {
            // Classify the image.
            model.classify(img).then(predictions => {
            console.log('Predictions: ');
            console.log(predictions);
            pred = "";
            for(let pred of predictions){
                let p = document.createElement('p');
                p.innerHTML = pred.className + " " + pred.probability;
                document.getElementById("pred_output").appendChild(p);
            }
            
            });
        });
        
    }

    if (file) {
        reader.readAsDataURL(file); //reads the data as a URL
    }

});
