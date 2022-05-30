export { sliderRegister, sliderOnUpdate, sliderGetMax, sliderGetMin, sliderGetStep, sliderGetValue };

let sliderData = new Map();

function sliderRegister(id, min, max, step, value, mininf, maxinf) {
    console.debug(`registering slider ${id} min=${min} max=${max} step=${step} value=${value} mininf=${mininf} maxinf=${maxinf}`);

    let isFloat = min.includes(".") || max.includes(".") || step.includes(".") || value.includes(".");
    let parseFn = isFloat ? parseFloat : parseInt;

    let minP = parseFn(min);
    let maxP = parseFn(max);
    let stepP = parseFn(step);
    let valueP;

    if (mininf) minP -= stepP;
    if (maxinf) maxP += stepP;

    console.assert(!(!mininf && !maxinf && value.includes("inf")));
    if (value === "-inf") valueP = minP;
    else if (value === "inf") valueP = maxP;
    else valueP = parseFn(value);

    let parseFnComplete = function (stringVal) {
        let sliderValP = parseFn(stringVal);
        let val;
        let str;
        if (mininf && sliderValP == minP) {
            val = -Infinity;
            str = "-∞"
        } else if (maxinf && sliderValP == maxP) {
            val = Infinity;
            str = "∞";
        }
        else {
            val = sliderValP;
            str = `${sliderValP}`;
        }
        return {
            "val": val,
            "str": str
        }
    };

    sliderData.set(id, {
        "parseFn": parseFnComplete
    });

    let range = $("#_range-" + id);
    let label = $("#_label-" + id);

    range.attr("min", `${minP}`);
    range.attr("max", `${maxP}`);
    range.attr("step", `${stepP}`);
    range.val(`${valueP}`);

    label.text(`${parseFnComplete(range.val()).str}`);

    range.on("input", () => {
        label.text(`${parseFnComplete(range.val()).str}`);
    });
}

function sliderOnUpdate(id, updateFunc) {
    $("#_range-" + id).on("input", updateFunc);
}

function sliderGetMax(id) {
    let parseFn = sliderData.get(id).parseFn;
    return parseFn($("#_range-" + id).attr("max"));
}

function sliderGetMin(id) {
    let parseFn = sliderData.get(id).parseFn;
    return parseFn($("#_range-" + id).attr("min"));
}

function sliderGetStep(id) {
    let parseFn = sliderData.get(id).parseFn;
    return parseFn($("#_range-" + id).attr("step"));
}

function sliderGetValue(id) {
    let parseFn = sliderData.get(id).parseFn;
    return parseFn($("#_range-" + id).val());
}