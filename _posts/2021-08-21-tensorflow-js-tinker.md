# Text Classifier in TensorFlow JS

I was tinkering around with TensorflowJS last week. You can check it out [here](https://github.com/parakalan/explore-tf-js). It is also hosted at Github pages [here](https://parakalan.github.io/explore-tf-js/).

It is a very simple text classifier model as of now. Get Universal Sentence Encoder (using the JS version from [here](https://github.com/tensorflow/tfjs-models/tree/master/universal-sentence-encoder)) embeddings for the documents and pass it through two dense layers and a softmax layer. Here is the model summary :-

```
_______________________________________________________________
Layer (type)                 Output shape              Param #
===============================================================
dense_Dense1 (Dense)         [batch_size,256]          131328
_______________________________________________________________
dense_Dense2 (Dense)         [batch_size,128]          32896
_______________________________________________________________
dropout_Dropout1 (Dropout)   [batch_size,128]          0
_______________________________________________________________
dense_Dense3 (Dense)         [batch_size,2]            258
===============================================================
Total params: 164482
Trainable params: 164482
Non-trainable params: 0
_______________________________________________________________

```
The embedding evaluation and the training happens on your browser! You can tryout with any text classification dataset. I tried out with a dataset of 5000 documents, took about 10 to 15 minutes for the training to complete. The batch size is tuned for not going out for memory, I'll make it configurable so if your PC has more compute power and memory you can increase them. I'd suggest to keep it the same though, I tried to increase on my Intel Core i9 16GB MacBook Pro, it overheated and restarted!

Here is a screenshot from training 100 epochs on Movie Review Dataset from [here](https://www.kaggle.com/c/sentiment-analysis-on-movie-reviews/data).

![100 epochs on Movie Review Dataset](/images/tf-js-complete.png)

Please feel free to raise an issue or give PRs to the [repo](https://github.com/parakalan/explore-tf-js). I am planning to add an image classifier using MobileNet / EfficientNet, as well as some unsupervised ML techniques like clustering.