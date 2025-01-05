const express = require("express");
const {Client} = require("pg");
const path = require("path");
const cors = require("cors");

const client = new Client({
    user: "postgres",
    password: "password",
    host: "localhost",
    port: 5432,
    database: "f1_staze"
});
client.connect();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/staze", async (req, res) => 
{
    try
    {
        const queryRes = await client.query(
            `
                select
                    staza.*,
                    json_agg(json_build_object(
                        'vn_id', velika_nagrada.vn_id,
                        'vn_naziv', velika_nagrada.vn_naziv,
                        'broj_odrzavanja', velika_nagrada.broj_odrzavanja
                    )) velike_nagrade
                from
                    staza
                    join odrzana_na on staza.staza_id = odrzana_na.staza_id
                    join velika_nagrada on odrzana_na.vn_id = velika_nagrada.vn_id
                group by
                    staza.staza_id
                order by
                    staza.staza_id;
            `
        );

        res.type("json").status(200).send(
            {
                "status": "OK",
                "message": "Dohvaćene staze",
                "response": queryRes.rows
            }
        );
    }
    catch(err)
    {
        res.type("json").status(400).send(
            {
                "status": "Bad Request",
                "message": "Zahtjev nije valjan",
                "response": null
            }
        );
    }
});

app.get("/staze/:id", async (req, res) => 
{
    try
    {
        const queryRes = await client.query(
            `
                select
                    staza.*,
                    json_agg(json_build_object(
                        'vn_id', velika_nagrada.vn_id,
                        'vn_naziv', velika_nagrada.vn_naziv,
                        'broj_odrzavanja', velika_nagrada.broj_odrzavanja
                    )) velike_nagrade
                from
                    staza
                    join odrzana_na on staza.staza_id = odrzana_na.staza_id
                    join velika_nagrada on odrzana_na.vn_id = velika_nagrada.vn_id
                where
                    staza.staza_id = ${req.params.id}
                group by
                    staza.staza_id
                order by
                    staza.staza_id;
            `
        );

        res.type("json").status(200).send(
            {
                "status": "OK",
                "message": `Dohvaćena staza ${req.params.id}`,
                "response": queryRes.rows
            }
        );
    }
    catch(err)
    {
        res.type("json").status(400).send(
            {
                "status": "Bad Request",
                "message": "Zahtjev nije valjan",
                "response": null
            }
        );
    }
});

app.get("/staze/:id/naziv", async (req, res) => 
{
    try
    {
        const queryRes = await client.query(
            `
                select
                    staza.*,
                    json_agg(json_build_object(
                        'vn_id', velika_nagrada.vn_id,
                        'vn_naziv', velika_nagrada.vn_naziv,
                        'broj_odrzavanja', velika_nagrada.broj_odrzavanja
                    )) velike_nagrade
                from
                    staza
                    join odrzana_na on staza.staza_id = odrzana_na.staza_id
                    join velika_nagrada on odrzana_na.vn_id = velika_nagrada.vn_id
                where
                    staza.staza_id = ${req.params.id}
                group by
                    staza.staza_id
                order by
                    staza.staza_id;
            `
        );

        res.type("json").status(200).send(
            {
                "status": "OK",
                "message": `Dohvaćen naziv staze ${req.params.id}`,
                "response": queryRes.rows[0]["staza_naziv"]
            }
        );
    }
    catch(err)
    {
        res.type("json").status(400).send(
            {
                "status": "Bad Request",
                "message": "Zahtjev nije valjan",
                "response": null
            }
        );
    }
});

app.get("/staze/:id/podrucje", async (req, res) => 
{
    try
    {
        const queryRes = await client.query(
            `
                select
                    staza.*,
                    json_agg(json_build_object(
                        'vn_id', velika_nagrada.vn_id,
                        'vn_naziv', velika_nagrada.vn_naziv,
                        'broj_odrzavanja', velika_nagrada.broj_odrzavanja
                    )) velike_nagrade
                from
                    staza
                    join odrzana_na on staza.staza_id = odrzana_na.staza_id
                    join velika_nagrada on odrzana_na.vn_id = velika_nagrada.vn_id
                where
                    staza.staza_id = ${req.params.id}
                group by
                    staza.staza_id
                order by
                    staza.staza_id;
            `
        );

        res.type("json").status(200).send(
            {
                "status": "OK",
                "message": `Dohvaćeno područje staze ${req.params.id}`,
                "response": queryRes.rows[0]["podrucje"]
            }
        );
    }
    catch(err)
    {
        res.type("json").status(400).send(
            {
                "status": "Bad Request",
                "message": "Zahtjev nije valjan",
                "response": null
            }
        );
    }
});

app.get("/staze/:id/drzava", async (req, res) => 
{
    try
    {
        const queryRes = await client.query(
            `
                select
                    staza.*,
                    json_agg(json_build_object(
                        'vn_id', velika_nagrada.vn_id,
                        'vn_naziv', velika_nagrada.vn_naziv,
                        'broj_odrzavanja', velika_nagrada.broj_odrzavanja
                    )) velike_nagrade
                from
                    staza
                    join odrzana_na on staza.staza_id = odrzana_na.staza_id
                    join velika_nagrada on odrzana_na.vn_id = velika_nagrada.vn_id
                where
                    staza.staza_id = ${req.params.id}
                group by
                    staza.staza_id
                order by
                    staza.staza_id;
            `
        );

        res.type("json").status(200).send(
            {
                "status": "OK",
                "message": `Dohvaćena država staze ${req.params.id}`,
                "response": queryRes.rows[0]["drzava"]
            }
        );
    }
    catch(err)
    {
        res.type("json").status(400).send(
            {
                "status": "Bad Request",
                "message": "Zahtjev nije valjan",
                "response": null
            }
        );
    }
});

