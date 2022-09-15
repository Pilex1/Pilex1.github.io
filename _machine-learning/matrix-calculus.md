---
---

In the previous two articles on neural networks, I introduced a framework to compute the derivative of a function with respect to a matrix. This article is intended to summarise everything about this matrix calculus framework in one place; having said that, you do not need to have read those articles to understand the framework and I will re-iterate what I said previously. On the other hand, if you *have* read the articles on neural networks, you may want to skip the introduction.

## Introduction

### Motivation

It is often the case in machine learning that we want to optimize a real-valued objective function $f$ using gradient descent. Typically, $f$ may involve matrix operations and we may need to take the derivative of $f$ with respect to a matrix. For example, in a neural network with a single layer, we may have something like

$$
f(W)=\Vert g(X\cdot W)-Y \Vert_F^2
$$

where $X,W,Y$ are all matrices, $g:\mathbb R\to\mathbb R$ is being applied elementwise, and we want to compute

$$
\frac{df}{dW}.
$$

As another example, in dictionary learning we have the objective function

$$
f(D,R)=\Vert X-D\cdot R\Vert_F^2
$$

and we want to compute the two derivatives

$$
\frac{df}{dD},\frac{df}{dR}.
$$

In theory you could compute these by computing the derivative of each individual component of the matrix e.g. for the first example you would compute

$$
\frac{df}{dW_{i,j}}
$$

for all $i,j$; however this quickly becomes very cumbersome especially for more complicated functions. Instead, we would like to compute the matrix derivatives using only operations between matrices i.e. without resorting to having to compute the derivatives of the individual components.

### Setup

The function $f$ is essentially comprised of a series of matrix-to-matrix operations (e.g. matrix multiplication, or applying an elementwise function to a matrix), followed by a matrix-to-scalar function at the end (i.e. computing the Frobenius norm of a matrix). 

We will abstract this as follows: let $G$ be an arbitrary matrix-to-matrix function which takes input $X$, and $f$ be an arbitrary matrix-to-scalar function that takes as input $G$ i.e. we have $f(G(X))$ which is matrix-to-scalar. 

Our goal is to find a set of rules for computing

$$
\frac{df}{dX}
$$

in terms of the matrix $\frac{df}{dG}$ and the function $G$.

### Matrix-to-matrix derivatives

To do this, we first let $f$ be arbitrary and fix $G$. This is best explained by example. Below, $G:\mathbb R^{m\times n}\to\mathbb R^{m\times p}$ is the matrix-to-matrix function that takes its input $X$ and right-multiplies it by a constant matrix $W$ so that $G:X\mapsto X\cdot W$. For this particular $G$, we can calculate $\frac{df}{dX}$ as follows.


#### Right Matrix multiplication

$$
\begin{align*}
\frac{df}{dX_{i,j}}&=\sum_{k,\ell}\frac{df}{dG_{k,\ell}}\cdot\frac{dG_{k,\ell}}{dX_{i,j}}\tag{multivariable chain rule}\\
&=\sum_{k,\ell}\frac{df}{dG_{k,\ell}}\cdot\frac{d}{dX_{i,j}}(X_{k,1}W_{1,\ell}+X_{k,2}W_{2,\ell}+\cdots+X_{k,n}W_{n,\ell})\\
&=\sum_{k,\ell}\frac{df}{dG_{k,\ell}}\cdot 1_{k=i}\frac{d}{dX_{i,j}}(X_{k,j}W_{j,\ell})\\
&=\sum_\ell \frac{df}{dG_{i,\ell}}\cdot \frac{d}{dX_{i,j}}(X_{i,j}W_{j,\ell})\\
&=\sum_\ell \frac{df}{dG_{i,\ell}}\cdot W_{j,\ell}\\
&=\sum_\ell \frac{df}{dG_{i,\ell}}\cdot W_{\ell,j}^T\\
\implies \frac{df}{dX}&=\frac{df}{dG}\cdot W^T.
\end{align*}
$$

This is essentially a sort of "chain rule". We've written the derivative $\frac{df}{dX}$ in terms of $\frac{df}{dG}$ and $W$ (which comes from the function $G$). In a proper chain rule, we'd expect to see $\frac{dG}{dX}$ appearing somewhere; the right multiplication of $\frac{df}{dG}$ by $W^T$ takes on this role. It is not immediately clear how to define $\frac{dG}{dX}$ since $G$ is matrix-to-matrix and so $\frac{dG}{dX}$ would have to be 4 dimensional; hence I find it easier to write it in the form I have as above.

