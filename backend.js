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

app.get("/", async (req, res) => 
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

    res.send(queryRes.rows);
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