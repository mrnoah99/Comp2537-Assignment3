const setup = async () => {
    let response = await axios.get("https://pokeapi.co/api/v2/pokemon?limit=810");
    // test connection to pokeapi by logging what we get
    console.log(response.data.results);
    console.log("First pokemon: " + response.data.results[0].name + ", " + response.data.results[0].url);
    let i2 = 1;
    let i3 = 1;
    let nextRow = 4;
    for (i = 0; i < 15; i++) {
        let pokemon = await axios.get(response.data.results[i].url);
        console.log(pokemon.data);
        let a = document.createElement("div");
        let b = document.createElement("img");
        let c = document.createElement("br");
        let d = document.createElement("span");
        let e = document.getElementById(`r${i2}c${i3}`);
        b.src = pokemon.data.sprites.front_default;
        b.style = "width: 100px; height: auto;";
        d.innerHTML = pokemon.data.name;
        a.appendChild(b);
        a.appendChild(c);
        a.appendChild(d);
        e.appendChild(a);
        i3++;
        if (i == nextRow) {
            i2++;
            i3 = 1;
            nextRow += 5;
        }
    }
    document.getElementById("title").innerHTML = "Pokemon!";
}

$(document).ready(setup);