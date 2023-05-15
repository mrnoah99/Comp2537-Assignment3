const PAGE_SIZE = 15;
let currentPage = 1;
let pokemons = []

const paginate = async (currentPage, PAGE_SIZE, pokemons) => {
    let selected_pokemons = pokemons.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

    $("#pokecards").empty();
    selected_pokemons.forEach(async (pokemon) => {
        const response = await axios.get(pokemon.url);
        $("#pokecards").append(`
            <div class='pokecard card' pokeName=${response.data.name}>
                <h3>${response.data.name.toUpperCase()}</h3>
                <img src='${response.data.sprites.front_default}' alt='${response.data.name}'>
                <button type='button' class='btn btn-primary' data-toggle='modal' data-target='#pokeModal'>
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

    $('body').on('click', '.pokecard', async function (e) {
        const pokemonName = $(this).attr('pokeName');
        const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`);
        const types = res.data.types.map((type) => type.type.name);
        $('modal-body').html(`
            <div style='width: 200px;'>
            <img src='${response.data.sprites.other['official-artwork'].front_default}' alt='${response.data.name}'>
                <div>
                <h3>Abilities</h3>
                <ul>
                ${res.data.abilities.map((ability) => `<li>${ability.ability.name}</li>`).join('')}
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
        `)
    });

    $("body").on("click", "numberedbuttons", async function (e) {
        currentPage = Number(e.target.value);
        paginate(currentPage, PAGE_SIZE, pokemons);
    });
    
    document.getElementById("title").innerHTML = "Pokemon!";
}

$(document).ready(setup);
