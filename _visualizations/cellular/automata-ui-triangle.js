{
    let automata = new Automata({"tilingType": "Triangle"}, parseInt($("#cellQuantityTriangle").val()));
    let ui = new AutomataUI("canvasTriangle", automata);

    // re-updates graphics (i.e. size and colour of cells) by looking at the
    // UI settings
    function updateGraphics() {
        ui.cellColorAlive = $("input[name=colorAliveCellTriangle]").val();
        ui.cellColorDead = $("input[name=colorDeadCellTriangle]").val();
        ui.cellColorStroke = $("input[name=colorOutlineTriangle").val();        
        ui.draw();
    }

    // re-updates rule by looking at the UI
    function updateRule() {
        let keepAlive = [];
        let resurrect = [];

        const neighbourhoodType = $("input[name=neighbourhoodTriangle]:checked").val();
        if (neighbourhoodType === "Edge") {
            $("#divKeepAliveMooreTriangle, #divResurrectMooreTriangle").hide();
            $("#divKeepAliveNeumannTriangle, #divResurrectNeumannTriangle").show();

            for (let i = 0; i <= 3; i++) {
                if ($(`#checkAliveNeumannTriangle${i}`).is(":checked")) keepAlive.push(i);
                if ($(`#checkResurrectNeumannTriangle${i}`).is(":checked")) resurrect.push(i);
            }
        } else if (neighbourhoodType === "Point") {
            $("#divKeepAliveMooreTriangle, #divResurrectMooreTriangle").show();
            $("#divKeepAliveNeumannTriangle, #divResurrectNeumannTriangle").hide();

            for (let i = 0; i <= 12; i++) {
                if ($(`#checkAliveMooreTriangle${i}`).is(":checked")) keepAlive.push(i);
                if ($(`#checkResurrectMooreTriangle${i}`).is(":checked")) resurrect.push(i);
            }
        }
        automata.rule = new Rule({
            "tilingType": "Triangle",
            "ruleType": "GameOfLife",
            "neighbourhoodType": neighbourhoodType,
            "deadValue": 0,
            "aliveValue": 1,
            "keepAlive": keepAlive,
            "resurrect": resurrect
        });
    }

    for (let i = 0; i <= 3; i++) {
        $("#divKeepAliveNeumannTriangle").append(`
        <div class="form-check">
        <input type="checkbox" class="form-check-input" id="checkAliveNeumannTriangle${i}">
        <label for="checkAliveNeumannTriangle${i}" class="form-check-label">${i}</label>
        `);
        $("#divResurrectNeumannTriangle").append(`
        <div class="form-check">
        <input type="checkbox" class="form-check-input" id="checkResurrectNeumannTriangle${i}">
        <label for="checkResurrectNeumannTriangle${i}" class="form-check-label">${i}</label>
        `);
        $(`#checkAliveNeumannTriangle${i}`).on("click", event => {
            updateRule();
        });
        $(`#checkResurrectNeumannTriangle${i}`).on("click", event => {
            updateRule();
        });
    }
    $("#checkAliveNeumannTriangle2, #checkAliveNeumannTriangle3, #checkResurrectNeumannTriangle3").attr("checked", "checked");


    for (let i = 0; i <= 12; i++) {
        $("#divKeepAliveMooreTriangle").append(`
        <div class="form-check">
        <input type="checkbox" class="form-check-input" id="checkAliveMooreTriangle${i}">
        <label for="checkAliveMooreTriangle${i}" class="form-check-label">${i}</label>
        `);
        $("#divResurrectMooreTriangle").append(`
        <div class="form-check">
        <input type="checkbox" class="form-check-input" id="checkResurrectMooreTriangle${i}">
        <label for="checkResurrectMooreTriangle${i}" class="form-check-label">${i}</label>
        `);
        $(`#checkAliveMooreTriangle${i}`).on("click", event => {
            updateRule();
        });
        $(`#checkResurrectMooreTriangle${i}`).on("click", event => {
            updateRule();
        });
    }
    $("#checkAliveMooreTriangle2, #checkAliveMooreTriangle3, #checkResurrectMooreTriangle3").attr("checked", "checked");


    $("#btnIterateTriangle").on("click", event => {
        ui.iterate();
    });
    $("#btnClearTriangle").on("click", event => {
        ui.clear();
    });
    $("#btnRandomizeTriangle").on("click", event => {
        ui.randomize();
    });

    $("input[name=neighbourhoodTriangle]").on("change", function (event) {
        updateRule();
    });

    $("input[name=colorAliveCellTriangle]").on("input", event=>{
        updateGraphics();
    });
    $("input[name=colorDeadCellTriangle]").on("input", event=>{
        updateGraphics();
    });
    $("input[name=colorOutlineTriangle]").on("input", event=>{
        updateGraphics();
    });

    $("#exportImageTriangle").on("click", event=>{

        let svg = ui.scope.project.exportSVG({asString: true});
        let blob = new Blob([svg], {type:     "image/svg+xml;charset=utf-8"});
  
        const blobUrl = URL.createObjectURL(blob);

        const anchor = document.createElement('a');
        anchor.href = blobUrl;
        anchor.target = "_blank";
        anchor.download = "image.svg";

        // Auto click on a element, trigger the file download
        anchor.click();

        // This is required
        URL.revokeObjectURL(blobUrl);


    });

    $("#cellSizeTriangle").on("change", event=>{
        ui.cellRadius = parseInt($("#cellSizeTriangle").val());

        ui.drawNew();
        updateGraphics();

    });

    $("#cellQuantityTriangle").on("change", event=>{
        ui.cellQuantity = parseInt($("#cellQuantityTriangle").val());
        automata.updateSize(ui.cellQuantity);

        ui.drawNew();
        updateGraphics();

    });

    $("#btnClearPlusTriangle").on("click", event=>{
        ui.clearInitializeCenter();
    })

    updateRule();
    ui.resizeCanvas();

    ui.cellRadius = parseInt($("#cellSizeTriangle").val());
    ui.cellQuantity = parseInt($("#cellQuantityTriangle").val());

    ui.drawNew();
    updateGraphics();
}