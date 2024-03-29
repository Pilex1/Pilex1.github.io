---
---

Suppose $\boldsymbol f$ is a function that has vectors for both input and output i.e.  $\boldsymbol f:\mathbb R^n\to\mathbb R^m$. We generalise the notion of a derivative of $\boldsymbol f$ by defining the Jacobian matrix (also called "derivative matrix") of $\boldsymbol f$ which we denote here by $\frac{d\boldsymbol f}{d\boldsymbol x}$. This is a matrix consisting of all the partial derivatives of all the component functions of $\boldsymbol f$. More precisely, if we let $(\frac{d\boldsymbol f}{d\boldsymbol x})_{i,j}$ denote the $i$th row and $j$th column of $\frac{d\boldsymbol f}{d\boldsymbol x}$ then

$$
\left(\frac{d\boldsymbol f}{d\boldsymbol x}\right)_{i,j}:=\frac{\partial  f_i}{\partial  x_j}.
$$



Explicitly,


$$
\frac{d\boldsymbol f}{d\boldsymbol x}=\begin{bmatrix}
\frac{\partial f_1}{\partial x_1}&\cdots&\frac{\partial f_1}{\partial x_n}\\
\vdots&\ddots&\vdots\\
\frac{\partial f_m}{\partial x_1}&\cdots&\frac{\partial f_m}{\partial x_n}.
\end{bmatrix}
$$


Intuitively, each column $j$ tells you the factor by which space in each of the output coordinates changes per infinitesimal change in $x_j$. The determinant of the Jacobian matrix then tells you the factor by which area/volume of the output space $\boldsymbol f$ changes per change in infinitesimal area/volume in the input space.

For example, consider the function 


$$
\boldsymbol f\left(x,y\right)=\begin{bmatrix}f_1(x,y)\\f_2(x,y)\end{bmatrix}=\begin{bmatrix}x+y\\xy\end{bmatrix}
$$


The Jacobian is


$$
\begin{bmatrix}
\frac{\partial f_1}{\partial x}&\frac{\partial f_1}{\partial y}\\
\frac{\partial f_2}{\partial x}&\frac{\partial f_2}{\partial y}\\
\end{bmatrix}=\begin{bmatrix}
1&1\\
y&x\\
\end{bmatrix}
$$


Let's pick a point in the input space arbitrarily say $(x,y)=(-1,2)$. Then the Jacobian evaluated at this point is


$$
\begin{bmatrix}1&1\\2&-1\end{bmatrix}
$$


The first column of this matrix tells us that for an infinitesimal change in $x$ around $(x,y)=(-1,2)$, in the output space $f_1$ changes by a factor of 1 (i.e. it changes by the same amount) and $f_2$ changes by a factor of 2 (it increases twice as much), Similarly, the second column of the matrix tells us that for an infinitesimal change in $y$ around $(x,y)=(-1,2)$, in the output space $f_1$ changes by a factor of 1 and $f_2$ changes by a factor of -1.

Hence the Jacobian matrix as a whole tells us that an infinitesimal change in the input space at $(x,y)=(-1,2)$ has the effect of producing a linear change in the output space described by the matrix

$$
\begin{bmatrix}1&1\\2&-1\end{bmatrix}.
$$

To illustrate this, note that $f(-1,2)=(1,-2)$. Suppose we perturb the input slightly to $(x,y)=(-1+0.001,2-0.0005)=(-0.999,1.9995)$. Then the Jacobian matrix tells us that the change in the output space is approximately

$$
\begin{bmatrix}
1&1\\
2&-1
\end{bmatrix}\cdot\begin{bmatrix}
0.001\\
-0.0005
\end{bmatrix}=\begin{bmatrix}
0.0005\\
0.0025
\end{bmatrix}
$$

meaning that we should expect $f(-0.999,1.9995)\approx (1,-2)+(0.0005,0.0025)=(1.0005,-1.9975)$. And indeed the true value is $f(-0.999,1.9995)=(1.0005,-1.9975005)$.

Note also that the determinant of the Jacobian matrix is $-3$. This means if you were to consider the perturbation as an area (i.e. consider the square with corners given by $(x,y)=(-1,2)$ and $(x,y)=(-0.999,1.9995$) and apply $\boldsymbol f$ to this area, the resulting shape would be approximately $3$ times as large as the input, and the orientation would be flipped (due to the negative sign).

## Examples

Here we will work through computing the Jacobian matrices of functions that pop up frequently in neural network maths.

### Left-multiplication by matrix

Let


$$
f(x):=W\cdot x,\quad f:\mathbb R^n\to\mathbb R^m
$$


where $W\in\mathbb R^{m\times n}$. Then


$$
\begin{align*}
\frac{\partial f_i}{\partial x_j}&=\frac{\partial}{\partial x_j}\left(W_{i,1}x_1+\cdots+W_{i,n}x_n\right)\\
&=\frac{\partial}{\partial x_j}W_{i,j}x_j\\
&=W_{i,j}
\end{align*}
$$


hence


$$
\frac{df}{dx}=W.
$$


### Squared $L_2$ norm

Let


$$
f(x)=\Vert x\Vert_2^2,\quad f:\mathbb R^n\to\mathbb R.
$$


Then


$$
\begin{align*}
\frac{\partial f}{\partial x_j}&=\frac{\partial}{\partial x_j}\left(x_1^2+\cdots+x_n^2\right)\\
&=\frac{\partial}{\partial x_j}x_j^2\\
&=2x_j
\end{align*}
$$


hence


$$
\frac{df}{dx}=2x^T.
$$

### Elementwise functions

Let $g\circ x$ denote the function $g:\mathbb R\to\mathbb R$ being applied elementwise to $x$. Let


$$
f(x)=g\circ x,\quad f:\mathbb R^n\to\mathbb R^n.
$$


Then


$$
\begin{align*}
\frac{\partial f_i}{\partial x_j}&=\frac{\partial}{\partial x_j}\left(g(x_i)\right)\\
&=g'(x_i)1_{i=j}
\end{align*}
$$


hence $\frac{df}{dx}$ is a diagonal matrix with its diagonal entries given by the vector $g'\circ x$. For ease of notation if $u$ is a vector, we define $\text{diag}(u)$ to be the diagonal matrix whose diagonal entries are given by the components of $u$. With this notation, we have that


$$
\frac{df}{dx}=\text{diag}(g'\circ x).
$$


#### Elementwise multiplication by a constant

Let


$$
f(x)=x\odot c,\quad f:\mathbb R^n\to\mathbb R^n
$$


where $c\in\mathbb R^n$ and $x\odot c$ denotes elementwise multiplication between $x$ and $c$. Then


$$
\begin{align*}
\frac{\partial f_i}{\partial x_j}&=\frac{\partial}{\partial x_j}\left(c_ix_i\right)\\
&=c_i1_{i=j}
\end{align*}
$$

hence

$$
\frac{df}{dx}=\text{diag}(c).
$$

#### Elementwise addition by a constant

Let


$$
f(x)=x+c,\quad f:\mathbb R^n\to\mathbb R^n
$$


where $c\in\mathbb R^n$. Hence

$$
\begin{align*}
\frac{\partial f_i}{\partial x_j}&=\frac{\partial}{\partial x_j}\left(x_i+c_i\right)\\
&=1_{i=j}
\end{align*}
$$

hence

$$
\frac{df}{dx}=\mathbb I_n
$$


the $n\times n$ identity matrix.