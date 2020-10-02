const fetchArtists = () => {
    let all = []
    fetch("https://groupietrackers.herokuapp.com/api/artists").then(response => response.json()).then(data => {
        all.push(data)
    }).catch(err => console.error(err))
    return all
}
 
const fetchLocations = () => {
    let all = []
    for (let i = 1; i < 53; i++) {
        fetch(`https://groupietrackers.herokuapp.com/api/locations/${i}`).then(response => response.json()).then((data) => {
            all.push(data)
    }).catch(err => console.error(err))
    }
    return all
}

const cities = fetchLocations()
const artists = fetchArtists()

let ulRes = document.createElement("ul")
ulRes.id = "search-results"

export const search = () => {
   let searchBar = document.getElementsByClassName("searchTerm")[0]
   let div = document.getElementsByClassName("results")[0]
   
   searchBar.addEventListener("input", event => {
        // Clear previous suggestions 
        // need to delete <li> tags
        let li = document.querySelectorAll("#res")
        for (let i = 0; i < li.length; i++) {
            li[i].parentNode.removeChild(li[i])
        }
        // Search
        let [resultsArtist, idA] = byArtist(event.target.value.toLowerCase(), artists)
        let [resultsLocation, idL, bandsL] = byLocation(event.target.value.toLowerCase(), cities)
        let [resultsMembers, idM] = byMembers(event.target.value.toLowerCase(), artists)
        let [resultsFirstAlbum, idFA, bandsFA] = byFirstAlbum(event.target.value, artists)
        let [resultsCreation, idC, bandsC] = byCreation(event.target.value, artists)

        // Displaying suggestions
        displayRecommendations(resultsArtist, idA, [], "artist/band")
        displayRecommendations(resultsMembers, idM, [], "member")
        displayRecommendations(resultsLocation, idL, bandsL, "location")
        displayRecommendations(resultsFirstAlbum, idFA, bandsFA, "first album")
        displayRecommendations(resultsCreation, idC, bandsC, "creation date")

        // document.body.append(ulRes)
        div.append(ulRes)            
    })
    
}

const displayRecommendations = (sugg, ids, names, sort) => {
    let index = sugg.length
    if (sugg.length > 10) {
        index = 6
    }
    for (let i = 0; i < index; i++) {
        let item = document.createElement("li") // Creating list item (<li>)
        item.id = "res"
        let recommendation = document.createElement("a")
        let textLink
        if (sort !== "artist/band" && sort !== "member") {
            textLink = document.createTextNode(sugg[i] + ' --> ' + sort + ` (${names[i]})`)
        } else {
            textLink = document.createTextNode(sugg[i] + ' --> ' + sort)
        }
        recommendation.appendChild(textLink)
        recommendation.href = "/artist?id="+String(ids[i])
        item.append(recommendation) // append <a> tag to <li>
        ulRes.append(item) // append <li> tag to <ul>
    }
}

const byLocation = (query, data) => {
    if (query) {
        let all = []
        let ids = []
        // let bands = []
        for (let i = 0; i < data.length; i++) {
            data[i].locations.filter(el =>  {
                if (el.includes(query)) {
                    ids.push(data[i].id)
                    let artistName = getArtistName(i)
                    // console.log(artistName[0])
                    // bands.push(artistName)
                    let city = normalizeLocationNames(el)
                    all.push(city)
                }
            })
        }
        // console.log(all, ids, "results")
        return [all, ids, bands]
    }
    
}
const getArtistName = (index) => {
    let bands = [] 
    fetch(`https://groupietrackers.herokuapp.com/api/artists/${index}`).then(response => response.json()).then(data => {
        bands.push(data)
    })
    return bands
}

const normalizeLocationNames = (city) => {
    city = city.replace(/_/g, " ").replace(/-/g, " - ")
    let splitCity = city.split(' ')
    for (let i = 0; i < splitCity.length; i++) {
        splitCity[i] = splitCity[i].charAt(0).toUpperCase() + splitCity[i].substring(1)
    }
    return splitCity.join(' ')
}

const byMembers = (query, data) => {
    if (query) {
        let all = []
        let ids = []
        for (let i = 0; i < data[0].length; i++) {
            data[0][i].members.filter(el =>  {
                if (el.toLowerCase().includes(query)) {
                    ids.push(data[0][i].id)
                    all.push(el)
                }
            })
        }
        // console.log(results, "members")
        return [all, ids]
    }
}

const byArtist = (query, data) => {
    if (query) {
        let all = []
        let ids = []
        for (let i = 0; i < data[0].length; i++) {
            if (data[0][i].name.toLowerCase().includes(query)) {
                ids.push(data[0][i].id)
                all.push(data[0][i].name)
            }
        }
        return [all, ids]
    }
    
}
const byFirstAlbum = (query, data) => {
    if (query) {
        let all = []
        let ids = []
        let bands = []
        for (let i = 0; i < data[0].length; i++) {
            if (data[0][i].firstAlbum.includes(query)) {
                ids.push(data[0][i].id)
                bands.push(data[0][i].name)
                all.push(data[0][i].firstAlbum)
            }
        }
        return [all, ids, bands]
    }
    
}

const byCreation = (query, data) => {
    if (query) {
        let all = []
        let ids = []
        let bands = []
        for (let i = 0; i < data[0].length; i++) {
            if (String(data[0][i].creationDate).includes(query)) {
                ids.push(data[0][i].id)
                bands.push(data[0][i].name)
                all.push(String(data[0][i].creationDate))
            }
        }
        return [all, ids, bands]
    } 
}