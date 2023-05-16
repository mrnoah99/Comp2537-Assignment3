const PAGE_SIZE = 15;
let currentPage = 1;
let pokemons = [];

const updatePaginationDiv = (currentPage, numPages) => {
    $("#pagination").empty();

    const startPage = currentPage;
    let endPage;
    console.log(numPages);
    if (currentPage * PAGE_SIZE >= pokemons.length) {
        endPage = currentPage;
    } else if (currentPage == numPages - 1 && (currentPage + 1) * PAGE_SIZE >= pokemons.length) {
        endPage = currentPage + 1;
    } else {
        endPage = currentPage + 2;
    }
    if (currentPage > 1) {
        $("#pagination").append(`
            <button class='btn btn-primary page m1-1 numberedButtons' value='${currentPage - 1}'>Prev</button>
        `);
    }
    for (let i = startPage - 2; i <= endPage; i++) {
        if (i <= 0) {
            i = 1;
        }
        $("#pagination").append(`
            <button class='btn btn-primary page m1-1 numberedButtons' value='${i}'>${i}</button>
        `);
    }
    if (currentPage < numPages) {
        $("#pagination").append(`
            <button class='btn btn-primary page m1-1 numberedButtons' value='${currentPage + 1}'>Next</button>
        `);
    }
    for (let i = 1; i <= endPage; i++) {
        let currentButton = document.getElementsByClassName("numberedButtons");
        console.log("Current Page: " + currentPage + "\nCurrent Button: " + currentButton.item(i - 1).value);
        if (currentButton.item(i - 1).value == currentPage) {
            currentButton.item(i - 1).id = "currentPage";
        }
    }
    $("#pagination").append(`
        <p style='margin-left: 40px; font-size=24pt;'>${(currentPage - 1) * PAGE_SIZE + 1}-${(currentPage) * PAGE_SIZE} of ${numPages * PAGE_SIZE} Pokemon</p>
    `);
}

const paginate = async (currentPage, PAGE_SIZE, pokemons) => {
    let selected_pokemons = pokemons.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

    $("#pokecards").empty();
    selected_pokemons.forEach(async (pokemon) => {
        const response = await axios.get(pokemon.url);
        $("#pokecards").append(`
            <div class='pokecard card' pokeName=${response.data.name}>
                <h3>${response.data.name.toUpperCase()}</h3>
                <img src='${response.data.sprites.front_default}' alt='${response.data.name}'>
                <button type='button' class='btn btn-primary' data-bs-toggle='modal' data-bs-target='#pokeModal'>
                    More...
                </button>
            </div>
        `);
    });
    
}

const setup = async () => {
    let response = await axios.get("https://pokeapi.co/api/v2/pokemon?limit=810");

    $('#pokecards').empty();
    pokemons = response.data.results;

    paginate(currentPage, PAGE_SIZE, pokemons);
    const numPages = Math.ceil(pokemons.length / PAGE_SIZE);
    updatePaginationDiv(currentPage, numPages);

    $('body').on('click', '.pokecard', async function (e) {
        const pokemonName = $(this).attr('pokeName');
        const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`);
        const types = response.data.types.map((type) => type.type.name);
        $('.modal-body').html(`
            <div style='width: 200px;'>
                <img src='${response.data.sprites.other['official-artwork'].front_default}' alt='${response.data.name}'>
                <div>
                    <h3>Abilities</h3>
                    <ul>
                        ${response.data.abilities.map((ability) => `<li>${ability.ability.name}</li>`).join('')}
                    </ul>
                </div>
            
                <div>
                    <h3>Stats</h3>
                    <ul>
                        ${response.data.stats.map((stat) => `<li>${stat.stat.name}: ${stat.base_stat}</li>`).join('')}
                    </ul>
                </div>
            </div>

            <h3>Types</h3>
            <ul>
                ${types.map((type) => `<li>${type}</li>`).join('')}
            </ul>
        `);
        $(".modal-title").html(`
            <h2>${response.data.name.toUpperCase()}</h2>
            <h5>${response.data.id}</h5>
        `);
        console.log("Pokemon details button has been pressed.");
    });

    $("body").on("click", ".numberedButtons", async function (e) {
        console.log("Page button has been pressed. Number: " + e.target.value);
        currentPage = Number(e.target.value);
        paginate(currentPage, PAGE_SIZE, pokemons);

        updatePaginationDiv(currentPage, numPages);
    });
    
    document.getElementById("title").innerHTML = "Pokemon!";
}

$(document).ready(setup);
