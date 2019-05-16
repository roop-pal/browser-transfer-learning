# Authors
Robby Costales (rsc2156)
Vivek Kumar (vk2425)
Roop Pal (rpsomething)

# Browser Based Transfer Learning
An application for image classification which brings state-of-the-art machine learning algorithms to the public. This is accomplished using tensorflowjs and transfer learning.

# Running
To run this website locally, run in the current directory:

`python -m http.server`

Observe the hosted location and port, often localhost:8000, and navigate to this in a mobile browser.
Alternatively, you can access the hosted website at http://accessible-transfer-learning.s3-website-us-east-1.amazonaws.com/

# Evaluation Metrics
In terms of our project, we first evaluated our model based on actual data on a standard dataset like the Kaggle Flowers Dataset. Given MobileNet's high performance, we were unsurprised with high accuracies in the 90s.

What's more important is the performance on the job. As seen in our presentation, we tried taking photos with our phones and evaluating the classifier in our browsers! We found we could classify objects around us, even people!
