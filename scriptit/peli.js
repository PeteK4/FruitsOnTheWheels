const rullaID = ["rulla1", "rulla2", "rulla3", "rulla4"];
const lukitusID = ["lukitus1", "lukitus2", "lukitus3", "lukitus4"];
const panosNapitID = ["panosNappi1", "panosNappi2", "panosNappi3", "panosNappi4"];
const kaynnista_nappi = document.getElementById("kaynnista");
const uusiPeli_nappi = document.getElementById("uusiPeli");
const lopetaPeli_nappi = document.getElementById("lopetaPeli");
const panosNappi1 = document.getElementById("panosNappi1");
const panosNappi2 = document.getElementById("panosNappi2");
const panosNappi3 = document.getElementById("panosNappi3");
const panosNappi4 = document.getElementById("panosNappi4");
const reset = document.getElementById("reset");

const saldoSumma = document.getElementById("saldoSumma");
const panosSumma = document.getElementById("panosSumma");
const tulosNaytto = document.getElementById("tulokset");
const nayttoSisalto = document.getElementById("sisalto");

const manitBois = document.getElementById("gameOver");

const rullaSarja = [];

kaynnista_nappi.style.backgroundImage = 'url("./kuvat/nappi_kaynnista_off.webp")';
panosNappi1.style.backgroundImage = 'url("./kuvat/r1.gif")';
panosNappi2.style.backgroundImage = 'url("./kuvat/r2.gif")';
panosNappi3.style.backgroundImage = 'url("./kuvat/r3.gif")';
panosNappi4.style.backgroundImage = 'url("./kuvat/r4.gif")';
tulosNaytto.innerHTML = "TERVETULOA PELAAMAAN!<br>LISÄÄ PANOS";

saldoSumma.innerHTML = "40 <span style='font-size: 2rem;'>€</span>";
panosSumma.innerHTML = "0 <span style='font-size: 2rem;'>€</span>";

let rullatPyorii = false;
let rullatArvottu = false;
let panosValittu = false; 
let voittoSarja = false;
let gameOver = false;
let kierros = 0
let lukitut = 0

// Voittotaulukko: *panoskerroin, sulkeissa kuvaindeksi
// 4 x 7 = *20 (1)
// 3 x 7 = *10  (1)

// 4 x vesimeloni = *8 (3)
// 3 x vesimeloni = *5 (3)

// 4 x omena = *6 (2)
// 3 x omena = *3 (2)

// 4 x päärynä = *5 (6)
// 3 x päärynä = *2 (6)

// 4 x viinirypäleet = *4 (4)
// 3 x viinirypäleet = *2 (4)

// 4 x kirsikka = *2 (5)
// 3 x kirsikka = *1 (5)

// rullaatit = [2,1,2,2]  // TESTAAMISEEN
// let rullaatitIndeksi = 0   // TESTAAMISEEN

for (let i = 0; i < rullaID.length; i++) {
    const rulla = document.getElementById(rullaID[i]);
    const arpaLuku = Math.floor(Math.random() * 6) + 1;
    rulla.src = `./kuvat/rulla${arpaLuku}.webp`;
    rullaSarja.push(arpaLuku);
}

for (let i = 0; i < lukitusID.length; i++) {
    const lukitus = document.getElementById(lukitusID[i]);
    lukitus.style.backgroundImage = 'url("./kuvat/nappi_lukitus_off.webp")';
    lukitus.addEventListener("click", function () {
        if (rullatArvottu && !rullatPyorii) {
            kytkeLukitus(lukitus, i);
        }
    });
}

for (let i = 0; i < panosNapitID.length; i++) {    
    const panosNappi = document.getElementById(panosNapitID[i]);
    panosNappi.addEventListener("click", function () {
        if (!rullatPyorii) {
            summatRuutuun(i);
            panosValittu = true;
            kaynnista_nappi.classList.remove("disabled");
            kaynnista_nappi.style.backgroundImage = 'url("./kuvat/nappi_kaynnista_off.gif")';
            if (parseInt(saldoSumma.innerText) == 0){
                tulosNaytto.innerHTML = "RIKAS TAI RUTIKÖYHÄ, KÄYNNISTÄ!";
                return;
            }
            tulosNaytto.innerHTML = "NOSTA PANOSTA TAI<br>KÄYNNISTÄ";
        }
    });
}

