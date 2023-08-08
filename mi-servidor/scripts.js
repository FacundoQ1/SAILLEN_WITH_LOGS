document.addEventListener("DOMContentLoaded", () => {
    const createOrderButton = document.getElementById("createOrderButton");
    const searchSection = document.getElementById("searchSection");
    const newFichaButton = document.getElementById("newFichaButton");
    const newFichaForm = document.getElementById("newFichaForm");
    const backSearchButton = document.getElementById("backSearchButton");
    const backNewFichaButton = document.getElementById("backNewFichaButton");
    const materialsSection = document.getElementById("materialsSection");
    const addMaterialButton = document.getElementById("addMaterialButton");
    const materialsList = document.getElementById("materialsList");
    const materialInput = document.getElementById("materialInput");
    const saveMaterialButton = document.getElementById("saveMaterialButton");
    const saveMaterialsButton = document.getElementById("saveMaterialsButton");

    let fichaValue = "";

    createOrderButton.addEventListener("click", () => {
        createOrderButton.style.display = "none";
        newFichaButton.style.display = "block";
        searchSection.style.display = "block";
        newFichaForm.style.display = "none";
        materialsSection.style.display = "none";
    });

    newFichaButton.addEventListener("click", () => {
        newFichaButton.style.display = "none";
        createOrderButton.style.display = "block";
        newFichaForm.style.display = "block";
        searchSection.style.display = "none";
        materialsSection.style.display = "none";
    });

    backSearchButton.addEventListener("click", () => {
        createOrderButton.style.display = "block";
        searchSection.style.display = "none";
        materialsSection.style.display = "none";
    });

    backNewFichaButton.addEventListener("click", () => {
        newFichaButton.style.display = "block";
        newFichaForm.style.display = "none";
        materialsSection.style.display = "none";
    });

    const searchButton = document.getElementById("searchButton");
    searchButton.addEventListener("click", () => {
        const fichaInput = document.getElementById("fichaInput").value;
        if (fichaInput) {
            fetch(`http://localhost:3000/get_data?ficha=${fichaInput}`)
                .then(response => response.json())
                .then(jsonData => {
                    const dataElement = document.getElementById("data");
                    dataElement.style.display = "block";
                    dataElement.innerHTML = "";

                    if (jsonData.length > 0) {
                        const item = jsonData[0];
                        const divElement = document.createElement("div");
                        divElement.className = "item";
                        divElement.innerHTML = `
                            <p>Ficha: ${item.ficha}</p>
                            <p>Tipo: ${item.tipo}</p>
                            <p>Medida: ${item.medidas}</p>
                            <p>Caracteristicas: ${item.caracteristicas}</p>
                            <p>Prensa: ${item.prensa}</p>
                            <p>Numero de presion: ${item.presion}</p>
                            <p>Peso Total: ${item.pesoTotal}</p>
                            <p>Largo: ${item.largo}</p>
                            <p>Altura: ${item.altura}</p>
                            <p>Ancho: ${item.ancho}</p>
                            <p>Diametro de recorte: ${item.diametroRecorte}</p>
                            <p>Buje: ${item.buje}</p>
                            <p>Codigo: ${item.codigo}</p>
                        `;
                        dataElement.appendChild(divElement);
                    } else {
                        dataElement.innerHTML = "No se encontraron resultados.";
                    }
                })
                .catch(error => console.error("Error al obtener los datos:", error));
        }
    });

    const saveButton = document.getElementById("saveButton");
    const fichaForm = document.getElementById("fichaForm");

    saveButton.addEventListener("click", (event) => {
        event.preventDefault();

        // Obtener los valores del formulario
        fichaValue = document.getElementById("ficha").value;
        const tipoValue = document.getElementById("tipo").value;
        const medidasValue = document.getElementById("medidas").value;
        const caracteristicasValue = document.getElementById("caracteristicas").value;
        const prensaValue = document.getElementById("prensa").value;
        const presionValue = document.getElementById("presion").value;
        const pesoTotalValue = document.getElementById("pesoTotal").value;
        const largoValue = document.getElementById("largo").value;
        const alturaValue = document.getElementById("altura").value;
        const anchoValue = document.getElementById("ancho").value;
        const diametroRecorteValue = document.getElementById("diametroRecorte").value;
        const bujeValue = document.getElementById("buje").value;
        const codigoValue = document.getElementById("codigo").value;

        const formData = {
            ficha: fichaValue,
            tipo: tipoValue,
            medidas: medidasValue,
            caracteristicas: caracteristicasValue,
            prensa: prensaValue,
            presion: presionValue,
            pesoTotal: pesoTotalValue,
            largo: largoValue,
            altura: alturaValue,
            ancho: anchoValue,
            diametroRecorte: diametroRecorteValue,
            buje: bujeValue,
            codigo: codigoValue
        };

        fetch("http://localhost:3000/save_ficha", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(formData)
        })
        .then(response => response.json())
        .then(data => {
            console.log("Respuesta del servidor:", data);
            newFichaForm.style.display = "none";
            materialsSection.style.display = "block";
        })
        .catch(error => console.error("Error al guardar en la base de datos:", error));
    });

    saveMaterialButton.addEventListener("click", () => {
        // Obtener los materiales ingresados y guardarlos en la base de datos
        const materialElements = materialsList.getElementsByTagName("li");
        const materiales = Array.from(materialElements).map(element => element.textContent);

        const formData = {
            ficha: fichaValue,
            materiales: materiales
        };
        fetch("http://localhost:3000/save_material", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(formData)
        })
        .then(response => response.json())
        .then(data => {
            console.log("Materiales guardados:", data);
        })
        .catch(error => console.error("Error al guardar los materiales:", error));
    });

    addMaterialButton.addEventListener("click", () => {
        const materialValue = materialInput.value.trim();
        if (materialValue !== "") {
            const listItem = document.createElement("li");
            listItem.textContent = materialValue;
            materialsList.appendChild(listItem);
            materialInput.value = "";
        }
    });
});
