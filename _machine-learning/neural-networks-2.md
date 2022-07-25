---
---

## Bias term

In our setup so far, at each layer $\ell$ the inputs $a^{[\ell-1]}$ are matrix-multiplied by a set of weights, to produce the $z$ values i.e.

$$
z_i^{[\ell]}={a^{[\ell-1]}}^T\cdot w_i
$$

Like we did in linear regression, we typically also add a bias term to this so that we have

$$
z_i^{[\ell]}={a^{[\ell-1]}}^T\cdot w_i+b_i^{[\ell]}
$$

Again, like we did in linear regression, an easy way to account for this is to add an extra component to all the inputs with a constant value of 1, and add an extra component to the weights. In our vectorized setup, this would correspond with adding an extra column of 1s at the far right of each $A^{[\ell-1]}$, and the weight matrices $W^{[\ell]}$ having an extra row at the bottom. The bias terms would then be updated by gradient descent in the same way the weight terms are updated.

Alternatively, we can explicitly write out the equations involving the bias term and compute the partial derivatives explicitly. In vectorized form, arrange the $b_i^{[\ell]}$ into a row vector

$$
b^{[\ell]}=\begin{bmatrix}
b_1^{[\ell]}&
b_2^{[\ell]}&
\cdots&
b_{n^{[\ell]}}^{[\ell]}
\end{bmatrix}
$$

Then compute

$$
Z^{[\ell]}={A^{[\ell-1]}}^T\cdot W+b^{[\ell]}
$$

where the addition here is between a matrix and a row vector, and is interpreted to mean that the addition is broadcasted over all the rows of the matrix i.e. the addition looks like

$$
Z^{[\ell]}={A^{[\ell-1]}}^T\cdot W+\begin{bmatrix}
\rule[.5ex]{2.5ex}{0.5pt}b^{[\ell]}\rule[.5ex]{2.5ex}{0.5pt}\\
\vdots\\
\rule[.5ex]{2.5ex}{0.5pt}b^{[\ell]}\rule[.5ex]{2.5ex}{0.5pt}\\
\end{bmatrix}
$$

### Matrix calculus: broadcasted addition

We now need to work out what the derivative of broadcast addition looks like within our matrix calculus frameowrk. Following the notation from our framework, let

$$
G:X\mapsto C+X
$$

where $X\in\mathbb R^{1\times n}$ is a row vector, $C\in\mathbb R^{m\times n}$ is a constant matrix, and the addition is broadcasted. If $f$ is a matrix-to-scalar function taking $G$ as input, then


$$
\begin{align*}
\frac{df}{dX_{1,j}}&=\sum_{k,\ell}\frac{df}{dG_{k,\ell}}\cdot\frac{dG_{k,\ell}}{dX_{1,j}}\tag{multivariable chain rule}\\
&=\sum_{k,\ell}\frac{df}{dG_{k,\ell}}\cdot\frac{d}{dX_{1,j}}(C_{k,\ell}+X_{1,\ell})\\
&=\sum_{k,\ell}\frac{df}{dG_{k,\ell}}\cdot 1_{\ell=j}\\
&=\sum_{k}\frac{df}{dG_{k,j}}\\
\implies \frac{df}{dX}&=\sum_{\text{rows}}\frac{df}{dG}.
\end{align*}
$$

Analogously, we can look at columnwise broadcasting. If

$$
G:X\mapsto C+X
$$

where $X\in\mathbb R^{m\times 1}$ is a *column* vector, $C\in\mathbb R^{m\times n}$, and the addition is broadcasted, then using similar reasoning,

$$
\frac{df}{dX}=\sum_{\text{columns}}\frac{df}{dG}.
$$

### Tying things together

We can now go back to what we were doing before. Recall we had

$$
Z^{[\ell]}={A^{[\ell-1]}}^T\cdot W+b^{[\ell]}
$$

where the addition is broadcasted between a matrix and row vector. Then our results above tell us that (with $G:b^{[\ell]}\mapsto {A^{[\ell-1]}}^T\cdot W+b^{[\ell]}=Z^{[\ell]}$ and $f:Z^{[\ell]}\mapsto\cdots$)

$$
\frac{df}{db^{[\ell]}}=\sum_{\text{rows}}\frac{df}{dZ^{[\ell]}}
$$

## Regression with multiple outputs

So far our neural network has been predicting a single real value. Sometimes we may want to have multiple outputs i.e. $y^{(i)}\in\mathbb R^n$. Previously, we minimized the mean squared error between the model's predictions and the actual values, where the error was simply the difference between the predictions and true values $\hat y^{(i)}-y^{(i)}$. When the output is a vector, we can extend this to the $L_2$ norm between the predictions and true values


$$
f(W)=\frac 1m\sum_{i=1}^m\Vert \hat y^{(i)}-y^{(i)}\Vert_2^2
$$


To vectorize the setup, place the $y^{(i)}$ as rows of a matrix $Y$ as before:


$$
Y=\begin{bmatrix}
\rule[.5ex]{2.5ex}{0.5pt}{y^{(1)}}^T\rule[.5ex]{2.5ex}{0.5pt}\\
\vdots\\
\rule[.5ex]{2.5ex}{0.5pt}{y^{(m)}}^T\rule[.5ex]{2.5ex}{0.5pt}\\
\end{bmatrix}.
$$


