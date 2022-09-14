---
---

We have discussed previously that the notion of a derivative can be generalised to vector functions through the Jacobian matrix. Recall that if $\boldsymbol y=\boldsymbol f(\boldsymbol x)$ where $\boldsymbol f:\mathbb R^n\to\mathbb R^m$ then the Jacobian matrix of $\boldsymbol f$, which we denote here by $\frac{d\boldsymbol f}{d\boldsymbol x}$, is a matrix whose $i$th row and $j$th column is equal to $\frac{\partial f_i}{\partial x_j}$ i.e.



$$
\left(\frac{d\boldsymbol f}{d\boldsymbol x}\right)_{i,j}:=\frac{\partial  f_i}{\partial  x_j}.
$$



We have already seen previously some examples of Jacobians of common functions. However, when computing Jacobians in practice, the functions we are dealing with are generally quite complex and involve the composition of many simpler functions. For example, as we will see later, in linear regression we need to compute the Jacobian of the function $f(w)=\Vert X\cdot w-y\Vert_2^2,f:\mathbb R^n\to\mathbb R$ where $X,y$ are appropriately sized constants. This is the composition of three functions:

- $g_1(w):=X\cdot w$
- $g_2(g_1):=g_1-y$
- $g_3(g_2):=\Vert g_2\Vert_2^2$

We know how to compute the Jacobian of each of these three functions individually, but what is the Jacobian when they are composed together?

In single variable calculus, we have the chain rule which describes how to take derivatives of a composition of two or more scalar functions. More precisely, this states that if $y=f(g(x))$ for scalar functions $f,g:\mathbb R\to\mathbb R$ then

$$
\frac{dy}{dx}=\frac{df}{dg}\cdot\frac{dg}{dx}
$$

where $\cdot$ represents ordinary multiplication.

We will soon see that a very similar statement holds for vector functions as well! Consider the vector case $\boldsymbol y=\boldsymbol f(\boldsymbol g(\boldsymbol x))$ where $\boldsymbol g:\mathbb R^k\to\mathbb R^n$ and $\boldsymbol f:\mathbb R^n\to\mathbb R^m$. Take an arbitrary entry in the Jacobian matrix $\frac{d\boldsymbol y}{d\boldsymbol x}$ at index $i,j$. Then


$$
\left(\frac{d\boldsymbol y}{d\boldsymbol x}\right)_{i,j}=\frac{\partial}{\partial x_j}f_i(g_1(x_1,\cdots,x_k),\cdots,g_n(x_1,\cdots,x_k)).
$$


By the multivariable chain rule, it follows that


$$
\begin{align*}
\left(\frac{d\boldsymbol y}{d\boldsymbol x}\right)_{i,j}&=\frac{\partial f_i}{\partial g_1}\cdot\frac{\partial g_1}{x_j}+\cdots +\frac{\partial f_i}{\partial g_n}\cdot\frac{\partial g_n}{x_j}\\
&=\left(\frac{df}{dg}\right)_{i,1}\cdot\left(\frac{dg}{dx}\right)_{1,j}+\cdots+\left(\frac{df}{dg}\right)_{i,n}\cdot\left(\frac{dg}{dx}\right)_{n,j}
\end{align*}
$$


hence


$$
\frac{d\boldsymbol y}{d\boldsymbol x}=\frac{d\boldsymbol f}{d\boldsymbol g}\cdot \frac{d\boldsymbol g}{d\boldsymbol x}
$$


where $\cdot$ here denotes matrix multiplication.

This is a really neat result as it is the exact analogue of the chain rule in the scalar function case except the derivative is replaced with the Jacobian matrix and the multiplication is replaced by matrix multiplication.

We can use this result to compute the Jacobian of our motivating example of $f(w)=\Vert X\cdot w-y\Vert_2^2$. Since $f(w)=g_3(g_2(g_1(w)))$ we have


$$
\begin{align*}
\frac{df}{dw}&=\frac{dg_3}{dg_2}\cdot\frac{dg_2}{dw}\tag{chain rule}\\
&=2g_2^T\cdot\frac{dg_2}{dw}\tag{derivative of squared $L_2$ norm}\\
&=2g_2^T\cdot \frac{dg_2}{dg_1}\cdot\frac{dg_1}{dw}\tag{chain rule}\\
&=2g_2^T\cdot\mathbb I\cdot\frac{dg_1}{dw}\tag{derivative of addition of a constant}\\
&=2g_2^T\cdot\mathbb I\cdot X\tag{derivative of left-multiplication by a matrix}\\
&=2(X\cdot w-y)^T\cdot X.
\end{align*}
$$
