const express = require("express");
const app = express();
const mysql = require("mysql2");
const cors = require("cors");
const bodyParser = require("body-parser");

const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "45350299",
    database: "saillen",
});

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(__dirname));

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

app.get("/get_data", (req, res) => {
    const ficha = req.query.ficha;
    if (!ficha) {
        res.status(400).json({ error: "Se requiere un valor de ficha" });
        return;
    }

    const query = "SELECT * FROM `fichas` WHERE ficha = ?";
    connection.query(query, [ficha], (err, results) => {
        if (err) {
            console.error("Error al obtener los datos:", err);
            res.status(500).json({ error: "Error al obtener los datos de la base de datos" });
            return;
        }

        if (results.length > 0) {
            const fichaData = results[0];
            const fichaId = fichaData.id;

            const materialesQuery = "SELECT material FROM `materiales` WHERE ficha_id = ?";
            connection.query(materialesQuery, [fichaId], (err, materialesResults) => {
                if (err) {
                    console.error("Error al obtener los materiales:", err);
                    res.status(500).json({ error: "Error al obtener los materiales de la base de datos" });
                    return;
                }

                fichaData.materiales = materialesResults.map(materialRow => materialRow.material).join(", ");
                res.json([fichaData]);
            });
        } else {
            res.json([]);
        }
    });
});

// ruta para guardar las fichas

app.post("/save_ficha", (req, res) => {
    const formData = req.body;

    const query = `
        INSERT INTO fichas (ficha, tipo, medidas, caracteristicas, prensa, presion, pesoTotal, largo, altura, ancho, diametroRecorte, buje, codigo)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    connection.query(
        query,
        [
            formData.ficha,
            formData.tipo,
            formData.medidas,
            formData.caracteristicas,
            formData.prensa,
            formData.presion,
            formData.pesoTotal,
            formData.largo,
            formData.altura,
            formData.ancho,
            formData.diametroRecorte,
            formData.buje,
            formData.codigo
        ],
        (err, results) => {
            if (err) {
                console.error("Error al guardar la ficha:", err);
                res.status(500).json({ error: "Error al guardar la ficha en la base de datos" });
                return;
            }

            res.json({ message: "Ficha guardada exitosamente" });
        }
    );
});

// ruta para guardar los materiales

app.post("/save_material", (req, res) => {
    const formData = req.body;

    const query = `INSERT INTO materiales (ficha_id, material) VALUES (?, ?)`;

    connection.query(
        query,
        [formData.ficha, formData.material],
        (err, results) => {
            if (err) {
                console.error("Error al guardar el material:", err);
                res.status(500).json({ error: "Error al guardar el material en la base de datos" });
                return;
            }

            res.json({ message: "Material guardado exitosamente" });
        }
    );
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor iniciado en http://localhost:${PORT}`);
});
