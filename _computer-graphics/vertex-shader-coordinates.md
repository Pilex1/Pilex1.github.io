---
---

When working in OpenGL, the output of the vertex shader must be a 4 dimensional vector $(x_c,y_c,z_c,w_c)$. Mathematically this is a vector in 4D projective space $\mathbb P^4$, but in computer graphics, this is known as **clip space**.


OpenGL takes this output vector and automatically transforms it to 3D Euclidean coordinates the usual way

$$
\begin{bmatrix}
x_c\\y_c\\z_c\\w_c
\end{bmatrix}\mapsto\begin{bmatrix}
x_c/w_c\\y_c/w_c\\z_c/w_c
\end{bmatrix}=:\begin{bmatrix}
x_{ndc}\\ y_{ndc}\\ z_{ndc}
\end{bmatrix}
$$

In the computer graphics community, this is often called **perspective division** since we are dividing by the $w$ coordinate. The resulting coordinate space is called **normalized device coordinates**. 

{% include image.html src="ndc-diagram.svg" caption="Normalized device coordinates. [Image source](https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/WebGL_model_view_projection)." %}

An object is rendered by OpenGL only if its normalized device coordinates lie between -1 and 1 i.e. $(x_{ndc},y_{ndc},z_{ndc})\in [-1,1]^3$. The $x_{ndc}$ and $y_{ndc}$ coordinates specify the horizontal and vertical positions as one would expect, with positive $x_{ndc}$ towards the right and positive $y_{ndc}$ towards the top.

Move the mouse over the app below to see this.

{% include_relative ndc-xy-app.html %}

The $z_{ndc}$ coordinate is used to determine whether an object should be rendered in front of or behind another object. An object is rendered in front of another if it has a **lower** $z$ coordinate. You can think of it as $z=-1$ representing the front of the screen, and $z=1$ representing the back of the screen.

To see this, adjust the sliders to change the $z_{ndc}$ coordinates of the two coloured squares.

{% include_relative ndc-z-app.html %}

Note that NDC is a **left-handed** coordinate system.

## Summary

{% capture summary %}

The output of the vertex shader is a vector in 4D projective space $(x_c,y_c,z_c,w_c)\in\mathbb P^4$, also called **clip space**.

OpenGL automatically transforms this into 3D Euclidean coordinates $(x_{ndc},y_{ndc},z_{ndc})=(x_c/w_c,y_c/w_c,z_c/w_c)\in\mathbb R^3$; this process is called **perspective division**.

- the resulting coordinate space is called **normalized device coordinates**
- only objects with normalized device coordinates lying between -1 and 1 are rendered
- positive $x_{ndc}$ points to the right, positive $y_{ndc}$ points upwards, and objects with lower $z_{ndc}$ are rendered in front
- NDC is a **left-handed** coordinate system

{% endcapture %}

{% include card.html content=summary title="Summary" %}