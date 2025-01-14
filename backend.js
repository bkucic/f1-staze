const express = require("express");
const {Client} = require("pg");
const path = require("path");
const cors = require("cors");
const { auth } = require('express-openid-connect');
const { requiresAuth } = require('express-openid-connect');
const fs = require("fs").promises;
const json2csv = require("json2csv").parse;

const config = {
  authRequired: false,
  secret: 'd4e6f6d4e4e5e2f3a1c4b2a1c3f7e5d4e3a1b4c7f9e1a3d6f4e5c2b3a7c4d2e1',
  baseURL: 'http://localhost:3000',
  clientID: 'qlmyzAYOzW6Hw1SeSKCl6apRRO5FLRDg',
  issuerBaseURL: 'https://dev-yxospk0ycbzyt6pj.us.auth0.com'
};

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
app.use(auth(config));
app.set("view engine", "ejs");
app.set("views", __dirname);

app.get("/", (req, res) => 
{
    res.sendFile(req.oidc.isAuthenticated() ? "userIndex.html": "index.html", {root: __dirname});
});

app.use(express.static(__dirname));

app.get('/profile', requiresAuth(), async (req, res) => 
{
    res.render("profile", {data: req.oidc.user});
});

function addSemantics(queryRes)
{
    queryRes.rows = queryRes.rows.map(entity =>
    {
        let newEntity = {};
        for(const attribute in entity)
        {
            if(attribute === "geografska_sirina")
            {
                newEntity["koordinate"] = 
                {
                    "@context": "https://schema.org/",
                    "@type": "geocoordinates",
                    "latitude": entity["geografska_sirina"],
                    "longitude": entity["geografska_duzina"]
                };
            }
            newEntity[attribute] = entity[attribute];
        }
        delete newEntity["geografska_sirina"];
        delete newEntity["geografska_duzina"];

        newEntity["drzava"] =
        {
            "@context": "https://schema.org/",
            "@type": "country",
            "name": entity["drzava"]
        };
        
        return newEntity;
    });

    return queryRes;
}

app.get("/update", requiresAuth(), async (req, res) =>
{
    try
    {
        let queryRes = await client.query(
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

        await fs.writeFile(path.join(__dirname, "f1_staze.json"), JSON.stringify(queryRes.rows, null, 4));

        queryRes = await client.query(
            `
                copy
                (
                    select
                        staza.*,
                        velika_nagrada.*
                    from
                        staza
                        join odrzana_na on staza.staza_id = odrzana_na.staza_id
                        join velika_nagrada on odrzana_na.vn_id = velika_nagrada.vn_id
                    order by
                        staza.staza_id
                ) to '${path.join(__dirname, "f1_staze.csv")}' with csv header;
            `
        );

        res.redirect("/");
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

app.get("/download/json", (req, res) =>
{
    res.download(path.join(__dirname, "f1_staze.json"));
});

app.get("/download/csv", (req, res) =>
{
    res.download(path.join(__dirname, "f1_staze.csv"));
});

app.get("/staze", async (req, res) => 
{
    try
    {
        let queryRes = await client.query(
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
        
        queryRes = addSemantics(queryRes);

        res.type("application/ld+json").status(200).send(
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
        let queryRes = await client.query(
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
        
        queryRes = addSemantics(queryRes);

        res.type("application/ld+json").status(200).send(
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
        let queryRes = await client.query(
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
        
        queryRes = addSemantics(queryRes);

        res.type("application/ld+json").status(200).send(
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
        let queryRes = await client.query(
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
        
        queryRes = addSemantics(queryRes);

        res.type("application/ld+json").status(200).send(
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
        let queryRes = await client.query(
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
        
        queryRes = addSemantics(queryRes);

        res.type("application/ld+json").status(200).send(
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
        let queryRes = await client.query(
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

        let queryRes = await client.query(
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
        let queryRes = await client.query(
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
        
        let queryRes = await client.query(
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