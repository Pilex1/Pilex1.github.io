---
---

# Work in progress

Neural networks and deep learning are an active research topic. We focus here on understanding the simplest types of neural networks which are feedforward fully-connected neural networks, and we will focus on using them for supervised learning. 

## Basics

We start off with a regression problem, similar to what we had for linear regression. As before, suppose we are given $m$ training example pairs $x^{(i)},y^{(i)}$ for $i=1,\cdots,m$ where $x^{(i)}\in\mathbb R^{ n},y^{(i)}\in\mathbb R$ and we want to predict $y$ from $x$. In linear regression we used a linear (technically, affine) function to predict $y$ from $x$ by making the prediction $\hat y=w^T\cdot x$. In order to simplify notation later on, we will write this instead as $\hat y=x^T\cdot w$.

Of course, if the relationship between $y$ and $x$ is non-linear, then this model will not perform very well. In order to introduce some non-linearity to our model, we introduce a non-linear activation function $g:\mathbb R\to\mathbb R$ that we apply to $x^T\cdot w$, which gives us


$$
a=g(x^T\cdot w)
$$


which is called the activation value. Common choices for $g$ include the sigmoid function $g(x)=\frac{1}{1+e^{-x}}$ or the ReLU function $g(x)=\max(0,x)$.

Unlike linear regression, we will use *multiple* sets of weights. Call the first set of weights $w_1$ and the first activation value $a_1$ so that


$$
a_1=g(x\cdot w_1^T).
$$



We can apply the same process with a different set of weights $w_2$ and obtain a different activation value



$$
a_2=g(x\cdot w_2^T)
$$



and so on. Let $n^{[1]}$ denote the number of different weights we used. Then in general we compute



$$
a_i=g(x\cdot w_i^T)
$$



for $i=1,2,\cdots,n^{[1]}$. To summarise, the setup we have currently looks like this

{% include image.html src="nn-one-layer.png" caption="One layer neural network." %}

We call this a neural network with one layer. The circles or activation values are the "neurons" or nodes in the network.

We can add more layers by considering all the activation values as a vector $a^{[1]}\in\mathbb R^{n^{[1]}}$, treating it as an input, and repeating the same process. That is, we have a set of new weights, say $w^{[2]}\_1,w^{[2]}_2,\cdots,w^{[2]}\_{n^{[2]}}$ and we compute the activation values in the second layer as


$$
a_i^{[2]}=g^{[2]}({a^{[1]}}^T\cdot w_i^{[2]}).
$$


The superscript of $[2]$ denotes which layer we are considering so $w^{[2]}$ are the weights of the second layer, $g^{[2]}$ is the activation function in the second layer and $a^{[2]}$ are the activation values in the second layer.

{% include image.html src="nn-two-layer.png" caption="Two layer neural network" %}

We can keep adding more layers to our network by using the activations of the last layer as inputs to the next layer. However, at the end of the day we want to be predicting a single real value $y\in\mathbb R$. Hence for the last layer we have just a single node, and the value of that node is the model's prediction. Also, for the last layer we have to pay a bit more attention to the activation function; for example, if the prediction $\hat y$ should lie in $[0,1]$ then we should apply a sigmoid activation function. However if instead the predicted output can be any real number, then an activation function like sigmoid should *not* be applied as that would restrict the predicted output to always lie in $[0,1]$.

{% include image.html src="nn-final-layer.png" %}

## Vectorization

And that's all a neural network is! Before we proceed any further, we will vectorize our setup, like we did for linear regression. Recall that we have $m$ training examples pairs $\\{(x_i,y_i)\\}_{i=1}^m$ for $x_i\in\mathbb R^n,y_i\in\mathbb R$. As we did for linear regression, arrange the $x_i$ as rows of a matrix $X$ and similarly arrange the $y_i$ as rows of a matrix $Y$. Explicitly, 


$$
X=\begin{bmatrix}
\rule[.5ex]{2.5ex}{0.5pt}{x^{(1)}}^T\rule[.5ex]{2.5ex}{0.5pt}\\
\vdots\\
\rule[.5ex]{2.5ex}{0.5pt}{x^{(m)}}^T\rule[.5ex]{2.5ex}{0.5pt}\\
\end{bmatrix}.
$$


and


$$
Y=\begin{bmatrix}
y^{(1)}\\
\vdots\\
y^{(m)}
\end{bmatrix}.
$$


Now, we arrange the weights of the first layer as *columns* of a matrix $W^{[1]}$ i.e.


$$
W^{[1]}=\begin{bmatrix}
{\rule[-1ex]{0.5pt}{2.5ex}}&&{\rule[-1ex]{0.5pt}{2.5ex}}\\
w_1^{[1]}&\cdots&w_{n^{[1]}}^{[1]}\\
{\rule[-1ex]{0.5pt}{2.5ex}}&&{\rule[-1ex]{0.5pt}{2.5ex}}
\end{bmatrix}.
$$


Matrix multiply $X$ and $W^{[1]}$, and apply the activation function $g^{[1]}$ elementwise to each component of the resulting matrix, to get a new matrix


$$
A^{[1]}=g^{[1]}\circ (X\cdot W^{[1]})
$$


What's really neat about this is that because of how matrix multiplication works, we actually have


$$
A^{[1]}=\begin{bmatrix}
\rule[.5ex]{2.5ex}{0.5pt}{a^{(1)[1]}}^T\rule[.5ex]{2.5ex}{0.5pt}\\
\vdots\\
\rule[.5ex]{2.5ex}{0.5pt}{a^{(m)[1]}}^T\rule[.5ex]{2.5ex}{0.5pt}\\
\end{bmatrix}
$$


i.e. the $i$th row of $A^{[1]}$ give us the activation values in the first layer of training example $i$.

We can do this process for all layers so that in general, at layer $\ell$ we have


$$

A^{[\ell]}=g^{[\ell]}\circ (A^{[\ell-1]}\cdot W^{[\ell]})=\begin{bmatrix}
\rule[.5ex]{2.5ex}{0.5pt}{a^{(1)[\ell]}}^T\rule[.5ex]{2.5ex}{0.5pt}\\
\vdots\\
\rule[.5ex]{2.5ex}{0.5pt}{a^{(m)[\ell]}}^T\rule[.5ex]{2.5ex}{0.5pt}\\
\end{bmatrix}
$$

## Gradient descent

The hard part though is figuring out what values we should set the weights $w_1^{[1]},w_2^{[1]},\cdots,w_{n^{[1]}}^{[1]},w_1^{[2]},w_2^{[2]},\cdots,w_{n^{[2]}}^{[2]},\cdots$ to. In our setup for linear regression, we picked $w$ so as to minimize the mean squared error over all the training examples


$$
f(w)=\frac 1m\sum_{i=1}^m(\hat y ^{(i)}-y^{(i)})^2
$$


where $\hat y^{(i)}$ denotes the predicted value and is dependent on $w$, and $y^{(i)}$ denotes the true value. In linear regression, we were able to explicitly solve for $w$ by finding the critical points of the above function. This time around, however, we are not so lucky, and there is no closed form solution for our neural network setup. 

Instead we will approximate the optimal solution $w$ by using gradient descent. 