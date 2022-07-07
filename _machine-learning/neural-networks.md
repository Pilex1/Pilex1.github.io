---
---

# WIP

Neural networks and deep learning are an active research topic. We focus here on understanding the simplest types of neural networks which are feedforward fully-connected neural networks, and we will focus on using them for supervised learning. 

We start off with a regression problem, similar to what we had for linear regression. As before, suppose we are given $m$ training example pairs $x^{(i)},y^{(i)}$ for $i=1,\cdots,m$ where $x^{(i)}\in\mathbb R^{ n},y^{(i)}\in\mathbb R$ and we want to predict $y$ from $x$. In linear regression we used a linear (technically, affine) function to predict $y$ from $x$ by making the prediction $\hat y=w^T\cdot x$. Of course, this won't work too well when there is non-linearity in the data. To model some non-linearity we introduce a nonlinear activation function $g:\mathbb R\to\mathbb R$ that we apply to $w^T\cdot x$, which gives us


$$
a=g(w^T\cdot x)
$$


which is called the activation value. Common choices for $g$ include the sigmoid function $g(x)=\frac{1}{1+e^{-x}}$ or the ReLU function $g(x)=\max(0,x)$.

Unlike linear regression, we will use *multiple* sets of weights. Call the first set of weights $w_1$ and the first activation value $a_1$ so that


$$
a_1=g(w_1^T\cdot x).
$$



We can apply the same process with a different set of weights $w_2$ and obtain a different activation value



$$
a_2=g(w_2^T\cdot x)
$$



and so on. Let $n^{[1]}$ denote the number of different weights we used. Then in general we compute



$$
a_i=g(w_i^T\cdot x)
$$



for $i=1,2,\cdots,n^{[1]}$. To summarise, the setup we have currently looks like this

{% include image.html src="nn-one-layer.png" caption="One layer neural network." %}

We call this a neural network with one layer. The circles or activation values are the "neurons" or nodes in the network.

We can add more layers by considering all the activation values as a vector $a^{[1]}\in\mathbb R^{n^{[1]}}$ and treating it as an input and repeating the same process. That is, we have a set of new weights, say $w^{[2]}\_1,w^{[2]}_2,\cdots,w^{[2]}\_{n^{[2]}}$ and we compute the activation values in the second layer as


$$
a_i^{[2]}=g^{[2]}({w^{[2]}_i}^T\cdot a).
$$


The superscript of $[2]$ denotes which layer we are considering so $w^{[2]}$ are the weights of the second layer, $g^{[2]}$ is the activation function in the second layer and $a^{[2]}$ are the activation values in the second layer.

{% include image.html src="nn-two-layer.png" caption="Two layer neural network" %}

We can keep adding more layers to our network by using the activations of the last layer as inputs to the next layer. However, at the end of the day we want to be predicting a single real value $y\in\mathbb R$. Hence we want the last layer to have a single node. For the last layer we may or may not want an activation function, depending on the desired output value. For example, if the prediction $\hat y$ should lie in $[0,1]$ then we should apply a sigmoid activation function. However if instead the predicted output can be any real number, then an activation function like sigmoid should not be applied as that would restrict the predicted output to always lie in $[0,1]$.

{% include image.html src="nn-final-layer.png" %}