function kytkeLukitus(nappi, indeksi) {
    if (!gameOver) { 
        const lukitusTila = nappi.style.backgroundImage.includes('nappi_lukitus_on');
        if (lukitusTila) {
            lukitut-- 
            nappi.style.backgroundImage = 'url("./kuvat/nappi_lukitus_off.gif")';
            nappi.style.boxShadow = "none";
            nappi.style.border = "solid 2px rgb(50, 230, 10)";
        } else {
            lukitut++
            nappi.style.backgroundImage = 'url("./kuvat/nappi_lukitus_on.webp")';
            nappi.style.boxShadow = "0px 0px 25px rgb(200, 255, 200)";
            nappi.style.border = "solid 2px rgb(190, 255, 150)";
        }

        if (lukitut == 4) {
            lukitut = 0;
            for (let i = 0; i < lukitusID.length; i++) {
                const lukitus = document.getElementById(lukitusID[i]);
                lukitus.style.backgroundImage = 'url("./kuvat/nappi_lukitus_off.gif")';
                lukitus.style.boxShadow = "none";
                lukitus.style.border = "solid 2px rgb(50, 230, 10)";
            }
        }
    }
}

function summatRuutuun(indeksi) {
    const panosSummat = [1, 3, 5, 10];
    const valittuPanos = panosSummat[indeksi];

    const saldoTilanne = parseInt(saldoSumma.innerText);
    const panosTilanne = parseInt(panosSumma.innerText);
    
    if (saldoTilanne >= valittuPanos) {
        saldoSumma.innerHTML = (saldoTilanne - valittuPanos).toString() + "<span style='font-size: 2rem;'> €</span>";
        panosSumma.innerHTML = (panosTilanne + valittuPanos).toString() + "<span style='font-size: 2rem;'> €</span>";
    }
    panosNapit(parseInt(saldoSumma.innerText));
}

function panosNapit(saldoTilanne) {
    if (rullatPyorii) {
        panosNappi1.style.backgroundImage = 'url("./kuvat/r1.webp")';
        panosNappi2.style.backgroundImage = 'url("./kuvat/r2.webp")';
        panosNappi3.style.backgroundImage = 'url("./kuvat/r3.webp")';
        panosNappi4.style.backgroundImage = 'url("./kuvat/r4.webp")';
        return;
    }

    if (saldoTilanne >= 10) {
        for (let i = 0; i < panosNapitID.length; i++) {
            const nappi = document.getElementById(panosNapitID[i]);
            nappi.style.backgroundImage = `url("./kuvat/r${i + 1}.gif")`;
            nappi.style.border = "solid 3px rgb(255, 255, 255)";
            nappi.style.boxShadow = "2px 5px 12px rgb(255, 255, 255)";
        }

    } else if (saldoTilanne >= 5 && saldoTilanne <= 9) {
        panosNappi1.style.cssText = 'background-image: url("./kuvat/r1.gif"); border: solid 3px rgb(220, 220, 220); box-shadow: 2px 5px 12px rgb(255, 255, 255);';
        panosNappi2.style.cssText = 'background-image: url("./kuvat/r2.gif"); border: solid 3px rgb(220, 220, 220); box-shadow: 2px 5px 12px rgb(255, 255, 255);';
        panosNappi3.style.cssText = 'background-image: url("./kuvat/r3.gif"); border: solid 3px rgb(220, 220, 220); box-shadow: 2px 5px 12px rgb(255, 255, 255);';
        panosNappi4.style.cssText = 'background-image: url("./kuvat/r4.webp"); border: solid 3px rgb(220, 220, 220); box-shadow: 2px 5px 12px rgb(222, 222, 222);';

    } else if (saldoTilanne >= 3 && saldoTilanne <= 5) {
        panosNappi1.style.cssText = 'background-image: url("./kuvat/r1.gif"); border: solid 3px rgb(220, 220, 220); box-shadow: 2px 5px 12px rgb(255, 255, 255);';
        panosNappi2.style.cssText = 'background-image: url("./kuvat/r2.gif"); border: solid 3px rgb(220, 220, 220); box-shadow: 2px 5px 12px rgb(255, 255, 255);';
        panosNappi3.style.cssText = 'background-image: url("./kuvat/r3.webp"); border: solid 3px rgb(220, 220, 220); box-shadow: 2px 5px 12px rgb(222, 222, 222);';
        panosNappi4.style.cssText = 'background-image: url("./kuvat/r4.webp"); border: solid 3px rgb(220, 220, 220); box-shadow: 2px 5px 12px rgb(222, 222, 222);';

    } else if (saldoTilanne >= 1 && saldoTilanne <= 3) {
        panosNappi1.style.cssText = 'background-image: url("./kuvat/r1.gif"); border: solid 3px rgb(220, 220, 220); box-shadow: 2px 5px 12px rgb(255, 255, 255);';
        panosNappi2.style.cssText = 'background-image: url("./kuvat/r2.webp"); border: solid 3px rgb(220, 220, 220); box-shadow: 2px 5px 12px rgb(222, 222, 222);';
        panosNappi3.style.cssText = 'background-image: url("./kuvat/r3.webp"); border: solid 3px rgb(220, 220, 220); box-shadow: 2px 5px 12px rgb(222, 222, 222);';
        panosNappi4.style.cssText = 'background-image: url("./kuvat/r4.webp"); border: solid 3px rgb(220, 220, 220); box-shadow: 2px 5px 12px rgb(222, 222, 222);';

    } else if (saldoTilanne <= 1) {
        panosNappi1.style.cssText = 'background-image: url("./kuvat/r1.webp"); border: solid 3px rgb(220, 220, 220); box-shadow: 2px 5px 12px rgb(222, 222, 222);';
        panosNappi2.style.cssText = 'background-image: url("./kuvat/r2.webp"); border: solid 3px rgb(220, 220, 220); box-shadow: 2px 5px 12px rgb(222, 222, 222);';
        panosNappi3.style.cssText = 'background-image: url("./kuvat/r3.webp"); border: solid 3px rgb(220, 220, 220); box-shadow: 2px 5px 12px rgb(222, 222, 222);';
        panosNappi4.style.cssText = 'background-image: url("./kuvat/r4.webp"); border: solid 3px rgb(220, 220, 220); box-shadow: 2px 5px 12px rgb(222, 222, 222);';
    }
}