The weight matrix in the last layer will need to have its shape suitably adjusted to produce predictions of the correct shape. Then the loss function in vectorized form becomes


$$
\frac 1m \Vert A^{[L]}-Y\Vert_F^2
$$
which is the same as what we had before. Recall, however, that when we had a scalar output, $A^{[L]}-Y$ was a column vector in disguise and taking the Frobenius norm was really the same as taking the $L_2$ norm. Now, $A^{[L]}-Y$ is a proper matrix and we take the Frobenius norm of this matrix.

## Binary classification

We have looked at how to do regression: predicting a real value (or vector of real values). Sometimes we want to perform classification instead, where we classify an example into one out of a discrete number of classes. We start with the simplest of these: binary classification. Here there are two classes and we want to predict which class an example falls into. 

The way this is typically done is to take our setup for a neural network for regression with a scalar output, and use a sigmoid function as activation for the last layer so that the output lies in the range $[0,1]$. Examples with a prediction closer to 0 fall into one class, and examples with a prediction closer to 1 fall into the other. 

Also, instead of using mean squared error as the loss, we typically use binary cross-entropy instead. For a single example, binary cross-entropy is defined as


$$
-y^{(i)}\log_2\hat y^{(i)}-(1-y^{(i)})\log_2(1-\hat y^{(i)})
$$


which is equivalent to


$$
\begin{cases}
-\log_2\hat y ^{(i)},&y^{(i)}=1\\
-\log_2(1-\hat y^{(i)}),&y^{(i)}=0
\end{cases}
$$


Using this form, we see that if the true value is 1 ($y^{(i)}=1$) then if the prediction is also 1, the loss is 0. However, as the predicted value approaches 0, the binary cross-entropy approaches positive infinity. Conversely, if the true value is 0 ($y^{(i)}=0$) then if the prediction is also 0, the loss is 0. As the predicted value approaches 1, the binary cross-entropy again approaches positive infinity.

We will use the first form from here, however, as this expresses binary cross-entropy as a differentiable function.

Taking into account all the training examples, we want to find weights so as to minimize the mean binary cross-entropy over all the training examples


$$
f(W)=\frac 1m\sum_{i=1}^m\left[-y^{(i)}\log_2\hat y^{(i)}-(1-y^{(i)})\log_2(1-\hat y^{(i)})\right]
$$


Since the $y^{(i)}$ and $\hat y^{(i)}$ are arranged as rows in the matrices $Y$ and $A^{[L]}$ respectively, we have


$$
\begin{align*}
f(W)&=\frac 1m\sum_{i=1}^m\left(-Y_i\log_2 A^{[L]}_i-(1-Y_i)\log_2(1-A^{[L]}_i)\right)\\
&=-\frac 1m\left(\left(\sum_{i=1}^mY_i\log_2 A^{[L]}_i\right)+\left(\sum_{i=1}^m(1-Y_i)\log_2(1-A^{[L]}_i)\right)\right)\\
&=-\frac 1m\left(Y^T\cdot\log_2\circ A^{[L]}+(1-Y)^T\cdot\log_2\circ (1-A^{[L]})\right)
\end{align*}
$$


Taking the partial derivative with respect to $A^{L}$ using our matrix calculus framework gives


$$
\begin{align*}
\frac{df}{dA^{[L]}}&=-\frac 1m\left(\frac{d}{dA^{[L]}}\left(Y^T\cdot \log_2\circ A^{[L]}\right)+\frac{d}{dA^{[L]}}\left((1-Y)^T\cdot \log_2\circ (1-A^{[L]})\right)\right)\\
&=-\frac 1m\left(Y\cdot\frac{d}{dA^{[L]}}\left(\log_2\circ A^{[L]}\right)+(1-Y)\cdot\frac{d}{dA^{[L]}}\left(\log_2\circ(1-A^{[L]}\right)\right)\\
&=-\frac 1m\left(Y\cdot\frac{1}{\ln 2}\oslash A^{[L]}+(1-Y)\cdot\frac{-1}{\ln 2}\oslash(1-A^{[L]})\right)\\
&=\frac{1}{m\ln 2}\left((1-Y)\oslash(1-A^{[L]})-Y\oslash A^{[L]}\right)
\end{align*}
$$


Since we are using the sigmoid activation function for the last layer, we have


$$
A^{[L]}=\sigma\circ Z^{[L]}
$$


and we also have (exercise for the reader)


$$
\sigma'=\sigma\cdot (1-\sigma)
$$


We can then simplifiy $\frac{df}{dZ^{[L]}}$ as follows


$$
\begin{align*}
\frac{df}{dZ^{[L]}}&=\frac{df}{dA^{[L]}}\odot (\sigma'\circ Z^{[L]})\\
&=\frac{1}{m\ln 2}\left((1-Y)\oslash(1-A^{[L]})-Y\oslash A^{[L]}\right)\odot (\sigma\circ Z^{[L]})\odot ((1-\sigma)\circ Z^{[L]})\\
&=\frac{1}{m\ln 2}\left((1-Y)\oslash(1-A^{[L]})-Y\oslash A^{[L]}\right)\odot A^{[L]}\odot (1-A^{[L]})\\
&=\frac{1}{m\ln 2}\left((1-Y)\odot A^{[L]}-Y\odot (1-A^{[L]})\right)
\end{align*}
$$

## Multi-class classification