#### Left multiplication by matrix

Using a similar line of reasoning, one can show (exercise to the reader) that if


$$
\begin{align*}
G:X\mapsto W\cdot X\\
G:\mathbb R^{m\times n}\to\mathbb R^{p\times n}
\end{align*}
$$

where $W\in\mathbb R^{p\times m}$ is a constant, then


$$
\frac{df}{dX}=W^T\cdot\frac{df}{dG}.
$$

Notice here that our function $G$ is different; consequently the role of $\frac{dG}{dX}$ is now taken up by **left**-multiplying $\frac{df}{dG}$ by $W^T$. 

#### Elementwise function application

Here's a different example that involves applying a scalar-to-scalar function $g:\mathbb R\to\mathbb R$ elementwise to each entry of a matrix.

Let


$$
\begin{align*}
G:X\mapsto g(X)\\
g:\mathbb R\to\mathbb R,G:\mathbb R^{m\times n}\to\mathbb R^{m\times n}.
\end{align*}
$$

Then

$$
\begin{align*}
\frac{df}{dX_{i,j}}&=\sum_{k,\ell}\frac{df}{dG_{k,\ell}}\cdot\frac{dG_{k,\ell}}{dX_{i,j}}\tag{multivariable chain rule}\\
&=\sum_{k,\ell}\frac{df}{dG_{k,\ell}}\cdot\frac{d}{dX_{i,j}}g(X_{k,\ell})\\
&=\sum_{k,\ell}\frac{df}{dG_{k,\ell}}\cdot 1_{k=i,\ell=j}\frac{d}{dX_{i,j}}g(X_{k,\ell})\\
&=\frac{df}{dG_{i,j}}\cdot\frac{d}{dX_{i,j}}g(X_{i,j})\\
&=\frac{df}{dG_{i,j}}\cdot g'(X_{i,j})\\
\implies\frac{df}{dX}&=\frac{df}{dG}\odot (g' (X)).
\end{align*}
$$

where $\odot$ denotes the elementwise (Hadamard) product between two matrices. I want to point out again that now the role of $\frac{dG}{dX}$ is to elementwise multiply $\frac{df}{dG}$ by $g'(X)$.

#### Matrix addition

Here's one final (and simple) example that involves adding a constant matrix.


Let


$$
\begin{align*}
G:X\mapsto X+C\\
G:\mathbb R^{m\times n}\to\mathbb R^{m\times n}
\end{align*}
$$

where $C\in\mathbb R^{m\times n}$ is a constant. Then

$$
\begin{align*}
\frac{df}{dX_{i,j}}&=\sum_{k,\ell}\frac{df}{dG_{k,\ell}}\cdot\frac{dG_{k,\ell}}{dX_{i,j}}\tag{multivariate chain rule}\\
&=\sum_{k,\ell}\frac{df}{dG_{k,\ell}}\cdot\frac{d}{dX_{i,j}}(X_{k,\ell}+C_{k,\ell})\\
&=\sum_{k,\ell}\frac{df}{dG_{k,\ell}}\cdot 1_{k=i,\ell=j}\frac{d}{dX_{i,j}}(X_{k,\ell}+C_{k,\ell})\\
&=\frac{df}{dG_{i,j}}\cdot\frac{d}{dX_{i,j}}(X_{i,j}+C_{i,j})\\
&=\frac{df}{dG_{i,j}}\\
\implies \frac{df}{dX}&=\frac{df}{dG}.
\end{align*}
$$

This is just a fancy way of saying that adding constants does not change the derivative.

### Matrix-to-scalar derivatives

So far we have written $\frac{df}{dX}$ in terms of $\frac{df}{dG}$. I now explain how to compute $\frac{df}{dG}$. We now let $G$ be arbitrary and fix $f$. In the below example $f$ computes the squared Frobenius norm.


#### Squared Frobenius norm


Let

$$
\begin{align*}
f:G\mapsto \Vert G\Vert_F^2\\
f:\mathbb R^{m\times n}\to\mathbb R
\end{align*}
$$

Then

$$
\begin{align*}
\frac{df}{dG_{i,j}}&=\frac{d}{dG_{i,j}}\sum_{k,\ell}G_{k,\ell}^2\\
&=\frac{d}{dG_{i,j}}G_{i,j}^2\\
&=2G_{i,j}\\
\implies \frac{df}{dG}&=2G.
\end{align*}
$$

### Computing the derivatives

We now have the tools necessary to go back to our two examples and compute matrix derivatives! 

#### Neural network example

For the neural network example, we have


$$
\begin{align}
\frac{df}{dW}&=\frac{d(\Vert g(X\cdot W)-Y \Vert_F^2)}{dW}\\
&=X^T\cdot\frac{d(\Vert g(X\cdot W)-Y \Vert_F^2)}{d(X\cdot W)}\tag 1\\
&=X^T\cdot\frac{d(\Vert g(X\cdot W)-Y \Vert_F^2)}{d(g(X\cdot W))}\odot g'(X\cdot W)\tag 2\\
&=X^T\cdot\frac{d(\Vert g(X\cdot W)-Y \Vert_F^2)}{d(g(X\cdot W)-Y)}\odot g'(X\cdot W)\tag 3\\
&=X^T\cdot2(g(X\cdot W)-Y)\odot g'(X\cdot W)\tag 4\\
&= 2X^T\cdot (g(X\cdot W)-Y)\odot g'(X\cdot W)
\end{align}
$$


For (1) we've used our matrix calculus framework with the matrix-to-matrix function $G:W\mapsto X\cdot W$.

For (2) we've used $G:X\cdot W\mapsto g(X\cdot W)$.

For (3) we've used $G:g(X\cdot W)\mapsto g(X\cdot W)-Y$

For (4) we've used the framework with the matrix-to-scalar function $f:g(X\cdot W-Y)\mapsto\Vert g(X\cdot W)-Y\Vert_2^F$.

#### Dictionary learning example

For the dictionary learning example we have
$$
\begin{align*}
\frac{df}{dD}&=\frac{d(\Vert X-D\cdot R\Vert_F^2)}{dD}\\
&=\frac{d(\Vert X-D\cdot R\Vert_F^2)}{d(D\cdot R)}\cdot R^T\tag 5\\
&=\frac{d(\Vert X-D\cdot R\Vert_F^2)}{d(-D\cdot R)}\cdot -R^T\\
&=\frac{d(\Vert X-D\cdot R\Vert_F^2)}{d(X-D\cdot R)}\cdot -R^T\tag 6\\
&=2(X-D\cdot R)\cdot -R^T\tag 7\\
&=-2(X-D\cdot R)\cdot R^T\\
&=-2XR^T+2DRR^T
\end{align*}
$$


For (5) we've used the framework with the matrix-to-matrix function $G:D\mapsto D\cdot R$.

For (6) we've used the framework with the matrix-to-matrix function $G:-D\cdot R\mapsto X-D\cdot R$.

For (7) we've used the framework with the matrix-to-scalar function $f:X-D\cdot R\mapsto \Vert X-D\cdot R\Vert_F^2$.

Similarly, we have
$$
\begin{align*}
\frac{df}{dR}&=\frac{d(\Vert X-D\cdot R\Vert_F^2)}{dR}\\
&=(-D)^T\cdot\frac{d(\Vert X-D\cdot R\Vert_F^2)}{d(-D\cdot R)}\tag 8\\
&=(-D)^T\cdot\frac{d(\Vert X-D\cdot R\Vert_F^2)}{d(X-D\cdot R)}\tag 9\\
&=(-D)^T\cdot 2(X-D\cdot R)\tag {10}\\
&=-2D^TX+2D^TDR
\end{align*}
$$
using similar steps to above.

## Formula List

Here I list the derivative calculations for commonly used operations.

### Matrix to matrix

#### Right matrix multiplication

$$
\begin{align*}
G:X\mapsto X\cdot W\\
\frac{df}{dX}=\frac{df}{dG}\cdot W^T
\end{align*}
$$

{% capture proof1 %}
$$
\begin{align*}
\frac{df}{dX_{i,j}}&=\sum_{k,\ell}\frac{df}{dG_{k,\ell}}\cdot\frac{dG_{k,\ell}}{dX_{i,j}}\\
&=\sum_{k,\ell}\frac{df}{dG_{k,\ell}}\cdot\frac{d}{dX_{i,j}}(X_{k,1}W_{1,\ell}+X_{k,2}W_{2,\ell}+\cdots+X_{k,n}W_{n,\ell})\\
&=\sum_{k,\ell}\frac{df}{dG_{k,\ell}}\cdot 1_{k=i}\frac{d}{dX_{i,j}}(X_{k,j}W_{j,\ell})\\
&=\sum_\ell \frac{df}{dG_{i,\ell}}\cdot \frac{d}{dX_{i,j}}(X_{i,j}W_{j,\ell})\\
&=\sum_\ell \frac{df}{dG_{i,\ell}}\cdot W_{j,\ell}\\
&=\sum_\ell \frac{df}{dG_{i,\ell}}\cdot W_{\ell,j}^T\\
\implies \frac{df}{dX}&=\frac{df}{dG}\cdot W^T.
\end{align*}
$$
{% endcapture %}
{% include collapse.html title="Proof" content=proof1 id=1 %}

#### Left matrix multiplication

$$
\begin{align*}
G:X\mapsto W\cdot X\\
\frac{df}{dX}=W^T\cdot \frac{df}{dG}
\end{align*}
$$

#### Elementwise matrix multiplication

$$
\begin{align*}
G:X\mapsto X\odot C\\
\frac{df}{dX}=\frac{df}{dG}\odot C
\end{align*}
$$

{% capture proof5 %}
$$
\begin{align*}
\frac{df}{dX_{i,j}}&=\sum_{k,\ell}\frac{df}{dG_{k,\ell}}\cdot\frac{dG_{k,\ell}}{dX_{i,j}}\tag{multivariable chain rule}\\
&=\sum_{k,\ell}\frac{df}{dG_{k,\ell}}\cdot\frac{d}{dX_{i,j}}(X_{k,\ell}\cdot C_{k,\ell})\\
&=\sum_{k,\ell}\frac{df}{dG_{k,\ell}}\cdot 1_{k=i,\ell=j}\cdot C_{k,\ell}\\
&=\frac{df}{dG_{i,j}}\cdot C_{i,j}\\
\implies\frac{df}{dX}&=\frac{df}{dG}\odot C
\end{align*}
$$
{% endcapture %}
{% include collapse.html title="Proof" content=proof5 id=5 %}

#### Elementwise function application

Let 


$$
G:X\mapsto g(X)\\
$$


where $g:\mathbb R\to\mathbb R$ is the scalar-to-scalar function that we are applying elementwise. Then


$$
\frac{df}{dX}=\frac{df}{dG}\odot (g'(X))
$$


{% capture proof2 %}
$$
\begin{align*}
\frac{df}{dX_{i,j}}&=\sum_{k,\ell}\frac{df}{dG_{k,\ell}}\cdot\frac{dG_{k,\ell}}{dX_{i,j}}\\
&=\sum_{k,\ell}\frac{df}{dG_{k,\ell}}\cdot\frac{d}{dX_{i,j}}g(X_{k,\ell})\\
&=\sum_{k,\ell}\frac{df}{dG_{k,\ell}}\cdot 1_{k=i,\ell=j}\frac{d}{dX_{i,j}}g(X_{k,\ell})\\
&=\frac{df}{dG_{i,j}}\cdot\frac{d}{dX_{i,j}}g(X_{i,j})\\
&=\frac{df}{dG_{i,j}}\cdot g'(X_{i,j})\\
\implies\frac{df}{dX}&=\frac{df}{dG}\odot (g' (X)).
\end{align*}
$$
{% endcapture %}
{% include collapse.html title="Proof" content=proof2 id=2 %}

#### Matrix addition

$$
\begin{align*}
G:X\mapsto X+C\\
\frac{df}{dX}=\frac{df}{dG}
\end{align*}
$$

{% capture proof3 %}
$$
\begin{align*}
\frac{df}{dX_{i,j}}&=\sum_{k,\ell}\frac{df}{dG_{k,\ell}}\cdot\frac{dG_{k,\ell}}{dX_{i,j}}\\
&=\sum_{k,\ell}\frac{df}{dG_{k,\ell}}\cdot\frac{d}{dX_{i,j}}(X_{k,\ell}+C_{k,\ell})\\
&=\sum_{k,\ell}\frac{df}{dG_{k,\ell}}\cdot 1_{k=i,\ell=j}\frac{d}{dX_{i,j}}(X_{k,\ell}+C_{k,\ell})\\
&=\frac{df}{dG_{i,j}}\cdot\frac{d}{dX_{i,j}}(X_{i,j}+C_{i,j})\\
&=\frac{df}{dG_{i,j}}\\
\implies \frac{df}{dX}&=\frac{df}{dG}.
\end{align*}
$$
{% endcapture %}
{% include collapse.html title="Proof" content=proof3 id=3 %}

#### Row broadcasted addition

Let


$$
G:X\mapsto C+X
$$


where $X\in\mathbb R^{1\times n}$ is a **row** vector, $C\in\mathbb R^{m\times n}$ is a constant matrix, and the addition is broadcasted. Then


$$
\frac{df}{dX}=\sum_{\text{rows}}\frac{df}{dG}.
$$
{% capture proof4 %}
$$
\begin{align*}
\frac{df}{dX_{1,j}}&=\sum_{k,\ell}\frac{df}{dG_{k,\ell}}\cdot\frac{dG_{k,\ell}}{dX_{1,j}}\\
&=\sum_{k,\ell}\frac{df}{dG_{k,\ell}}\cdot\frac{d}{dX_{1,j}}(C_{k,\ell}+X_{1,\ell})\\
&=\sum_{k,\ell}\frac{df}{dG_{k,\ell}}\cdot 1_{\ell=j}\\
&=\sum_{k}\frac{df}{dG_{k,j}}\\
\implies \frac{df}{dX}&=\sum_{\text{rows}}\frac{df}{dG}.
\end{align*}
$$
{% endcapture %}
{% include collapse.html title="Proof" content=proof4 id=4 %}

#### Column broadcasted addition

Let



$$

G:X\mapsto C+X

$$



where $X\in\mathbb R^{m\times 1}$ is a **column** vector, $C\in\mathbb R^{m\times n}$, and the addition is broadcasted. Then



$$

\frac{df}{dX}=\sum_{\text{columns}}\frac{df}{dG}.

$$

### Matrix to scalar

#### Squared Frobenius norm

$$
\begin{align*}
f:G\mapsto \Vert G\Vert_F^2\\
\frac{df}{dG}=2G.
\end{align*}
$$

{% capture proof6 %}
$$
\begin{align*}
\frac{df}{dG_{i,j}}&=\frac{d}{dG_{i,j}}\sum_{k,\ell}G_{k,\ell}^2\\
&=\frac{d}{dG_{i,j}}G_{i,j}^2\\
&=2G_{i,j}\\
\implies \frac{df}{dG}&=2G.
\end{align*}
$$
{% endcapture %}
{% include collapse.html title="Proof" content=proof6 id=6 %}

#### Matrix sum

$$
\begin{align*}
f:G\mapsto\sum G\\
\frac{df}{dG}=\vec 1
\end{align*}
$$

the vector of all 1s.

{% capture proof7 %}
$$
\begin{align*}
\frac{df}{dG_{i,j}}&=\frac{d}{dG_{i,j}}\sum_{k,\ell}G_{k,\ell}\\
&=\frac{d}{dG_{i,j}}G_{i,j}\\
&=1\\
\implies \frac{df}{dG}&=\vec 1.
\end{align*}
$$
{% endcapture %}
{% include collapse.html title="Proof" content=proof7 id=7 %}

#### Quadratic form

Let


$$
f:G\mapsto a^TGa
$$


where $G\in\mathbb R^{n\times n}$ and $a\in\mathbb R^n$. Then


$$
\frac{df}{dG}=aa^T
$$


{% capture proof8 %}

To compute this in index form explicitly, let $y=Xa$. Then

$$
y_i=\sum_jX_{i,j}a_j
$$

and so

$$
\begin{align*}
f(X)&=a^Ty\\
&=\sum_i a_i y_i\\
&=\sum_i a_i\sum_jX_{i,j}a_j\\
&=\sum_{i,j}a_iX_{i,j}a_j
\end{align*}
$$

Then

$$
\begin{align*}
\left[\frac{df}{dX}\right]_{1,1,k,\ell}&:=\frac{\partial f_{1,1}}{\partial X_{k,\ell}}\\
&=\frac{\partial}{\partial X_{k,\ell}}\sum_{i,j}a_iX_{i,j}a_j\\
&=a_ka_\ell1_{k=i,\ell=j}\\
\implies\left[\frac{df}{dX}\right]&=aa^T
\end{align*}
$$

{% endcapture %}
{% include collapse.html title="Proof" content=proof8 id=8 %}