function rullatKehiin(indeksi) {
    return new Promise(resolve => {
        const rulla = document.getElementById(rullaID[indeksi]);
        const lukitus = document.getElementById(lukitusID[indeksi]);

        if (lukitus.style.backgroundImage.includes("nappi_lukitus_on")) {
            resolve();
            return;
        }

        const arpaLuku = Math.floor(Math.random() * 6) + 1;
        // const arpaLuku = rullaatit[rullaatitIndeksi] //TESTAAMISEEN
        // rullaatitIndeksi++ // TESTAAMISEEN

        setTimeout(() => {
            rulla.src = `./kuvat/rulla${arpaLuku}.webp`;
            rullaSarja[indeksi] = arpaLuku;
            resolve();
        }, (indeksi * 400) + 2000);
    });
}

async function koneRullaamaan() {
    rullatPyorii = true;
    const rulla1 = document.getElementById("rulla1");
    const rulla2 = document.getElementById("rulla2");
    const rulla3 = document.getElementById("rulla3");
    const rulla4 = document.getElementById("rulla4");

    const lukitus1 = document.getElementById("lukitus1");
    const lukitus2 = document.getElementById("lukitus2");
    const lukitus3 = document.getElementById("lukitus3");
    const lukitus4 = document.getElementById("lukitus4");
    const lukitusNapit = [lukitus1, lukitus2, lukitus3, lukitus4];
    
    for (const lukitus of lukitusNapit) {
        if (lukitus.style.backgroundImage.includes("nappi_lukitus_off.gif")) {
            lukitus.style.backgroundImage = 'url("./kuvat/nappi_lukitus_off.webp")';
        }
    }
    
    if (!lukitus1.style.backgroundImage.includes("nappi_lukitus_on")) {
        rulla1.src = "./kuvat/rullaRolla1.gif";
    }
    
    if (!lukitus2.style.backgroundImage.includes("nappi_lukitus_on")) {
        rulla2.src = "./kuvat/rullaRolla2.gif";
    }
    
    if (!lukitus3.style.backgroundImage.includes("nappi_lukitus_on")) {
        rulla3.src = "./kuvat/rullaRolla3.gif";
    }
    
    if (!lukitus4.style.backgroundImage.includes("nappi_lukitus_on")) {
        rulla4.src = "./kuvat/rullaRolla4.gif";
    }
    
    kaynnista_nappi.style.backgroundImage = 'url("./kuvat/nappi_kaynnista_off.webp")';
    kaynnista_nappi.style.border = "solid 2px rgb(240, 50, 50)";
    kaynnista_nappi.style.boxShadow = "none";
    
    const rullat = [];
    for (let i = 0; i < rullaID.length; i++) {
        rullat.push(rullatKehiin(i));
    }
    
    await Promise.all(rullat);
    kierros++
    //rullaatitIndeksi = 0 // TESTAAMISEEN
    
    kaynnista_nappi.classList.remove("disabled");
    kaynnista_nappi.style.cssText = 'background-image: url("./kuvat/nappi_kaynnista_off.gif"); border: solid 2px rgb(255, 190, 190); box-shadow: 0px 0px 25px rgb(255, 200, 200);';
    lompakko = parseInt(saldoSumma.innerText);
    panosNapit(parseInt(saldoSumma.innerText));
    rullatArvottu = true;
    rullatPyorii = false;
        
    if (rullatArvottu) {
        const rullaSarjaStr = rullaSarja.join("");
        const panos = parseInt(panosSumma.innerText);

        if (rullaSarjaStr == "1111") {
            saldoSumma.innerHTML = (parseInt(saldoSumma.innerText) + panos * 20) .toString() + "<span style='font-size: 2rem;'> €</span>"; // 7
            tulosNaytolle(panos * 20);
            voittoSarja = true;
        } else if (rullaSarjaStr == "2222") {
            saldoSumma.innerHTML = (parseInt(saldoSumma.innerText) + panos * 6).toString() + "<span style='font-size: 2rem;'> €</span>"; // Omena
            tulosNaytolle(panos * 6);
            voittoSarja = true;
        } else if (rullaSarjaStr == "3333") {  
            saldoSumma.innerHTML = (parseInt(saldoSumma.innerText) + panos * 8).toString() + "<span style='font-size: 2rem;'> €</span>"; // Vesimeloni
            tulosNaytolle(panos * 8);
            voittoSarja = true;
        } else if (rullaSarjaStr == "4444") {
            saldoSumma.innerHTML = (parseInt(saldoSumma.innerText) + panos * 4).toString() + "<span style='font-size: 2rem;'> €</span>"; // Viinirypäle
            tulosNaytolle(panos * 4);
            voittoSarja = true;
        } else if (rullaSarjaStr == "5555") {
            saldoSumma.innerHTML= (parseInt(saldoSumma.innerText) + panos * 2).toString() + "<span style='font-size: 2rem;'> €</span>"; // Kirsikka
            tulosNaytolle(panos * 2);
            voittoSarja = true;
        } else if (rullaSarjaStr == "6666") {
            saldoSumma.innerHTML= (parseInt(saldoSumma.innerText) + panos * 5).toString() + "<span style='font-size: 2rem;'> €</span>"; // Päärynä
            tulosNaytolle(panos * 5);
            voittoSarja = true;
        } else {

            if ((rullaSarjaStr.match(/1/g) || []).length == 3 && rullaSarjaStr.includes("1")) {
                saldoSumma.innerHTML = (parseInt(saldoSumma.innerText) + panos * 10).toString() + "<span style='font-size: 2rem;'> €</span>"; 
                tulosNaytolle(panos * 10);
                voittoSarja = true;
            }

            if ((rullaSarjaStr.match(/2/g) || []).length == 3 && rullaSarjaStr.includes("2")) {
                saldoSumma.innerHTML = (parseInt(saldoSumma.innerText) + panos * 3).toString() + "<span style='font-size: 2rem;'> €</span>";
                tulosNaytolle(panos * 3);
                voittoSarja = true;
            }

            if ((rullaSarjaStr.match(/3/g) || []).length == 3 && rullaSarjaStr.includes("3")) {
                saldoSumma.innerHTML = (parseInt(saldoSumma.innerText) + panos * 5).toString() + "<span style='font-size: 2rem;'> €</span>";
                tulosNaytolle(panos * 5);
                voittoSarja = true;
            }

            if ((rullaSarjaStr.match(/4/g) || []).length == 3 && rullaSarjaStr.includes("4")) {
                saldoSumma.innerHTML = (parseInt(saldoSumma.innerText) + panos * 2).toString() + "<span style='font-size: 2rem;'> €</span>";
                tulosNaytolle(panos * 1);
                voittoSarja = true;
            }

            if ((rullaSarjaStr.match(/5/g) || []).length == 3 && rullaSarjaStr.includes("5")) {
                saldoSumma.innerHTML = (parseInt(saldoSumma.innerText) + panos).toString() + "<span style='font-size: 2rem;'> €</span>";
                tulosNaytolle(panos);
                voittoSarja = true;
            }

            if ((rullaSarjaStr.match(/6/g) || []).length == 3 && rullaSarjaStr.includes("6")) {
                saldoSumma.innerHTML = (parseInt(saldoSumma.innerText) + panos * 2).toString() + "<span style='font-size: 2rem;'> €</span>";
                tulosNaytolle(panos * 2);
                voittoSarja = true;
            }
        }
     
    if (voittoSarja || kierros == 2) {
        for (let i = 0; i < lukitusID.length; i++) {
            const lukitus = document.getElementById(lukitusID[i]);
            lukitus.style.backgroundImage = 'url("./kuvat/nappi_lukitus_off.webp")';
            lukitus.style.boxShadow = "none";
            lukitus.style.border = "solid 2px rgb(50, 230, 10)";
        }

        if (!voittoSarja){tulosNaytto.innerHTML = "EI VOITTOA - LISÄÄ PANOS";}
            kaynnista_nappi.style.backgroundImage = 'url("./kuvat/nappi_kaynnista_off.webp")'
            kaynnista_nappi.classList.add("disabled");
            panosNapit(parseInt(saldoSumma.innerText));
            voittoSarja = false;
            rullatArvottu = false;
            panosSumma.innerHTML = "0<span style='font-size: 2rem;'> €</span>";
            kierros = 0;
        } 
    
        if (lompakko == 0) {
            kaynnista_nappi.style.backgroundImage = 'url("./kuvat/nappi_kaynnista_off.webp")'
            kaynnista_nappi.classList.add("disabled");
            tulosNaytto.innerHTML = "PELI PÄÄTTYI";
            nayttoSisalto.style.display = "none";
            manitBois.style.display = "block";
            gameOver = true;
            uusiPeli_nappi.addEventListener("click", function() {
                location.reload();
            });
            lopetaPeli_nappi.addEventListener("click", function() {
                window.close();
            });
            
        } else 
            if (kierros == 1) {
            panosNapit(parseInt(saldoSumma.innerText));
            for (const lukitus of lukitusNapit) {
                if (!lukitus.style.backgroundImage.includes("nappi_lukitus_on")) {
                    lukitus.style.backgroundImage = 'url("./kuvat/nappi_lukitus_off.gif")';
                    tulosNaytto.innerHTML = "EI VOITTOA<br>LUKITSE, NOSTA PANOSTA TAI<br>KÄYNNISTÄ";
                }
            }
        }
}};

function tulosNaytolle(tulos) {
    tulosNaytto.innerHTML = `<span style='font-size: 2.3rem;'>VOITIT</span>&nbsp;&nbsp;&nbsp;<span style='font-size: 3rem;'>${tulos}</span><span style='font-size: 2.3rem;'>&nbsp;&nbsp;€</span><br>ASETA PANOS`;
};
    
kaynnista_nappi.addEventListener("click", function () {
    lukitut = 0;
    if (panosValittu && !kaynnista_nappi.classList.contains("disabled")) {
        kaynnista_nappi.classList.add("disabled");
        rullatPyorii = true;
        panosNapit(parseInt(saldoSumma.innerText));
        tulosNaytto.innerHTML = "☰&nbsp;&nbsp;&nbsp;&nbsp;☰&nbsp;&nbsp;&nbsp;&nbsp;☰&nbsp;&nbsp;&nbsp;&nbsp;☰";
        koneRullaamaan();
    }
});

reset.addEventListener("click", function() {
    location.reload();
});
