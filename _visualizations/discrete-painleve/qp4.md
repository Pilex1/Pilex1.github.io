---
import: three,plotly
---

Here there are three iterates $f_0(t),f_1(t),f_2(t)$ which are notated as functions of $t$. The initial values for each of the three at $t=t_0$ are given i.e. $f_0(t_0),f_1(t_0),f_2(t_0)$ are given. There are constants $a_0,a_1,a_2$ which are also given, making for a total of six parameters. 

Define $t_0^2:=f_0(t_0)\cdot f_1(t_0)\cdot f_2(t_0)$ and define $q:=a_0\cdot a_1\cdot a_2$. 

The iterates satisfy the recurrence relation

$$
\begin{cases}\displaystyle

\frac{\overline{f}_0}{a_0\cdot a_1\cdot f_1}=\frac{1+a_2\cdot f_2\cdot (1+a_0\cdot f_0)}{1+a_0\cdot f_0\cdot (1+a_1\cdot f_1)}, &\\

\displaystyle\frac{\overline{f}_1}{a_1\cdot a_2\cdot f_2}=\frac{1+a_0\cdot f_0\cdot (1+a_1\cdot f_1)}{1+a_1\cdot f_1\cdot (1+a_2\cdot f_2)}, &\\

\displaystyle\frac{\overline{f}_2}{a_2\cdot a_0\cdot f_0}=\frac{1+a_1\cdot f_1\cdot (1+a_2\cdot f_2)}{1+a_2\cdot f_2\cdot (1+a_0\cdot f_0)}, &

\end{cases}
$$

where $f_i$ is shorthand for $f_i(t)$ and $\bar f_i$ is shorthand for $f_i(q\cdot t)$.

Using the above recurrence relation, we can calculate

$$
\begin{align*}
f_0(t_0),&&f_1(t_0),&&f_2(t_0)\\
f_0(q\cdot t_0),&&f_1(q\cdot t_0),&&f_2(q\cdot t_0)\\
f_0(q^2\cdot t_0),&&f_1(q^2\cdot t_0),&&f_2(q^2\cdot t_0)\\
f_0(q^3\cdot t_0),&&f_1(q^3\cdot t_0),&&f_2(q^3\cdot t_0)\\
\vdots
\end{align*}
$$

and so we plot the three sequences 

$$
\{ f_0(q^n\cdot t_0) \}_{n=0}^\infty,\quad\{ f_1(q^n\cdot t_0) \}_{n=0}^\infty,\quad \{ f_2(q^n\cdot t_0) \}_{n=0}^\infty
$$

stereographically as we did for all the other Painleve sequences.


Note that $f_0(t)\cdot f_1(t)\cdot f_2(t)=t^2$ for all $t$ for which $f_i(t)$ is defined. To see this, firstly note that at $t=t_0$ we have $f_0(t_0)\cdot f_1(t_0)\cdot f_2(t_0)=t_0^2$ by definition. Now assume $f_0(t)\cdot f_1(t)\cdot f_2(t)=t^2$ holds. Then

$$
\begin{align*}
\frac{f_0(q\cdot t)}{a_0\cdot a_1\cdot f_1(t)}\cdot\frac{f_1(q\cdot t)}{a_1\cdot a_2\cdot f_2(t)}\cdot \frac{f_2(q\cdot t)}{a_2\cdot a_0\cdot f_0(t)}&= 1\\
\implies f_0(q\cdot t)\cdot f_1(q\cdot t)\cdot f_2(q\cdot t)&=(a_0\cdot a_1\cdot a_2)^2\cdot(f_0(t)\cdot f_1(t)\cdot f_2(t))\\
&=q^2\cdot t^2\\
&= (q\cdot t)^2.\tag*{$\blacksquare$}
\end{align*}
$$

Hence there is a bit of redundancy in plotting all three sequences, as from any two of the sequences we can extract the third sequence. Nevertheless, we plot all three below.

{% capture parameters %}
{% include components/complex-picker-collapse.html id="a0" title="$a_0$" value="-0.7+0.3i" snap="onshift" range=1.5 %}
{% include components/complex-picker-collapse.html id="a1" title="$a_1$" value="-0.8-0.5i" snap="onshift" range=1.5 %}
{% include components/complex-picker-collapse.html id="a2" title="$a_2$" value="-0.7+0.4i" snap="onshift" range=1.5 %}
<hr>
{% include components/complex-picker-collapse.html id="f0" title="$f_0(t_0)$" value="-1" snap="onshift" range=1.5 %}
{% include components/complex-picker-collapse.html id="f1" title="$f_1(t_0)$" value="-1" snap="onshift" range=1.5 %}
{% include components/complex-picker-collapse.html id="f2" title="$f_2(t_0)$" value="-1" snap="onshift" range=1.5 %}
{% endcapture %}
{% include components/painleve-ui.html parameters=parameters js="./qp4-app.js" %}