app.post("/staze", async (req, res) => 
{
    try
    {
        const queryRes = await client.query(
            `
                insert into
                    staza
                values
                (
                    ${req.body.staza_id},
                    '${req.body.staza_naziv}',
                    ${req.body.geografska_sirina},
                    ${req.body.geografska_duzina},
                    '${req.body.podrucje}',
                    '${req.body.drzava}',
                    '${req.body.tip}',
                    ${req.body.duljina_km},
                    ${req.body.broj_zavoja},
                    '${req.body.smjer}'
                );
            `
        );

        res.type("json").status(200).send(
            {
                "status": "OK",
                "message": `Staza ${req.body.staza_id} ubačena`,
                "response": [req.body]
            }
        );
    }
    catch(err)
    {
        res.type("json").status(400).send(
            {
                "status": "Bad Request",
                "message": "Zahtjev nije valjan",
                "response": null
            }
        );
    }
});

app.put("/staze/:id", async (req, res) => 
{
    try
    {
        let string = "";

        for(const column in req.body)
        {
            string += `${column} = ${req.body[column] === parseFloat(req.body[column]) ? req.body[column]: `'${req.body[column]}'`}, `;
        }

        const queryRes = await client.query(
            `
                update
                    staza
                set
                    ${string.substring(0, string.length - 2)}
                where
                    staza.staza_id = ${req.params.id};
            `
        );

        res.type("json").status(200).send(
            {
                "status": "OK",
                "message": `Osvježena staza ${req.params.id}`,
                "response": null
            }
        );
    }
    catch(err)
    {
        res.type("json").status(400).send(
            {
                "status": "Bad Request",
                "message": "Zahtjev nije valjan",
                "response": null
            }
        );
    }
});

app.delete("/staze/:id", async (req, res) => 
{
    try
    {
        const queryRes = await client.query(
            `
                delete from
                    staza
                where
                    staza.staza_id = ${req.params.id};
            `
        );

        res.type("json").status(200).send(
            {
                "status": "OK",
                "message": `Obrisana staza ${req.params.id}`,
                "response": null
            }
        );
    }
    catch(err)
    {
        res.type("json").status(400).send(
            {
                "status": "Bad Request",
                "message": "Zahtjev nije valjan",
                "response": null
            }
        );
    }
});

app.get("/filter", async (req, res) => 
{
    try
    {
        const search = req.query.search;
        const attribute = req.query.attribute;
        
        const queryRes = await client.query(
            `
                select
                    staza.*,
                    json_agg(json_build_object(
                        'vn_id', velika_nagrada.vn_id,
                        'vn_naziv', velika_nagrada.vn_naziv,
                        'broj_odrzavanja', velika_nagrada.broj_odrzavanja
                    )) velike_nagrade
                from
                    staza
                    join odrzana_na on staza.staza_id = odrzana_na.staza_id
                    join velika_nagrada on odrzana_na.vn_id = velika_nagrada.vn_id
                ${(attribute === "sve" && search === "") ? "": attribute !== "sve" ? `where
                    lower(cast(${attribute} as text)) like '%${search}%'`: 
                    `
                        where
                            lower(cast(staza_naziv as text)) like '%${search}%' or
                            lower(cast(geografska_sirina as text)) like '%${search}%' or
                            lower(cast(geografska_duzina as text)) like '%${search}%' or
                            lower(cast(podrucje as text)) like '%${search}%' or
                            lower(cast(drzava as text)) like '%${search}%' or
                            lower(cast(tip as text)) like '%${search}%' or
                            lower(cast(duljina_km as text)) like '%${search}%' or
                            lower(cast(broj_zavoja as text)) like '%${search}%' or
                            lower(cast(smjer as text)) like '%${search}%' or
                            lower(cast(vn_naziv as text)) like '%${search}%' or
                            lower(cast(broj_odrzavanja as text)) like '%${search}%'
                    `
                }
                group by
                    staza.staza_id
                order by
                    staza.staza_id;
            `
        );

        res.type("json").status(200).send(
            {
                "status": "OK",
                "message": "Dohvaćene staze",
                "response": queryRes.rows
            }
        );
    }
    catch(err)
    {
        res.type("json").status(400).send(
            {
                "status": "Bad Request",
                "message": "Zahtjev nije valjan",
                "response": null
            }
        );
    }
});

app.get("/openapi", (req, res) => 
{
    res.sendFile(path.join(__dirname, "openapi.json"));
});

app.all("*", (req, res) => 
{
    res.type("json").status(501).send(
        {
            "status": "Not Implemented",
            "message": `HTTP ${req.method} nije implementiran za rutu '${req.originalUrl}'`,
            "response": null
        }
    );
});

app.listen(3000, () =>
{
    console.log("Server listening on port 3000.")
});

process.on("SIGINT", async () => 
{
    await client.end();
    process.exit(0);
})