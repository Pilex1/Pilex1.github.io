import { ComplexPicker } from "./complex-picker.js";

export { sliderRegister, sliderOnUpdate, sliderGetMax, sliderGetMin, sliderGetStep, sliderGetValue };
export { complexPickerRegister, complexPickerGet };

let sliderData = new Map();

function sliderRegister(id, min, max, step, value, mininf, maxinf, log) {
    console.debug(`registering slider ${id} min=${min} max=${max} step=${step} value=${value} mininf=${mininf} maxinf=${maxinf} log=${log}`);

    let isFloat = min.includes(".") || max.includes(".") || step.includes(".") || value.includes(".");
    let parseFn = isFloat ? parseFloat : parseInt;

    // parses min, max, and step (which are strings) into either ints or floats
    let minP = parseFn(min);
    let maxP = parseFn(max);
    let stepP = parseFn(step);
    if (log) {
        minP = Math.floor(Math.log(minP) / Math.log(stepP));
        maxP = Math.ceil(Math.log(maxP) / Math.log(stepP));
        stepP = 1;
    }
    // if minus infinity is allowed as a slider value, we add an additional possible slider value past the original minimum slider value which represents minus infinity
    // similarly if positive infinity is allowed, we add an additional possible slider value past the original maximum slider value which represents positive infinity
    if (mininf) minP -= stepP;
    if (maxinf) maxP += stepP;

    // this is the initial true value of the slider
    let valueP;

    console.assert(!(!mininf && !maxinf && value.includes("inf")));
    if (value === "-inf") valueP = minP;
    else if (value === "inf") valueP = maxP;
    else if (log) valueP = Math.log(parseFn(value)) / Math.log(step);
    else valueP = parseFn(value);

    // this function gets passed the slider's true value, and should return the UI value
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
            val = log ? Math.pow(parseFn(step), sliderValP) : sliderValP;
            str = `${val}`;
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

let complexPickers = new Map();

function complexPickerRegister(id, value, snap, range) {
    let picker = new ComplexPicker("_complex-picker-"+id, snap, range);
    picker.onChange((selectedValue) => {
        $("#_label-complex-picker-"+id).text(selectedValue.format(2));
    });
    picker.setValue(math.complex(value));
    complexPickers.set(id, picker);
}

function complexPickerGet(id) {
    return complexPickers.get(id);
}