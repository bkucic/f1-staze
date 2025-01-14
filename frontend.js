const searchButton = document.getElementById("search-button");
const searchInput = document.getElementById("search-input");
const select = document.getElementById("select");
const tableBody = document.getElementById("table-body");

fetch(`http://localhost:3000/filter?search=&attribute=sve`)
.then(res => res.json())
.then(data =>
{
    tableBody.innerHTML = data.response.map(staza => 
        `
            <tr>
                <td>${staza.staza_naziv}</td>
                <td>${staza.geografska_sirina}</td>
                <td>${staza.geografska_duzina}</td>
                <td>${staza.podrucje}</td>
                <td>${staza.drzava}</td>
                <td>${staza.tip}</td>
                <td>${staza.duljina_km} km</td>
                <td>${staza.broj_zavoja}</td>
                <td>${staza.smjer}</td>
                <td colspan="2" class="last-column">
                    ${staza.velike_nagrade.length > 0 ? 
                        staza.velike_nagrade.map(vn =>
                            `
                            <div class="cell">
                                <div>${vn.vn_naziv}</div>
                                <div class="count-col">${vn.broj_odrzavanja}</div>
                            </div>
                            `
                        ).join('') : ""}
                </td>
            </tr>
        `
    ).join("");
});

searchButton.addEventListener("click", () => 
{
    const searchValue = searchInput.value;
    const attribute = select.value;

    fetch(`http://localhost:3000/filter?search=${searchValue}&attribute=${attribute}`)
    .then(res => res.json())
    .then(data =>
    {
        tableBody.innerHTML = data.response.map(staza => 
            `
                <tr>
                    <td>${staza.staza_naziv}</td>
                    <td>${staza.geografska_sirina}</td>
                    <td>${staza.geografska_duzina}</td>
                    <td>${staza.podrucje}</td>
                    <td>${staza.drzava}</td>
                    <td>${staza.tip}</td>
                    <td>${staza.duljina_km} km</td>
                    <td>${staza.broj_zavoja}</td>
                    <td>${staza.smjer}</td>
                    <td colspan="2" class="last-column">
                        ${staza.velike_nagrade.length > 0 ? 
                            staza.velike_nagrade.map(vn =>
                                `
                                <div class="cell">
                                    <div>${vn.vn_naziv}</div>
                                    <div class="count-col">${vn.broj_odrzavanja}</div>
                                </div>
                                `
                            ).join('') : ""}
                    </td>
                </tr>
            `
        ).join("");
    });
});