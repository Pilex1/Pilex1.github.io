---
import: three,plotly
---

This is given by the recurrence equation

$$
w_{n+1}w_{n-1}=\frac{1}{w_n}-\frac{1}{aq^nw_n^2}
$$

with $a,q\in\mathbb C$ constants.

{% capture parameters %}
{% include components/complex-picker-collapse.html id="a" title="$a$" value="0.35" snap="onshift" range=1.5 %}
{% include components/complex-picker-collapse.html id="q" title="$q$" value="1" snap="onshift" range=1.5 %}
{% include components/complex-picker-collapse.html id="w0" title="$w_0$" value="0.5" snap="onshift" range=1.5 %}
{% include components/complex-picker-collapse.html id="w1" title="$w_1$" value="0.5i" snap="onshift" range=1.5 %}
{% endcapture %}
{% include components/painleve-ui.html parameters=parameters js="./qp1-app.js" %}